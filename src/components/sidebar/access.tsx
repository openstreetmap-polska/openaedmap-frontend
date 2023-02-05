import { useTranslation } from "react-i18next";
import React, { useState } from "react";

export default function AccessFormField() {
    const { t } = useTranslation();
    const groupName = "aedAccess";
    const [access, setAccess] = useState("");
    const accessOptions: Array<{ value: string, label: string }> = [
        { value: "yes", label: t("access.yes") },
        { value: "private", label: t("access.private") },
        { value: "customers", label: t("access.customers") },
    ];
    return (
        <div>
            <span className="label has-text-weight-semibold">{`${t("form.accessibility")}:`}</span>
            {accessOptions.map(({ value, label }) => (
                <div key={`radio-${value}-field`} className="field">
                    <input
                        key={`radio-${value}-input`}
                        className="is-checkradio is-success mr-1"
                        type="radio"
                        name={groupName}
                        id={`access-${value}`}
                        value={value}
                        checked={access === value}
                        onChange={() => setAccess(value)}
                    />
                    <label
                        htmlFor={`access-${value}`}
                        key={`radio-${value}-label`}
                    >
                        {label}
                    </label>
                </div>
            ))}
        </div>
    );
}
