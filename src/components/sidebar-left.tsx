import type { Marker } from "maplibre-gl";
import React, { type FC } from "react";
import type { DefibrillatorData } from "~/model/defibrillatorData";
import SidebarAction from "~/model/sidebarAction";
import "./sidebar.css";
import DefibrillatorDetails from "./sidebar/defibrillatorDetails";
import DefibrillatorEditor from "./sidebar/defibrillatorEditor";
import PhotoReport from "./sidebar/photoReporter";
import PhotoUpload from "./sidebar/photoUploader";

const SidebarLeft: FC<SidebarLeftProps> = (props) => {
	const {
		action,
		data,
		closeSidebar,
		visible,
		marker,
		openChangesetId,
		setOpenChangesetId,
	} = props;

	if (!visible) return null;

	switch (action) {
		case SidebarAction.init:
			return null;
		case SidebarAction.showDetails:
			return <DefibrillatorDetails data={data} closeSidebar={closeSidebar} />;
		case SidebarAction.addNode:
			if (marker === null) {
				console.error("Marker shouldn't be null");
				return null;
			}
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
		case SidebarAction.reportPhoto:
			return <PhotoReport data={data} closeSidebar={closeSidebar} />;
		case SidebarAction.uploadPhoto:
			return <PhotoUpload data={data} closeSidebar={closeSidebar} />;
		default:
			return null;
	}
};

interface SidebarLeftProps {
	action: SidebarAction;
	data: DefibrillatorData | null;
	closeSidebar: () => void;
	visible: boolean;
	marker: Marker | null;
	openChangesetId: string;
	setOpenChangesetId: (changesetId: string) => void;
}

export default SidebarLeft;
