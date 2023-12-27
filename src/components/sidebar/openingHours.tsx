import i18n from "i18next";
import OpeningHours, { argument_hash } from "opening_hours";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {useLanguage} from "~/i18n";
import SpanNoData from "./spanNoData";

interface OpeningHoursProps {
    openingHours: string,
    timezoneOffsetUTCMinutes: number,
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

function parseOpeningHours(openingHours: string): string | null {
    if (!openingHours) return null;

    try {
        const oh = new OpeningHours(openingHours, null, 2);
        const language = useLanguage();
        const config = getOpeningHoursConfig(language);
        // @ts-ignore
        return oh.prettifyValue({ conf: config });
    } catch (error) {
        console.error(`Error when parsing opening hours: ${error}`);
        return openingHours;
    }
}

function isCurrentlyOpen(openingHours: string, timezoneOffsetUTCMinutes: number): boolean | null {
    if (!openingHours) return null;

    if (openingHours === "24/7") return true;

    if (openingHours.startsWith("\"") && openingHours.endsWith("\"")) return null;

    try {
        const oh = new OpeningHours(openingHours, null, 2);
        const now = Date.now();
        const minutesOffset = new Date(now).getTimezoneOffset() + timezoneOffsetUTCMinutes;
        const time = new Date(now + convertMinutesToMilliseconds(minutesOffset));
        return oh.getState(time);
    } catch (error) {
        console.error(`Error while parsing opening hours: ${error}`);
        return null;
    }
}

export const CurrentlyOpenStatus: FC<OpeningHoursProps> = ({ openingHours, timezoneOffsetUTCMinutes }) => {
    const { t } = useTranslation();
    const isOpen = isCurrentlyOpen(openingHours, timezoneOffsetUTCMinutes);

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

export const OpeningHoursDescription: FC<OpeningHoursProps> = ({ openingHours, timezoneOffsetUTCMinutes}) => {
    if (!openingHours) {
        return <SpanNoData />;
    }

    const { t } = useTranslation();

    return (
        <span>
            <span className="has-text-weight-medium">
                {openingHours === "24/7"
                    ? t("opening_hours.24_7")
                    : parseOpeningHours(openingHours)}
            </span>
            <CurrentlyOpenStatus openingHours={openingHours} timezoneOffsetUTCMinutes={timezoneOffsetUTCMinutes} />
        </span>
    );
};

export const OpeningHoursField: FC<OpeningHoursProps> = ({ openingHours, timezoneOffsetUTCMinutes}) => {
    const { t } = useTranslation();
    const openingHoursLabelText = `${t("sidebar.opening_hours")}: `;
    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">{openingHoursLabelText}</p>
            <OpeningHoursDescription openingHours={openingHours} timezoneOffsetUTCMinutes={timezoneOffsetUTCMinutes} />
        </div>
    );
};
