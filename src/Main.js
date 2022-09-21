import React from 'react';
import { Suspense, useState } from 'react';
import './Main.css';
import 'bulma/css/bulma.min.css';
import SiteNavbar from './components/navbar.js';
import SidebarRight from './components/sidebar-right';
import Map from './components/map.js';

// Type declaration in this package is broken. I had to disable it.
import { osmAuth } from 'osm-auth';
import { CustomModal } from './components/modal'


function Main() {

    // some ui elements might depend on window size i.e. we don't want some stuff open by default on mobile
    const defaultRightSidebarState = window.innerWidth > 1024;

    const [modalState, setModalState] = useState({visible: false});
    const [rightSidebarShown, setRightSidebarShown] = useState(defaultRightSidebarState);
    const toggleRightSidebarShown = () => setRightSidebarShown(!rightSidebarShown);
    const closeRightSidebar = () => setRightSidebarShown(false);

    const { REACT_APP_OSM_API_URL, REACT_APP_OSM_OAUTH2_CLIENT_ID, REACT_APP_OSM_OAUTH2_CLIENT_SECRET } = process.env;
    const redirectPath = window.location.origin + window.location.pathname;
    // eslint-disable-next-line no-unused-vars
    const [auth, setAuth] = useState(
        osmAuth({
            url: REACT_APP_OSM_API_URL,
            client_id: REACT_APP_OSM_OAUTH2_CLIENT_ID,
            client_secret: REACT_APP_OSM_OAUTH2_CLIENT_SECRET,
            redirect_uri: redirectPath + "land.html",
            scope: "read_prefs write_api",
            auto: false,
            singlepage: false,
        })
    )
    const [openChangesetId, setOpenChangesetId] = useState(null);

    return (
        <>
            <SiteNavbar toggleSidebarShown={toggleRightSidebarShown} auth={auth} setModalState={setModalState} />
            <CustomModal state={modalState} setModalState={setModalState} />
            { rightSidebarShown && <SidebarRight closeSidebar={closeRightSidebar} />}
            <Map auth={auth} openChangesetId={openChangesetId} setOpenChangesetId={setOpenChangesetId} modalState={modalState} setModalState={setModalState} />
        </>
    );
}

export default function WrappedApp() {
    return (
        <Suspense fallback="...is loading">
            <Main />
        </Suspense>
    );
}
