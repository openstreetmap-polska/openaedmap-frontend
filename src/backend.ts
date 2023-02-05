import { fetchNodeData } from "./osm";
import { DefibrillatorData } from "./model/defibrillatorData";

export const backendBaseUrl = process.env.REACT_APP_BACKEND_API_URL;

export async function fetchNodeDataFromBackend(nodeId: string): Promise<DefibrillatorData | null> {
    const url = `${backendBaseUrl}/api/v1/node/${nodeId}`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetchNodeData(url);
}