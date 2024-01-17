export function fixOsmAuthLocalStorageTokens() {
	for (const key in localStorage) {
		if (key.includes("oauth")) {
			const oldValue = localStorage.getItem(key);
			if (oldValue?.includes('"')) {
				const newValue = oldValue.replace(/"/g, "");
				localStorage.setItem(key, newValue);
			}
		}
	}
}
