import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function ContactNumberDescription({ contactNumber }) {
    if (contactNumber) {
        return <span className="has-text-weight-medium">{contactNumber}</span>
    } else {
        return <SpanNoData />
    }
}

export function ContactNumberField({ contactNumber }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.contact_number') + ": "}
            <ContactNumberDescription contactNumber={contactNumber} />
        </p>
    )
}

export function ContactPhoneFormField() {
    const { t } = useTranslation();

    return (
        <div className="field">
        <label className="label has-text-weight-semibold">{t("sidebar.contact_number")}</label>
        <div className="control">
          <input className="input is-success" type="text" placeholder="+48 123 456 789" name="aedPhone"
            pattern="^[+][0-9]{2}[ ]?((?:[0-9]{9})|(?:[0-9]{3} [0-9]{3} [0-9]{3})|(?:[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}))$" />
        </div>
        <p className="help has-text-weight-light">{t("form.optional_field")}</p>
      </div>
    )
}
