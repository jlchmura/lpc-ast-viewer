import react from "@vitejs/plugin-react";
import * as path from "node:path";
import process from "node:process";
import { defineConfig } from "vite";
import * as monacoEditorPlugin from "vite-plugin-monaco-editor";

// GitHub Pages serves project sites from /<repo>/, so asset URLs need that prefix.
// Set VITE_BASE=/ when deploying to a custom domain or a user/org page.
const base = process.env.VITE_BASE ?? "/lpc-ast-viewer/";

export default defineConfig({
  base,
  plugins: [
    react(),
    (monacoEditorPlugin as any).default.default({
      // The plugin bakes the base into the worker URLs *and* into their output
      // directory, so with a non-root base the workers get written to
      // dist/<base>/monacoeditorwork and then requested at /<base>/<base>/... .
      // Drop the base from the output path; the URLs already carry it.
      customDistPath: (root: string, buildOutDir: string) => path.join(root, buildOutDir, "monacoeditorwork"),
    }),
  ],
});
