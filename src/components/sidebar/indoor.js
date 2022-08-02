import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function IndoorDescription({indoor}) {
    const { t } = useTranslation();

    if (indoor) {
        return <span className="has-text-weight-medium">{t(`indoor.${indoor}`)}</span>
    } else {
        return <SpanNoData/>
    }
}

export function IndoorField({indoor}) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.indoor') + "?: "}
            <IndoorDescription indoor={indoor} />
        </p>
    )
}
