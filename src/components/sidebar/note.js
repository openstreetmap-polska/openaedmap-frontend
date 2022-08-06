import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common.js'

function NoteDescription({ note }) {
    if (note) {
        return <span className="has-text-weight-medium">{note}</span>
    } else {
        return <SpanNoData />
    }
}

export function NoteField({ operator: note }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.note') + ": "}
            <NoteDescription note={note} />
        </p>
    )
}
