export const backendBaseUrl = process.env.REACT_APP_BACKEND_API_URL;

export async function fetchNodeDataFromBackend(nodeId: string): Promise<NodeData | null> {
    const url = `${backendBaseUrl}/api/v1/node/${nodeId}`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const node = response.elements[0];
            const tags = Object.fromEntries(
                Object.entries(node.tags).map(([key, val]) => [key.replaceAll(":", "_"), val]),
            );
            const { lon, lat } = node;

            return {
                osm_id: node.id,
                osm_type: "node",
                lat,
                lon,
                ...tags,
            };
        })
        .catch((error) => {
            console.error("Error:", error);
            return null;
        });
}

export interface NodeData {
    osm_id: string,
    osm_type: string,
    lat: number,
    lon: number,
}