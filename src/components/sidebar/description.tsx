import React, {FC} from 'react';
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
        <div>
        <p className="has-text-weight-light has-text-grey mb-1">
            {t('sidebar.description') + ": "}
        </p>
        <DescriptionText description={description} />
        </div>
    )
};


interface DescriptionProps {
    description: string,
}