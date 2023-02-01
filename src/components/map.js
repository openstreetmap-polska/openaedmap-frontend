import React, { useRef, useEffect, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import styleJson from './map_style';
import SidebarLeft from './sidebar-left';
import FooterDiv from './footer';
import { useTranslation } from 'react-i18next';
import { fetchNodeDataFromBackend } from '../backend';
import {ButtonsType} from "../model/buttonsType";

// -------------------------------------------------------------------
// https://github.com/maplibre/maplibre-gl-js/issues/1011

// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from '!maplibre-gl';      // ! is important here
import maplibreglWorker from 'maplibre-gl/dist/maplibre-gl-csp-worker';
import {initialModalState, ModalType} from "../model/modal";
import {useAppContext} from "../appContext";

maplibregl.workerClass = maplibreglWorker;
// -------------------------------------------------------------------



function fillSidebarWithOsmDataAndShow(nodeId, mapInstance, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown, jumpInsteadOfEaseTo) {
    const result = fetchNodeDataFromBackend(nodeId);
    result.then(data => {
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
                        around: {lon: data.lon, lat: data.lat},
                    });
                }
            } else {
                if (jumpInsteadOfEaseTo) {
                    mapInstance.jumpTo({
                        zoom: currentZoomLevel,
                        center: [data.lon, data.lat],
                    });
                } else {
                    mapInstance.easeTo({
                        zoom: currentZoomLevel,
                        around: {lon: data.lon, lat: data.lat},
                    });
                }
            }
            setSidebarLeftData(data);
            setSidebarLeftAction("showDetails");
            setSidebarLeftShown(true);
        }
    })
}

function parseHash() {
    let parameters = {};
    window.location.hash.slice(1).split('&').forEach(part => {
        const [key, value] = part.split("=", 2);
        parameters[key] = value;
    });
    return parameters
}

function getNewHashString(parameters) {
    return Object
        .entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
}

export default function Map({ openChangesetId, setOpenChangesetId }) {
    const { authState: { auth }, setModalState } = useAppContext();
    const { t } = useTranslation();

    const hash4MapName = "map";

    const paramsFromHash = parseHash();

    let initialSidebarData = {};
    let initialSidebarAction = "init";
    let initialSidebarVisibility = false;
    let initialMapLongitude = -8;
    let initialMapLatitude = 47.74;
    let initialMapZoom = 3;

    if (paramsFromHash[hash4MapName]) {
        [initialMapZoom, initialMapLatitude, initialMapLongitude] = paramsFromHash[hash4MapName].split("/");
    }

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(initialMapLongitude);
    const [lat] = useState(initialMapLatitude);
    const [zoom] = useState(initialMapZoom);
    const controlsLocation = 'bottom-right';

    const [marker, setMarker] = useState(null);

    const [sidebarLeftData, setSidebarLeftData] = useState(initialSidebarData);
    const [sidebarLeftAction, setSidebarLeftAction] = useState(initialSidebarAction);
    const [sidebarLeftShown, setSidebarLeftShown] = useState(initialSidebarVisibility);

    const [footerButtonType, setFooterButtonType] = useState(ButtonsType.AddAED);

    const removeNodeIdFromHash = () => {
        let hashParams = parseHash();
        delete hashParams["node_id"];
        window.location.hash = getNewHashString(hashParams);
    }

    const deleteMarker = () => {
        if (marker !== null) {
            marker.remove();
            setMarker(null);
        }
    }

    const closeSidebarLeft = () => {
        setSidebarLeftShown(false);
        deleteMarker();
        removeNodeIdFromHash();
        setFooterButtonType(ButtonsType.AddAED);
    };

    const checkConditionsThenCall = (callable) => {
        if (!auth.authenticated())
            setModalState({...initialModalState, visible: true, type: ModalType.NeedToLogin});
        else if (map.current.getZoom() < 15)
            setModalState({...initialModalState, visible: true, type: ModalType.NeedMoreZoom, currentZoom: map.current.getZoom()})
        else callable()
    }

    const mobileCancel = () => {
        deleteMarker();
        setSidebarLeftShown(false);
        setFooterButtonType(ButtonsType.AddAED);
    }

    const showFormMobile = () => {
        setSidebarLeftShown(true);
        setFooterButtonType(ButtonsType.None);
    }

    const startAEDAdding = (mobile) => {
        deleteMarker();
        removeNodeIdFromHash();
        setSidebarLeftData({});
        setSidebarLeftAction("addNode");
        setSidebarLeftShown(!mobile); // for mobile hide sidebar so marker is visible
        setFooterButtonType(mobile ? ButtonsType.MobileStep1 : ButtonsType.None);
        // add marker
        const markerColour = "#e81224";
        const mapCenter = map.current.getCenter();
        const initialCoordinates = [mapCenter.lng, mapCenter.lat];
        setMarker(
            new maplibregl.Marker({
                draggable: true,
                color: markerColour,
            })
            .setLngLat(initialCoordinates)
            .setPopup(new maplibregl.Popup().setHTML(t("form.marker_popup_text")))
            .addTo(map.current)
            .togglePopup()
        );
    }

    useEffect(() => {
        if (map.current) return; //stops map from initializing more than once
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          hash: hash4MapName,
          style: styleJson,
          center: [lng, lat],
          zoom: zoom,
          minZoom: 3,
          maxZoom: 19,
          maplibreLogo: false,
        });

        // how fast mouse scroll wheel zooms
        map.current.scrollZoom.setWheelZoomRate(1);

        // disable map rotation using right click + drag
        map.current.dragRotate.disable();

        // disable map rotation using touch rotation gesture
        map.current.touchZoomRotate.disableRotation();

        let control = new maplibregl.NavigationControl({
            showCompass: false
        });

        let geolocate = new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            }
        });

        // Map controls
        map.current.addControl(control, controlsLocation);
        map.current.addControl(geolocate, controlsLocation);

        // Map interaction
        map.current.on('mouseenter', 'clustered-circle', () => {
            map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clustered-circle', () => {
            map.current.getCanvas().style.cursor = '';
        });
        map.current.on('mouseenter', 'unclustered', () => {
            map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'unclustered', () => {
            map.current.getCanvas().style.cursor = '';
        });
        map.current.on('mouseenter', 'clustered-circle-low-zoom', () => {
            map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clustered-circle-low-zoom', () => {
            map.current.getCanvas().style.cursor = '';
        });
        map.current.on('mouseenter', 'unclustered-low-zoom', () => {
            map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'unclustered-low-zoom', () => {
            map.current.getCanvas().style.cursor = '';
        });

        // zoom to cluster on click
        map.current.on('click', 'clustered-circle', function (e) {
            var features = map.current.queryRenderedFeatures(e.point, {
                layers: ['clustered-circle']
            });
            var zoom = map.current.getZoom();
            map.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom + 2
            });
        });
        map.current.on('click', 'clustered-circle-low-zoom', function (e) {
            var features = map.current.queryRenderedFeatures(e.point, {
                layers: ['clustered-circle-low-zoom']
            });
            var zoom = map.current.getZoom();
            map.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom + 2
            });
        });
        // show sidebar on single element click
        map.current.on('click', 'unclustered', function (e) {
            console.log("Clicked on object with properties: ", e.features[0].properties);
            if (e.features[0].properties !== undefined) {
                const osm_node_id = e.features[0].properties.node_id;
                console.log("Clicked on object with osm_id: ", osm_node_id);
                // show sidebar
                fillSidebarWithOsmDataAndShow(osm_node_id, map.current, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown, false);
                // update hash
                const params = {
                    ...parseHash(),
                    node_id: osm_node_id,
                };
                console.log("new hash params", params);
                window.location.hash = getNewHashString(params);
            }
        });
        map.current.on('click', 'unclustered-low-zoom', function (e) {
            console.log("Clicked on object with properties: ", e.features[0].properties);
            if (e.features[0].properties !== undefined) {
                const osm_node_id = e.features[0].properties.node_id;
                console.log("Clicked on object with osm_id: ", osm_node_id);
                // show sidebar
                fillSidebarWithOsmDataAndShow(osm_node_id, map.current, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown, false);
                // update hash
                const params = {
                    ...parseHash(),
                    node_id: osm_node_id,
                };
                console.log("new hash params", params);
                window.location.hash = getNewHashString(params);
            }
        });

        // if direct link to osm node then get its data and zoom in
        const paramsFromHash = parseHash();
        if (paramsFromHash["node_id"]) fillSidebarWithOsmDataAndShow(paramsFromHash["node_id"], map.current, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown, true);
    }, [lat, lng, zoom, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown]);

    return (
        <>
        { sidebarLeftShown && <SidebarLeft
                                action={sidebarLeftAction}
                                data={sidebarLeftData}
                                closeSidebar={closeSidebarLeft}
                                visible={sidebarLeftShown}
                                marker={marker}
                                openChangesetId={openChangesetId}
                                setOpenChangesetId={setOpenChangesetId}
                              />}
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
}
