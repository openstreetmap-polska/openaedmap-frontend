interface GeocoderConfig {
	query: string;
}

const nominatimGeocoder = {
	forwardGeocode: async (config: GeocoderConfig) => {
		const features = [];
		try {
			const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
			const response = await fetch(request);
			const geojson = await response.json();
			for (let i = 0; i < geojson.features.length; i += 1) {
				const feature = geojson.features[i];
				const center = [
					feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
					feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
				];
				const point = {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: center,
					},
					place_name: feature.properties.display_name,
					properties: feature.properties,
					text: feature.properties.display_name,
					place_type: ["place"],
					center,
				};
				features.push(point);
			}
		} catch (e) {
			console.error(`Failed to forwardGeocode with error: ${e}`);
		}

		return {
			features,
		};
	},
};

export default nominatimGeocoder;
