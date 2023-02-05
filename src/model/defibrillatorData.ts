export interface NewDefibrillatorData {
    lat: number,
    lon: number,
    tags: Record<string, string>,
}

export interface DefibrillatorData extends NewDefibrillatorData {
    osmId: string,
    osmType: string,
    version: string,
}