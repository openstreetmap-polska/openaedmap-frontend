import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@mdi/react";
import { mdiDownload, mdiEarth, mdiFlag } from "@mdi/js";
import { Country } from "../model/country";
import { fetchCountriesData } from "../backend";

export default function DownloadCard() {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    function resolvedLanguageToBackendLanguage(language: string): string {
        let result = language;
        if (result.includes("-")) [result] = result.split("-");
        result = result.toUpperCase();
        return result;
    }
    function worldAsCountry(language: string): Country {
        return {
            code: "",
            names: { default: t("sidebar.world"), [resolvedLanguageToBackendLanguage(language)]: t("sidebar.world") },
            featureCount: 0,
            dataPath: "/data/world.geojson",
        };
    }
    const world = worldAsCountry(resolvedLanguage);
    const [countries, setCountries] = useState<Array<Country>>([]);
    const countriesAndWorld = [world].concat(countries);
    const [selectedCountry, setSelectedCountry] = useState<Country>(world);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCountriesData();
            if (data !== null) setCountries(data);
        };
        fetchData().catch(console.error);
    }, []);
    function countryName(country: Country, language: string) {
        const backendLanguage = resolvedLanguageToBackendLanguage(language);
        if (Object.hasOwn(country.names, backendLanguage)) {
            return country.names[backendLanguage];
        }
        return country.names.default;
    }
    return (
        <div className="px-4 pt-5">
            <div className="content has-text-weight-light">
                <p className="has-text-weight-normal">
                    <Icon path={mdiDownload} size={1} className="icon mr-1" color="#7a7a7a" />
                    {t("sidebar.download_title")}
                </p>
                <select
                    className="select"
                    onChange={(e) => {
                        const selected = countriesAndWorld
                            .find((country) => countryName(country, resolvedLanguage) === e.target.value);
                        if (selected !== undefined) setSelectedCountry(selected);
                    }}
                >
                    { countriesAndWorld.map((country) => (
                        <option key={country.code}>{countryName(country, resolvedLanguage)}</option>
                    ))}
                </select>
                <br />
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