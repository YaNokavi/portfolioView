import { ResolveOptions } from "webpack";
import path from "path";

export function buildResolvers(): ResolveOptions {
  return {
    extensions: [".tsx", ".ts", ".js"],
    preferAbsolute: true,
    modules: [path.resolve(__dirname, "../../src"), "node_modules"],
    mainFiles: ["index"],
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  };
}
