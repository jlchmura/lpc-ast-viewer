import { CompilerApi } from "./CompilerApi.js";

export interface BrowserSystem {
  files: { [fileName: string]: string | undefined };
}

/**
 * The LPC compiler reaches for the ambient `sys` object in a handful of places
 * (include resolution and source text lookup in `program.ts`, for example), and
 * `sys` is undefined outside of node. Install an in-memory implementation backed
 * by `files` so those code paths work in the browser.
 */
export function installBrowserSystem(api: CompilerApi, files: { [fileName: string]: string | undefined }) {
  const anyApi = api as any;
  if (typeof anyApi.setSys !== "function") {
    throw new Error("The lpc compiler does not export setSys - it cannot run in the browser.");
  }

  const system = {
    args: [] as string[],
    newLine: "\n",
    useCaseSensitiveFileNames: true,
    write: (s: string) => console.log(s),
    readFile: (path: string) => files[normalize(path)],
    writeFile: (path: string, data: string) => {
      files[normalize(path)] = data;
    },
    resolvePath: (path: string) => normalize(path),
    fileExists: (path: string) => files[normalize(path)] != null,
    directoryExists: (path: string) => {
      const dir = ensureTrailingSlash(normalize(path));
      return dir === "/" || Object.keys(files).some((f) => f.startsWith(dir));
    },
    createDirectory: () => {},
    getExecutingFilePath: () => "/",
    getCurrentDirectory: () => "/",
    getDirectories: (path: string) => {
      const dir = ensureTrailingSlash(normalize(path));
      const result = new Set<string>();
      for (const fileName of Object.keys(files)) {
        if (!fileName.startsWith(dir)) continue;
        const rest = fileName.slice(dir.length);
        const slashIndex = rest.indexOf("/");
        if (slashIndex >= 0) result.add(rest.slice(0, slashIndex));
      }
      return Array.from(result);
    },
    readDirectory: (path: string) => {
      const dir = ensureTrailingSlash(normalize(path));
      return Object.keys(files).filter((f) => f.startsWith(dir) && !f.slice(dir.length).includes("/"));
    },
    realpath: (path: string) => normalize(path),
    getEnvironmentVariable: () => "",
    exit: () => {},
  };

  anyApi.setSys(system);
  return system;

  function normalize(path: string) {
    const collapsed = path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
    return collapsed.startsWith("/") ? collapsed : "/" + collapsed;
  }

  function ensureTrailingSlash(path: string) {
    return path.endsWith("/") ? path : path + "/";
  }
}
