import React from 'react';
import './sidebar.css';
import DownloadCard from './downloadCard.js';
import {useTranslation} from "react-i18next";
import MapLegend from "./legend";
import { CloseSidebarButton } from './sidebar/buttons';
import { Card } from 'react-bulma-components';

export default function SidebarRight({ closeSidebar }) {
    const { t } = useTranslation();
    return (
        <div className='sidebar-right'>
            <Card>
                <Card.Content p={1}>
                    <CloseSidebarButton closeSidebarFunction={closeSidebar} margins={"mr-2 ml-1 mt-5"} />
                    <DownloadCard />
                    <MapLegend />
                </Card.Content>
            </Card>
        </div>
    );
}