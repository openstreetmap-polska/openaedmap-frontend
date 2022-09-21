import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common'
import React, {FC} from "react";

const NoteDescription: FC<NoteProps> = ({ note }) => {
    if (note) {
        return <span className="has-text-weight-medium">{note}</span>
    } else {
        return <SpanNoData />
    }
};

export const NoteField: FC<NoteProps> = ({ note }) => {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.note') + ": "}
            <NoteDescription note={note} />
        </p>
    )
};

interface NoteProps {
    note: string,
}