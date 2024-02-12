import * as Sentry from "@sentry/react";

export default function initSentry() {
	if (shouldEnableSentry()) {
		Sentry.init({
			dsn: "https://7f263ca9541cbb26b1fe3228e80a8b6f@o4506736017539072.ingest.sentry.io/4506736027959296",
			integrations: [Sentry.browserTracingIntegration()],
			// Performance Monitoring
			tracesSampleRate: 1.0, //  Capture 100% of the transactions
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: [
				"localhost:5173",
				/^https:\/\/(dev.)?openaedmap\.org/,
			],
		});
	}
}

function shouldEnableSentry(): boolean {
	const doNotTrack =
		navigator.doNotTrack === "1" ||
		navigator.doNotTrack === "yes" ||
		navigator.doNotTrack === "true";
	const globalPrivacyControl =
		navigator.globalPrivacyControl === true ||
		navigator.globalPrivacyControl === "true";
	return !doNotTrack && !globalPrivacyControl;
}
