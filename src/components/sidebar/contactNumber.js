import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function ContactNumberDescription({ contactNumber }) {
    if (contactNumber) {
        return <span className="has-text-weight-medium">{contactNumber}</span>
    } else {
        return <SpanNoData />
    }
}

export function ContactNumberField({ contactNumber }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.contact_number') + ": "}
            <ContactNumberDescription contactNumber={contactNumber} />
        </p>
    )
}
