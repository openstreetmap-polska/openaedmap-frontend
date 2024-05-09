import * as fs from "node:fs";
import path, { resolve } from "node:path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import Sitemap from "vite-plugin-sitemap";
import languages from "./src/languages";

const getTranslatedStrings = async (languageCode) => {
	const translations = await import(
		`./public/locales/${languageCode}/translation.json`
	);
	return translations.meta;
};

const htmlPlugin = async (env) => {
	const translationsEn = await getTranslatedStrings("en");
	return {
		name: "html-transform",
		async transformIndexHtml(html) {
			const currentLang = html.match(/<html lang="([a-zA-Z-]+)">/)[1];
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
					/<html lang="en">/,
					`<html lang="${lang}">`,
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

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const plugins = [react(), htmlPlugin(env)];

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

	const rollupInputs = { main: resolve(__dirname, "index.html") };
	for (const lang of Object.keys(languages)) {
		rollupInputs[lang] = resolve(__dirname, `langs/${lang}/index.html`);
	}

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
