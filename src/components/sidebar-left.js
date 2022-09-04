import 'bulma/css/bulma.min.css';
import i18n from 'i18next';
import React from "react";
import { Card, Image } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import '../Main.css';
import './sidebar.css';
import { CloseSidebarButton, CopyUrlButton, EditButton, ViewButton, AddAedButton } from './sidebar/buttons';
import { ContactNumberField } from "./sidebar/contactNumber";
import { DescriptionField } from "./sidebar/description";
import { IndoorField, IndoorFormField } from "./sidebar/indoor";
import { LocationField, LocationFormField } from "./sidebar/location";
import { NoteField } from "./sidebar/note";
import { OpeningHoursField } from "./sidebar/openingHours";
import { OperatorField } from "./sidebar/operator";
import { AccessFormField } from "./sidebar/access";


const accessToColourMapping = {
  'yes': 'has-background-green',
  'no': 'has-background-grey',
  'private': 'has-background-link-dark',
  'permissive': 'has-background-link-dark',
  'customers': 'has-background-link-dark',
  'default': 'has-background-grey',
};

function accessColourClass(access) {
  return accessToColourMapping[access] || accessToColourMapping['default'];
}


export default function SidebarLeft({ action, data, closeSidebar, visible }) {
  const { t } = useTranslation();

  console.log("Opening left sidebar with action: ", action, " and data:", data);

  if (action === "showDetails") {

    const accessText = data.access ? " - " + t(`access.${data.access}`) : ""

    return (
      <div className={visible ? "sidebar" : "sidebar is-invisible"} id="sidebar-div">
        <Card>
          <Card.Header id="sidebar-header" className={accessColourClass(data.access)} alignItems="center">
            <Image m={2} className='icon' src="./img/logo-aed.svg" color="white" alt="" size={48} />
            <span
              className="is-size-5 mr-3 has-text-white-ter has-text-weight-light"
              id="sidebar-caption">
              {t('sidebar.caption_info') + accessText}
            </span>
            <CloseSidebarButton closeSidebarFunction={closeSidebar} margins={"mr-3 ml-6"} />
          </Card.Header>
          <Card.Content py={3} className="content">
            <IndoorField indoor={data.indoor} />
            <LocationField description={data[`defibrillator_location_${i18n.resolvedLanguage}`] || data["defibrillator_location"]} />
            <OpeningHoursField openingHours={data.opening_hours} />
            <DescriptionField description={data[`description_${i18n.resolvedLanguage}`] || data["description"]} />
            <ContactNumberField contactNumber={data.phone} />
            <OperatorField operator={data.operator} />
            <NoteField note={data[`note_${i18n.resolvedLanguage}`] || data["note"]} />
          </Card.Content>
          <Card.Footer>
            <Card.Footer.Item className="has-background-success-light">
              <CopyUrlButton />
              <ViewButton osmId={data.osm_id} />
              <EditButton osmId={data.osm_id} />
            </Card.Footer.Item>
          </Card.Footer>
        </Card>
      </div>
    )
  } else if (action === "addNode") {
    return (
    <div className={visible ? "sidebar" : "sidebar is-invisible"} id="sidebar-div">
      <Card>
        <Card.Header id="sidebar-header" className="has-background-grey" alignItems="center">
          <Image m={2} className='icon' src="./img/logo-aed.svg" color="white" alt="" size={48} />
          <span className="is-size-5 mr-3 has-text-white-ter has-text-weight-light">
            {t('sidebar.add_defibrillator')}
          </span>
          <CloseSidebarButton closeSidebarFunction={closeSidebar} margins={"mr-3 ml-6"} />
        </Card.Header>
        <Card.Content py={3} className="content">
          <form>
            <AccessFormField/>
            <IndoorFormField/>
            <LocationFormField lang={i18n.resolvedLanguage} />
          </form>
        </Card.Content>
        <Card.Footer>
          <Card.Footer.Item className="has-background-success-light">
            <AddAedButton />
          </Card.Footer.Item>
        </Card.Footer>
      </Card>
    </div>
    )
  } else if (action === "init") {
    return <div id="sidebar-div"></div>
  } else {
    console.log(`Unknown action: '${action}'.`)
  }
}
