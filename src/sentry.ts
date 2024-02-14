import * as Sentry from "@sentry/react";

export default function initSentry() {
	if (shouldEnableSentry()) {
		Sentry.init({
			dsn: "https://df77ee799280152a4bc7b88a7a9ee6f4@sentry.openaedmap.org/2",
			integrations: [],
		});
	}
}

function shouldEnableSentry(): boolean {
	const doNotTrack =
		navigator.doNotTrack === "1" || navigator.doNotTrack === "true";
	// @ts-ignore
	const globalPrivacyControl = navigator.globalPrivacyControl === true;
	return !doNotTrack && !globalPrivacyControl;
}
