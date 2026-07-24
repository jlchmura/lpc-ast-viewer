import * as lpc from "lpc/server/src/lpc/lpc.js";
import { CompilerPackageNames } from "./compilerVersions.generated.js";

export interface CompilerApi {
  createSourceFile: typeof lpc.createSourceFile;
  createProgram: typeof lpc.createProgram;
  getDefaultLibFileName: typeof lpc.getDefaultLibFileName;
  forEachChild: typeof lpc.forEachChild;
  ScriptTarget: typeof lpc.ScriptTarget;
  ScriptKind: typeof lpc.ScriptKind;
  SyntaxKind: typeof lpc.SyntaxKind;
  ModifierFlags: typeof lpc.ModifierFlags;
  ModuleKind: typeof lpc.ModuleKind;
  NodeFlags: typeof lpc.NodeFlags;
  ObjectFlags: typeof lpc.ObjectFlags;
  SymbolFlags: typeof lpc.SymbolFlags;
  TypeFlags: typeof lpc.TypeFlags;
  FlowFlags: typeof lpc.FlowFlags;
  // Internal enum
  CheckFlags: object;
  // Internal enum
  TransformFlags: object;
  // Internal enum
  TypeMapKind: object;
  getDefaultLibFolder: typeof lpc.getDefaultLibFolder;
  createLpcFileHandler: typeof lpc.createLpcFileHandler;
  flattenDiagnosticMessageText: typeof lpc.flattenDiagnosticMessageText;
  textToKeywordObj: typeof lpc.textToKeywordObj;
  textToDirectiveObj: typeof lpc.textToDirectiveObj;
  LanguageVariant: typeof lpc.LanguageVariant;
  DiagnosticCategory: typeof lpc.DiagnosticCategory;
  tsAstViewer: {
    packageName: CompilerPackageNames;
    /** Raw text of the efun headers, keyed by their virtual path. */
    libFileTexts: { [name: string]: string | undefined };
    cachedSourceFiles: { [name: string]: SourceFile | undefined };
  };
  version: string;
  getLeadingCommentRanges: typeof lpc.getLeadingCommentRanges;
  getTrailingCommentRanges: typeof lpc.getTrailingCommentRanges;
}

export type Node = lpc.Node;
export type Type = lpc.Type;
export type Signature = lpc.Signature;
export type SourceFile = lpc.SourceFile;
export type Symbol = lpc.Symbol;
export type Program = lpc.Program;
export type TypeChecker = lpc.TypeChecker;
export type CompilerOptions = lpc.CompilerOptions;
export type ScriptTarget = lpc.ScriptTarget;
export type ScriptKind = lpc.ScriptKind;
export type NodeFlags = lpc.NodeFlags;
export type ObjectFlags = lpc.ObjectFlags;
export type SymbolFlags = lpc.SymbolFlags;
export type TypeFlags = lpc.TypeFlags;
export type SyntaxKind = lpc.SyntaxKind;
export type CompilerHost = lpc.CompilerHost;
export type CommentRange = lpc.CommentRange;
export type FlowNode = lpc.FlowNode;
export type Diagnostic = lpc.Diagnostic;
