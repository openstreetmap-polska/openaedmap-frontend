import "bulma/css/bulma.min.css";
import i18n from "i18next";
import React, { FC } from "react";
import { Card, Image, Columns } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import "../Main.css";
import "./sidebar.css";
import Icon from "@mdi/react";
import {
    mdiMapMarkerOutline, mdiClockOutline,
    mdiPhoneOutline, mdiAccountSupervisorOutline, mdiInformationOutline, mdiHomeRoof,
} from "@mdi/js";
import { Marker } from "maplibre-gl";
import {
    CloseSidebarButton,
    CopyUrlButton,
    EditButton,
    ViewButton,
    AddAedButton,
    OpenStreetMapNavigationButton,
    GoogleMapsNavigationButton,
} from "./sidebar/buttons";
import { ContactNumberField, ContactPhoneFormField } from "./sidebar/contactNumber";
import { CheckDateFormField, CheckDateField } from "./sidebar/verificationDate";
import DescriptionField from "./sidebar/description";
import { IndoorField, IndoorFormField } from "./sidebar/indoor";
import { LocationField, LocationFormField } from "./sidebar/location";
import { OpeningHoursField } from "./sidebar/openingHours";
import OperatorField from "./sidebar/operator";
import AccessFormField from "./sidebar/access";
import { getOpenChangesetId, addDefibrillatorToOSM } from "../osm";
import { initialModalState, ModalType } from "../model/modal";
import { useAppContext } from "../appContext";

const accessToColourMapping = {
    yes: "has-background-green has-text-white-ter",
    no: "has-background-red has-text-white-ter",
    private: "has-background-blue has-text-white-ter",
    permissive: "has-background-blue has-text-white-ter",
    customers: "has-background-yellow has-text-black-ter",
    default: "has-background-gray has-text-white-ter",
};

function accessColourClass(access: string): string {
    if (access in accessToColourMapping) {
        return accessToColourMapping[access as keyof typeof accessToColourMapping];
    }
    return accessToColourMapping.default;
}

const parseForm = (formElements: HTMLFormControlsCollection, language: string) => {
    const tags: Record<string, string> = { emergency: "defibrillator" };
    const access = (formElements.namedItem("aedAccess") as RadioNodeList).value;
    if (access.length > 0) tags.access = access;
    const indoor = (formElements.namedItem("aedIndoor") as RadioNodeList).value;
    if (indoor.length > 0) tags.indoor = indoor;
    const level = (formElements.namedItem("level") as HTMLInputElement) || { value: "" };
    if (level.value.trim()) tags.level = level.value.trim();
    const location = formElements.namedItem("aedLocation") as HTMLInputElement;
    if (location.value.trim()) tags[`defibrillator:location:${language}`] = location.value.trim();
    const phone = formElements.namedItem("aedPhone") as HTMLInputElement;
    if (phone.value.trim()) tags.phone = phone.value.trim();
    const checkDate = formElements.namedItem("aedCheckDate") as HTMLInputElement;
    if (checkDate.value.trim()) tags.check_date = checkDate.value.trim();
    return tags;
};

const SidebarLeft: FC<SidebarLeftProps> = ({
    action, data, closeSidebar, visible, marker, openChangesetId, setOpenChangesetId,
}) => {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const { authState: { auth }, setModalState } = useAppContext();

    console.log("Opening left sidebar with action: ", action, " and data:", data);

    if (action === "showDetails") {
        const accessText = data.access ? ` - ${t(`access.${data.access}`)}` : "";
        const defibrillatorLocation = data[`defibrillator_location_${i18n.resolvedLanguage}`]
            || data.defibrillator_location;

        return (
            <div className={visible ? "sidebar" : "sidebar is-invisible"} id="sidebar-div">
                <Card>
                    <Card.Header
                        id="sidebar-header"
                        shadowless
                        className={accessColourClass(data.access)}
                        alignItems="center"
                    >
                        <Image m={2} className="icon" src="./img/logo-aed.svg" color="white" alt="" size={48} />
                        <span
                            className="is-size-5 py-2 has-text-weight-light"
                            id="sidebar-caption"
                        >
                            {t("sidebar.caption_info") + accessText}
                        </span>
                        <CloseSidebarButton closeSidebarFunction={closeSidebar} />
                    </Card.Header>
                    <Card.Content pl={3} pr={3} mb={1} pt={4} className="content pb-0">
                        <Columns vCentered className="is-mobile">
                            <Columns.Column textAlign="center" size={2}>
                                <Icon path={mdiHomeRoof} size={1.15} className="icon" color="#028955" />
                            </Columns.Column>
                            <Columns.Column className="py-1">
                                <IndoorField indoor={data.indoor} level={data.level} />
                            </Columns.Column>
                        </Columns>
                        <Columns vCentered className="is-mobile">
                            <Columns.Column textAlign="center" size={2}>
                                <Icon path={mdiMapMarkerOutline} size={1.15} className="icon" color="#028955" />
                            </Columns.Column>
                            <Columns.Column className="py-1">
                                <LocationField description={defibrillatorLocation} />
                            </Columns.Column>
                        </Columns>
                        <Columns vCentered className="is-mobile">
                            <Columns.Column textAlign="center" size={2}>
                                <Icon path={mdiClockOutline} size={1.15} className="icon" color="#028955" />
                            </Columns.Column>
                            <Columns.Column className="py-1">
                                <OpeningHoursField openingHours={data.opening_hours} />
                            </Columns.Column>
                        </Columns>
                        <Columns vCentered className="is-mobile">
                            <Columns.Column textAlign="center" size={2}>
                                <Icon path={mdiPhoneOutline} size={1.15} className="icon" color="#028955" />
                            </Columns.Column>
                            <Columns.Column className="py-1">
                                <ContactNumberField contactNumber={data.phone} />
                            </Columns.Column>
                        </Columns>
                        <Columns vCentered className="is-mobile">
                            <Columns.Column textAlign="center" size={2}>
                                <Icon path={mdiAccountSupervisorOutline} size={1.15} className="icon" color="#028955" />
                            </Columns.Column>
                            <Columns.Column className="py-1">
                                <OperatorField operator={data.operator} />
                            </Columns.Column>
                        </Columns>
                        <Columns vCentered className="is-mobile pb-0 mb-0">
                            <Columns.Column textAlign="center" size={2}>
                                <Icon path={mdiInformationOutline} size={1.15} className="icon" color="#028955" />
                            </Columns.Column>
                            <Columns.Column className="py-1">
                                <DescriptionField
                                    description={data[`description_${i18n.resolvedLanguage}`] || data.description}
                                />
                            </Columns.Column>
                        </Columns>
                        <CheckDateField check_date={data.check_date} />
                    </Card.Content>
                    <Card.Footer>
                        <Card.Footer.Item className="has-background-white-ter">
                            <CopyUrlButton />
                            <ViewButton osmId={data.osm_id} />
                            <EditButton osmId={data.osm_id} />
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
    } if (action === "addNode") {
        const sendFormData = (event: Event) => {
            event.preventDefault();
            if (event.target === null) {
                console.error("Form target null");
                return;
            }
            const button = event.target as HTMLFormElement;
            button.classList.add("is-loading");
            const lngLat = marker.getLngLat();
            const tags = parseForm(button.form.elements, resolvedLanguage);
            const defibrillatorData = {
                lng: lngLat.lng,
                lat: lngLat.lat,
                tags,
            };
            console.log(lngLat);
            console.log(tags);
            if (auth === null) return;
            getOpenChangesetId(auth, openChangesetId, setOpenChangesetId, i18n.resolvedLanguage)
                .then((changesetId) => addDefibrillatorToOSM(auth, changesetId, defibrillatorData))
                .then((newNodeId) => {
                    button.classList.remove("is-loading");
                    closeSidebar();
                    console.log("created new node with id: ", newNodeId);
                    setModalState({
                        ...initialModalState, visible: true, type: ModalType.NodeAddedSuccessfully, nodeId: newNodeId,
                    });
                })
                .catch((err) => {
                    button.classList.remove("is-loading");
                    closeSidebar();
                    console.log(err);
                    const errorMessage = `${err} <br> status: ${err.status} ${err.statusText} <br> ${err.response}`;
                    setModalState({
                        ...initialModalState, visible: true, type: ModalType.Error, errorMessage,
                    });
                });
        };
        return (
            <div className={visible ? "sidebar" : "sidebar is-invisible"} id="sidebar-div">
                <Card>
                    <Card.Header id="sidebar-header" className="has-background-grey" shadowless alignItems="center">
                        <Image m={2} className="icon" src="./img/logo-aed.svg" color="white" alt="" size={48} />
                        <span className="is-size-5 mr-3 has-text-white-ter has-text-weight-light">
                            {t("sidebar.add_defibrillator")}
                        </span>
                        <CloseSidebarButton closeSidebarFunction={closeSidebar} />
                    </Card.Header>

                    <Card.Content py={3} marginless className="content">
                        <form id="add_aed">
                            <AccessFormField />
                            <IndoorFormField />
                            <LocationFormField />
                            <ContactPhoneFormField />
                            <CheckDateFormField />
                        </form>
                    </Card.Content>
                    <Card.Footer>
                        <Card.Footer.Item className="has-background-white-ter">
                            <AddAedButton nextStep={sendFormData} />
                        </Card.Footer.Item>
                    </Card.Footer>
                </Card>
            </div>
        );
    } if (action === "init") {
        return <div id="sidebar-div" />;
    }
    console.log(`Unknown action: '${action}'.`);
    return null;
};

interface SidebarLeftProps {
    action: string,
    data: any, // TODO: type
    closeSidebar: () => void,
    visible: boolean,
    marker: Marker,
    openChangesetId: string,
    setOpenChangesetId: (changesetId: string) => void,
}

export default SidebarLeft;