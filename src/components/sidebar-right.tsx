import React from 'react';
import { Card } from 'react-bulma-components';
//import DownloadCard from './downloadCard';
import MapLegend from "./legend";
import './sidebar.css';
import { CloseSidebarButton } from './sidebar/buttons';

export default function SidebarRight({ closeSidebar }: { closeSidebar: () => void }) {
    return (
        <div className='sidebar-right'>
            <Card>
                <Card.Content p={1}>
                    <CloseSidebarButton closeSidebarFunction={closeSidebar} />
                    {/** <DownloadCard /> **/}
                    <MapLegend />
                </Card.Content>
            </Card>
        </div>
    );
}
