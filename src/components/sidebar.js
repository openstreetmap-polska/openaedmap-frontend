import React from 'react';
import './sidebar.css';
import DownloadCard from './downloadCard.js';
import {useTranslation} from "react-i18next";
import MapLegend from "./legend";

export default function Sidebar({ closeSidebar }) {
    const { t } = useTranslation();
    return (
        <div className='sidebar-right'>
            <div className='card'>
                <div className='columns is-vcentered is-flex mr-0 is-pulled-right'>
                    <button
                        aria-label={t('sidebar.close')}
                        className='delete is-medium is-hidden-touch is-pulled-right close-button mr-2 mt-5'
                        onClick={closeSidebar}
                    />
                    <button
                        aria-label={t('sidebar.close')}
                        className='delete is-large is-hidden-desktop is-pulled-right close-button mr-2 mt-5'
                        onClick={closeSidebar}
                    />
                </div>
                <DownloadCard />
                <MapLegend />
            </div>
        </div>
    );
}