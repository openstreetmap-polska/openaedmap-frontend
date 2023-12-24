import React, { FC, useState } from "react";
import { Image, Card } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import { Marker } from "maplibre-gl";
import { initialModalState, ModalType } from "~/model/modal";
import { addDefibrillatorToOSM, editDefibrillatorInOSM, getOpenChangesetId } from "../../osm";
import { AddAedButton, CloseSidebarButton, SaveAedButton } from "./buttons";
import AccessFormField from "./access";
import IndoorFormField from "./indoor";
import LocationFormField from "./location";
import ContactPhoneFormField from "./contactNumber";
import { CheckDateFormField } from "./verificationDate";
import { useAppContext } from "../../appContext";
import { DefibrillatorData } from "../../model/defibrillatorData";

const DefibrillatorEditor: FC<DefibrillatorEditorProps> = ({
    closeSidebar, marker, openChangesetId, setOpenChangesetId, data,
}) => {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const language = resolvedLanguage ?? "en";
    const { authState: { auth }, setModalState } = useAppContext();
    const newAED = data === null;
    const initialTags = data !== null ? data.tags : { emergency: "defibrillator" };
    const [access, setAccess] = useState<string>(initialTags.access ?? "");
    const [indoor, setIndoor] = useState<string>(initialTags.indoor ?? "");
    const [level, setLevel] = useState<string>(initialTags.level ?? "");
    const [location, setLocation] = useState<string>(
        initialTags[`defibrillator:location:${language}`] ?? "",
    );
    const [phoneNumber, setPhoneNumber] = useState<string>(initialTags.phone ?? initialTags["contact:phone"] ?? "");
    const todayDate = new Date().toISOString().substring(0, 10);
    const [checkDate, setCheckDate] = useState<string>(todayDate);

    const parseTags: () => Record<string, string> = () => {
        const tags = { ...initialTags };
        if (access.length > 0) tags.access = access;
        if (indoor.length > 0) tags.indoor = indoor;
        if (level.length > 0) tags.level = level.trim();
        if (location.trim().length > 0) tags[`defibrillator:location:${language}`] = location.trim();
        if (phoneNumber.trim().length > 0) tags.phone = phoneNumber.trim();
        if (checkDate.trim().length > 0) tags.check_date = checkDate.trim();
        return tags;
    };

    const sendFormData = (event: Event) => {
        event.preventDefault();
        if (event.target === null) {
            console.error("Form target null");
            return;
        }
        const button = event.target as HTMLFormElement;
        button.classList.add("is-loading");
        const tags = parseTags();
        console.log(tags);
        if (auth === null) return;
        const handleError = (err: XMLHttpRequest) => {
            button.classList.remove("is-loading");
            closeSidebar();
            console.log(err);
            const errorMessage = `${err} <br> status: ${err.status} ${err.statusText} <br> ${err.responseText}`;
            setModalState({
                ...initialModalState, visible: true, type: ModalType.Error, errorMessage,
            });
        };
        if (newAED) {
            if (marker === null) {
                console.error("Marker shouldn't be null");
                return null;
            }
            const lngLat = marker.getLngLat();
            const newDefibrillatorData = {
                lon: lngLat.lng,
                lat: lngLat.lat,
                tags,
            };
            getOpenChangesetId(auth, openChangesetId, setOpenChangesetId, language, newAED)
                .then((changesetId) => addDefibrillatorToOSM(auth, changesetId, newDefibrillatorData))
                .then((newNodeId) => {
                    button.classList.remove("is-loading");
                    closeSidebar();
                    console.log("created new node with id: ", newNodeId);
                    setModalState({
                        ...initialModalState, visible: true, type: ModalType.NodeAddedSuccessfully, nodeId: newNodeId,
                    });
                })
                .catch(handleError);
        } else {
            const defibrillatorData: DefibrillatorData = {
                ...data,
                tags,
            };
            getOpenChangesetId(auth, openChangesetId, setOpenChangesetId, language, newAED)
                .then((changesetId) => editDefibrillatorInOSM(auth, changesetId, defibrillatorData))
                .then((newVersion) => {
                    button.classList.remove("is-loading");
                    closeSidebar();
                    console.log("updated node with id: ", newVersion);
                    setModalState({
                        ...initialModalState,
                        visible: true,
                        type: ModalType.NodeUpdatedSuccessfully,
                        nodeId: data.osmId,
                    });
                })
                .catch(handleError);
        }
    };
    return (
        <div className="sidebar" id="sidebar-div">
            <Card>
                <Card.Header id="sidebar-header" className="has-background-grey" shadowless alignItems="center">
                    <Image m={2} className="icon" src="./img/logo-aed.svg" color="white" alt="" size={48} />
                    <span className="is-size-5 mr-3 has-text-white-ter has-text-weight-light">
                        {t(newAED ? "sidebar.add_defibrillator" : "sidebar.edit_defibrillator")}
                    </span>
                    <CloseSidebarButton closeSidebarFunction={closeSidebar} />
                </Card.Header>

                <Card.Content py={3} marginless className="content">
                    <form id="add_aed">
                        <AccessFormField access={access} setAccess={setAccess} />
                        <IndoorFormField indoor={indoor} setIndoor={setIndoor} level={level} setLevel={setLevel} />
                        <LocationFormField location={location} setLocation={setLocation} />
                        <ContactPhoneFormField phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
                        <CheckDateFormField checkDate={checkDate} setCheckDate={setCheckDate} todayDate={todayDate} />
                    </form>
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item className="has-background-white-ter">
                        {newAED
                            ? <AddAedButton nextStep={sendFormData} />
                            : <SaveAedButton nextStep={sendFormData} />}
                    </Card.Footer.Item>
                </Card.Footer>
            </Card>
        </div>
    );
};

interface DefibrillatorEditorProps {
    closeSidebar: () => void,
    marker: Marker | null,
    openChangesetId: string,
    setOpenChangesetId: (changesetId: string) => void,
    data: DefibrillatorData | null,
}

export default DefibrillatorEditor;