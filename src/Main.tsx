import React, {
    useEffect, Suspense, useState, useMemo,
} from "react";
// @ts-ignore
import { osmAuth } from "osm-auth";
import SiteNavbar from "./components/navbar";
import SidebarRight from "./components/sidebar-right";
import MapView from "./components/map";
import { initialModalState, ModalType } from "~/model/modal";
import { AppContext } from "~/appContext";
import CustomModal from "~/components/modal";
import { updateOsmUsernameState } from "~/osm";
import { AuthState } from "~/model/auth";
import SidebarAction from "~/model/sidebarAction";
import { DefibrillatorData } from "~/model/defibrillatorData";
import {Country} from "~/model/country";
import {fetchCountriesData} from "~/backend";
import {useLanguage} from "~/i18n";

function Main() {
    // some ui elements might depend on window size i.e. we don't want some stuff open by default on mobile
    const defaultRightSidebarState = window.innerWidth > 1024;

    const [modalState, setModalState] = useState(initialModalState);
    const [sidebarAction, setSidebarAction] = useState(SidebarAction.init);
    const [sidebarData, setSidebarData] = useState<DefibrillatorData | null>(null);
    const [rightSidebarShown, setRightSidebarShown] = useState(defaultRightSidebarState);
    const [countriesData, setCountriesData] = useState<Array<Country>>([]);
    const [countriesDataLanguage, setCountriesDataLanguage] = useState<string>("");

    const toggleRightSidebarShown = () => setRightSidebarShown(!rightSidebarShown);
    const closeRightSidebar = () => setRightSidebarShown(false);

    const { VITE_OSM_API_URL, VITE_OSM_OAUTH2_CLIENT_ID, VITE_OSM_OAUTH2_CLIENT_SECRET } = import.meta.env;
    const redirectPath = window.location.origin + window.location.pathname;
    const [auth] = useState(
        osmAuth({
            url: VITE_OSM_API_URL,
            client_id: VITE_OSM_OAUTH2_CLIENT_ID ?? "",
            client_secret: VITE_OSM_OAUTH2_CLIENT_SECRET ?? "",
            redirect_uri: `${redirectPath}land.html`,
            scope: "read_prefs write_api",
            auto: false,
            singlepage: false,
            apiUrl: VITE_OSM_API_URL,
        }),
    );
    const [osmUsername, setOsmUsername] = useState("");
    const [openChangesetId, setOpenChangesetId] = useState("");

    const handleLogIn = () => {
        auth.authenticate(() => {
            updateOsmUsernameState(auth, setOsmUsername);
            if (modalState.type === ModalType.NeedToLogin) {
                setModalState(initialModalState);
            }
        });
    };

    const handleLogOut = () => {
        auth.logout();
        setOsmUsername("");
    };

    const authState: AuthState = { auth, osmUsername };

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
        [authState, sidebarData, sidebarAction, modalState, handleLogIn, handleLogOut, countriesDataLanguage, countriesData],
    );
    useEffect(() => {
        if (auth.authenticated()) updateOsmUsernameState(auth, setOsmUsername);
    }, [auth]);
    return (
        <AppContext.Provider value={appContext}>
            <SiteNavbar toggleSidebarShown={toggleRightSidebarShown} />
            <CustomModal />
            { rightSidebarShown && <SidebarRight closeSidebar={closeRightSidebar} />}
            <MapView openChangesetId={openChangesetId} setOpenChangesetId={setOpenChangesetId} />
        </AppContext.Provider>
    );
}

function Fallback() {
    return <div className="fallback"><div className="fallback-header" /></div>;
}

export default function WrappedApp() {
    return (
        <Suspense fallback={<Fallback />}>
            <Main />
        </Suspense>
    );
}
