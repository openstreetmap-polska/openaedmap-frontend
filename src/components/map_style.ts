import { StyleSpecification } from "maplibre-gl";
import { backendBaseUrl } from "~/backend";
import { Country } from "~/model/country";

const getUrl = window.location;
const baseUrl = `${getUrl.protocol}//${getUrl.host}${getUrl.pathname}`;
const spriteUrl = new URL("img/sprite", baseUrl).href;
// can't use URL class since this is a template not literal url
const tilesUrl = `${backendBaseUrl}/api/v1/tile/{z}/{x}/{y}.mvt`;
const TILE_COUNTRIES_MAX_ZOOM = 6;

export const LAYER_CLUSTERED_CIRCLE = "clustered-circle";
export const LAYER_CLUSTERED_CIRCLE_LOW_ZOOM = "clustered-circle-low-zoom";
export const LAYER_UNCLUSTERED_LOW_ZOOM = "unclustered-low-zoom";
export const LAYER_UNCLUSTERED = "unclustered";

const mapStyle = (
	lang: string,
	countriesData: Array<Country>,
): StyleSpecification => {
	const countryCodeToName: Record<string, string> = countriesData.reduce(
		(map: Record<string, string>, country) => {
			if (country.names[lang.toUpperCase()] !== undefined) {
				map[country.code] = country.names[lang];
			} else if (country.names.default !== undefined) {
				map[country.code] = country.names.default;
			}
			return map;
		},
		{},
	);
	return {
		version: 8,
		name: "Map style",
		sources: {
			osm: {
				type: "raster",
				tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
				tileSize: 256,
				minzoom: 0,
				maxzoom: 19,
				attribution:
					'© <a target="_blank" rel="noopener" href="https://openstreetmap.org/copyright">' +
					"OpenStreetMap contributors</a>",
			},
			countries: {
				type: "vector",
				tiles: [tilesUrl],
				minzoom: 3,
				maxzoom: TILE_COUNTRIES_MAX_ZOOM,
			},
			"aed-locations": {
				type: "vector",
				tiles: [tilesUrl],
				minzoom: TILE_COUNTRIES_MAX_ZOOM,
				maxzoom: 16,
			},
		},
		sprite: spriteUrl,
		glyphs: "/fonts/{fontstack}/{range}.pbf",
		layers: [
			{
				id: "background",
				type: "raster",
				source: "osm",
				layout: {
					visibility: "visible",
				},
			},
			{
				id: "borders-fill",
				type: "fill",
				source: "countries",
				"source-layer": "countries",
				paint: {
					"fill-color": "#7a7a7a",
					"fill-opacity": 0.5,
				},
				maxzoom: TILE_COUNTRIES_MAX_ZOOM,
			},
			{
				id: "borders",
				type: "line",
				source: "countries",
				"source-layer": "countries",
				paint: {
					"line-color": "#ff3333",
					"line-width": 2,
					"line-blur": 1,
				},
				maxzoom: TILE_COUNTRIES_MAX_ZOOM,
			},
			{
				id: LAYER_UNCLUSTERED,
				type: "symbol",
				source: "aed-locations",
				"source-layer": "defibrillators",
				minzoom: 9,
				filter: ["!has", "point_count"],
				layout: {
					"icon-image": [
						"coalesce",
						["image", ["concat", "marker_", ["get", "access"]]],
						["image", "marker_unknown"],
					],
					"icon-size": 0.5,
					"icon-allow-overlap": true,
				},
			},
			{
				id: LAYER_UNCLUSTERED_LOW_ZOOM,
				type: "symbol",
				source: "aed-locations",
				"source-layer": "defibrillators",
				minzoom: TILE_COUNTRIES_MAX_ZOOM,
				maxzoom: 9,
				filter: ["!has", "point_count"],
				layout: {
					"icon-image": [
						"coalesce",
						["image", ["concat", "marker_", ["get", "access"]]],
						["image", "marker_unknown"],
					],
					"icon-size": 0.3,
					"icon-allow-overlap": true,
				},
			},
			{
				id: LAYER_CLUSTERED_CIRCLE,
				type: "circle",
				source: "aed-locations",
				"source-layer": "defibrillators",
				minzoom: 8,
				filter: [">", "point_count", 0],
				layout: { visibility: "visible" },
				paint: {
					"circle-color": "rgba(0,145,64, 0.85)",
					"circle-radius": [
						"step",
						["get", "point_count"],
						12,
						100,
						16,
						999,
						20,
					],
					"circle-stroke-color": "rgba(245, 245, 245, 0.88)",
					"circle-stroke-width": 2,
				},
			},
			{
				id: LAYER_CLUSTERED_CIRCLE_LOW_ZOOM,
				type: "circle",
				source: "aed-locations",
				"source-layer": "defibrillators",
				minzoom: TILE_COUNTRIES_MAX_ZOOM,
				maxzoom: 8,
				filter: [">", "point_count", 0],
				layout: { visibility: "visible" },
				paint: {
					"circle-color": "rgba(0,145,64, 0.85)",
					"circle-radius": [
						"step",
						["get", "point_count"],
						8,
						100,
						11,
						999,
						14,
					],
					"circle-stroke-color": "rgba(245, 245, 245, 0.88)",
					"circle-stroke-width": 2,
				},
			},
			{
				id: "clustered-label",
				type: "symbol",
				source: "aed-locations",
				"source-layer": "defibrillators",
				minzoom: TILE_COUNTRIES_MAX_ZOOM,
				filter: [">", "point_count", 0],
				layout: {
					"text-allow-overlap": true,
					"text-field": "{point_count_abbreviated}",
					"text-font": ["OpenSansBold"],
					"text-size": 10,
					"text-letter-spacing": 0.05,
					visibility: "visible",
				},
				paint: { "text-color": "#f5f5f5" },
			},
			{
				id: "countries-label",
				type: "symbol",
				source: "countries",
				"source-layer": "defibrillators",
				maxzoom: TILE_COUNTRIES_MAX_ZOOM,
				layout: {
					"text-allow-overlap": false,
					"text-field": [
						"concat",
						[
							"coalesce",
							[
								"get",
								["get", "country_code", ["properties"]],
								["literal", countryCodeToName],
							],
							["get", "country_name", ["properties"]],
						],
						"\n",
						["get", "point_count_abbreviated"],
					],
					"text-font": ["OpenSansBold"],
					"text-size": 14,
					"text-letter-spacing": 0.05,
					visibility: "visible",
					"symbol-sort-key": ["*", ["get", "point_count"], -1],
				},
				paint: {
					"text-halo-width": 3,
					"text-halo-color": "#f5f5f5",
					"text-halo-blur": 1,
					// "text-color": "#f5f5f5"
				},
			},
		],
	};
};

export default mapStyle;
