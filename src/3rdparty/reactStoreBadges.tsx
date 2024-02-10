// Based on https://github.com/yjb94/react-store-badges

import React, { FC, useLayoutEffect, useState } from "react";

const HEIGHT_RATIO = 3.375;

export const googlePlayPath = (language: string) =>
	`img/google-play/${language}.svg`;

const getImage = (locale: string, language: string) => ({
	ios: `https://apple-resources.s3.amazonaws.com/media-badges/download-on-the-app-store/black/${locale}.svg`,
	android: googlePlayPath(language),
});

export interface ReactStoreBadgesProps {
	/** url of App Store and Play Store */
	url: string;

	/** platform name. 'ios' and 'android' only */
	platform: "ios" | "android";

	/** language name. such as en */
	language: string;

	/** width for badge size */
	width?: number;

	/** height for badge size */
	height?: number;

	/** target for url to be opened */
	target?: "_self" | "_blank" | "_parent" | "_top";
}

const defaultLocale = "en-us";

function localeFromLanguage(language: string): string {
	// available badges for App Store
	// https://developer.apple.com/app-store/marketing/guidelines/
	switch (language) {
		case "ca":
			return "ca-es";
		case "cs":
			return "cs-cz";
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
		case "zh-Hans":
			return "zh-cn";
		case "zh-Hant":
			return "zh-tw";
		default:
			return defaultLocale;
	}
}

const ReactStoreBadges: FC<ReactStoreBadgesProps> = ({
	url,
	platform,
	language,
	width = 100,
	height = width / HEIGHT_RATIO,
	target = "_self",
}) => {
	const locale = localeFromLanguage(language);
	const [image, setImage] = useState(getImage(locale, language));

	const setDefaultImage = () => {
		setImage(getImage(defaultLocale, language));
	};

	useLayoutEffect(() => {
		setImage(getImage(locale, language));
	}, [locale, language]);

	return (
		<a
			style={{
				display: "inline-block",
				height,
				width,
			}}
			href={url}
			target={target}
			aria-label="Badge"
		>
			<img
				alt=""
				src={image[platform]}
				style={{
					width: "100%",
					height: "100%",
				}}
				onError={setDefaultImage}
			/>
		</a>
	);
};
export default ReactStoreBadges;
