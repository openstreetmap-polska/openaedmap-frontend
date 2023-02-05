import { useTranslation } from "react-i18next";
import React, { useState } from "react";

export default function IndoorFormField() {
    const { t } = useTranslation();
    const groupName = "aedIndoor";
    const [indoor, setIndoor] = useState("");
    const indoorOptions: Array<{ value: string, label: string }> = [
        { value: "no", label: t("form.outside") },
        { value: "yes", label: t("form.inside") },
    ];
    return (
        <div>
            <span className="label has-text-weight-semibold pt-2">{t("form.is_indoor")}</span>
            <div className="field">
                {indoorOptions.map(({ value, label }) => (
                    <React.Fragment key={value}>
                        <input
                            key={`radio-${value}-input`}
                            className="is-checkradio is-success mr-1"
                            type="radio"
                            name={groupName}
                            value={value}
                            id={`indoor-${value}`}
                            checked={indoor === value}
                            onChange={() => setIndoor(value)}
                        />
                        <label
                            htmlFor={`indoor-${value}`}
                            key={`radio-${value}-label`}
                        >
                            {label}
                        </label>
                    </React.Fragment>
                ))}
            </div>
            {indoor === "yes" && (
                <div className="field">
                    <label htmlFor="level" className="label has-text-weight-semibold pt-2">{t("form.level")}</label>
                    <div className="control">
                        <input className="input is-success" type="number" placeholder="13" name="level" />
                    </div>
                </div>
            )}
        </div>
    );
}
