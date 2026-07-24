import type * as monacoEditorForTypes from "monaco-editor";
import { CompilerApi } from "../compiler/index.js";

export const lpcLanguageId = "lpc";

/**
 * Keywords that name a type rather than control flow. Everything else in the
 * compiler's keyword table is coloured as a plain keyword, so this list only
 * affects shading - it can never introduce a keyword the scanner doesn't have.
 */
const typeKeywords = new Set([
  "any",
  "buffer",
  "bytes",
  "closure",
  "float",
  "function",
  "int",
  "lwobject",
  "mapping",
  "mixed",
  "object",
  "status",
  "string",
  "struct",
  "symbol",
  "unknown",
  "void",
]);

let registered = false;

export function registerLpcLanguage(monaco: typeof monacoEditorForTypes, api: CompilerApi) {
  if (registered) {
    return;
  }
  registered = true;

  monaco.languages.register({ id: lpcLanguageId, extensions: [".c", ".h", ".lpc"] });

  const allKeywords = Object.keys(api.textToKeywordObj);
  const directives = Object.keys(api.textToDirectiveObj).map((d) => d.slice(1)); // drop the '#'

  monaco.languages.setLanguageConfiguration(lpcLanguageId, {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string", "comment"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
    ],
  });

  monaco.languages.setMonarchTokensProvider(lpcLanguageId, {
    defaultToken: "",
    keywords: allKeywords.filter((k) => !typeKeywords.has(k)),
    typeKeywords: [...typeKeywords].filter((k) => allKeywords.includes(k)),
    directives,
    operators: [
      "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=", "&&", "||", "++", "--",
      "+", "-", "*", "/", "&", "|", "^", "%", "<<", ">>", "+=", "-=", "*=", "/=", "&=",
      "|=", "^=", "%=", "<<=", ">>=", "->", "::", "..",
    ],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|[0-7]{1,3})/,

    tokenizer: {
      root: [
        // preprocessor directives
        [/^\s*#\s*(@[a-z]+)/, {
          cases: { "$1@directives": "keyword.directive", "@default": "keyword.directive" },
        }],
        [/^\s*#\s*[a-z_]\w*/, "keyword.directive"],

        // LPC composite literal openers: ({ }) arrays, ([ ]) mappings, (: :) closures
        [/\(\{|\}\)|\(\[|\]\)|\(:|:\)/, "delimiter.bracket"],

        // LDMud closure/symbol references: #'foo
        [/#'[\w<>=+\-*/%!&|^~[\]]+/, "string.escape"],

        [/[a-zA-Z_]\w*/, {
          cases: {
            "@typeKeywords": "keyword.type",
            "@keywords": "keyword",
            "@default": "identifier",
          },
        }],

        { include: "@whitespace" },

        [/[{}()[\]]/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

        [/\d+\.\d+([eE][-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/0[bB][01]+/, "number.binary"],
        [/\d+/, "number"],

        [/[;,.]/, "delimiter"],

        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"],
        [/'[^\\']'/, "string"],
        [/'/, "string.invalid"],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],

      comment: [
        [/[^/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[/*]/, "comment"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"],
      ],
    },
  } as monacoEditorForTypes.languages.IMonarchLanguage);
}
