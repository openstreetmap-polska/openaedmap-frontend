import React from 'react';
import { Suspense, useState } from 'react';
import './Main.css';
import 'bulma/css/bulma.min.css';
import SiteNavbar from './components/navbar.js';
import SidebarRight from './components/sidebar-right.js';
import Map from './components/map.js';


function Main() {

    // init
    let defaultRightSidebarState = false;

    // some ui elements migth depend on window size i.e. we don't want some stuff open by default on mobile
    if (window.innerWidth > 1024) {
        defaultRightSidebarState = true;
    } else {
        defaultRightSidebarState = false;
    }

    const [sidebarShown, setSidebarShown] = useState(defaultRightSidebarState);
    const toggleSidebarShown = () => setSidebarShown(!sidebarShown);
    const closeSidebar = () => setSidebarShown(false);
    return (
        <>
            <SiteNavbar toggleSidebarShown={toggleSidebarShown} />
            { sidebarShown && <SidebarRight closeSidebar={closeSidebar} />}
            <Map />
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
