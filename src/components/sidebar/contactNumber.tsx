import { useTranslation } from "react-i18next";
import React, { FC } from "react";
import { mdiPhone } from "@mdi/js";
import Icon from "@mdi/react";
import SpanNoData from "./spanNoData";

const ContactNumberDescription: FC<ContactNumberProps> = ({ contactNumber }) => {
    if (contactNumber) {
        return <span className="has-text-weight-medium">{contactNumber}</span>;
    }
    return <SpanNoData />;
};

export const ContactNumberField: FC<ContactNumberProps> = ({ contactNumber }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">
                {`${t("sidebar.contact_number")}: `}
            </p>
            <ContactNumberDescription contactNumber={contactNumber} />
        </div>
    );
};

export function ContactPhoneFormField() {
    const { t } = useTranslation();

    const phoneRegex = "^[+][0-9]{2}[ ]?((?:[0-9]{9})|(?:[0-9]{3} [0-9]{3} "
        + "[0-9]{3})|(?:[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}))$";

    return (
        <div className="field">
            <label htmlFor="aedPhone" className="label has-text-weight-semibold">{t("sidebar.contact_number")}</label>
            <div className="control has-icons-left">
                <input
                    className="input is-success"
                    type="text"
                    placeholder="+48 123 456 789"
                    name="aedPhone"
                    pattern={phoneRegex}
                />
                <span className="icon is-small is-left is-flex is-justify-content-center">
                    <Icon path={mdiPhone} size={1} color="#dbdbdb" />
                </span>
            </div>
            <p className="help has-text-weight-light">{t("form.optional_field")}</p>
        </div>
    );
}

interface ContactNumberProps {
    contactNumber: string,
}
