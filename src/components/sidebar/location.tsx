import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "~/i18n";

export default function LocationFormField({
	location,
	setLocation,
}: LocationFormFieldProps) {
	const { t } = useTranslation();
	const language = useLanguage();
	const locationLabelText = `${t("form.location")} (${language}):`;
	return (
		<div className="field pt-2">
			<label htmlFor="aedLocation" className="label has-text-weight-semibold">
				{locationLabelText}
			</label>
			<div className="control">
				<textarea
					value={location}
					onChange={(event) => setLocation(event.target.value)}
					name="aedLocation"
					className="textarea is-success"
					rows={2}
					placeholder={t("form.location_example")}
				/>
			</div>
		</div>
	);
}

interface LocationFormFieldProps {
	location: string;
	setLocation: (location: string) => void;
}
