import React from 'react';
import { Suspense, useState } from 'react';
import './Main.css';
import 'bulma/css/bulma.min.css';
import SiteNavbar from './components/navbar.js';
import SidebarRight from './components/sidebar-right.js';
import Map from './components/map.js';
import FooterDiv from './components/footer';


function Main() {

    // init
    let defaultRightSidebarState = false;

    // some ui elements migth depend on window size i.e. we don't want some stuff open by default on mobile
    if (window.innerWidth > 1024) {
        defaultRightSidebarState = true;
    } else {
        defaultRightSidebarState = false;
    }

    const [rightSidebarShown, setRightSidebarShown] = useState(defaultRightSidebarState);
    const toggleRightSidebarShown = () => setRightSidebarShown(!rightSidebarShown);
    const closeRightSidebar = () => setRightSidebarShown(false);
    return (
        <>
            <SiteNavbar toggleSidebarShown={toggleRightSidebarShown} />
            { rightSidebarShown && <SidebarRight closeSidebar={closeRightSidebar} />}
            <Map />
            <FooterDiv />
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
