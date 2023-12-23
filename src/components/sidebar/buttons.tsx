import {
    mdiMagnify, mdiPencil, mdiContentCopy, mdiMap, mdiMapMarkerPlus,
    mdiGoogleMaps,
} from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import React, { FC } from "react";
import { OSM_DOMAIN } from "~/constants";
import { useAppContext } from "~/appContext";
import SidebarAction from "~/model/sidebarAction";
import { fetchNodeDataFromOsm } from "~/osm";
import { initialModalState, ModalType } from "~/model/modal";

type OsmId = string;

export function EditButton({ osmId }: { osmId: OsmId }) {
    const { t } = useTranslation();
    const {
        setSidebarData, setSidebarAction, setModalState, authState: { auth },
    } = useAppContext();
    const startEdit = () => {
        fetchNodeDataFromOsm(osmId).then((data) => {
            setSidebarData(data);
            if (auth === null || !auth.authenticated()) {
                setModalState({ ...initialModalState, visible: true, type: ModalType.NeedToLogin });
            } else {
                setSidebarAction(SidebarAction.editNode);
            }
        });
    };
    return (
        <Button
            className="button is-small is-success mx-1"
            onClick={startEdit}
        >
            <Icon path={mdiPencil} size={1.0} className="icon" color="#fff" />
            <span>{t("sidebar.edit")}</span>
        </Button>
    );
}

export function ViewButton({ osmId }: { osmId: OsmId }) {
    const { t } = useTranslation();
    return (
        <a
            key={`view_url_${osmId}`}
            href={`https://www.openstreetmap.org/node/${osmId}`}
            className="button is-small is-success mx-1"
            rel="noreferrer"
            target="_blank"
        >
            <Icon path={mdiMagnify} size={1.0} className="icon" color="#fff" />
            <span>{t("sidebar.view")}</span>
        </a>
    );
}

export function CopyUrlButton() {
    const { t } = useTranslation();
    return (
        <Button
            className="button is-small is-success mx-1"
            onClick={() => { navigator.clipboard.writeText(window.location.toString()); }}
        >
            <Icon path={mdiContentCopy} size={0.8} className="icon" color="#fff" />
            <span>{t("sidebar.copy_url")}</span>
        </Button>
    );
}

export function CloseSidebarButton({ closeSidebarFunction }: { closeSidebarFunction: () => void }) {
    const { t } = useTranslation();
    // Button seems to have issues with delete class, using button instead
    return (
        <button
            id="sidebar-card-close-button"
            aria-label={t("sidebar.close")}
            className="delete is-large is-pulled-right"
            onClick={closeSidebarFunction}
            type="button"
        />
    );
}

export function AddAedButton({ nextStep }: { nextStep: (event: Event) => void }) {
    const { t } = useTranslation();
    return (
        // TODO type
        // @ts-ignore
        <Button color="success" fullwidth form="add_aed" onClick={nextStep}>
            <Icon path={mdiMapMarkerPlus} className="icon mr-2" />
            {t("footer.add_aed")}
        </Button>
    );
}

export function SaveAedButton({ nextStep }: { nextStep: (event: Event) => void }) {
    const { t } = useTranslation();
    return (
        // TODO type
        // @ts-ignore
        <Button color="success" fullwidth form="save_aed" onClick={nextStep}>
            <Icon path={mdiMapMarkerPlus} className="icon mr-2" />
            {t("footer.save_aed")}
        </Button>
    );
}

interface NavigationButtonProps {
    lat: number,
    lon: number,
}

export const OpenStreetMapNavigationButton: FC<NavigationButtonProps> = ({ lat, lon }) => {
    const { t } = useTranslation();
    const OSM_NAVIGATION_ZOOM = 14;
    return (
        <a
            className="button is-small is-info mx-1"
            href={`${OSM_DOMAIN}/directions?from=&to=${lat}%2C${lon}#map=${OSM_NAVIGATION_ZOOM}/${lat}/${lon}`}
            rel="noreferrer"
            target="_blank"
        >
            <Icon path={mdiMap} size={0.8} className="icon" color="#fff" />
            <span>{t("sidebar.openstreetmap_navigation")}</span>
        </a>
    );
};

export const GoogleMapsNavigationButton: FC<NavigationButtonProps> = ({ lat, lon }) => {
    const { t } = useTranslation();
    return (
        <a
            className="button is-small is-info mx-1"
            href={`https://google.com/maps/dir/?api=1&destination=${lat}%2C${lon}`}
            rel="noreferrer"
            target="_blank"
        >
            <Icon path={mdiGoogleMaps} size={0.8} className="icon" color="#fff" />
            <span>{t("sidebar.google_maps_navigation")}</span>
        </a>
    );
};