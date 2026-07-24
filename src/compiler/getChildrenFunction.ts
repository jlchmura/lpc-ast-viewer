import { TreeMode } from "../types/index.js";
import { assertNever } from "../utils/index.js";
import { CompilerApi, Node, SourceFile } from "./CompilerApi.js";

export interface GetChildrenOptions {
  api: CompilerApi;
  /**
   * Shows the synthetic `#include` the parser injects for the driver's efun
   * definitions. It expands to hundreds of nodes that are rarely what someone
   * is looking at, so it's hidden unless asked for.
   */
  showEfunDefinitions?: boolean;
}

export function getChildrenFunction(mode: TreeMode, sourceFile: SourceFile, options?: GetChildrenOptions) {
  const getChildren = getChildrenForMode();
  if (options == null || options.showEfunDefinitions) {
    return getChildren;
  }

  const api = options.api;
  return (node: Node) => getChildren(node).filter((child) => !isSyntheticGlobalInclude(api, child));

  function getChildrenForMode() {
    switch (mode) {
      case TreeMode.getChildren:
        return getAllChildren;
      case TreeMode.forEachChild:
        return forEachChild;
      default:
        return assertNever(mode, `Unhandled mode: ${mode}`);
    }
  }

  function getAllChildren(node: Node) {
    return node.getChildren(sourceFile);
  }

  function forEachChild(node: Node) {
    const nodes: Node[] = [];
    node.forEachChild((child) => {
      nodes.push(child);
      return undefined;
    });
    return nodes;
  }
}

/** The global includes the parser injects are the only ones with an empty text range. */
export function isSyntheticGlobalInclude(api: CompilerApi, node: Node) {
  return node.kind === api.SyntaxKind.IncludeDirective && node.pos === node.end;
}
