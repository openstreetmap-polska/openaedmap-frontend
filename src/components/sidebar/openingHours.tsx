import { useTranslation } from "react-i18next";
import OpeningHours, { argument_hash } from "opening_hours";
import i18n from "i18next";
import React, { FC, useEffect, useState } from "react";
import { getFuzzyLocalTimeFromPoint } from "@mapbox/timespace";

import { getNominatimDataForLatLon } from "src/backend";
import { NominatimData } from "src/model/Nominatim";
import SpanNoData from "./spanNoData";

interface OpeningHoursProps {
    openingHours: string,
    lat: number,
    lon: number
}

interface OpeninHoursPreparedData {
    openingHours: string,
    nominatimData: NominatimData | null
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

function getOpeningHoursConfig(language: string): argument_hash {
    return {
        ...openingHoursDefaultConfig,
        locale: language,
    };
}

function parseOpeningHours(openingHours: string, nominatimData: NominatimData | null): string | null {
    if (openingHours) {
        let hoursPrettified;
        try {
            const oh = new OpeningHours(openingHours, nominatimData, 2);
            // @ts-ignore
            hoursPrettified = oh.prettifyValue({ conf: getOpeningHoursConfig(i18n.resolvedLanguage) });
            console.log("hoursPrettified:", hoursPrettified);
            return hoursPrettified;
        } catch (error) {
            console.log("Error when parsing opening hours");
            console.log(error);
            return openingHours;
        }
    }
    return null;
}

function isCurrentlyOpen(openingHours: string, nominatimData: NominatimData | null): boolean | null {
    console.log("openingHours:", openingHours);
    if (openingHours) {
        if (openingHours === "24/7") {
            return true;
        }
        if (openingHours.startsWith("\"") && openingHours.endsWith("\"")) {
            return null;
        }

        try {
            const oh = new OpeningHours(openingHours, nominatimData, 2);
            const nowTimestamp = Date.now();
            let time;
            if (nominatimData) {
                time = getFuzzyLocalTimeFromPoint(nowTimestamp, [nominatimData.lat, nominatimData.lon]);
            }
            // eslint-disable-next-line no-underscore-dangle
            return oh.getState(time?._d);
        } catch (error) {
            console.log(`Error while parsing opening hours: ${error}`);
            return null;
        }
    }
    return null;
}

export const CurrentlyOpenStatus: FC<OpeninHoursPreparedData> = ({ openingHours, nominatimData }) => {
    const { t } = useTranslation();
    const isOpen = isCurrentlyOpen(openingHours, nominatimData);
    if (isOpen === null) {
        return <sup />;
    }
    const currentlyOpenText = `• ${t(isOpen ? "opening_hours.open" : "opening_hours.closed")}`;
    return (
        <sup className="pl-1 is-lowercase">
            <span className={isOpen ? "has-text-primary-dark" : "has-text-danger-dark"}>
                {currentlyOpenText}
            </span>
        </sup>
    );
};

// http://127.0.0.1:3000/#map=4.71/27.12/105.6&node_id=9126380737
export const OpeningHoursDescription: FC<OpeningHoursProps> = ({ openingHours, lat, lon }) => {
    const { t } = useTranslation();
    const [nominatimData,
        setNominatimData] = useState<NominatimData | null>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getNominatimDataForLatLon(lat, lon);
            setNominatimData(data);
        }
        fetchData();
    }, [lat, lon]);

    if (!nominatimData) {
        const loadingText = t("common.loading");
        return (
            <span>{loadingText}</span>
        );
    }

    if (openingHours) {
        return (
            <span>
                <span className="has-text-weight-medium">
                    {openingHours === "24/7" ? t("opening_hours.24_7") : parseOpeningHours(openingHours, nominatimData)}
                </span>
                <CurrentlyOpenStatus openingHours={openingHours} nominatimData={nominatimData} />
            </span>
        );
    }
    return <SpanNoData />;
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
