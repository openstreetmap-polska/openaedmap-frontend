import { useTranslation } from "react-i18next";
import React from "react";

export default function AccessFormField({ access, setAccess }: AccessFormFieldProps) {
    const { t } = useTranslation();
    const groupName = "aedAccess";
    const accessOptions: Array<{ value: string, label: string }> = [
        { value: "yes", label: t("access.yes") },
        { value: "private", label: t("access.private") },
        { value: "customers", label: t("access.customers") },
    ];
    const accessLabelText = `${t("form.accessibility")}:`;
    return (
        <div>
            <span className="label has-text-weight-semibold">{accessLabelText}</span>
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

interface AccessFormFieldProps {
    access: string,
    setAccess: (access: string) => void,
}