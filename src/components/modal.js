import { mdiInformationOutline } from '@mdi/js';
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bulma-components';

const getNodeUrl = (nodeId) => {
    const { REACT_APP_OSM_API_URL } = process.env;
    return (
        <a target="_blank" rel="noreferrer" href={REACT_APP_OSM_API_URL + "/node/" + nodeId}>{REACT_APP_OSM_API_URL + "/node/" + nodeId}</a>
    )
}

const ModalContent = ({ state }) => {
    const { t } = useTranslation();

    if (!state.visible) return <></>
    else if (state.type === "nodeAddedSucesfully") {
        return (
            <div>
                <p className="pb-2">{t("modal.aed_added_sucesfully")}</p>
                <p className="pb-4">{t("modal.available_in_osm")} {getNodeUrl(state.nodeId)}</p>
                <p className="pb-2">{t("modal.should_appear_soon")}</p>
            </div>
        )
    } else if (state.type === "needToLogin") {
        return (
            <div>
                <p className="pb-3">{t("modal.need_to_login")}</p>
                <p className="pb-3">{t("modal.click_login_button")}</p>
            </div>
        )
    } else if (state.type === "needMoreZoom") {
        return (
            <div>
                <p className="pb-2">{t("modal.need_more_zoom")}</p>
                <p className="pb-2">{t("modal.current_zoom")} {state.currentZoom.toFixed(2)}.</p>
                <p className="pb-2">{t("modal.zoom_need_to_be")}</p>
            </div>
        )
    } else if (state.type === "info") {
        return (
            <div>
                <p className="pb-2">{t("modal.about_project")}</p>
                <p className="pb-2">{t("modal.about_osm")}</p>
                <p>
                    {t("modal.create_account")}
                    <a href="https://osm.org" rel="noreferrer" target="_blank">osm.org</a>
                </p>
            </div>
        )
    } else if (state.type === "error") {
        return (
            <p className="pb-2">{t("modal.error_occured")}: ${state.errorMessage}</p>
        )
    } else console.log("Unexpected modal call: ", state)
}

export function CustomModal({ state, setModalState }) {
    const { t } = useTranslation();

    return (
        <Modal show={state.visible} onClose={() => { setModalState({ visible: false }) }} closeOnEsc={true} closeOnBlur={true}>
            <Modal.Card radiusless={true}>
                <Modal.Card.Header showClose={true} className="has-background-green has-text-white-ter">
                    <Icon path={mdiInformationOutline} size={1} className='icon mr-2' />
                    <Modal.Card.Title className='has-text-white-ter has-text-weight-light'>{t("modal.title")}</Modal.Card.Title>
                </Modal.Card.Header>
                <Modal.Card.Body>
                    <ModalContent state={state} />
                </Modal.Card.Body>
            </Modal.Card>
        </Modal>
    )
}
