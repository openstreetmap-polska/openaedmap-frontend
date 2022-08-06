import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function DescriptionText({ description }) {
    if (description) {
        return <span className="has-text-weight-medium">{description}</span>
    } else {
        return <SpanNoData />
    }
}

export function DescriptionField({ description }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.description') + ": "}
            <DescriptionText description={description} />
        </p>
    )
}
