import React, { FC } from "react";
import { Button, Card, Image } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import { DefibrillatorData } from "src/model/defibrillatorData";
import SidebarAction from "src/model/sidebarAction";
import { CloseSidebarButton } from "./buttons";
import { accessColourClass } from "./access";
import { useAppContext } from "../../appContext";
import { backendBaseUrl } from "../../backend";

interface DefibrillatorDetailsProps {
    data: DefibrillatorData | null,
    closeSidebar: () => void,
}

const PhotoReport: FC<DefibrillatorDetailsProps> = (props) => {
    const { t } = useTranslation();
    const {
        data, closeSidebar,
    } = props;
    const { setSidebarAction } = useAppContext();
    if (data === null) return null;
    const accessText = data.tags.access ? ` - ${t(`access.${data.tags.access}`)}` : "";
    const sendReport = (photoId: string | undefined) => {
        if (photoId === undefined) {
            console.error("Photo id is undefined. Report issue to the maintainers.");
            return;
        }
        console.log("Reported photo:", photoId);
        fetch(`${backendBaseUrl}/api/v1/photos/report`, {
            method: "POST",
            body: `id=${encodeURIComponent(photoId)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        })
            .then(() => console.log("uploaded")) // todo: add error handling
            .catch((error) => console.log(error));
        closeSidebar();
    };

    return (
        <div className="sidebar" id="sidebar-div">
            <Card>
                <Card.Header
                    id="sidebar-header"
                    shadowless
                    className={accessColourClass(data.tags.access)}
                    alignItems="center"
                >
                    <Image m={2} className="icon" src="./img/logo-aed.svg" color="white" alt="" size={48} />
                    <span
                        className="is-size-5 py-2 has-text-weight-light"
                        id="sidebar-caption"
                    >
                        {t("sidebar.caption_info") + accessText}
                    </span>
                    <CloseSidebarButton closeSidebarFunction={closeSidebar} />
                </Card.Header>
                <Card.Content>
                    <Button m={2} onClick={() => setSidebarAction(SidebarAction.showDetails)}>{t("cancel")}</Button>
                    <Button m={2} onClick={() => sendReport(data.photoId)}>{t("photo.send_report")}</Button>
                </Card.Content>
            </Card>
        </div>
    );
};

export default PhotoReport;
