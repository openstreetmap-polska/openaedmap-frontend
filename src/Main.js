import React from 'react';
import { Suspense, useState } from 'react';
import './Main.css';
import 'bulma/css/bulma.min.css';
import SiteNavbar from './components/navbar.js';
import Sidebar from './components/sidebar.js';
import Map from './components/map.js';


function Main() {
    const [sidebarShown, setSidebarShown] = useState(true);
    const toggleSidebarShown = () => setSidebarShown(!sidebarShown);
    const closeSidebar = () => setSidebarShown(false);
    return (
        <>
            <SiteNavbar toggleSidebarShown={toggleSidebarShown} />
            { sidebarShown && <Sidebar closeSidebar={closeSidebar} />}
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
