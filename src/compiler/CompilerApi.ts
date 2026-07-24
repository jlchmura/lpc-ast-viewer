import * as ts from "lpc/server/src/lpc/lpc.js";
import { CompilerPackageNames } from "./compilerVersions.generated.js";

export interface CompilerApi {
  createSourceFile: typeof ts.createSourceFile;
  createProgram: typeof ts.createProgram;
  getDefaultLibFileName: typeof ts.getDefaultLibFileName;
  forEachChild: typeof ts.forEachChild;
  ScriptTarget: typeof ts.ScriptTarget;
  ScriptKind: typeof ts.ScriptKind;
  SyntaxKind: typeof ts.SyntaxKind;
  ModifierFlags: typeof ts.ModifierFlags;
  ModuleKind: typeof ts.ModuleKind;
  NodeFlags: typeof ts.NodeFlags;
  ObjectFlags: typeof ts.ObjectFlags;
  SymbolFlags: typeof ts.SymbolFlags;
  TypeFlags: typeof ts.TypeFlags;
  FlowFlags: typeof ts.FlowFlags;
  // Internal enum
  CheckFlags: object;
  // Internal enum
  TransformFlags: object;
  // Internal enum
  TypeMapKind: object;
  getDefaultLibFolder: typeof ts.getDefaultLibFolder;
  createLpcFileHandler: typeof ts.createLpcFileHandler;
  LanguageVariant: typeof ts.LanguageVariant;
  tsAstViewer: {
    packageName: CompilerPackageNames;
    /** Raw text of the efun headers, keyed by their virtual path. */
    libFileTexts: { [name: string]: string | undefined };
    cachedSourceFiles: { [name: string]: SourceFile | undefined };
  };
  version: string;
  getLeadingCommentRanges: typeof ts.getLeadingCommentRanges;
  getTrailingCommentRanges: typeof ts.getTrailingCommentRanges;
}

export type Node = ts.Node;
export type Type = ts.Type;
export type Signature = ts.Signature;
export type SourceFile = ts.SourceFile;
export type Symbol = ts.Symbol;
export type Program = ts.Program;
export type TypeChecker = ts.TypeChecker;
export type CompilerOptions = ts.CompilerOptions;
export type ScriptTarget = ts.ScriptTarget;
export type ScriptKind = ts.ScriptKind;
export type NodeFlags = ts.NodeFlags;
export type ObjectFlags = ts.ObjectFlags;
export type SymbolFlags = ts.SymbolFlags;
export type TypeFlags = ts.TypeFlags;
export type SyntaxKind = ts.SyntaxKind;
export type CompilerHost = ts.CompilerHost;
export type CommentRange = ts.CommentRange;
export type FlowNode = ts.FlowNode;
