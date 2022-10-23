var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + getUrl.pathname;

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
          "tiles": ["https://aed.openstreetmap.org.pl/mvt/{z}/{x}/{y}.pbf"],
          "maxzoom": 13
        }
    },
    "sprite": new URL("sprite", baseUrl).href,
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
            "id": "unclustered",
            "type": "symbol",
            "source": "aed-locations",
            "source-layer": "defibrillators",
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
          "id": "clustered-circle",
          "type": "circle",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "filter": ["has", "point_count"],
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
          "id": "clustered-label",
          "type": "symbol",
          "source": "aed-locations",
          "source-layer": "defibrillators",
          "filter": ["has", "point_count"],
          "layout": {
            "text-allow-overlap": true,
            "text-field": "{point_count}",
            "text-font": ["Open Sans Bold"],
            "text-size": 10,
            "text-letter-spacing": 0.05,
            "visibility": "visible"
          },
          "paint": {"text-color": "#f5f5f5"}
        }
    ],
    "id": "style"
}

export default style
