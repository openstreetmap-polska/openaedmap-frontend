import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import styleJson from './map_style'

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(-8);
    const [lat] = useState(47.74);
    const [zoom] = useState(3);
    const controlsLocation = 'bottom-right';

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          hash: 'map',
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
        // map.current.on('click', 'unclustered', function (e) {
        //     console.log(e.features[0].properties);
        //     if (e.features[0].properties !== undefined) {
        //         let properties = {
        //             action: "showDetails",
        //             data: e.features[0].properties,
        //         };
                
        //     }
        // });
    });

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
}
