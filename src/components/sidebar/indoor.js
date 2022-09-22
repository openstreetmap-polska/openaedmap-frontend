import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function IndoorDescription({ indoor }) {
    const { t } = useTranslation();

    if (indoor) {
        return <span className="has-text-weight-medium">{t(`indoor.${indoor}`)}</span>
    } else {
        return <SpanNoData />
    }
}

export function IndoorField({ indoor }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.indoor') + "?: "}
            <IndoorDescription indoor={indoor} />
        </p>
    )
}

export function IndoorFormField() {
    const { t } = useTranslation();
    const groupName = "aedIndoor";
    return (
        <div>
            <label className="label has-text-weight-semibold pt-2">{t("form.is_indoor")}</label>
            <div className="field">
                <input className="is-checkradio is-success mr-1" type="radio" name={groupName} value="no" />
                <label className="mr-2" htmlFor="indoorRadio1">{t("form.outside")}</label>
                <input className="is-checkradio is-success mr-1" type="radio" name={groupName} value="yes" />
                <label className="mr-2" htmlFor="indoorRadio2">{t("form.inside")}</label>
            </div>
        </div>
    )
}
