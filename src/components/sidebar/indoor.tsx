import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common'
import {FC, useState} from "react";
import React from "react";

const IndoorDescription: FC<IndoorProps> = ({ indoor }) => {
    const { t } = useTranslation();

    if (indoor) {
        return <span className="has-text-weight-medium">{t(`indoor.${indoor}`)}</span>
    } else {
        return <SpanNoData />
    }
};

export const IndoorField: FC<IndoorProps> = ({ indoor }) => {
    const { t } = useTranslation();

    return (
        <div>
        <p className="has-text-weight-light has-text-grey mb-1">
        {t('sidebar.indoor') + "?: "}
        </p>
        <IndoorDescription indoor={indoor} />
        </div>
    )
};

export function IndoorFormField() {
    const { t } = useTranslation();
    const groupName = "aedIndoor";
    const [indoor, setIndoor] = useState("");
    const indoorOptions: Array<{value: string, label: string}> = [
        {"value": "no", "label": t("form.outside")},
        {"value": "yes", "label": t("form.inside")},
    ];
    return (
        <div>
            <label className="label has-text-weight-semibold pt-2">{t("form.is_indoor")}</label>
            <div className="field">
                {indoorOptions.map(({value, label}) => (
                    <>
                        <input
                            key={`radio-${value}-input`}
                            className="is-checkradio is-success mr-1"
                            type="radio"
                            name={groupName}
                            value={value}
                            checked={indoor === value}
                            onChange={() => setIndoor(value)}
                        />
                        <label
                            key={`radio-${value}-label`}
                            onClick={() => setIndoor(value)}>
                            {label}
                        </label>
                    </>
                ))}
            </div>
        </div>
    )
}

interface IndoorProps {
    indoor: string,
}
