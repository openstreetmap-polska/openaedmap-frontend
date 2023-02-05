import React from "react";
import { useTranslation } from "react-i18next";

export default function LocationFormField({ location, setLocation }: LocationFormFieldProps) {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const locationLabelText = `${t("form.location")} (${resolvedLanguage}):`;
    console.log(location);
    return (
        <div className="field pt-2">
            <label htmlFor="aedLocation" className="label has-text-weight-semibold">{locationLabelText}</label>
            <div className="control">
                <textarea
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    name="aedLocation"
                    className="textarea is-success"
                    rows={2}
                    placeholder={t("form.location_example")}
                />
            </div>
        </div>
    );
}

interface LocationFormFieldProps {
    location: string,
    setLocation: (location: string) => void,
}