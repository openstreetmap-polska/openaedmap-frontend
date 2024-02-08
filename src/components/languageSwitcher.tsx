import i18n from "i18next";
import React, { useEffect } from "react";
import { Navbar } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import { languages, useLanguage } from "~/i18n";

export default function LanguageSwitcher() {
	const { t } = useTranslation();
	const language = useLanguage();
	useEffect(() => {
		document.title = t("meta.website_title");
	}, [t]);
	return (
		<Navbar.Item px={1}>
			<div className="select">
				<select
					id="language-switcher"
					value={language}
					onChange={(e) => {
						i18n.changeLanguage(e.target.value);
					}}
				>
					{Object.keys(languages).map((language) => (
						<option key={language} value={language}>
							{languages[language].nativeName}
						</option>
					))}
				</select>
			</div>
		</Navbar.Item>
	);
}
