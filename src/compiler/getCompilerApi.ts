import { importCompilerApi, importLibFiles } from "./compiler.generated.js";
import { CompilerApi } from "./CompilerApi.js";
import { CompilerPackageNames } from "./compilerVersions.generated.js";

const compilerTypes: { [name: string]: Promise<CompilerApi> } = {};
const compilerTypesLoaded: { [name: string]: true } = {};

export function getCompilerApi(packageName: CompilerPackageNames): Promise<CompilerApi> {
  if (compilerTypes[packageName] == null) {
    compilerTypes[packageName] = loadCompilerApi(packageName);
    compilerTypes[packageName].catch(() => delete compilerTypes[packageName]);
  }
  return compilerTypes[packageName];
}

export function hasLoadedCompilerApi(packageName: CompilerPackageNames) {
  return compilerTypesLoaded[packageName] === true;
}

async function loadCompilerApi(packageName: CompilerPackageNames) {
  const libFilesPromise = importLibFiles(packageName);
  const compilerApiPromise = importCompilerApi(packageName);
  const api = { ...await compilerApiPromise as any as CompilerApi };

  api.tsAstViewer = {
    packageName,
    libFileTexts: {},
    cachedSourceFiles: {},
  };

  // The efun headers are kept as raw text and only parsed on demand by the
  // compiler host. Eagerly parsing all of them would block the main thread for
  // a long time and most of them are never pulled in by a given snippet.
  for (const libFile of await libFilesPromise) {
    api.tsAstViewer.libFileTexts[libFile.fileName] = libFile.text;
  }

  compilerTypesLoaded[packageName] = true;

  return api;
}
