import { useTranslation } from 'react-i18next';


export function AccessFormField() {
    const { t } = useTranslation();
    const groupName = "aedAccess";
    return (
        <div>
            <label className="label has-text-weight-semibold">{t("form.accessibility") + ":"}</label>
            <div className="field">
                <input className="is-checkradio is-success mr-1" type="radio" name={groupName} value="yes" tag="access" />
                <label htmlFor="accessRadio1">{t("access.yes")}</label>
            </div>
            <div className="field">
                <input className="is-checkradio is-success mr-1" type="radio" name={groupName} value="private" tag="access" />
                <label htmlFor="accessRadio2">{t("access.private")}</label>
            </div>
            <div className="field">
                <input className="is-checkradio is-success mr-1" type="radio" name={groupName} value="customers" tag="access" />
                <label htmlFor="accessRadio3">{t("access.customers")}</label>
            </div>
        </div>
    )
}
