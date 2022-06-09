export default {
    "version": 8,
    "name": "Map style",
    "sources": {
        "osm": {
            "type": "raster",
            "tiles": [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
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
    "sprite": "http://localhost:3000/sprite",
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
                "icon-image": ["image", ["concat", "marker_", ["get", "access"]]],
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
            "circle-radius": 12,
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
            "text-field": "{point_count}",
            "text-font": ["Open Sans Bold"],
            "text-size": 12,
            "text-letter-spacing": 0.05,
            "visibility": "visible"
          },
          "paint": {"text-color": "#f5f5f5"}
        }
    ],
    "id": "style"
};