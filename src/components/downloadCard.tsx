import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { Country } from "../model/country";
import { fetchCountriesData } from "../backend";

export default function DownloadCard() {
    const { t, i18n: { resolvedLanguage: language } } = useTranslation();
    function resolvedLanguageToBackendLanguage(): string {
        let result = language;
        if (result.includes("-")) [result] = result.split("-");
        result = result.toUpperCase();
        return result;
    }
    function worldAsCountry(count: number): Country {
        return {
            code: "",
            names: { default: t("sidebar.world"), [resolvedLanguageToBackendLanguage()]: t("sidebar.world") },
            featureCount: count,
            dataPath: "/data/world.geojson",
        };
    }
    function countryName(country: Country) {
        const backendLanguage = resolvedLanguageToBackendLanguage();
        if (Object.hasOwn(country.names, backendLanguage)) {
            return country.names[backendLanguage];
        }
        return country.names.default;
    }
    const [countries, setCountries] = useState<Array<Country>>([]);
    const world = worldAsCountry(countries.reduce((acc, country) => acc + country.featureCount, 0));
    const sortedCountriesByName = countries
        .sort((a: Country, b: Country) => ((countryName(a) < countryName(b)) ? -1 : 1));
    const countriesAndWorld = [world].concat(sortedCountriesByName);
    const [selectedCountry, setSelectedCountry] = useState<Country>(world);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCountriesData();
            if (data !== null) setCountries(data);
        };
        fetchData().catch(console.error);
    }, []);

    function countryLabel(country: Country) {
        return `${countryName(country)} (${country.featureCount})`;
    }
    return (
        <div className="px-4 pt-5">
            <div className="content has-text-weight-light">
                <p className="has-text-weight-normal">
                    <Icon path={mdiDownload} size={1} className="icon mr-1" color="#7a7a7a" />
                    {t("sidebar.download_title")}
                </p>
                <select
                    className="select mb-2"
                    onChange={(e) => {
                        const selected = countriesAndWorld
                            .find((country) => country.code === e.target.value);
                        if (selected !== undefined) setSelectedCountry(selected);
                    }}
                >
                    { countriesAndWorld.map((country) => (
                        <option key={country.code} value={country.code}>{countryLabel(country)}</option>
                    ))}
                </select>
                <a
                    className="button is-success mr-1"
                    href={selectedCountry.dataPath}
                    target="_blank"
                    rel="noreferrer"
                    download
                    key={t("sidebar.geojson")}
                >
                    <Icon
                        path={mdiDownload}
                        size={1}
                        className="icon mr-2"
                    />
                    {t("sidebar.geojson")}
                </a>
                <hr className="my-3" />
            </div>
        </div>
    );
}