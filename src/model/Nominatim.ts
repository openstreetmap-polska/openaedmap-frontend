export interface NominatimData {
    "place_id": number,
    "licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": string,
    "osm_id":number,
    "lat": number,
    "lon": number,
    "display_name": string,
    "address": {
        "state": string,
        "ISO3166-2-lvl3": string,
        "country": string,
        "country_code": string
    },
    "boundingbox": [number, number, number, number]
}
