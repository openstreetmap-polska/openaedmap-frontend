import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import SpanNoData from "./spanNoData";

const DescriptionText: FC<DescriptionProps> = ({ description }) => {
    if (description) {
        return <span className="has-text-weight-medium">{description}</span>;
    }
    return <SpanNoData />;
};

const DescriptionField: FC<DescriptionProps> = ({ description }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p className="has-text-weight-light has-text-grey mb-0 pb-0">
                {`${t("sidebar.description")}: `}
            </p>
            <DescriptionText description={description} />
        </div>
    );
};

interface DescriptionProps {
    description: string,
}

export default DescriptionField;