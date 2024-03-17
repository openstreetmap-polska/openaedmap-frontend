import { mdiCalendar } from "@mdi/js";
import Icon from "@mdi/react";
import React, { type FC } from "react";
import { useTranslation } from "react-i18next";
import SpanNoData from "./spanNoData";

export const CheckDateField: FC<CheckDateProps> = ({ check_date }) => {
	const { t } = useTranslation();
	const verificationDateText = `${t("sidebar.verification_date")}: `;
	return (
		<span
			className={
				"is-pulled-right is-flex has-text-grey-dark has-text-weight-light" +
				" is-size-7 p-0 is-justify-content-center"
			}
		>
			<Icon path={mdiCalendar} size={0.7} color="#dbdbdb" className="mr-1" />
			{verificationDateText}
			{check_date ? (
				<span className="has-text-weight-medium">{check_date}</span>
			) : (
				<SpanNoData />
			)}
		</span>
	);
};

export function CheckDateFormField({
	checkDate,
	setCheckDate,
	todayDate,
}: CheckDateFormFieldProps) {
	const { t } = useTranslation();

	return (
		<div className="field">
			<label htmlFor="aedCheckDate" className="label has-text-weight-semibold">
				{t("sidebar.verification_date")}
			</label>
			<div className="control has-icons-left">
				<input
					className="input is-success py-0 datepicker-input"
					type="date"
					value={checkDate}
					defaultValue={todayDate}
					placeholder={todayDate}
					max={todayDate}
					name="aedCheckDate"
					onChange={(event) => setCheckDate(event.target.value)}
					required
					pattern="\d{4}-\d{2}-\d{2}"
				/>
				<span className="icon is-small is-left is-flex is-justify-content-center">
					<Icon path={mdiCalendar} size={1} color="#dbdbdb" />
				</span>
			</div>
		</div>
	);
}

interface CheckDateProps {
	check_date: string;
}

interface CheckDateFormFieldProps {
	checkDate: string;
	setCheckDate: (checkDate: string) => void;
	todayDate: string;
}
