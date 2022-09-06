import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

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
        <p className="has-text-weight-light">
            {t("sidebar.location") + ": "}
            <LocationDescription description={description} />
        </p>
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
