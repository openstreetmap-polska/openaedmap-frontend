import React from "react";
import { useTranslation } from "react-i18next";

export default function SpanNoData() {
    const { t } = useTranslation();

    return (
        <span className="has-text-grey-light is-italic has-text-weight-light">{t("sidebar.no_data")}</span>
    );
}
