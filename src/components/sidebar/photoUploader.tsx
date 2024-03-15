import { mdiArrowLeftBold, mdiFileDocumentRemove, mdiFileSend } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useState } from "react";
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

// TODO: consider splitting cc0 part from translation
const LicenceInfoBlock: FC = () => {
	const { t } = useTranslation();
	const cc0 = "Creative Commons Zero (CC0 v1.0)";
	const licenseInfoText = t("photo.license");
	if (!licenseInfoText.includes(cc0)) {
		return <p className="block">{licenseInfoText}</p>;
	}
	const [before, after] = licenseInfoText.split(cc0);
	return (
		<p className="block">
			{before}
			<a href="https://creativecommons.org/publicdomain/zero/1.0/">{cc0}</a>
			{after}
		</p>
	);
};

const PhotoUpload: FC<DefibrillatorDetailsProps> = (props) => {
	const { t } = useTranslation();
	const { data, closeSidebar } = props;
	const {
		authState: { auth },
		setSidebarAction,
		setModalState,
	} = useAppContext();
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	if (data === null) return null;
	const accessText = data.tags.access
		? ` - ${t(`access.${data.tags.access}`)}`
		: "";
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
					<Button
						mb={2}
						onClick={() => setSidebarAction(SidebarAction.showDetails)}
					>
						<Icon path={mdiArrowLeftBold} size={0.8} className="icon" />
						<span>{t("footer.cancel")}</span>
					</Button>
					<LicenceInfoBlock />
					<p className="block">{t("photo.license_short_description")}</p>
					{(selectedImage !== null && (
						<div>
							<img
								alt="not found"
								width="250px"
								src={URL.createObjectURL(selectedImage)}
							/>
							<br />
							<div>
								<Button
									m={2}
									color="danger"
									onClick={() => setSelectedImage(null)}
								>
									<Icon
										path={mdiFileDocumentRemove}
										size={0.8}
										className="icon"
									/>
									<span>{t("photo.remove")}</span>
								</Button>
								<Button
									m={2}
									color="success"
									onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
										event.preventDefault();
										const button: HTMLButtonElement = event.currentTarget;
										button.classList.add("is-loading");

										const url = auth?.options().url;
										const storageKey = `${url}oauth2_access_token`;
										const oauth2AccessToken = localStorage.getItem(storageKey);
										if (!oauth2AccessToken || !auth || !auth.authenticated()) {
											const errorMessage =
												`auth.authenticated()=${auth?.authenticated()} ` +
												`<br> oauth2AccessToken=${oauth2AccessToken}`;
											closeSidebar();
											setModalState({
												...initialModalState,
												visible: true,
												type: ModalType.Error,
												errorMessage,
											});
										}
										const fd = new FormData();
										fd.append("node_id", data.osmId);
										fd.append("file_license", "CC0");
										fd.append(
											"oauth2_credentials",
											JSON.stringify({
												access_token: oauth2AccessToken,
												token_type: "Bearer",
												scope: "read_prefs",
											}),
										);
										fd.append("file", selectedImage);
										fetch(`${backendBaseUrl}/api/v1/photos/upload`, {
											method: "POST",
											body: fd,
										})
											.then((response) => {
												if (response.ok) {
													button.classList.remove("is-loading");
													closeSidebar();
													setModalState({
														...initialModalState,
														visible: true,
														type: ModalType.ThanksForPhoto,
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
									<Icon path={mdiFileSend} size={0.8} className="icon" />
									<span>{t("photo.upload")}</span>
								</Button>
							</div>
						</div>
					)) || (
						<input
							type="file"
							accept="capture=camera,image/jpeg,image/jpg,image/png,image/webp"
							onChange={(event) => {
								const { files } = event.target;
								setSelectedImage(
									files !== null && files.length > 0 ? files[0] : null,
								);
							}}
						/>
					)}
				</Card.Content>
			</Card>
		</div>
	);
};

export default PhotoUpload;
