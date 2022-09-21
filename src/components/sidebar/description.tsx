import {FC} from 'react';
import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common'

const DescriptionText: FC<DescriptionProps> =({ description }) => {
    if (description) {
        return <span className="has-text-weight-medium">{description}</span>
    } else {
        return <SpanNoData />
    }
};

export const DescriptionField: FC<DescriptionProps> = ({ description }) => {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.description') + ": "}
            <DescriptionText description={description} />
        </p>
    )
};


interface DescriptionProps {
    description: string,
}