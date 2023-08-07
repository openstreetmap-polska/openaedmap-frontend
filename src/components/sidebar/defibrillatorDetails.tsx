import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
    Card, Columns, Image,
} from "react-bulma-components";
import {
    mdiAccountSupervisorOutline, mdiClockOutline, mdiHomeRoof,
    mdiInformationOutline, mdiMapMarkerOutline, mdiPhoneOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
    CloseSidebarButton,
    CopyUrlButton, EditButton,
    EditIdButton,
    GoogleMapsNavigationButton,
    OpenStreetMapNavigationButton,
    ViewButton,
} from "./buttons";
import { OpeningHoursField } from "./openingHours";
import { CheckDateField } from "./verificationDate";
import { DefibrillatorData } from "../../model/defibrillatorData";
import DetailTextRow from "./detailTextRow";

const accessToColourMapping = {
    yes: "has-background-green has-text-white-ter",
    no: "has-background-red has-text-white-ter",
    private: "has-background-blue has-text-white-ter",
    permissive: "has-background-blue has-text-white-ter",
    customers: "has-background-yellow has-text-black-ter",
    default: "has-background-gray has-text-white-ter",
};

function accessColourClass(access: string): string {
    if (access in accessToColourMapping) {
        return accessToColourMapping[access as keyof typeof accessToColourMapping];
    }
    return accessToColourMapping.default;
}

const DefibrillatorDetails: FC<DefibrillatorDetailsProps> = (props) => {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    const {
        data, closeSidebar,
    } = props;
    if (data === null) return null;
    const accessText = data.tags.access ? ` - ${t(`access.${data.tags.access}`)}` : "";
    const defibrillatorLocation = data.tags[`defibrillator:location:${resolvedLanguage}`]
        || data.tags["defibrillator:location"];
    const levelText = data.tags.level ? ` (${t("sidebar.level")}: ${data.tags.level})` : "";
    const indoorText = data.tags.indoor ? t(`indoor.${data.tags.indoor}`) + levelText : "";
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
                <Card.Content pl={3} pr={3} mb={1} pt={4} className="content pb-0">
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiHomeRoof} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <DetailTextRow text={indoorText} translationId="sidebar.indoor" />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiMapMarkerOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <DetailTextRow text={defibrillatorLocation} translationId="sidebar.location" />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiClockOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <OpeningHoursField openingHours={data.tags.opening_hours} lat={data.lat} lon={data.lon} />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiPhoneOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <DetailTextRow text={data.tags.phone} translationId="sidebar.contact_number" />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiAccountSupervisorOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <DetailTextRow text={data.tags.operator} translationId="sidebar.operator" />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile pb-0 mb-0">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiInformationOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <DetailTextRow
                                text={data.tags[`description:${resolvedLanguage}`] || data.tags.description}
                                translationId="sidebar.description"
                            />
                        </Columns.Column>
                    </Columns>
                    <CheckDateField check_date={data.tags.check_date} />
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item className="has-background-white-ter">
                        <CopyUrlButton />
                        <ViewButton osmId={data.osmId} />
                        <EditButton osmId={data.osmId} />
                        <EditIdButton osmId={data.osmId} />
                    </Card.Footer.Item>
                </Card.Footer>
                <Card.Footer>
                    <Card.Footer.Item className="has-background-white-ter">
                        <OpenStreetMapNavigationButton lat={data.lat} lon={data.lon} />
                        <GoogleMapsNavigationButton lat={data.lat} lon={data.lon} />
                    </Card.Footer.Item>
                </Card.Footer>
            </Card>
        </div>
    );
};

interface DefibrillatorDetailsProps {
    data: DefibrillatorData | null,
    closeSidebar: () => void,
}

export default DefibrillatorDetails;
