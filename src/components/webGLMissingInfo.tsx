import type { FC } from "react";
import { useTranslation } from "react-i18next";

const WebGLMissingInfo: FC = () => {
	const { t } = useTranslation();
	const instructionUrl =
		"https://superuser.com/questions/836832/how-can-i-enable-webgl-in-my-browser/836833#836833";
	return (
		<div className="p-4 is-size-6">
			{t("webgl.disabled_or_unsupported")}
			<br />
			{t("webgl.required_for_using_openaedmap")}
			<br />
			{t("webgl.please_check_instruction_at")}
			<br />
			<a href={instructionUrl}>{instructionUrl}</a>
		</div>
	);
};

export default WebGLMissingInfo;
