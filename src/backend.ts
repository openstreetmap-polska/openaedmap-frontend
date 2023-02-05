import { fetchNodeData } from "./osm";

export const backendBaseUrl = process.env.REACT_APP_BACKEND_API_URL;

export async function fetchNodeDataFromBackend(nodeId: string): Promise<NodeData | null> {
    const url = `${backendBaseUrl}/api/v1/node/${nodeId}`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetchNodeData(url);
}

export interface NodeData {
    osm_id: string,
    osm_type: string,
    lat: number,
    lon: number,
    tags: Record<string, string>,
}