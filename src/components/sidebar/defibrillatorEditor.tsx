import React, { FC } from "react";
import { Image, Card } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import { Marker } from "maplibre-gl";
import { addDefibrillatorToOSM, getOpenChangesetId } from "../../osm";
import { initialModalState, ModalType } from "../../model/modal";
import { AddAedButton, CloseSidebarButton } from "./buttons";
import AccessFormField from "./access";
import IndoorFormField from "./indoor";
import LocationFormField from "./location";
import ContactPhoneFormField from "./contactNumber";
import { CheckDateFormField } from "./verificationDate";
import { useAppContext } from "../../appContext";

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

const DefibrillatorEditor: FC<DefibrillatorEditorProps> = ({
    closeSidebar, marker, openChangesetId, setOpenChangesetId,
}) => {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const { authState: { auth }, setModalState } = useAppContext();

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
        getOpenChangesetId(auth, openChangesetId, setOpenChangesetId, resolvedLanguage)
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
        <div className="sidebar" id="sidebar-div">
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
};

interface DefibrillatorEditorProps {
    closeSidebar: () => void,
    marker: Marker,
    openChangesetId: string,
    setOpenChangesetId: (changesetId: string) => void,
}

export default DefibrillatorEditor;