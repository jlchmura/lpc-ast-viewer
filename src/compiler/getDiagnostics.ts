import { CompilerState } from "../types/index.js";
import { CompilerApi, Diagnostic } from "./CompilerApi.js";

export interface EditorDiagnostic {
  start: number;
  length: number;
  message: string;
  category: "error" | "warning" | "suggestion" | "message";
}

/**
 * Diagnostics for the snippet only. Syntactic ones are always available;
 * semantic ones need a bound program, so they're skipped when binding is off.
 */
export function getDiagnostics(compiler: CompilerState, bindingEnabled: boolean): EditorDiagnostic[] {
  const { api, sourceFile } = compiler;
  const diagnostics: readonly Diagnostic[] = bindingEnabled
    ? getProgramDiagnostics()
    : sourceFile.parseDiagnostics ?? [];

  return diagnostics
    // A diagnostic reported against the injected efun header has no meaningful
    // position in the snippet, so there's nowhere sensible to underline.
    .filter((d) => d.file === sourceFile && d.start != null && d.length != null && d.length > 0)
    .filter((d) => !isLibIncludeRollup(d))
    .map((d) => ({
      start: d.start!,
      length: d.length!,
      message: api.flattenDiagnosticMessageText(d.messageText, "\n"),
      category: getCategory(api, d),
    }));

  function getProgramDiagnostics() {
    try {
      const { program } = compiler.bindingTools();
      return [
        ...program.getSyntacticDiagnostics(sourceFile),
        ...program.getSemanticDiagnostics(sourceFile),
      ];
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

/** "Include file '{0}' contains one or more errors." */
const includeFileHasErrorsCode = 9025;

/**
 * The efun headers reference config-driven defines (`__LPC_CONFIG_LIBFILES_MASTER`
 * and friends) that only a real lpc-config.json supplies, so they report errors of
 * their own. The checker rolls those up onto the `#include` that pulled them in,
 * which puts a squiggle on the user's code for something they can't fix. Errors in
 * an include the user actually wrote still get through.
 */
function isLibIncludeRollup(diagnostic: Diagnostic) {
  if (diagnostic.code !== includeFileHasErrorsCode) {
    return false;
  }
  const related = diagnostic.relatedInformation;
  return related != null && related.length > 0 &&
    related.every((r) => r.file != null && r.file.fileName.startsWith("/efuns/"));
}

function getCategory(api: CompilerApi, diagnostic: Diagnostic): EditorDiagnostic["category"] {
  switch (diagnostic.category) {
    case api.DiagnosticCategory.Error:
      return "error";
    case api.DiagnosticCategory.Warning:
      return "warning";
    case api.DiagnosticCategory.Suggestion:
      return "suggestion";
    default:
      return "message";
  }
}
