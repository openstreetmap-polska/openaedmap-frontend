import { useTranslation } from "react-i18next";
import React, { FC } from "react";
import SpanNoData from "./spanNoData";

const OperatorDescription: FC<OperatorProps> = ({ operator }) => {
    if (operator) {
        return <span className="has-text-weight-medium">{operator}</span>;
    }
    return <SpanNoData />;
};

const OperatorField: FC<OperatorProps> = ({ operator }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-1">
                {`${t("sidebar.operator")}: `}
            </p>
            <OperatorDescription operator={operator} />
        </div>
    );
};

interface OperatorProps {
    operator: string,
}
export default OperatorField;