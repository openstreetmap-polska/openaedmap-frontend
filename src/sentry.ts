import * as Sentry from "@sentry/react";

export default function initSentry() {
	if (shouldEnableSentry()) {
		Sentry.init({
			dsn: "https://4499d52ff3734be1b204d9f13353ae4c@glitch.openaedmap.org/2",
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
	// @ts-ignore
	const globalPrivacyControl = // @ts-ignore
		navigator.globalPrivacyControl === true || // @ts-ignore
		navigator.globalPrivacyControl === "true";
	return !doNotTrack && !globalPrivacyControl;
}
