import { mdiInformationOutline } from '@mdi/js';
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bulma-components';

const getNodeUrl = (nodeId) => {
    return (
        <a target="_blank" rel="noreferrer" href={"https://www.openstreetmap.org/node/" + nodeId}>{"https://www.openstreetmap.org/node/" + nodeId}</a>
    )
}

const ModalContent = (state) => {
    const { t } = useTranslation();

    if (state.type === "init") return <></>
    else if (state.type === "nodeAddedSucesfully") {
        return (
            <>
            <p class="pb-2">{t("modal.aed_added_sucesfully")}</p>
            <p class="pb-4">{t("modal.available_in_osm")} {getNodeUrl(state.nodeId)}</p>
            <p class="pb-2">{t("modal.should_appear_soon")}</p>
            </>
        )
    } else if (state.type === "error") {
        return (
            <p class="pb-2">{t("modal.error_occured")}: ${state.errorMessage}</p>
        )
    }
}

export function CustomModal({ state }) {
    const { t } = useTranslation();

    return (
        <Modal className={state.visible ? "is-active" : "" }>
            <Modal.Card>
                <Modal.Card.Header showClose={true}>
                    <Icon path={mdiInformationOutline} className='icon mr-2' />
                    <Modal.Card.Title>{t("modal.title")}</Modal.Card.Title>
                    <Button></Button>
                </Modal.Card.Header>
                <Modal.Card.Body>
                    <ModalContent state={state} />
                </Modal.Card.Body>
            </Modal.Card>
        </Modal>
    )
}