export const locationParameter = "map";

export interface MapLocation {
	zoom: number;
	latitude: number;
	longitude: number;
}

export function getMapLocation(): MapLocation {
	const defaultLocation: MapLocation = {
		zoom: 3,
		latitude: 47.74,
		longitude: -8,
	};
	return (
		getLocationFromUrl() ?? getLocationFromLocalStorage() ?? defaultLocation
	);
}

function getLocationStringFromUrl(): string | null {
	const paramsFromHash = parseParametersFromUrl();
	return paramsFromHash[locationParameter] ?? null;
}

function getLocationFromUrl(): MapLocation | null {
	const locationString = getLocationStringFromUrl();
	return locationString !== null
		? parseLocationFromString(locationString)
		: null;
}

function getLocationFromLocalStorage(): MapLocation | null {
	const locationString = localStorage.getItem(locationParameter);
	return locationString !== null
		? parseLocationFromString(locationString)
		: null;
}

function parseLocationFromString(locationString: string): MapLocation | null {
	try {
		const [zoom, latitude, longitude] = locationString.split("/").map(Number);
		return { zoom, latitude, longitude };
	} catch (e) {
		return null;
	}
}

export function parseParametersFromUrl(): Record<string, string> {
	const parameters: Record<string, string> = {};
	for (const part of window.location.hash.slice(1).split("&")) {
		const [key, value] = part.split("=", 2);
		parameters[key] = value;
	}
	return parameters;
}

function serializeParametersToUrlTarget(parameters: Record<string, string>) {
	return Object.entries(parameters)
		.map(([key, value]) => `${key}=${value}`)
		.join("&");
}

export function removeNodeIdFromHash() {
	const params = parseParametersFromUrl();
	// biome-ignore lint/performance/noDelete: using undefined assignment causes it to be part of url
	delete params.node_id;
	window.location.hash = serializeParametersToUrlTarget(params);
}

export function addNodeIdToHash(nodeId: string) {
	const params = parseParametersFromUrl();
	params.node_id = nodeId;
	window.location.hash = serializeParametersToUrlTarget(params);
}

export function saveLocationToLocalStorage() {
	const location = getLocationStringFromUrl();
	if (location !== null) {
		localStorage.setItem(locationParameter, location ?? "");
	}
}
