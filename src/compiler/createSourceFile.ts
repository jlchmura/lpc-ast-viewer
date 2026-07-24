import {
  CompilerApi,
  CompilerHost,
  CompilerOptions,
  LanguageVariant,
  Program,
  ScriptKind,
  ScriptTarget,
  SourceFile,
  TypeChecker,
} from "./CompilerApi.js";
import { installBrowserSystem } from "./createBrowserSystem.js";

export function createSourceFile(
  api: CompilerApi,
  code: string,
  scriptTarget: ScriptTarget,
  scriptKind: ScriptKind,
  driverType: LanguageVariant,
) {
  const filePath = `/lpc-ast-viewer${getExtension(api, scriptKind)}`;
  const libFolder = `/${api.getDefaultLibFolder({ driverType })}`;
  // the efun header is auto-included into every file, the way the language server does it
  const globalIncludes = [`${libFolder}${api.getDefaultLibFileName({ driverType })}`];
  const options: CompilerOptions = {
    target: scriptTarget,
    module: api.ModuleKind.LPC,
    driverType,
    rootDir: "/",
    libIncludeDirs: [libFolder],
  };

  // Every file the compiler is allowed to see: the snippet plus the efun headers.
  // This doubles as the file system for `#include` resolution.
  const fileTexts: { [name: string]: string | undefined } = {
    ...api.tsAstViewer.libFileTexts,
    [filePath]: code,
  };

  // Several compiler code paths reach for the ambient `sys` rather than the host
  // (include resolution in `program.ts`, for one), and `sys` is undefined outside node.
  installBrowserSystem(api, fileTexts);

  const fileHandler = api.createLpcFileHandler({
    fileExists: (fileName: string) => fileTexts[fileName] != null,
    readFile: (fileName: string) => fileTexts[fileName],
    getCurrentDirectory: () => "/",
    getIncludeDirs: () => [libFolder],
    getCompilerOptions: () => options,
  });

  const sourceFile = api.createSourceFile(
    filePath,
    code,
    { languageVersion: scriptTarget, globalIncludes, fileHandler },
    false,
    scriptKind,
    driverType,
  );
  let bindingResult: { typeChecker: TypeChecker; program: Program } | undefined;

  return { sourceFile, bindingTools: getBindingTools };

  // binding may be disabled, so make this deferred
  function getBindingTools() {
    if (bindingResult == null) {
      bindingResult = getBindingResult();
    }
    return bindingResult;
  }

  function getBindingResult() {
    const sourceFiles: { [name: string]: SourceFile | undefined } = {
      [filePath]: sourceFile,
    };

    const compilerHost: CompilerHost = {
      getSourceFile: (fileName, languageVersion, onError) => {
        const existing = sourceFiles[fileName];
        if (existing != null) {
          return existing;
        }
        const text = fileTexts[fileName];
        if (text == null) {
          onError?.(`File not found: ${fileName}`);
          return undefined;
        }
        return sourceFiles[fileName] = api.createSourceFile(
          fileName,
          text,
          typeof languageVersion === "object"
            ? { ...languageVersion, fileHandler }
            : { languageVersion, globalIncludes, fileHandler },
          false,
          api.ScriptKind.LPC,
          driverType,
        );
      },
      getSourceTextFromSnapshot: (fileName: string) => fileTexts[fileName],
      getDefaultLibFileName: (defaultLibOptions: CompilerOptions) =>
        `/${api.getDefaultLibFolder(defaultLibOptions)}${api.getDefaultLibFileName(defaultLibOptions)}`,
      getDefaultLibLocation: () => libFolder,
      writeFile: () => {
        // do nothing
      },
      getCurrentDirectory: () => "/",
      getDirectories: (_path: string) => [],
      fileExists: (fileName: string) => fileTexts[fileName] != null,
      readFile: (fileName: string) => fileTexts[fileName],
      getCanonicalFileName: (fileName: string) => fileName,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => "\n",
      getEnvironmentVariable: () => "",
      directoryExists: () => true,
      realpath: (fileName: string) => fileName,
      readDirectory: () => [],
      createDirectory: () => {},
      onAllFilesNeedReparse: () => {},
      getParseableFiles: () => undefined,
    };
    const program = api.createProgram([filePath], options, compilerHost);
    const typeChecker = program.getTypeChecker();

    return { typeChecker, program };
  }
}

function getExtension(api: CompilerApi, scriptKind: ScriptKind) {
  switch (scriptKind) {
    case api.ScriptKind.LPC:
      return ".c";
    case api.ScriptKind.JSON:
      return ".json";
    default:
      return "";
  }
}
