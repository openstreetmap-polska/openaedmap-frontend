import React, { useRef, useEffect, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import styleJson from './map_style';
import SidebarLeft from './sidebar-left';
import FooterDiv from './footer';

// -------------------------------------------------------------------
// https://github.com/maplibre/maplibre-gl-js/issues/1011

// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from '!maplibre-gl';      // ! is important here
import maplibreglWorker from 'maplibre-gl/dist/maplibre-gl-csp-worker';

maplibregl.workerClass = maplibreglWorker;
// -------------------------------------------------------------------

async function fetchNodeDataFromOsm(nodeId) {
    const url = `https://www.openstreetmap.org/api/0.6/node/${nodeId}.json`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetch(url)
        .then(response => response.json())
        .then(response => {
            const node = response["elements"][0];
            const tags = Object.fromEntries(
                Object.entries(node["tags"]).map(([key, val]) => [key.replaceAll(":", "_"), val])
            );
            const lon = node["lon"];
            const lat = node["lat"];

            return {
                "lat": lat,
                "lon": lon,
                "data": {
                    osm_id: node["id"],
                    osm_type: "node",
                    ...tags,
                },
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return {};
        });
}

function fillSidebarWithOsmDataAndShow(nodeId, mapInstance, setSidebarLeftAction, setSidebarLeftData, setSidebarLeftShown, jumpInsteadOfEaseTo) {
    const result = fetchNodeDataFromOsm(nodeId);
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
            setSidebarLeftData(data.data);
            setSidebarLeftAction("showDetails");
            setSidebarLeftShown(true);
        }
    })
}

function parseHash() {
    let parameters = {};
    window.location.hash.slice(1).split('&').forEach(part => {
        const arr = part.split("=", 2);
        parameters[arr[0]] = arr[1];
    });
    return parameters
}

function getNewHashString(parameters) {
    return Object
        .entries(parameters)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
}

export default function Map() {

    const hash4MapName = "map";

    const paramsFromHash = parseHash();

    let initialSidebarData = {};
    let initialSidebarAction = "init";
    let initialSidebarVisibility = false;
    let initialMapLongitude = -8;
    let initialMapLatitude = 47.74;
    let initialMapZoom = 3;

    if (paramsFromHash[hash4MapName]) {
        const p = paramsFromHash[hash4MapName].split("/");
        initialMapZoom = p[0];
        initialMapLatitude = p[1];
        initialMapLongitude = p[2];
    }

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(initialMapLongitude);
    const [lat] = useState(initialMapLatitude);
    const [zoom] = useState(initialMapZoom);
    const controlsLocation = 'bottom-right';

    const [sidebarLeftData, setSidebarLeftData] = useState(initialSidebarData);
    const [sidebarLeftAction, setSidebarLeftAction] = useState(initialSidebarAction);
    const [sidebarLeftShown, setSidebarLeftShown] = useState(initialSidebarVisibility);
    // const toggleSidebarLeftShown = () => setSidebarLeftShown(!sidebarShown);
    const closeSidebarLeft = () => {
        setSidebarLeftShown(false);
        let hashParams = parseHash();
        delete hashParams["node_id"];
        window.location.hash = getNewHashString(hashParams);
    };

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          hash: hash4MapName,
          style: styleJson,
          center: [lng, lat],
          zoom: zoom,
          minZoom: 3,
          maxZoom: 19,
          maplibreLogo: true,
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
        // show sidebar on single element click
        map.current.on('click', 'unclustered', function (e) {
            console.log("Clicked on object with properties: ", e.features[0].properties);
            if (e.features[0].properties !== undefined) {
                const osm_node_id = e.features[0].properties.osm_id;
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
        { sidebarLeftShown && <SidebarLeft action={sidebarLeftAction} data={sidebarLeftData} closeSidebar={closeSidebarLeft} visible={sidebarLeftShown} />}
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
        <FooterDiv actionSetter={setSidebarLeftAction} dataSetter={setSidebarLeftData} visibilitySetter={setSidebarLeftShown} />
        </>
    );
}
