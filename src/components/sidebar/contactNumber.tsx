import { useTranslation } from 'react-i18next';
import SpanNoData from "./spanNoData";
import React, {FC} from "react";

const ContactNumberDescription: FC<ContactNumberProps> = ({ contactNumber }) => {
    if (contactNumber) {
        return <span className="has-text-weight-medium">{contactNumber}</span>
    } else {
        return <SpanNoData />
    }
};

export const ContactNumberField: FC<ContactNumberProps> = ({ contactNumber }) => {
    const { t } = useTranslation();

    return (
        <div>
        <p className="has-text-weight-light has-text-grey mb-1">
            {t('sidebar.contact_number') + ": "}
        </p>
        <ContactNumberDescription contactNumber={contactNumber} />
        </div>
    )
};

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

interface ContactNumberProps {
    contactNumber: string,
}
