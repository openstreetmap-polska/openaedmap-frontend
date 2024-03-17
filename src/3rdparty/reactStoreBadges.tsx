// Based on https://github.com/yjb94/react-store-badges

import React, { type FC, useLayoutEffect, useState } from "react";

const HEIGHT_RATIO = 3.375;

export const googlePlayPath = (language: string) =>
	`/img/google-play/${language}.svg`;

export const appStorePath = (language: string) =>
	`/img/play-store/${language}.svg`;

const badgePath = (platform: "ios" | "android", language: string): string =>
	platform === "android" ? googlePlayPath(language) : appStorePath(language);

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

const ReactStoreBadges: FC<ReactStoreBadgesProps> = ({
	url,
	platform,
	language,
	width = 100,
	height = width / HEIGHT_RATIO,
	target = "_self",
}) => {
	const [imageUrl, setImageUrl] = useState(badgePath(platform, language));

	const setDefaultImage = () => {
		setImageUrl(badgePath(platform, "en"));
	};

	useLayoutEffect(() => {
		setImageUrl(badgePath(platform, language));
	}, [platform, language]);

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
				src={imageUrl}
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
