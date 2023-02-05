import React, {
    FC, useRef, useEffect, useState,
} from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { useTranslation } from "react-i18next";
// @ts-ignore
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
import styleJson from "./map_style";
import SidebarLeft from "./sidebar-left";
import FooterDiv from "./footer";
import { NodeData } from "../backend";
import ButtonsType from "../model/buttonsType";

// -------------------------------------------------------------------
// https://github.com/maplibre/maplibre-gl-js/issues/1011

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from "!maplibre-gl"; // ! is important here
// @ts-ignore
import { initialModalState, ModalType } from "../model/modal";
import { useAppContext } from "../appContext";
import SidebarAction from "../model/sidebarAction";
import { fetchNodeDataFromOsm } from "../osm";

maplibregl.workerClass = maplibreglWorker;
// -------------------------------------------------------------------

function fillSidebarWithOsmDataAndShow(
    nodeId: string,
    mapInstance: maplibregl.Map,
    setSidebarLeftAction: (action: SidebarAction) => void,
    setSidebarLeftData: (data: NodeData) => void,
    setSidebarLeftShown: (sidebarLeftShown: boolean) => void,
    jumpInsteadOfEaseTo: boolean,
) {
    const result = fetchNodeDataFromOsm(nodeId);
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
            setSidebarLeftData(data);
            setSidebarLeftAction(SidebarAction.showDetails);
            setSidebarLeftShown(true);
        }
    });
}

function parseHash(): Record<string, string> {
    const parameters: Record<string, string> = {};
    window.location.hash.slice(1).split("&").forEach((part) => {
        const [key, value] = part.split("=", 2);
        parameters[key] = value;
    });
    return parameters;
}

function getNewHashString(parameters: Record<string, string>) {
    return Object
        .entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
}

const Map: FC<MapProps> = ({ openChangesetId, setOpenChangesetId }) => {
    const { authState: { auth }, setModalState } = useAppContext();
    const { t } = useTranslation();

    const hash4MapName = "map";

    const paramsFromHash = parseHash();

    let initialLongitude = -8;
    let initialLatitude = 47.74;
    let initialZoom = 3;

    if (paramsFromHash[hash4MapName]) {
        [initialZoom, initialLatitude, initialLongitude] = paramsFromHash[hash4MapName].split("/").map(Number);
    }

    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const controlsLocation = "bottom-right";

    const [marker, setMarker] = useState<maplibregl.Marker>(null);

    const [sidebarLeftData, setSidebarLeftData] = useState<NodeData | null>(null);
    const [sidebarLeftAction, setSidebarLeftAction] = useState(SidebarAction.init);
    const [sidebarLeftShown, setSidebarLeftShown] = useState(false);

    const [footerButtonType, setFooterButtonType] = useState(ButtonsType.AddAED);

    const removeNodeIdFromHash = () => {
        const hashParams = parseHash();
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
        setFooterButtonType(ButtonsType.AddAED);
    };

    const checkConditionsThenCall = (callable: () => void) => {
        const map: maplibregl.Map = mapRef.current;
        if (map === null) return;
        if (auth !== null && !auth.authenticated()) {
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
        setFooterButtonType(ButtonsType.AddAED);
    };

    const showFormMobile = () => {
        setSidebarLeftShown(true);
        setFooterButtonType(ButtonsType.None);
    };

    const startAEDAdding = (mobile: boolean) => {
        const map: maplibregl.Map = mapRef.current;
        if (map === null) return;
        deleteMarker();
        removeNodeIdFromHash();
        setSidebarLeftData(null);
        setSidebarLeftAction(SidebarAction.addNode);
        setSidebarLeftShown(!mobile); // for mobile hide sidebar so marker is visible
        setFooterButtonType(mobile ? ButtonsType.MobileStep1 : ButtonsType.None);
        // add marker
        const markerColour = "#e81224";
        const mapCenter = map.getCenter();
        const initialCoordinates = [mapCenter.lng, mapCenter.lat];
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
        if (mapRef.current) return; // stops map from initializing more than once
        const map = new maplibregl.Map({
            container: mapContainer.current,
            hash: hash4MapName,
            style: styleJson,
            center: [initialLongitude, initialLatitude],
            zoom: initialZoom,
            minZoom: 3,
            maxZoom: 19,
            maplibreLogo: false,
        });
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

        // TODO: event type
        type MapEventType = any;
        // zoom to cluster on click
        map.on("click", "clustered-circle", (e: MapEventType) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["clustered-circle"],
            });
            const zoom = map.getZoom();
            map.easeTo({
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
                center: features[0].geometry.coordinates,
                zoom: zoom + 2,
            });
        });
        function showObjectWithProperties(e: MapEventType) {
            console.log("Clicked on object with properties: ", e.features[0].properties);
            if (e.features[0].properties !== undefined) {
                const osmNodeId = e.features[0].properties.node_id;
                console.log("Clicked on object with osm_id: ", osmNodeId);
                // show sidebar
                fillSidebarWithOsmDataAndShow(
                    osmNodeId,
                    mapRef.current,
                    setSidebarLeftAction,
                    setSidebarLeftData,
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
        if (newParamsFromHash.node_id) {
            fillSidebarWithOsmDataAndShow(
                newParamsFromHash.node_id,
                mapRef.current,
                setSidebarLeftAction,
                setSidebarLeftData,
                setSidebarLeftShown,
                true,
            );
        }
    }, [initialLatitude, initialLongitude, initialZoom, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown]);

    return (
        <>
            { sidebarLeftShown && (
                <SidebarLeft
                    action={sidebarLeftAction}
                    data={sidebarLeftData}
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

interface MapProps {
    openChangesetId: string,
    setOpenChangesetId: (openChangesetId: string) => void,
}

export default Map;