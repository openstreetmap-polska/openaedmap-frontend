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
    CopyUrlButton,
    EditButton,
    GoogleMapsNavigationButton,
    OpenStreetMapNavigationButton,
    ViewButton,
} from "./buttons";
import { IndoorField } from "./indoor";
import { LocationField } from "./location";
import { OpeningHoursField } from "./openingHours";
import { ContactNumberField } from "./contactNumber";
import OperatorField from "./operator";
import DescriptionField from "./description";
import { CheckDateField } from "./verificationDate";
import { NodeData } from "../../model/nodeData";

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
    const defibrillatorLocation = data.tags[`defibrillator_location_${resolvedLanguage}`]
        || data.tags.defibrillator_location;
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
                            <IndoorField indoor={data.tags.indoor} level={data.tags.level} />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiMapMarkerOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <LocationField description={defibrillatorLocation} />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiClockOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <OpeningHoursField openingHours={data.tags.opening_hours} />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiPhoneOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <ContactNumberField contactNumber={data.tags.phone} />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiAccountSupervisorOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <OperatorField operator={data.tags.operator} />
                        </Columns.Column>
                    </Columns>
                    <Columns vCentered className="is-mobile pb-0 mb-0">
                        <Columns.Column textAlign="center" size={2}>
                            <Icon path={mdiInformationOutline} size={1.15} className="icon" color="#028955" />
                        </Columns.Column>
                        <Columns.Column className="py-1">
                            <DescriptionField
                                description={data.tags[`description_${resolvedLanguage}`] || data.tags.description}
                            />
                        </Columns.Column>
                    </Columns>
                    <CheckDateField check_date={data.tags.check_date} />
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item className="has-background-white-ter">
                        <CopyUrlButton />
                        <ViewButton osmId={data.osm_id} />
                        <EditButton osmId={data.osm_id} />
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
    data: NodeData | null,
    closeSidebar: () => void,
}

export default DefibrillatorDetails;