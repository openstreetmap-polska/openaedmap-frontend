import React, { FC, useState } from "react";
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

const PhotoUpload: FC<DefibrillatorDetailsProps> = (props) => {
    const { t } = useTranslation();
    const {
        data, closeSidebar,
    } = props;
    const { authState: { auth }, setSidebarAction } = useAppContext();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    if (data === null) return null;
    const accessText = data.tags.access ? ` - ${t(`access.${data.tags.access}`)}` : "";

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
                    {selectedImage !== null && (
                        <div>
                            <img
                                alt="not found"
                                width="250px"
                                src={URL.createObjectURL(selectedImage)}
                            />
                            <br />
                            <Button onClick={() => setSelectedImage(null)}>{t("photo.remove")}</Button>
                            <Button
                                m={2}
                                onClick={() => {
                                    console.log(selectedImage);
                                    const fd = new FormData();
                                    fd.append("node_id", data.osmId);
                                    fd.append("file_license", "CC0");
                                    fd.append(
                                        "oauth2_credentials",
                                        JSON.stringify({ access_token: auth?.options().access_token || "test" }),
                                    );
                                    fd.append("file", selectedImage);
                                    fetch(`${backendBaseUrl}/api/v1/photos/upload`, {
                                        method: "POST",
                                        body: fd,
                                    })
                                        .then(() => console.log("uploaded")) // todo: add error handling
                                        .catch((error) => console.log(error));
                                }}
                            >
                                {t("photo.upload_photo")}
                            </Button>
                        </div>
                    )}
                    <input
                        type="file"
                        name="myImage"
                        onChange={(event) => {
                            const { files } = event.target;
                            console.log(files);
                            setSelectedImage(files !== null && files.length > 0 ? files[0] : null);
                        }}
                    />
                </Card.Content>
            </Card>
        </div>
    );
};

export default PhotoUpload;
