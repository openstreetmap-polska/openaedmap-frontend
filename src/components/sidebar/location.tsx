import React from "react";
import { useTranslation } from "react-i18next";

export default function LocationFormField() {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const locationLabelText = `${t("form.location")} (${resolvedLanguage}):`;
    return (
        <div className="field pt-2">
            <label htmlFor="aedLocation" className="label has-text-weight-semibold">{locationLabelText}</label>
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