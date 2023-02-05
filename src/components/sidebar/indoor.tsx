import { useTranslation } from "react-i18next";
import React, { FC, useState } from "react";
import SpanNoData from "./spanNoData";

const IndoorDescription: FC<IndoorProps> = ({ indoor, level }) => {
    const { t } = useTranslation();

    if (indoor) {
        const levelText = level ? ` (${t("sidebar.level")}: ${level})` : "";
        const indoorText = t(`indoor.${indoor}`) + levelText;
        return <span className="has-text-weight-medium">{indoorText}</span>;
    }
    return <SpanNoData />;
};

export const IndoorField: FC<IndoorProps> = ({ indoor, level }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">
                {`${t("sidebar.indoor")}?: `}
            </p>
            <IndoorDescription indoor={indoor} level={level} />
        </div>
    );
};

export function IndoorFormField() {
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

interface IndoorProps {
    indoor: string,
    level: string,
}
