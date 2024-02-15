import * as Sentry from "@sentry/react";
import { backendBaseUrl } from "./backend";

export default function initSentry() {
	if (shouldEnableSentry()) {
		Sentry.init({
			dsn: "https://df77ee799280152a4bc7b88a7a9ee6f4@sentry.openaedmap.org/2",
			integrations: [Sentry.browserTracingIntegration()],
			tracesSampleRate: 0,
			tracePropagationTargets: [backendBaseUrl],
			environment: import.meta.env.VITE_ENV,
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
