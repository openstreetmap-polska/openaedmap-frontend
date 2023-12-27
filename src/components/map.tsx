// @ts-ignore
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "~/appContext";
import { fetchCountriesData, fetchNodeDataFromBackend } from "~/backend";
import nominatimGeocoder from "~/components/nominatimGeocoder";
import { useLanguage } from "~/i18n";
import {
	addNodeIdToHash,
	getMapLocation,
	locationParameter,
	parseParametersFromUrl,
	removeNodeIdFromHash,
	saveLocationToLocalStorage,
} from "~/location";
import ButtonsType from "~/model/buttonsType";
import { DefibrillatorData } from "~/model/defibrillatorData";
import { ModalType, initialModalState } from "~/model/modal";
import SidebarAction from "~/model/sidebarAction";
import FooterDiv from "./footer";
import "./map.css";
import mapStyle from "./map_style";
import SidebarLeft from "./sidebar-left";

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

const MapView: FC<MapViewProps> = ({ openChangesetId, setOpenChangesetId }) => {
	const {
		authState: { auth },
		setModalState,
		sidebarAction,
		setSidebarAction,
		sidebarData,
		setSidebarData,
		countriesData,
		setCountriesData,
		countriesDataLanguage,
		setCountriesDataLanguage,
	} = useAppContext();
	const { t } = useTranslation();
	const language = useLanguage();
	const { longitude, latitude, zoom } = getMapLocation();
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const maplibreGeocoderRef = useRef<MaplibreGeocoder | null>(null);
	const controlsLocation = "bottom-right";
	const [marker, setMarker] = useState<maplibregl.Marker | null>(null);
	const [sidebarLeftShown, setSidebarLeftShown] = useState(false);
	const [footerButtonType, setFooterButtonType] = useState(ButtonsType.Basic);

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
			setModalState({
				...initialModalState,
				visible: true,
				type: ModalType.NeedToLogin,
			});
		} else if (map.getZoom() < 15) {
			setModalState({
				...initialModalState,
				visible: true,
				type: ModalType.NeedMoreZoom,
				currentZoom: map.getZoom(),
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
		const fetchData = async () => {
			const data = await fetchCountriesData(language);
			if (data !== null) {
				setCountriesData(data);
				setCountriesDataLanguage(language);
			}
		};
		fetchData().catch(console.error);
	}, [language, setCountriesDataLanguage, setCountriesData]);

	function addMaplibreGeocoder(map: maplibregl.Map) {
		if (maplibreGeocoderRef.current !== null) {
			map.removeControl(maplibreGeocoderRef.current);
		}
		const newMaplibreGeocoder = new MaplibreGeocoder(nominatimGeocoder, {
			maplibregl,
			placeholder: t("sidebar.find_location"),
		});
		newMaplibreGeocoder.setLanguage(language);
		map.addControl(newMaplibreGeocoder);
		maplibreGeocoderRef.current = newMaplibreGeocoder;
	}

	useEffect(() => {
		if (mapContainer.current === null) return;
		if (mapRef.current !== null) return; // stops map from initializing more than once
		const map = new maplibregl.Map({
			container: mapContainer.current,
			hash: locationParameter,
			style: mapStyle(language.toUpperCase(), countriesData),
			center: [longitude, latitude],
			zoom: zoom,
			minZoom: 3,
			maxZoom: 19,
			maplibreLogo: false,
		});

		addMaplibreGeocoder(map);
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
		map.on("moveend", saveLocationToLocalStorage);

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
			if (e.features[0].properties !== undefined && mapRef.current !== null) {
				const osmNodeId = e.features[0].properties.node_id;
				fillSidebarWithOsmDataAndShow(
					osmNodeId,
					mapRef.current,
					setSidebarAction,
					setSidebarData,
					setSidebarLeftShown,
					false,
				);
				addNodeIdToHash(osmNodeId);
			}
		}

		// show sidebar on single element click
		map.on("click", "unclustered", showObjectWithProperties);
		map.on("click", "unclustered-low-zoom", showObjectWithProperties);

		// if direct link to osm node then get its data and zoom in
		const newParamsFromHash = parseParametersFromUrl();
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
	}, [
		latitude,
		longitude,
		zoom,
		setSidebarAction,
		setSidebarData,
		language,
		countriesData,
		countriesDataLanguage,
	]);

	useEffect(() => {
		if (mapRef.current === null) return;
		const map = mapRef.current;
		addMaplibreGeocoder(map);
		if (countriesDataLanguage !== language) return; // wait for countries data to be loaded
		map.setStyle(mapStyle(language.toUpperCase(), countriesData));
	}, [countriesData, countriesDataLanguage, language]);

	return (
		<>
			{sidebarLeftShown && (
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
				startAEDAdding={(mobile) =>
					checkConditionsThenCall(() => startAEDAdding(mobile))
				}
				mobileCancel={mobileCancel}
				showFormMobile={showFormMobile}
				buttonsConfiguration={footerButtonType}
			/>
		</>
	);
};

interface MapViewProps {
	openChangesetId: string;
	setOpenChangesetId: (openChangesetId: string) => void;
}

export default MapView;
