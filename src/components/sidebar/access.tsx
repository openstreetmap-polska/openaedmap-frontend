import { useTranslation } from 'react-i18next';
import React, {useState} from "react";

export function AccessFormField() {
    const { t } = useTranslation();
    const groupName = "aedAccess";
    const [access, setAccess] = useState("");
    const accessOptions: Array<{value: string, label: string}> = [
        {"value": "yes", "label": t("access.yes")},
        {"value": "private", "label": t("access.private")},
        {"value": "customers", "label": t("access.customers")},
    ];
    return (
        <div>
            <label className="label has-text-weight-semibold">{t("form.accessibility") + ":"}</label>
            {accessOptions.map(({value, label}) => (
            <div key={`radio-${value}-field`} className="field">
                <input
                    key={`radio-${value}-input`}
                    className="is-checkradio is-success mr-1"
                    type="radio"
                    name={groupName}
                    value={value}
                    checked={access == value}
                    onChange={() => setAccess(value)}
                />
                <label
                    key={`radio-${value}-label`}
                    onClick={() => setAccess(value)}>
                    {label}
                </label>
            </div>
        ))}
        </div>
    )
}
