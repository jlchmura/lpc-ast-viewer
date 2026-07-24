# LPC AST Viewer

Based on [TypeScript AST Viewer](https://github.com/dsherret/ts-ast-viewer) by @dsherret.

Modified to use the [LPC Compiler/Language Server](https://github.com/jlchmura/lpc-language-server/).

## Developing

Install [Deno](https://deno.com) (this currently requires `canary`—run `deno upgrade --canary`) and
[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```
# install packages
npm install

# run locally
deno task dev

# run unit tests
deno task test
```

