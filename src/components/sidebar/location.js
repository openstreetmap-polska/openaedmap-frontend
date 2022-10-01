import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common'
import React from "react";

function LocationDescription({ description }) {
    if (description) {
        return <span className="has-text-weight-medium">{description}</span>
    } else {
        return <SpanNoData />
    }
}

export function LocationField({ description }) {
    const { t } = useTranslation();

    return (
        <div>
        <p className="has-text-weight-light has-text-grey mb-1">
            {t("sidebar.location") + ": "}
        </p>
        <LocationDescription description={description} />
        </div>
    )
}

export function LocationFormField({ lang }) {
    const { t } = useTranslation();

    return (
        <div className="field pt-2">
            <label className="label has-text-weight-semibold">{t('form.location') + ` (${lang}):`}</label>
            <div className="control">
                <textarea tag={"defibrillator:location" + (lang ? ":" + lang : "")} name="aedLocation" className="textarea is-success" rows="1"
                    placeholder={t("form.location_example")}></textarea>
            </div>
        </div>
    )
}
