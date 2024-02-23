#!/usr/bin/env bun
import * as fs from "fs";
import { appStorePath } from "../src/3rdparty/reactStoreBadges";
import languages from "../src/languages";

const defaultLocale = "en-us";

function localeFromLanguage(language: string): string {
	// available badges for App Store
	// https://developer.apple.com/app-store/marketing/guidelines/
	switch (language) {
		case "be":
			return "be-by";
		case "ca":
			return "ca-es";
		case "cs":
			return "cs-cz";
		case "cy":
			return "cy-gb";
		case "de":
			return "de-de";
		case "en":
			return "en-us";
		case "es":
			return "es-es";
		case "fi":
			return "fi-fi";
		case "fr":
			return "fr-fr";
		case "it":
			return "it-it";
		case "ja":
			return "ja-jp";
		case "ko":
			return "ko-kr";
		case "nl":
			return "nl-nl";
		case "pl":
			return "pl-pl";
		case "pt":
			return "pt-pt";
		case "ru":
			return "ru-ru";
		case "sk":
			return "sk-sk";
		case "sl":
			return "sl-sl";
		case "sr":
			return "sr-cs";
		case "uk":
			return "uk-ua";
		case "zgh":
			return "zgh-ma";
		case "zh-Hans":
			return "zh-cn";
		case "zh-Hant":
			return "zh-tw";
		default:
			console.warn(`[${language}]: no locale found, using default: en-us`);
			return defaultLocale;
	}
}

const enFilePath = `public/${appStorePath("en")}`;

async function downloadAppleIcon(language: string) {
	const locale = localeFromLanguage(language);
	const iosUrl = `https://apple-resources.s3.amazonaws.com/media-badges/download-on-the-app-store/black/${locale}.svg`;
	const filePath = `public/${appStorePath(language)}`;
	const response = await fetch(iosUrl);
	if (response.status === 200) {
		const content = await response.blob();
		Bun.write(filePath, content);
	} else {
		console.warn(`[${language}]: app store icon not found: ${iosUrl}`);
		if (!fs.existsSync(filePath)) fs.linkSync(enFilePath, filePath);
	}
}

await Promise.all(Object.keys(languages).map(downloadAppleIcon));
console.log(
	"Please run svg optimizer:\nbunx svgo --disable=removeViewBox public/img/play-store/*.svg",
);
