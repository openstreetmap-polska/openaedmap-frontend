export function webglSupported(): boolean {
	try {
		const canvas = document.createElement("canvas");
		return (
			!!window.WebGLRenderingContext &&
			(canvas.getContext("webgl") !== null ||
				canvas.getContext("experimental-webgl") !== null)
		);
	} catch (_e) {
		return false;
	}
}
