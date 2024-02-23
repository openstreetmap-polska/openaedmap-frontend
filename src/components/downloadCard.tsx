import { mdiDownload, mdiFileDownloadOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "~/appContext";
import { backendBaseUrl } from "~/backend";
import { useLanguage } from "~/i18n";
import { Country } from "~/model/country";

const worldCountryCode = "WORLD";

export default function DownloadCard() {
	const { t } = useTranslation();
	const language = useLanguage();
	const { countriesData } = useAppContext();
	function countryName(country: Country) {
		if (country.code === worldCountryCode) return t("sidebar.world");
		const backendLanguageUppercase = language.toUpperCase();
		if (country.names[backendLanguageUppercase] !== undefined) {
			return country.names[backendLanguageUppercase];
		}
		if (backendLanguageUppercase.includes("-")) {
			const basicLanguage = backendLanguageUppercase.split("-")[0];
			if (country.names[basicLanguage] !== undefined) {
				return country.names[basicLanguage];
			}
		}
		return country.names.default;
	}
	const sortedCountriesByName = countriesData.sort((a: Country, b: Country) => {
		if (a.code === worldCountryCode) return -1;
		if (b.code === worldCountryCode) return 1;
		return countryName(a) < countryName(b) ? -1 : 1;
	});
	const [selectedCountryCode, setSelectedCountryCode] =
		useState<string>(worldCountryCode);
	const selectedCountry = countriesData.find(
		(country) => country.code === selectedCountryCode,
	);

	function countryLabel(country: Country) {
		return `${countryName(country)} (${country.featureCount})`;
	}
	return (
		<div className="px-3 pt-5">
			<div className="content">
				<p className="has-text-weight-normal">
					<Icon
						path={mdiDownload}
						size={1}
						className="icon mr-1"
						color="#7a7a7a"
					/>
					{t("sidebar.download_title")}
				</p>
				<div className="select is-primary is-small mb-1">
					<select
						className="select mb-2"
						onChange={(e) => {
							const selected = sortedCountriesByName.find(
								(country) => country.code === e.target.value,
							);
							if (selected !== undefined) setSelectedCountryCode(selected.code);
						}}
					>
						{sortedCountriesByName.map((country) => (
							<option key={country.code} value={country.code}>
								{countryLabel(country)}
							</option>
						))}
					</select>
				</div>
				<a
					className="button is-success is-fullwidth is-small"
					href={
						selectedCountry ? backendBaseUrl + selectedCountry.dataPath : ""
					}
					target="_blank"
					rel="noreferrer"
					download
					key={t("sidebar.geojson")}
				>
					<Icon path={mdiFileDownloadOutline} size={1} className="icon mr-2" />
					{t("sidebar.geojson")}
				</a>
				<hr className="my-4" />
			</div>
		</div>
	);
}
