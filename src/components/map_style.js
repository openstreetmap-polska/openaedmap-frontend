const getUrl = window.location;
const baseUrl = getUrl.protocol + "//" + getUrl.host + getUrl.pathname;
const spriteUrl = (new URL("sprite", baseUrl)).href;
const isProduction = process.env.REACT_APP_ENV === 'production';
const tilesBaseUrl = isProduction ? "https://openaedmap.openstreetmap.org.pl" : "https://openaedmap-dev.openstreetmap.org.pl";
const tilesUrl = tilesBaseUrl + "/api/v1/tile/{z}/{x}/{y}.mvt"; // can't use URL class since this is a template not literal url

const style = {
    "version": 8,
    "name": "Map style",
    "sources": {
        "osm": {
            "type": "raster",
            "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256,
            "minzoom": 0,
            "maxzoom": 19,
            "attribution": "© <a target=\"_blank\" rel=\"noopener\" href=\"https://openstreetmap.org/copyright\">OpenStreetMap contributors</a>"
        },
        "aed-locations": {
          "type": "vector",
          "tiles": [tilesUrl],
          "maxzoom": 13
        }
    },
    "sprite": spriteUrl,
    "glyphs": "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "raster",
            "source": "osm",
            "layout": {
                "visibility": "visible"
            }
        },
        {
          "id": "borders-fill",
          "type": "fill",
          "source": "aed-locations",
          "source-layer": "countries",
          "paint": {
            "fill-color": "#7a7a7a",
            "fill-opacity": 0.5
          }
        },
        {
          "id": "borders",
          "type": "line",
          "source": "aed-locations",
          "source-layer": "countries",
          "paint": {
            "line-color": "#ff3333",
            "line-width": 2,
            "line-blur": 1
          }
        },
        {
            "id": "unclustered",
            "type": "symbol",
            "source": "aed-locations",
            "source-layer": "defibrillators",
            "minzoom": 9,
            "filter": ["!has", "point_count"],
            "layout": {
                "icon-image": [
                  "coalesce",
                  ["image", ["concat", "marker_", ["get", "access"]]],
                  ["image", "marker_unknown"]
                ],
                "icon-size": 0.5,
                "icon-allow-overlap": true
            }
        },
        {
          "id": "unclustered-low-zoom",
          "type": "symbol",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "minzoom": 6,
          "maxzoom": 9,
          "filter": ["!has", "point_count"],
          "layout": {
              "icon-image": [
                "coalesce",
                ["image", ["concat", "marker_", ["get", "access"]]],
                ["image", "marker_unknown"]
              ],
              "icon-size": 0.3,
              "icon-allow-overlap": true
          }
      },
        {
          "id": "clustered-circle",
          "type": "circle",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "minzoom": 8,
          "filter": [">", "point_count", 0],
          "layout": {"visibility": "visible"},
          "paint": {
            "circle-color": "rgba(0,145,64, 0.85)",
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              12,
              100,
              16,
              999,
              20
              ],
            "circle-stroke-color": "rgba(245, 245, 245, 0.88)",
            "circle-stroke-width": 2
          }
        },
        {
          "id": "clustered-circle-low-zoom",
          "type": "circle",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "minzoom": 6,
          "maxzoom": 8,
          "filter": [">", "point_count", 0],
          "layout": {"visibility": "visible"},
          "paint": {
            "circle-color": "rgba(0,145,64, 0.85)",
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              8,
              100,
              11,
              999,
              14
              ],
            "circle-stroke-color": "rgba(245, 245, 245, 0.88)",
            "circle-stroke-width": 2
          }
        },
        {
          "id": "clustered-label",
          "type": "symbol",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "minzoom": 6,
          "filter": [">", "point_count", 0],
          "layout": {
            "text-allow-overlap": true,
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Open Sans Bold"],
            "text-size": 10,
            "text-letter-spacing": 0.05,
            "visibility": "visible"
          },
          "paint": {"text-color": "#f5f5f5"}
        },
        {
          "id": "countries-label",
          "type": "symbol",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "maxzoom": 6,
          "layout": {
            "text-allow-overlap": false,
            "text-field": "{country_name}\n{point_count_abbreviated}",
            "text-font": ["Open Sans Bold"],
            "text-size": 14,
            "text-letter-spacing": 0.05,
            "visibility": "visible",
            "symbol-sort-key": ["*", ["get", "point_count"], -1]
          },
          "paint": {
            "text-halo-width": 3,
            "text-halo-color": "#f5f5f5",
            "text-halo-blur": 1
            // "text-color": "#f5f5f5"
          }
        }
    ],
    "id": "style"
}

export default style
