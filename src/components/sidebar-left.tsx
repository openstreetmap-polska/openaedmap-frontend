import "bulma/css/bulma.min.css";
import React, { FC } from "react";
import "../Main.css";
import "./sidebar.css";
import { Marker } from "maplibre-gl";
import DefibrillatorDetails from "./sidebar/defibrillatorDetails";
import SidebarAction from "../model/sidebarAction";
import DefibrillatorEditor from "./sidebar/defibrillatorEditor";
import { DefibrillatorData } from "../model/defibrillatorData";

const SidebarLeft: FC<SidebarLeftProps> = (props) => {
    const {
        action, data, closeSidebar, visible, marker, openChangesetId, setOpenChangesetId,
    } = props;

    console.log("Opening left sidebar with action: ", action, " and data:", data);

    if (!visible) return null;

    switch (action) {
        case SidebarAction.init:
            return null;
        case SidebarAction.showDetails:
            return <DefibrillatorDetails data={data} closeSidebar={closeSidebar} />;
        case SidebarAction.addNode:
            return (
                <DefibrillatorEditor
                    closeSidebar={closeSidebar}
                    marker={marker}
                    openChangesetId={openChangesetId}
                    setOpenChangesetId={setOpenChangesetId}
                    data={data}
                />
            );
        case SidebarAction.editNode:
            return (
                <DefibrillatorEditor
                    closeSidebar={closeSidebar}
                    marker={marker}
                    openChangesetId={openChangesetId}
                    setOpenChangesetId={setOpenChangesetId}
                    data={data}
                />
            );
        default:
            return null;
    }
};

interface SidebarLeftProps {
    action: SidebarAction,
    data: DefibrillatorData | null,
    closeSidebar: () => void,
    visible: boolean,
    marker: Marker,
    openChangesetId: string,
    setOpenChangesetId: (changesetId: string) => void,
}

export default SidebarLeft;