import { useTranslation } from "react-i18next";
import OpeningHours, { argument_hash } from "opening_hours";
import i18n from "i18next";
import React, { FC, useEffect, useState } from "react";
import { getFuzzyLocalTimeFromPoint } from "@mapbox/timespace";

import { getNominatimReverseGeocodingState } from "src/backend";
import { NominatimStateData } from "src/model/Nominatim";
import SpanNoData from "./spanNoData";

interface OpeningHoursProps {
    openingHours: string,
    lat: number,
    lon: number
}

interface OpeningHoursPreparedData {
    openingHours: string,
    nominatimStateData: NominatimStateData | null
}

const openingHoursDefaultConfig = {
    rule_index: undefined,
    zero_pad_hour: true,
    one_zero_if_hour_zero: false,
    leave_off_closed: false,
    keyword_for_off_closed: "",
    rule_sep_string: "\n",
    print_semicolon: false,
    leave_weekday_sep_one_day_betw: false,
    sep_one_day_between: "",
    zero_pad_month_and_week_numbers: true,
};

function convertMinutesToMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
}

function getOpeningHoursConfig(language: string): argument_hash {
    return {
        ...openingHoursDefaultConfig,
        locale: language,
    };
}

function parseOpeningHours(openingHours: string, nominatimStateData: NominatimStateData | null): string | null {
    if (!openingHours) return null;

    try {
        const oh = new OpeningHours(openingHours, nominatimStateData, 2);
        const config = getOpeningHoursConfig(i18n.resolvedLanguage);
        // @ts-ignore
        return oh.prettifyValue({ conf: config });
    } catch (error) {
        console.log(`Error when parsing opening hours: ${error}`);
        return openingHours;
    }
}

function isCurrentlyOpen(openingHours: string, nominatimStateData: NominatimStateData | null): boolean | null {
    if (!openingHours) return null;

    if (openingHours === "24/7") return true;

    if (openingHours.startsWith("\"") && openingHours.endsWith("\"")) return null;

    try {
        const oh = new OpeningHours(openingHours, nominatimStateData, 2);
        // Not sure why, but getFuzzyLocalTimeFromPoint was returning wrong date so I had to fix it by adding offset
        const epochFixed = Date.now() + convertMinutesToMilliseconds(new Date().getTimezoneOffset());
        const time = nominatimStateData
            ? getFuzzyLocalTimeFromPoint(epochFixed, [nominatimStateData.lon, nominatimStateData.lat])
            : null;
        // eslint-disable-next-line no-underscore-dangle
        return oh.getState(time?._d);
    } catch (error) {
        console.log(`Error while parsing opening hours: ${error}`);
        return null;
    }
}

export const CurrentlyOpenStatus: FC<OpeningHoursPreparedData> = ({ openingHours, nominatimStateData }) => {
    const { t } = useTranslation();
    const isOpen = isCurrentlyOpen(openingHours, nominatimStateData);

    if (isOpen === null) return <sup />;

    const currentlyOpenText = `• ${t(isOpen ? "opening_hours.open" : "opening_hours.closed")}`;
    return (
        <sup className="pl-1 is-lowercase">
            <span className={isOpen ? "has-text-primary-dark" : "has-text-danger-dark"}>
                {currentlyOpenText}
            </span>
        </sup>
    );
};

export const OpeningHoursDescription: FC<OpeningHoursProps> = ({ openingHours, lat, lon }) => {
    if (!openingHours) {
        return <SpanNoData />;
    }

    const { t } = useTranslation();
    const [nominatimStateData, setNominatimStateData] = useState<NominatimStateData | null>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getNominatimReverseGeocodingState(lat, lon);
            setNominatimStateData(data);
        }
        fetchData();
    }, [lat, lon]);

    if (!nominatimStateData) {
        const loadingText = t("common.loading");
        return (
            <span>{loadingText}</span>
        );
    }

    return (
        <span>
            <span className="has-text-weight-medium">
                {openingHours === "24/7"
                    ? t("opening_hours.24_7")
                    : parseOpeningHours(openingHours, nominatimStateData)}
            </span>
            <CurrentlyOpenStatus openingHours={openingHours} nominatimStateData={nominatimStateData} />
        </span>
    );
};

export const OpeningHoursField: FC<OpeningHoursProps> = ({ openingHours, lat, lon }) => {
    const { t } = useTranslation();
    const openingHoursLabelText = `${t("sidebar.opening_hours")}: `;
    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">{openingHoursLabelText}</p>
            <OpeningHoursDescription openingHours={openingHours} lat={lat} lon={lon} />
        </div>
    );
};
