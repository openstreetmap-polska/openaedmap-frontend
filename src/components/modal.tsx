import { mdiInformationOutline } from '@mdi/js';
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bulma-components';
import React, {FC} from "react";
import {ModalType} from "../model/modal";
import {useAppContext} from "../appContext";
import LogInButton from "./logInButton";

const ModalContent: FC<{}> = () => {
    const { t } = useTranslation();
    const { modalState: { type, currentZoom, errorMessage, nodeId } } = useAppContext();

    switch (type) {
        case ModalType.NodeAddedSuccessfully:
            const nodeUrl = `${process.env.REACT_APP_OSM_API_URL}/node/${nodeId}/`;
            return (
                <div>
                    <p className="pb-2">{t("modal.aed_added_successfully")}</p>
                    <p className="pb-4">
                        {t("modal.available_in_osm")}&nbsp;
                        <a target="_blank" rel="noreferrer" href={nodeUrl}>{nodeUrl}</a>
                    </p>
                    <p className="pb-2">{t("modal.should_appear_soon")}</p>
                </div>
            );
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
                    <p className="pb-2">{t("modal.current_zoom")} {currentZoom.toFixed(2)}.</p>
                    <p className="pb-2">{t("modal.zoom_need_to_be")}</p>
                </div>
            );
        case ModalType.About:
            return (
                <div>
                    <p className="pb-2">{t("modal.about_project")}</p>
                    <p className="pb-2">{t("modal.about_osm")}</p>
                    <p>
                        {t("modal.create_account")}
                        <a href="https://osm.org" rel="noreferrer" target="_blank">osm.org</a>
                    </p>
                </div>
            );
        case ModalType.Error:
            return (
                <p className="pb-2">{t("modal.error_occurred")}: ${errorMessage}</p>
            )
    }
};

export const CustomModal: FC<{}> = () => {
    const { t } = useTranslation();
    const { modalState, setModalState } = useAppContext();

    return (
        <Modal show={modalState.visible} onClose={() => { setModalState({ ...modalState, visible: false }) }} closeOnEsc={true} closeOnBlur={true}>
            <Modal.Card radiusless={true}>
                <Modal.Card.Header showClose={true} className="has-background-green has-text-white-ter">
                    <Icon path={mdiInformationOutline} size={1} className='icon mr-2' />
                    <Modal.Card.Title className='has-text-white-ter has-text-weight-light'>{t("modal.title")}</Modal.Card.Title>
                </Modal.Card.Header>
                <Modal.Card.Body>
                    { modalState.visible && <ModalContent /> }
                </Modal.Card.Body>
            </Modal.Card>
        </Modal>
    )
};