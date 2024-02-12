import { mdiArrowLeftBold, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC } from "react";
import { Button, Card, Image } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import { useAppContext } from "~/appContext";
import { backendBaseUrl } from "~/backend";
import { DefibrillatorData } from "~/model/defibrillatorData";
import { ModalType, initialModalState } from "~/model/modal";
import SidebarAction from "~/model/sidebarAction";
import { accessColourClass } from "./access";
import { CloseSidebarButton } from "./buttons";

interface DefibrillatorDetailsProps {
	data: DefibrillatorData | null;
	closeSidebar: () => void;
}

const PhotoReport: FC<DefibrillatorDetailsProps> = (props) => {
	const { t } = useTranslation();
	const { data, closeSidebar } = props;
	const { setSidebarAction, setModalState } = useAppContext();
	if (data === null) return null;
	const accessText = data.tags.access
		? ` - ${t(`access.${data.tags.access}`)}`
		: "";
	const sendReport = (photoId?: string): Promise<Response> => {
		if (photoId === undefined) {
			throw Error("Photo id is undefined. Report issue to the maintainers.");
		}
		console.log("Reported photo:", photoId);
		return fetch(`${backendBaseUrl}/api/v1/photos/report`, {
			method: "POST",
			body: `id=${encodeURIComponent(photoId)}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
			},
		});
	};

	return (
		<div className="sidebar" id="sidebar-div">
			<Card>
				<Card.Header
					id="sidebar-header"
					shadowless
					className={accessColourClass(data.tags.access)}
					alignItems="center"
				>
					<Image
						m={2}
						className="icon"
						src="/img/logo-aed.svg"
						color="white"
						alt=""
						size={48}
					/>
					<span
						className="is-size-5 py-2 has-text-weight-light"
						id="sidebar-caption"
					>
						{t("sidebar.caption_info") + accessText}
					</span>
					<CloseSidebarButton closeSidebarFunction={closeSidebar} />
				</Card.Header>
				<Card.Content>
					<p>{t("photo.report_long_text")}</p>
					<Button
						m={2}
						onClick={() => setSidebarAction(SidebarAction.showDetails)}
					>
						<Icon path={mdiArrowLeftBold} size={0.8} className="icon" />
						<span>{t("footer.cancel")}</span>
					</Button>
					<Button
						m={2}
						onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
							event.preventDefault();
							const button: HTMLButtonElement = event.currentTarget;
							button.classList.add("is-loading");

							sendReport(data.photoId)
								.then((response) => {
									if (response.ok) {
										button.classList.remove("is-loading");
										closeSidebar();
										setModalState({
											...initialModalState,
											visible: true,
											type: ModalType.ThanksForReport,
										});
									} else {
										const responseJson = JSON.stringify(
											response.json(),
											null,
											2,
										);
										const errorMessage =
											`Response status: ${response.status} ` +
											`${response.statusText} <br> ${responseJson}`;
										throw Error(errorMessage);
									}
								})
								.catch((error) => {
									button.classList.remove("is-loading");
									closeSidebar();
									setModalState({
										...initialModalState,
										visible: true,
										type: ModalType.Error,
										errorMessage: error,
									});
								});
						}}
					>
						<Icon path={mdiSend} size={0.8} className="icon" />
						<span>{t("photo.send_report")}</span>
					</Button>
				</Card.Content>
			</Card>
		</div>
	);
};

export default PhotoReport;
