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
        }
    ],
    "id": "style"
};