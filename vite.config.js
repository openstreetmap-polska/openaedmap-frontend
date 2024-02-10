import path from "path";
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
	const translationsTarget = await getTranslatedStrings(
		env.VITE_DEFAULT_LANG ?? "en",
	).catch((e) => console.error(e));
	const { meta_title, meta_description, website_title } = {
		...translationsEn,
		...translationsTarget,
	};
	const baseUrl = env.VITE_BASE_URL ?? "";
	const canonicalLinks = `<link href="${env.VITE_BACKEND_API_URL}${baseUrl}" rel="canonical" />`;
	const alternateLinks = Object.keys(languages)
		.map(
			(lang) =>
				`\t<link href="${env.VITE_BACKEND_API_URL}/${lang}/" rel="alternate" hreflang="${lang}" />`,
		)
		.join("\n");
	const defaultAlternateLink = `\t<link href="${env.VITE_BACKEND_API_URL}/" rel="alternate" hreflang="x-default" />`;
	const seoLinks = `${canonicalLinks}\n${alternateLinks}\n${defaultAlternateLink}`;
	return {
		name: "html-transform",
		transformIndexHtml(html) {
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
				);
		},
	};
};

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const isProduction =
		env.VITE_BACKEND_API_URL !== undefined &&
		!env.VITE_BACKEND_API_URL.includes("dev");
	const plugins = [react(), htmlPlugin(env)];
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
			chunkSizeWarningLimit: 1700,
		},
		plugins: plugins,
	};
});
