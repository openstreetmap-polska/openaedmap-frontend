import { useTranslation } from "react-i18next";
import { mdiCalendar } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC } from "react";

export const CheckDateField: FC<CheckDateProps> = ({ check_date }) => {
    const { t } = useTranslation();

    if (check_date) {
        return (
            <span className={"is-pulled-right is-flex has-text-grey-dark has-text-weight-light"
                + "is-size-7 p-0 is-justify-content-center"}
            >
                <Icon path={mdiCalendar} size={0.7} color="#dbdbdb" className="mr-1" />
                {`${t("sidebar.verification_date")}: `}
                <span className="has-text-weight-medium">{check_date}</span>
            </span>
        );
    }
    return (
        <span className={"is-pulled-right is-flex has-text-grey-dark has-text-weight-light"
            + "is-size-7 p-0 is-justify-content-center"}
        >
            <Icon path={mdiCalendar} size={0.7} color="#dbdbdb" className="mr-1" />
            {`${t("sidebar.verification_date")}: `}
            <span className="is-italic has-text-grey-light">{t("sidebar.no_data")}</span>
        </span>
    );
};

export function CheckDateFormField() {
    const curr = new Date();
    const date = curr.toISOString().substring(0, 10);

    const { t } = useTranslation();

    return (
        <div className="field">
            <label htmlFor="aedCheckDate" className="label has-text-weight-semibold">
                {t("sidebar.verification_date")}
            </label>
            <div className="control has-icons-left">
                <input
                    className="input is-success py-0 datepicker-input"
                    type="date"
                    defaultValue={date}
                    placeholder={date}
                    max={date}
                    name="aedCheckDate"
                    required
                    pattern="\d{4}-\d{2}-\d{2}"
                />
                <span className="icon is-small is-left is-flex is-justify-content-center">
                    <Icon path={mdiCalendar} size={1} color="#dbdbdb" />
                </span>
            </div>
        </div>
    );
}

interface CheckDateProps {
    check_date: string,
}