import { osmAuth } from "osm-auth";
import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { AppContext } from "~/appContext";
import CustomModal from "~/components/modal";
import WebGLMissingInfo from "~/components/webGLMissingInfo";
import type { AuthState } from "~/model/auth";
import type { Country } from "~/model/country";
import type { DefibrillatorData } from "~/model/defibrillatorData";
import { ModalType, initialModalState } from "~/model/modal";
import SidebarAction from "~/model/sidebarAction";
import { updateOsmUsernameState } from "~/osm";
import MapView from "./components/map";
import SiteNavbar from "./components/navbar";
import SidebarRight from "./components/sidebar-right";
import { webglSupported } from "./webgl";

function Main() {
	// some ui elements might depend on window size i.e. we don't want some stuff open by default on mobile
	const defaultRightSidebarState = window.innerWidth > 1024;

	const [modalState, setModalState] = useState(initialModalState);
	const [sidebarAction, setSidebarAction] = useState(SidebarAction.init);
	const [sidebarData, setSidebarData] = useState<DefibrillatorData | null>(
		null,
	);
	const [rightSidebarShown, setRightSidebarShown] = useState(
		defaultRightSidebarState,
	);
	const [countriesData, setCountriesData] = useState<Array<Country>>([]);
	const [countriesDataLanguage, setCountriesDataLanguage] =
		useState<string>("");

	const toggleRightSidebarShown = () =>
		setRightSidebarShown(!rightSidebarShown);
	const closeRightSidebar = () => setRightSidebarShown(false);

	const { VITE_OSM_API_URL, VITE_OSM_AUTH_URL, VITE_OSM_OAUTH2_CLIENT_ID } =
		import.meta.env;
	const [auth] = useState(
		new osmAuth({
			url: VITE_OSM_AUTH_URL ?? VITE_OSM_API_URL,
			client_id: VITE_OSM_OAUTH2_CLIENT_ID ?? "",
			redirect_uri: window.location.origin.endsWith("/")
				? window.location.origin
				: `${window.location.origin}/`,
			scope: "read_prefs write_api",
			auto: false,
			singlepage: true,
			apiUrl: VITE_OSM_API_URL,
		}),
	);
	const [osmUsername, setOsmUsername] = useState("");
	const [openChangesetId, setOpenChangesetId] = useState("");

	const handleLogIn = useCallback(() => {
		auth.authenticate(() => {
			updateOsmUsernameState(auth, setOsmUsername);
			if (modalState.type === ModalType.NeedToLogin) {
				setModalState(initialModalState);
			}
			window.history.pushState(
				{},
				"",
				window.location.origin +
					window.location.pathname +
					window.location.hash,
			);
		});
	}, [auth, modalState.type]);

	useEffect(() => {
		if (
			window.location.search
				.slice(1)
				.split("&")
				.some((p) => p.startsWith("code="))
		) {
			handleLogIn();
		}
	}, [handleLogIn]);

	const handleLogOut = useCallback(() => {
		auth.logout();
		setOsmUsername("");
	}, [auth]);

	const authState: AuthState = useMemo<AuthState>(
		() => ({ auth, osmUsername }),
		[osmUsername, auth],
	);

	const appContext = useMemo(
		() => ({
			authState,
			modalState,
			setModalState,
			handleLogIn,
			handleLogOut,
			sidebarAction,
			setSidebarAction,
			sidebarData,
			setSidebarData,
			countriesData,
			setCountriesData,
			countriesDataLanguage,
			setCountriesDataLanguage,
		}),
		[
			authState,
			sidebarData,
			sidebarAction,
			modalState,
			handleLogIn,
			handleLogOut,
			countriesDataLanguage,
			countriesData,
		],
	);
	useEffect(() => {
		if (auth.authenticated()) updateOsmUsernameState(auth, setOsmUsername);
	}, [auth]);
	return (
		<AppContext.Provider value={appContext}>
			<SiteNavbar toggleSidebarShown={toggleRightSidebarShown} />
			<CustomModal />
			{rightSidebarShown && <SidebarRight closeSidebar={closeRightSidebar} />}
			{webglSupported() ? (
				<MapView
					openChangesetId={openChangesetId}
					setOpenChangesetId={setOpenChangesetId}
				/>
			) : (
				<WebGLMissingInfo />
			)}
		</AppContext.Provider>
	);
}

function Fallback() {
	return (
		<div className="fallback">
			<div className="fallback-header" />
		</div>
	);
}

export default function WrappedApp() {
	return (
		<Suspense fallback={<Fallback />}>
			<Main />
		</Suspense>
	);
}
