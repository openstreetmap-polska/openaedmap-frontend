import { mdiInformationOutline, mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bulma-components";
import React, { FC } from "react";
import { ModalType } from "../model/modal";
import { useAppContext } from "../appContext";
import LogInButton from "./logInButton";
import PartnersModal from "./partnersModal";

const ModalContent: FC<{}> = () => {
    const { t } = useTranslation();
    const {
        modalState: {
            type, currentZoom, errorMessage, nodeId,
        },
    } = useAppContext();
    const helpTranslationText = `🖋 ${t("navbar.help_translating")}`;

    switch (type) {
        case ModalType.NodeAddedSuccessfully: {
            const nodeUrl = `${process.env.REACT_APP_OSM_API_URL}/node/${nodeId}/`;
            return (
                <div>
                    <p className="pb-2">{t("modal.aed_added_successfully")}</p>
                    <p className="pb-4">
                        {t("modal.available_in_osm")}
                        &nbsp;
                        <a target="_blank" rel="noreferrer" href={nodeUrl}>{nodeUrl}</a>
                    </p>
                    <p className="pb-2">{t("modal.should_appear_soon")}</p>
                </div>
            );
        }
        case ModalType.NodeUpdatedSuccessfully: {
            const nodeUrl = `${process.env.REACT_APP_OSM_API_URL}/node/${nodeId}/`;
            return (
                <div>
                    <p className="pb-2">{t("modal.aed_updated_successfully")}</p>
                    <p className="pb-4">
                        {t("modal.available_in_osm")}
                        &nbsp;
                        <a target="_blank" rel="noreferrer" href={nodeUrl}>{nodeUrl}</a>
                    </p>
                </div>
            );
        }
        case ModalType.NeedToLogin:
            return (
                <div>
                    <p className="pb-3">{t("modal.need_to_login")}</p>
                    <LogInButton inNavBar={false} />
                </div>
            );
        case ModalType.NeedMoreZoom:
            return (
                <div>
                    <p className="pb-2">{t("modal.need_more_zoom")}</p>
                    <p className="pb-2">
                        {t("modal.current_zoom")}
                        {" "}
                        <span className="has-text-weight-semibold">{currentZoom.toFixed(0)}</span>
                        .
                    </p>
                    <p className="pb-2">{t("modal.zoom_need_to_be")}</p>
                </div>
            );
        case ModalType.About:
            return (
                <div>
                    <p className="block">{t("modal.about_project")}</p>
                    <p className="block">
                        <Button
                            mr={2}
                            renderAs="a"
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/openstreetmap-polska/openaedmap-frontend#translating"
                        >
                            {helpTranslationText}
                        </Button>
                        <Button
                            mr={2}
                            renderAs="a"
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/openstreetmap-polska/openaedmap-frontend"
                        >
                            <Icon path={mdiGithub} size="2rem" />
                            <span>{t("navbar.visit_github")}</span>
                        </Button>
                    </p>
                    <p className="block">{t("modal.about_osm")}</p>
                    <p>
                        {t("modal.create_account")}
                        <a href="https://osm.org" rel="noreferrer" target="_blank">osm.org</a>
                    </p>
                </div>
            );
        case ModalType.Error: {
            const errorText = `${t("modal.error_occurred")}: $${errorMessage}`;
            return <p className="pb-2">{errorText}</p>;
        }
        case ModalType.Partners: return <PartnersModal />;
        case ModalType.ThanksForPhoto:
            return (
                <div>
                    <p className="pb-4">
                        {t("modal.thanks_for_photo")}
                    </p>
                </div>
            );
        case ModalType.ThanksForReport:
            return (
                <div>
                    <p className="pb-4">
                        {t("modal.thanks_for_report")}
                    </p>
                </div>
            );
        default:
            return null;
    }
};

const CustomModal: FC<{}> = () => {
    const { t } = useTranslation();
    const { modalState, setModalState } = useAppContext();

    return (
        <Modal
            show={modalState.visible}
            onClose={() => { setModalState({ ...modalState, visible: false }); }}
            closeOnEsc
            closeOnBlur
        >
            <Modal.Card radiusless>
                <Modal.Card.Header showClose className="has-background-green has-text-white-ter">
                    <Icon path={mdiInformationOutline} size={1} className="icon mr-2" />
                    <Modal.Card.Title className="has-text-white-ter has-text-weight-light">
                        {modalState.type === ModalType.Partners ? t("partners.honorary_patronage") : t("modal.title")}
                    </Modal.Card.Title>
                </Modal.Card.Header>
                <Modal.Card.Body>
                    { modalState.visible && <ModalContent /> }
                </Modal.Card.Body>
            </Modal.Card>
        </Modal>
    );
};

export default CustomModal;