import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import SpanNoData from "./spanNoData";

const LocationDescription: FC<LocationProps> = ({ description }) => {
    if (description) {
        return <span className="has-text-weight-medium">{description}</span>;
    }
    return <SpanNoData />;
};

export const LocationField: FC<LocationProps> = ({ description }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">
                {`${t("sidebar.location")}: `}
            </p>
            <LocationDescription description={description} />
        </div>
    );
};

export function LocationFormField() {
    const { t, i18n: { resolvedLanguage } } = useTranslation();

    return (
        <div className="field pt-2">
            <label htmlFor="aedLocation" className="label has-text-weight-semibold">
                {`${t("form.location")} (${resolvedLanguage}):`}
            </label>
            <div className="control">
                <textarea
                    name="aedLocation"
                    className="textarea is-success"
                    rows={2}
                    placeholder={t("form.location_example")}
                />
            </div>
        </div>
    );
}

interface LocationProps {
    description: string,
}