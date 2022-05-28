import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(0);
    const [lat] = useState(0);
    const [zoom] = useState(2);
    const controlsLocation = 'bottom-right';

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          hash: 'map',
          style: './map_style.json',
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
    });

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
}
