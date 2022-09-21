import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common'
import {FC} from "react";
import * as React from "react";

const OperatorDescription: FC<OperatorProps> = ({ operator }) => {
    if (operator) {
        return <span className="has-text-weight-medium">{operator}</span>
    } else {
        return <SpanNoData />
    }
};

export const OperatorField: FC<OperatorProps> = ({ operator }) => {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.operator') + ": "}
            <OperatorDescription operator={operator} />
        </p>
    )
};

interface OperatorProps {
    operator: string,
}