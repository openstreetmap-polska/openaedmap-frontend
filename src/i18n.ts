import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next, useTranslation } from "react-i18next";
import languages from "~/languages";

const isProduction = import.meta.env.VITE_ENV === "production";

if (!isProduction) {
	languages.debug = { nativeName: "--debug--" };
}
const languagesIsoCodes = Object.keys(languages);
const defaultLanguage = import.meta.env.VITE_DEFAULT_LANG ?? "en";

i18n
	// i18next-http-backend
	// loads translations from your server
	// https://github.com/i18next/i18next-http-backend
	.use(Backend)
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init(
		{
			debug: !isProduction,
			supportedLngs: languagesIsoCodes,
			fallbackLng: isProduction ? "en" : "debug",
			interpolation: {
				escapeValue: false, // not needed for react as it escapes by default
			},
			backend: {
				loadPath: "./locales/{{lng}}/{{ns}}.json",
			},
			detection: {
				order: ["localStorage", "path", "navigator", "htmlTag"],
				lookupLocalStorage: "i18nextLng",
				// cache user language
				caches: ["localStorage"],
				excludeCacheFor: ["cimode"],
			},
		},
		(err, t) => {
			if (err) return console.log("something went wrong loading", err);
			return t("key");
		},
	);

i18n.on("languageChanged", (lang: string) => {
	document.documentElement.setAttribute("lang", lang);
});

function useLanguage(): string {
	const {
		i18n: { resolvedLanguage },
	} = useTranslation();
	return resolvedLanguage ?? defaultLanguage;
}

export default i18n;
export { languages, languagesIsoCodes, useLanguage };
