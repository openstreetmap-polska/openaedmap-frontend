import { mdiMagnify, mdiPencil, mdiContentCopy } from "@mdi/js";
import Icon from '@mdi/react';
import { Button } from "react-bulma-components";
import { useTranslation } from 'react-i18next';


export function EditButton({ osmId }) {
    const { t } = useTranslation();
    return (
        <a key={"edit_url_" + osmId} href={"https://www.openstreetmap.org/edit?node=" + osmId}
            className="button is-small is-success mx-1"
            rel={"noreferrer"} target={"_blank"}>
            <Icon path={mdiPencil} size={1.0} className="icon" color="#fff" />
            <span>{t("sidebar.edit")}</span>
        </a>
    )
}

export function ViewButton({ osmId }) {
    const { t } = useTranslation();
    return <a key={"view_url_" + osmId} href={"https://www.openstreetmap.org/node/" + osmId}
        className="button is-small is-success mx-1"
        rel={"noreferrer"} target={"_blank"}>
        <Icon path={mdiMagnify} size={1.0} className="icon" color="#fff" />
        <span>{t("sidebar.view")}</span>
    </a>
}

export function CopyUrlButton() {
    const { t } = useTranslation();
    return <Button
        className="button is-small is-success mx-1"
        onClick={() => { navigator.clipboard.writeText(window.location.toString()) }}>
        <Icon path={mdiContentCopy} size={0.8} className="icon" color="#fff" />
        <span>{t("sidebar.copy_url")}</span>
    </Button>
}
