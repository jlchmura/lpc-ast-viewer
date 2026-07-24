import { OptionsState } from "../types/index.js";
import { CompilerApi, ScriptKind, ScriptTarget } from "./CompilerApi.js";

export function convertOptions(apiFrom: CompilerApi | undefined, apiTo: CompilerApi, options: OptionsState) {
  if (apiFrom == null || apiFrom === apiTo) {
    return options;
  } 

  const scriptTarget = apiTo.ScriptTarget.LPC;
  const scriptKind = apiTo.ScriptKind.LPC;

  return {
    ...options,
    scriptTarget: scriptTarget == null ? apiTo.ScriptTarget.Latest : scriptTarget,
    scriptKind: scriptKind == null ? apiTo.ScriptKind.LPC : scriptKind,
  };
}
