import React, {
    useEffect, Suspense, useState, useMemo,
} from "react";
import "./Main.css";
import "bulma/css/bulma.min.css";
// @ts-ignore
import { osmAuth } from "osm-auth";
import SiteNavbar from "./components/navbar";
import SidebarRight from "./components/sidebar-right";
import Map from "./components/map";

// @ts-ignore
import { initialModalState, ModalType } from "./model/modal";
import { AppContext } from "./appContext";
import CustomModal from "./components/modal";
import { updateOsmUsernameState } from "./osm";
import { AuthState } from "./model/auth";
import SidebarAction from "./model/sidebarAction";
import { DefibrillatorData } from "./model/defibrillatorData";

function Main() {
    // some ui elements might depend on window size i.e. we don't want some stuff open by default on mobile
    const defaultRightSidebarState = window.innerWidth > 1024;

    const [modalState, setModalState] = useState(initialModalState);
    const [sidebarAction, setSidebarAction] = useState(SidebarAction.init);
    const [sidebarData, setSidebarData] = useState<DefibrillatorData | null>(null);
    const [rightSidebarShown, setRightSidebarShown] = useState(defaultRightSidebarState);

    const toggleRightSidebarShown = () => setRightSidebarShown(!rightSidebarShown);
    const closeRightSidebar = () => setRightSidebarShown(false);

    const { REACT_APP_OSM_API_URL, REACT_APP_OSM_OAUTH2_CLIENT_ID, REACT_APP_OSM_OAUTH2_CLIENT_SECRET } = process.env;
    const redirectPath = window.location.origin + window.location.pathname;
    const [auth] = useState(
        osmAuth({
            url: REACT_APP_OSM_API_URL,
            client_id: REACT_APP_OSM_OAUTH2_CLIENT_ID || "",
            client_secret: REACT_APP_OSM_OAUTH2_CLIENT_SECRET || "",
            redirect_uri: `${redirectPath}land.html`,
            scope: "read_prefs write_api",
            auto: false,
            singlepage: false,
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
        }),
        [authState],
    );
    useEffect(() => {
        if (auth.authenticated()) updateOsmUsernameState(auth, setOsmUsername);
    }, [auth]);
    return (
        <AppContext.Provider value={appContext}>
            <SiteNavbar toggleSidebarShown={toggleRightSidebarShown} />
            <CustomModal />
            { rightSidebarShown && <SidebarRight closeSidebar={closeRightSidebar} />}
            <Map openChangesetId={openChangesetId} setOpenChangesetId={setOpenChangesetId} />
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
