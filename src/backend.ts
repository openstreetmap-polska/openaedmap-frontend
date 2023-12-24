import { fetchNodeData } from "./osm";
import { DefibrillatorData } from "./model/defibrillatorData";
import { Country } from "./model/country";

export const backendBaseUrl = import.meta.env.VITE_BACKEND_API_URL;

export async function fetchNodeDataFromBackend(nodeId: string): Promise<DefibrillatorData | null> {
    const url = `${backendBaseUrl}/api/v1/node/${nodeId}`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetchNodeData(url);
}

interface BackendCountry {
    country_code: string;
    country_names: Record<string, string>;
    feature_count: number;
    data_path: string;
}

export async function fetchCountriesData(language: string): Promise<Array<Country> | null> {
    const url = `${backendBaseUrl}/api/v1/countries/names?language=${language.toUpperCase()}`;
    return fetch(url)
        .then((response) => response.json())
        .then((response: Array<BackendCountry>) => response.map((country: BackendCountry) => ({
            code: country.country_code,
            names: country.country_names,
            featureCount: country.feature_count,
            dataPath: country.data_path,
        })))
        .catch((error) => {
            console.error("Error:", error);
            return null;
        });
}