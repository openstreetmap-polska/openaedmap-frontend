import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function OperatorDescription({ operator }) {
    if (operator) {
        return <span className="has-text-weight-medium">{operator}</span>
    } else {
        return <SpanNoData />
    }
}

export function OperatorField({ operator }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.operator') + ": "}
            <OperatorDescription operator={operator} />
        </p>
    )
}
