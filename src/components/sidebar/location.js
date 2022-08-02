import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function LocationDescription({description}) {
    if (description) {
        return <span className="has-text-weight-medium">{description}</span>
    } else {
        return <SpanNoData/>
    }
}

export function LocationField({description}) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.location') + "?: "}
            <LocationDescription description={description} />
        </p>
    )
}
