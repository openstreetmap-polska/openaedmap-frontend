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
        <div class="field">
        <label class="label has-text-weight-semibold">{t("sidebar.contact_number")}</label>
        <div class="control">
          <input tag="phone" class="input is-success" type="text" placeholder="+48 123 456 789"
            pattern="^[+][0-9]{2}[ ]?((?:[0-9]{9})|(?:[0-9]{3} [0-9]{3} [0-9]{3})|(?:[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}))$" />
        </div>
        <p class="help has-text-weight-light">{t("form.optional_field")}</p>
      </div>
    )
}
