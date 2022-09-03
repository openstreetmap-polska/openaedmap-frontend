import { useTranslation } from 'react-i18next';


export function AccessFormField() {
    const { t } = useTranslation();
    return (
        <div>
            <label className="label has-text-weight-semibold">{t("form.accessibility") + ":"}</label>
            <div className="field">
                <input className="is-checkradio is-success mr-1" id="accessRadio1" type="radio" name="aedAccess" value="yes" tag="access" />
                <label htmlFor="accessRadio1">{t("access.yes")}</label>
            </div>
            <div className="field">
                <input className="is-checkradio is-success mr-1" id="accessRadio2" type="radio" name="aedAccess" value="private" tag="access" />
                <label htmlFor="accessRadio2">{t("access.private")}</label>
            </div>
            <div className="field">
                <input className="is-checkradio is-success mr-1" id="accessRadio3" type="radio" name="aedAccess" value="customers" tag="access" />
                <label htmlFor="accessRadio3">{t("access.customers")}</label>
            </div>
        </div>
    )
}
