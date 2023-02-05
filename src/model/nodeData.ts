export interface NodeData {
    osm_id: string,
    osm_type: string,
    lat: number,
    lon: number,
    tags: Record<string, string>,
}