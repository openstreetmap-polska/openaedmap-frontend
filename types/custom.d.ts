declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module "@mapbox/timespace" {
    export function getFuzzyLocalTimeFromPoint(timestamp: number, point: number[]): { _d: Date };
}

declare module "@maplibre/maplibre-gl-geocoder" {
    export default class MaplibreGeocoder {
        constructor(geocoderApi, options);
        setLanguage(language: string): void;
    }
}
