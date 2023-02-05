import { useTranslation } from "react-i18next";
import opening_hours, { argument_hash } from "opening_hours";
import i18n from "i18next";
import React, { FC } from "react";
import SpanNoData from "./spanNoData";

function openingHoursConfig(language: string): argument_hash {
    return {
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
        locale: language,
    };
}

function parseOpeningHours(openingHours: string): string | null {
    if (openingHours) {
        let hoursPrettified;
        try {
            // eslint-disable-next-line new-cap
            const oh = new opening_hours(openingHours, undefined, 2);
            // @ts-ignore
            hoursPrettified = oh.prettifyValue({ conf: openingHoursConfig(i18n.resolvedLanguage) });
            return hoursPrettified;
        } catch (error) {
            console.log("Error when parsing opening hours");
            console.log(error);
            return openingHours;
        }
    }
    return null;
}

function isCurrentlyOpen(openingHours: string): boolean | null {
    if (openingHours) {
        if (openingHours === "24/7") {
            return true;
        }
        if (openingHours.startsWith("\"") && openingHours.endsWith("\"")) {
            return null;
        }

        try {
            // eslint-disable-next-line new-cap
            const oh = new opening_hours(openingHours, undefined, 2);
            return oh.getState();
        } catch (error) {
            console.log(`Error while parsing opening hours: ${error}`);
            return null;
        }
    }
    return null;
}

export const CurrentlyOpenStatus: FC<OpeningHoursProps> = ({ openingHours }) => {
    const { t } = useTranslation();
    const isOpen = isCurrentlyOpen(openingHours);
    if (isOpen === null) {
        return <sup />;
    }
    return (
        <sup className="pl-1 is-lowercase">
            <span className={isOpen ? "has-text-primary-dark" : "has-text-danger-dark"}>
                •
                {" "}
                {t(isOpen ? "opening_hours.open" : "opening_hours.closed")}
            </span>
        </sup>
    );
};

export const OpeningHoursDescription: FC<OpeningHoursProps> = ({ openingHours }) => {
    const { t } = useTranslation();

    if (openingHours) {
        return (
            <span>
                <span className="has-text-weight-medium">
                    {openingHours === "24/7" ? t("opening_hours.24_7") : parseOpeningHours(openingHours)}
                </span>
                <CurrentlyOpenStatus openingHours={openingHours} />
            </span>
        );
    }
    return <SpanNoData />;
};

export const OpeningHoursField: FC<OpeningHoursProps> = ({ openingHours }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">
                {`${t("sidebar.opening_hours")}: `}
            </p>
            <OpeningHoursDescription openingHours={openingHours} />
        </div>
    );
};

interface OpeningHoursProps {
    openingHours: string
}