import {
	mdiAccountSupervisorOutline,
	mdiClockOutline,
	mdiHomeRoof,
	mdiImagePlus,
	mdiInformationOutline,
	mdiMapMarkerOutline,
	mdiPhoneOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC } from "react";
import { Button, Card, Columns, Image } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useAppContext } from "~/appContext";
import { backendBaseUrl } from "~/backend";
import { useLanguage } from "~/i18n";
import { DefibrillatorData } from "~/model/defibrillatorData";
import { ModalType, initialModalState } from "~/model/modal";
import SidebarAction from "~/model/sidebarAction";
import { accessColourClass } from "./access";
import {
	CloseSidebarButton,
	CopyUrlButton,
	EditButton,
	GoogleMapsNavigationButton,
	OpenStreetMapNavigationButton,
	ViewButton,
} from "./buttons";
import DetailTextRow from "./detailTextRow";
import { OpeningHoursField } from "./openingHours";
import { CheckDateField } from "./verificationDate";

const PhotoGallery: FC<DefibrillatorDetailsProps> = ({
	data,
	closeSidebar,
}) => {
	if (data === null) return null;
	const { t } = useTranslation();
	const {
		authState: { auth },
		setSidebarAction,
		setModalState,
	} = useAppContext();
	const [imageError, setImageError] = React.useState("");
	let images: ReactImageGalleryItem[] = [];
	// Currently only one photo allowed
	if (data.photoRelativeUrl !== undefined && data.photoRelativeUrl !== null) {
		const imageUrl = backendBaseUrl + data.photoRelativeUrl;
		if (imageUrl !== imageError) {
			images = [
				{
					original: imageUrl,
					thumbnail: imageUrl,
				},
			];
		}
	}
	if (images.length > 0) {
		// ref would be used if there were more photos to see which one is selected
		// const refImg = useRef<ImageGallery>(null);
		const renderCustomControls = () => (
			<Button
				outlined
				inverted
				p={2}
				className="image-gallery-custom-icon"
				onClick={() => setSidebarAction(SidebarAction.reportPhoto)}
			>
				{t("photo.report")}
			</Button>
		);

		return (
			<div>
				<ImageGallery
					// ref={refImg}
					items={images}
					lazyLoad
					showPlayButton={false}
					showThumbnails={images.length > 1}
					renderCustomControls={
						data.photoId === null ? undefined : renderCustomControls
					}
					onImageError={(event: React.SyntheticEvent<HTMLImageElement>) => {
						const target = event.target as HTMLImageElement;
						setImageError(target.src);
					}}
				/>
				<hr style={{ marginTop: "0.5rem", marginBottom: "1rem" }} />
			</div>
		);
	}
	return (
		<div>
			<Button
				mb={1}
				mt={0}
				className="button is-small is-success mx-1"
				onClick={() => {
					if (auth === null || !auth.authenticated()) {
						closeSidebar();
						setModalState({
							...initialModalState,
							visible: true,
							type: ModalType.NeedToLogin,
						});
					}
					setSidebarAction(SidebarAction.uploadPhoto);
				}}
			>
				<Icon path={mdiImagePlus} size={1.15} className="icon" color="#fff" />
				<span>{t("photo.upload")}</span>
			</Button>
			<hr style={{ marginTop: "0.5rem", marginBottom: "1rem" }} />
		</div>
	);
};

const DefibrillatorDetails: FC<DefibrillatorDetailsProps> = (props) => {
	const { t } = useTranslation();
	const language = useLanguage();
	const { data, closeSidebar } = props;
	if (data === null) return null;
	const accessText = data.tags.access
		? ` - ${t(`access.${data.tags.access}`)}`
		: "";
	const defibrillatorLocation =
		data.tags[`defibrillator:location:${language}`] ??
		data.tags["defibrillator:location"];
	const levelText = data.tags.level
		? ` (${t("sidebar.level")}: ${data.tags.level})`
		: "";
	const indoorText = data.tags.indoor
		? t(`indoor.${data.tags.indoor}`) + levelText
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
						src="./img/logo-aed.svg"
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
				<Card.Content pl={3} pr={3} mb={1} pt={2} className="content pb-0">
					<PhotoGallery data={data} closeSidebar={closeSidebar} />
					<Columns vCentered className="is-mobile">
						<Columns.Column textAlign="center" size={2}>
							<Icon
								path={mdiHomeRoof}
								size={1.15}
								className="icon"
								color="#028955"
							/>
						</Columns.Column>
						<Columns.Column className="py-1">
							<DetailTextRow text={indoorText} translationId="sidebar.indoor" />
						</Columns.Column>
					</Columns>
					<Columns vCentered className="is-mobile">
						<Columns.Column textAlign="center" size={2}>
							<Icon
								path={mdiMapMarkerOutline}
								size={1.15}
								className="icon"
								color="#028955"
							/>
						</Columns.Column>
						<Columns.Column className="py-1">
							<DetailTextRow
								text={defibrillatorLocation}
								translationId="sidebar.location"
							/>
						</Columns.Column>
					</Columns>
					<Columns vCentered className="is-mobile">
						<Columns.Column textAlign="center" size={2}>
							<Icon
								path={mdiClockOutline}
								size={1.15}
								className="icon"
								color="#028955"
							/>
						</Columns.Column>
						<Columns.Column className="py-1">
							<OpeningHoursField
								openingHours={data.tags.opening_hours}
								timezoneOffsetUTCMinutes={data.timezoneOffsetUTCMinutes}
							/>
						</Columns.Column>
					</Columns>
					<Columns vCentered className="is-mobile">
						<Columns.Column textAlign="center" size={2}>
							<Icon
								path={mdiPhoneOutline}
								size={1.15}
								className="icon"
								color="#028955"
							/>
						</Columns.Column>
						<Columns.Column className="py-1">
							<DetailTextRow
								text={data.tags.phone}
								translationId="sidebar.contact_number"
							/>
						</Columns.Column>
					</Columns>
					<Columns vCentered className="is-mobile">
						<Columns.Column textAlign="center" size={2}>
							<Icon
								path={mdiAccountSupervisorOutline}
								size={1.15}
								className="icon"
								color="#028955"
							/>
						</Columns.Column>
						<Columns.Column className="py-1">
							<DetailTextRow
								text={data.tags.operator}
								translationId="sidebar.operator"
							/>
						</Columns.Column>
					</Columns>
					<Columns vCentered className="is-mobile pb-0 mb-0">
						<Columns.Column textAlign="center" size={2}>
							<Icon
								path={mdiInformationOutline}
								size={1.15}
								className="icon"
								color="#028955"
							/>
						</Columns.Column>
						<Columns.Column className="py-1">
							<DetailTextRow
								text={
									data.tags[`description:${language}`] ?? data.tags.description
								}
								translationId="sidebar.description"
							/>
						</Columns.Column>
					</Columns>
					<CheckDateField check_date={data.tags.check_date} />
				</Card.Content>
				<Card.Footer>
					<Card.Footer.Item className="has-background-white-ter">
						<CopyUrlButton />
						<ViewButton osmId={data.osmId} />
						<EditButton osmId={data.osmId} />
					</Card.Footer.Item>
				</Card.Footer>
				<Card.Footer>
					<Card.Footer.Item className="has-background-white-ter">
						<OpenStreetMapNavigationButton lat={data.lat} lon={data.lon} />
						<GoogleMapsNavigationButton lat={data.lat} lon={data.lon} />
					</Card.Footer.Item>
				</Card.Footer>
			</Card>
		</div>
	);
};

interface DefibrillatorDetailsProps {
	data: DefibrillatorData | null;
	closeSidebar: () => void;
}

export default DefibrillatorDetails;
