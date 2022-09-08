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
        console.log("nodeAddedSucesfully");
        return (
            <div>
                <p class="pb-2">{t("modal.aed_added_sucesfully")}</p>
                <p class="pb-4">{t("modal.available_in_osm")} {getNodeUrl(state.nodeId)}</p>
                <p class="pb-2">{t("modal.should_appear_soon")}</p>
            </div>
        )
    } else if (state.type === "error") {
        return (
            <p class="pb-2">{t("modal.error_occured")}: ${state.errorMessage}</p>
        )
    }
}

export function CustomModal({ state, setModalState }) {
    const { t } = useTranslation();

    return (
        <Modal show={state.visible} onClose={() => {setModalState({ visible: false})}}>
            <Modal.Card>
                <Modal.Card.Header showClose={true} className="is-radiusless has-background-green has-text-white-ter">
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