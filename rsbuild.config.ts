import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { UnoCSSRspackPlugin } from "@unocss/webpack/rspack";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import { presetWind4 } from "unocss";

export default defineConfig({
	plugins: [pluginReact()],
	tools: {
		rspack: {
			plugins: [
				new MonacoWebpackPlugin({ languages: ["javascript"] }),
				UnoCSSRspackPlugin({
					presets: [presetWind4()],
				}),
			],
		},
	},
	server: {
		headers: {
			"cross-origin-embedder-policy": "require-corp",
			"cross-origin-opener-policy": "same-origin",
		},
	},
});
