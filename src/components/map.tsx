import React, {
    FC, useRef, useEffect, useState,
} from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "./map.css";
import { useTranslation } from "react-i18next";
// @ts-ignore
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import maplibregl from "maplibre-gl";
import ButtonsType from "~/model/buttonsType";
import { initialModalState, ModalType } from "~/model/modal";
import SidebarAction from "~/model/sidebarAction";
import { fetchNodeDataFromBackend } from "~/backend";
import { DefibrillatorData } from "~/model/defibrillatorData";
import nominatimGeocoder from "~/components/nominatimGeocoder";
import { useAppContext } from "../appContext";
import FooterDiv from "./footer";
import SidebarLeft from "./sidebar-left";
import styleJson from "./map_style";
import {useLanguage} from "~/i18n";

function fillSidebarWithOsmDataAndShow(
    nodeId: string,
    mapInstance: maplibregl.Map,
    setSidebarAction: (action: SidebarAction) => void,
    setSidebarData: (data: DefibrillatorData) => void,
    setSidebarLeftShown: (sidebarLeftShown: boolean) => void,
    jumpInsteadOfEaseTo: boolean,
) {
    const result = fetchNodeDataFromBackend(nodeId);
    result.then((data) => {
        if (data) {
            const zoomLevelForDetailedView = 17;
            const currentZoomLevel = mapInstance.getZoom();
            // todo: possibly add handling of request error which will cause lnglat to be NaN, NaN
            if (currentZoomLevel < zoomLevelForDetailedView) {
                if (jumpInsteadOfEaseTo) {
                    mapInstance.jumpTo({
                        zoom: zoomLevelForDetailedView,
                        center: [data.lon, data.lat],
                    });
                } else {
                    mapInstance.easeTo({
                        zoom: zoomLevelForDetailedView,
                        around: { lon: data.lon, lat: data.lat },
                    });
                }
            } else if (jumpInsteadOfEaseTo) {
                mapInstance.jumpTo({
                    zoom: currentZoomLevel,
                    center: [data.lon, data.lat],
                });
            } else {
                mapInstance.easeTo({
                    zoom: currentZoomLevel,
                    around: { lon: data.lon, lat: data.lat },
                });
            }
            setSidebarData(data);
            setSidebarAction(SidebarAction.showDetails);
            setSidebarLeftShown(true);
        }
    });
}

function parseHash(): Record<string, string> {
    const parameters: Record<string, string> = {};
    for (const part of window.location.hash.slice(1).split("&")) {
        const [key, value] = part.split("=", 2);
        parameters[key] = value;
    };
    return parameters;
}

function getNewHashString(parameters: Record<string, string>) {
    return Object
        .entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
}

const MapView: FC<MapViewProps> = ({ openChangesetId, setOpenChangesetId }) => {
    const {
        authState: { auth }, setModalState, sidebarAction, setSidebarAction, sidebarData, setSidebarData,
    } = useAppContext();
    const { t} = useTranslation();
    const language = useLanguage();

    const hash4MapName = "map";

    const paramsFromHash = parseHash();

    let initialLongitude = -8;
    let initialLatitude = 47.74;
    let initialZoom = 3;

    if (paramsFromHash[hash4MapName]) {
        [initialZoom, initialLatitude, initialLongitude] = paramsFromHash[hash4MapName].split("/").map(Number);
    }

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const controlsLocation = "bottom-right";

    const [marker, setMarker] = useState<maplibregl.Marker | null>(null);

    const [sidebarLeftShown, setSidebarLeftShown] = useState(false);

    const [footerButtonType, setFooterButtonType] = useState(ButtonsType.Basic);

    const removeNodeIdFromHash = () => {
        const hashParams = parseHash();
        // biome-ignore lint/performance/noDelete: using undefined assignment causes it to be part of url
        delete hashParams.node_id;
        window.location.hash = getNewHashString(hashParams);
    };

    const deleteMarker = () => {
        if (marker !== null) {
            marker.remove();
            setMarker(null);
        }
    };

    const closeSidebarLeft = () => {
        setSidebarLeftShown(false);
        deleteMarker();
        removeNodeIdFromHash();
        setFooterButtonType(ButtonsType.Basic);
    };

    const checkConditionsThenCall = (callable: () => void) => {
        if (mapRef.current === null) return;
        const map = mapRef.current;
        if (auth === null || !auth.authenticated()) {
            setModalState({ ...initialModalState, visible: true, type: ModalType.NeedToLogin });
        } else if (map.getZoom() < 15) {
            setModalState({
                ...initialModalState, visible: true, type: ModalType.NeedMoreZoom, currentZoom: map.getZoom(),
            });
        } else callable();
    };

    const mobileCancel = () => {
        deleteMarker();
        setSidebarLeftShown(false);
        setFooterButtonType(ButtonsType.Basic);
    };

    const showFormMobile = () => {
        setSidebarLeftShown(true);
        setFooterButtonType(ButtonsType.None);
    };

    const startAEDAdding = (mobile: boolean) => {
        if (mapRef.current === null) return;
        const map = mapRef.current;
        deleteMarker();
        removeNodeIdFromHash();
        setSidebarData(null);
        setSidebarAction(SidebarAction.addNode);
        setSidebarLeftShown(!mobile); // for mobile hide sidebar so marker is visible
        setFooterButtonType(mobile ? ButtonsType.MobileAddAed : ButtonsType.None);
        // add marker
        const markerColour = "#e81224";
        const mapCenter = map.getCenter();
        const initialCoordinates: [number, number] = [mapCenter.lng, mapCenter.lat];
        setMarker(
            new maplibregl.Marker({
                draggable: true,
                color: markerColour,
            })
                .setLngLat(initialCoordinates)
                .setPopup(new maplibregl.Popup().setHTML(t("form.marker_popup_text")))
                .addTo(mapRef.current)
                .togglePopup(),
        );
    };

    useEffect(() => {
        if (mapRef.current || mapContainer.current === null) return; // stops map from initializing more than once
        const map = new maplibregl.Map({
            container: mapContainer.current,
            hash: hash4MapName,
            // @ts-ignore
            style: styleJson,
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            minZoom: 3,
            maxZoom: 19,
            maplibreLogo: false,
        });

        const maplibreGeocoder = new MaplibreGeocoder(nominatimGeocoder, {
            maplibregl,
            placeholder: t("sidebar.find_location"),
        });
        maplibreGeocoder.setLanguage(language);

        map.addControl(maplibreGeocoder);
        mapRef.current = map;

        // how fast mouse scroll wheel zooms
        map.scrollZoom.setWheelZoomRate(1);

        // disable map rotation using right click + drag
        map.dragRotate.disable();

        // disable map rotation using touch rotation gesture
        map.touchZoomRotate.disableRotation();

        const control = new maplibregl.NavigationControl({
            showCompass: false,
        });

        const geolocate = new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
        });

        // Map controls
        map.addControl(control, controlsLocation);
        map.addControl(geolocate, controlsLocation);

        // Map interaction
        map.on("mouseenter", "clustered-circle", () => {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clustered-circle", () => {
            map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", "unclustered", () => {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "unclustered", () => {
            map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", "clustered-circle-low-zoom", () => {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clustered-circle-low-zoom", () => {
            map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", "unclustered-low-zoom", () => {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "unclustered-low-zoom", () => {
            map.getCanvas().style.cursor = "";
        });

        // biome-ignore lint/suspicious/noExplicitAny: unknown type
        type MapEventType = any;
        // zoom to cluster on click
        map.on("click", "clustered-circle", (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["clustered-circle"],
            });
            const zoom = map.getZoom();
            map.easeTo({
                // @ts-ignore
                center: features[0].geometry.coordinates,
                zoom: zoom + 2,
            });
        });
        map.on("click", "clustered-circle-low-zoom", (e: MapEventType) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["clustered-circle-low-zoom"],
            });
            const zoom = map.getZoom();
            map.easeTo({
                // @ts-ignore
                center: features[0].geometry.coordinates,
                zoom: zoom + 2,
            });
        });
        function showObjectWithProperties(e: MapEventType) {
            console.log("Clicked on object with properties: ", e.features[0].properties);
            if (e.features[0].properties !== undefined && mapRef.current !== null) {
                const osmNodeId = e.features[0].properties.node_id;
                console.log("Clicked on object with osm_id: ", osmNodeId);
                // show sidebar
                fillSidebarWithOsmDataAndShow(
                    osmNodeId,
                    mapRef.current,
                    setSidebarAction,
                    setSidebarData,
                    setSidebarLeftShown,
                    false,
                );
                // update hash
                const params = {
                    ...parseHash(),
                    node_id: osmNodeId,
                };
                console.log("new hash params", params);
                window.location.hash = getNewHashString(params);
            }
        }

        // show sidebar on single element click
        map.on("click", "unclustered", showObjectWithProperties);
        map.on("click", "unclustered-low-zoom", showObjectWithProperties);

        // if direct link to osm node then get its data and zoom in
        const newParamsFromHash = parseHash();
        if (newParamsFromHash.node_id && mapRef.current !== null) {
            fillSidebarWithOsmDataAndShow(
                newParamsFromHash.node_id,
                mapRef.current,
                setSidebarAction,
                setSidebarData,
                setSidebarLeftShown,
                true,
            );
        }
    }, [initialLatitude, initialLongitude, initialZoom,
        setSidebarAction, setSidebarData, language, t]);

    return (
        <>
            { sidebarLeftShown && (
                <SidebarLeft
                    action={sidebarAction}
                    data={sidebarData}
                    closeSidebar={closeSidebarLeft}
                    visible={sidebarLeftShown}
                    marker={marker}
                    openChangesetId={openChangesetId}
                    setOpenChangesetId={setOpenChangesetId}
                />
            )}
            <div className="map-wrap">
                <div ref={mapContainer} className="map" />
            </div>
            <FooterDiv
                startAEDAdding={(mobile) => checkConditionsThenCall(() => startAEDAdding(mobile))}
                mobileCancel={mobileCancel}
                showFormMobile={showFormMobile}
                buttonsConfiguration={footerButtonType}
            />
        </>
    );
};

interface MapViewProps {
    openChangesetId: string,
    setOpenChangesetId: (openChangesetId: string) => void,
}

export default MapView;