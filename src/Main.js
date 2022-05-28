import React from 'react';
import { Suspense } from 'react';
import './Main.css';
import SiteNavbar from './components/navbar.js';
import Map from './components/map.js';


function Main() {
    return (
        <div className="Main">
            <SiteNavbar />
            <Map />
        </div>
    );
}

export default function WrappedApp() {
    return (
        <Suspense fallback="...is loading">
            <Main />
        </Suspense>
    );
}
