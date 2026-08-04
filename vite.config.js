import * as fs from "node:fs";
import path, { resolve } from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import Sitemap from "vite-plugin-sitemap";
import languages from "./src/languages.ts";

const getTranslatedStrings = async (languageCode) => {
	// Read via an absolute path rather than a relative dynamic import: Vite 8
	// bundles the config into node_modules/.vite-temp, so relative specifiers
	// would resolve against that temp dir instead of the project root.
	const translations = JSON.parse(
		fs.readFileSync(
			path.resolve(
				process.cwd(),
				`public/locales/${languageCode}/translation.json`,
			),
			"utf-8",
		),
	);
	return translations.meta;
};

const htmlPlugin = async (env) => {
	const translationsEn = await getTranslatedStrings("en");
	return {
		name: "html-transform",
		async transformIndexHtml(html) {
			const currentLang = html.match(/<html lang="([a-zA-Z_-]+)"/)[1];
			const translationsTarget = await getTranslatedStrings(currentLang).catch(
				(e) => console.error(e),
			);
			const { meta_title, meta_description, website_title } = {
				...translationsEn,
				...translationsTarget,
			};
			const baseUrl = currentLang === "en" ? "" : `/${currentLang}/`;
			const canonicalLinks = `<link href="${env.VITE_BACKEND_API_URL}${baseUrl}" rel="canonical" />`;
			const alternateLinks = Object.keys(languages)
				.filter((lang) => lang !== currentLang)
				.map(
					(lang) =>
						`\t<link href="${env.VITE_BACKEND_API_URL}/${lang}/" rel="alternate" hreflang="${lang}" />`,
				)
				.join("\n");
			const defaultAlternateLink = `\t<link href="${env.VITE_BACKEND_API_URL}/" rel="alternate" hreflang="x-default" />`;
			const seoLinks = `${canonicalLinks}\n${alternateLinks}\n${defaultAlternateLink}`;
			return html
				.replace(/<title>(.*?)<\/title>/, `<title>${website_title}</title>`)
				.replace(
					/<meta content="(.*?)" name="title">/,
					`<meta content="${meta_title}" name="title">`,
				)
				.replace(
					/<meta content="(.*?)" name="description">/,
					`<meta content="${meta_description}" name="description">`,
				)
				.replace(
					/<link href="https:\/\/openaedmap.org" rel="canonical" \/>/,
					seoLinks,
				)
				.replace(
					/<meta name="twitter:title" content="(.*)">/,
					`<meta name="twitter:title" content="${meta_title}">`,
				)
				.replace(
					/<meta name="og:title" content="(.*)">/,
					`<meta name="og:title" content="${meta_title}">`,
				)
				.replace(
					/<meta name="twitter:description" content="(.*)">/,
					`<meta name="twitter:description" content="${meta_description}">`,
				)
				.replace(
					/<meta name="og:description" content="(.*)">/,
					`<meta name="og:description" content="${meta_description}">`,
				);
		},
		buildStart() {
			const content = fs.readFileSync("index.html", "utf-8");
			for (const lang of Object.keys(languages)) {
				fs.mkdirSync(`langs/${lang}`, { recursive: true });
				const contentLang = content.replace(
					/<html lang="en"/,
					`<html lang="${lang}"`,
				);
				fs.writeFileSync(`langs/${lang}/index.html`, contentLang);
			}
		},
		writeBundle() {
			for (const lang of Object.keys(languages)) {
				fs.mkdirSync(`build/${lang}`, { recursive: true });
				fs.renameSync(`build/langs/${lang}`, `build/${lang}`);
			}
		},
	};
};

// maplibre-gl v6 loads its web worker from `new URL(`./${name}`, import.meta.url)`
// with a dynamic name, so Vite can't statically detect it and never emits the
// worker chunk. Copy the worker (and the shared chunk it imports) next to the
// built JS so the runtime URL resolves in production. Dev is handled separately
// via optimizeDeps.exclude.
const copyMaplibreWorkerPlugin = () => ({
	name: "copy-maplibre-worker",
	apply: "build",
	writeBundle(options) {
		const srcDir = path.resolve(
			import.meta.dirname,
			"node_modules/maplibre-gl/dist",
		);
		const outDir = path.join(options.dir, "assets");
		for (const file of [
			"maplibre-gl-worker.mjs",
			"maplibre-gl-worker.mjs.map",
			"maplibre-gl-shared.mjs",
			"maplibre-gl-shared.mjs.map",
		]) {
			const from = path.join(srcDir, file);
			if (fs.existsSync(from)) {
				fs.copyFileSync(from, path.join(outDir, file));
			}
		}
	},
});

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const plugins = [react(), htmlPlugin(env), copyMaplibreWorkerPlugin()];

	if (env.VITE_SENTRY_AUTH_TOKEN) {
		plugins.push(
			sentryVitePlugin({
				org: "sentry",
				project: "openaedmap-frontend",
				authToken: env.VITE_SENTRY_AUTH_TOKEN,
				url: "https://sentry.monicz.dev",
				telemetry: false,
				release: {
					dist: env.VITE_ENV,
				},
			}),
		);
	}

	const isProduction =
		env.VITE_BACKEND_API_URL !== undefined &&
		!env.VITE_BACKEND_API_URL.includes("dev");
	if (isProduction) {
		plugins.push(
			Sitemap({
				outDir: "build",
				hostname: env.VITE_BACKEND_API_URL,
				exclude: ["/land"],
				dynamicRoutes: Object.keys(languages).map((lang) => `/${lang}`),
			}),
		);
	}

	const rollupInputs = { main: resolve(import.meta.dirname, "index.html") };
	for (const lang of Object.keys(languages)) {
		rollupInputs[lang] = resolve(
			import.meta.dirname,
			`langs/${lang}/index.html`,
		);
	}

	return {
		// https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
		define: {
			"process.env": {},
		},
		resolve: {
			alias: {
				"~": path.resolve(import.meta.dirname, "./src"),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					// Bulma's SCSS still uses the deprecated Sass if() function.
					// Silence the warning until Bulma migrates to the CSS syntax.
					silenceDeprecations: ["if-function"],
				},
			},
		},
		optimizeDeps: {
			// maplibre-gl loads its own web worker as a separate chunk, which the
			// dep optimizer drops (the worker .mjs 404s). Serve it un-bundled.
			exclude: ["maplibre-gl"],
		},
		build: {
			target: "es2020",
			outDir: "build",
			chunkSizeWarningLimit: 1900,
			sourcemap: true,
			rollupOptions: {
				input: rollupInputs,
			},
		},
		plugins: plugins,
		server: {
			host: "127.0.0.1",
		},
	};
});
