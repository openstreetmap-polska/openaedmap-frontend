import React from 'react';
import { Card } from 'react-bulma-components';
import DownloadCard from './downloadCard.js';
import MapLegend from "./legend";
import './sidebar.css';
import { CloseSidebarButton } from './sidebar/buttons';

export default function SidebarRight({ closeSidebar }) {
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