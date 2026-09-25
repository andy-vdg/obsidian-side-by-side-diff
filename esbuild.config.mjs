import esbuild from "esbuild";
import { PLUGIN_BUNDLE_OPTIONS } from "./scripts/bundle-options.mjs";

const production = process.argv.includes("production");

await esbuild.build({
	...PLUGIN_BUNDLE_OPTIONS,
	outfile: "main.js",
	sourcemap: production ? false : "inline",
	minify: production,
	logLevel: "info",
});
