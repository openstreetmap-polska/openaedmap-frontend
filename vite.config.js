import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import Sitemap from "vite-plugin-sitemap";
import languages from "./src/languages";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		// https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
		define: {
			"process.env": {},
		},
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "./src"),
			},
		},
		build: {
			target: "es2015",
			outDir: "build",
		},
		plugins: [
			react(),
			Sitemap({
				outDir: "./build",
				hostname: env.VITE_BACKEND_API_URL,
				exclude: "/land",
				dynamicRoutes: Object.keys(languages).map((lang) => `/${lang}`),
			}),
		],
	};
});
