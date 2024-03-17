import React, { type FC } from "react";
import { useTranslation } from "react-i18next";
import SpanNoData from "./spanNoData";

const DetailTextRow: FC<DetailTextRowProps> = ({ translationId, text }) => {
	const { t } = useTranslation();
	const labelText = `${t(translationId)}: `;
	return (
		<div>
			<p className="has-text-weight-light has-text-grey mb-1">{labelText}</p>
			{text ? (
				<span className="has-text-weight-medium">{text}</span>
			) : (
				<SpanNoData />
			)}
		</div>
	);
};
interface DetailTextRowProps {
	translationId: string;
	text: string;
}
export default DetailTextRow;
