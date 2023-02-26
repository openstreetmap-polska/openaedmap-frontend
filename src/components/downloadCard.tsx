import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@mdi/react";
import { mdiDownload, mdiEarth, mdiFlag } from "@mdi/js";
import { Country } from "../model/country";
import { fetchCountriesData } from "../backend";

export default function DownloadCard() {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const world: Country = {
        code: "",
        names: { default: t("sidebar.world") },
        featureCount: 0,
        dataPath: "/data/world.geojson",
    };
    const [countries, setCountries] = useState<Array<Country>>([world]);
    const [selectedCountry, setSelectedCountry] = useState<Country>(world);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCountriesData();
            if (data !== null) setCountries([world].concat(data));
        };
        fetchData().catch(console.error);
    }, []);
    function countryName(country: Country, language: string) {
        let lang = language;
        if (lang.includes("-")) [lang] = lang.split("-");
        lang = lang.toUpperCase();
        if (Object.hasOwn(country.names, lang)) {
            return country.names[lang];
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
                        const selected = countries
                            .find((country) => countryName(country, resolvedLanguage) === e.target.value);
                        if (selected !== undefined) setSelectedCountry(selected);
                    }}
                >
                    { countries.map((country) => (
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
                    <Icon path={selectedCountry === world ? mdiEarth : mdiFlag} size={1} className="icon mr-2" />
                    {t("sidebar.geojson")}
                </a>
                <hr className="my-3" />
            </div>
        </div>
    );
}