import 'bulma/css/bulma.min.css';
import i18n from 'i18next';
import React from "react";
import { Card, Image } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import '../Main.css';
import './sidebar.css';
import { CopyUrlButton, EditButton, ViewButton } from './sidebar/buttons';
import { ContactNumberField } from "./sidebar/contactNumber";
import { DescriptionField } from "./sidebar/description";
import { IndoorField } from "./sidebar/indoor";
import { LocationField } from "./sidebar/location";
import { NoteField } from "./sidebar/note";
import { OpeningHoursField } from "./sidebar/openingHours";
import { OperatorField } from "./sidebar/operator";


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
            <button
              aria-label={t('sidebar.close')}
              className='delete is-large is-pulled-right mr-3 ml-6'
              onClick={closeSidebar}
            />
          </Card.Header>
          <Card.Content py={3} >
            <div className="content" id="sidebar-content-div">
              <IndoorField indoor={data.indoor} />
              <LocationField description={
                data[`defibrillator_location_${i18n.resolvedLanguage}`] || data["defibrillator_location"]
              } />
              <OpeningHoursField openingHours={data.opening_hours} />
              <DescriptionField description={
                data[`description_${i18n.resolvedLanguage}`] || data["description"]
              } />
              <ContactNumberField contactNumber={data.phone} />
              <OperatorField operator={data.operator} />
              <NoteField note={
                data[`note_${i18n.resolvedLanguage}`] || data["note"]
              } />
            </div>
          </Card.Content>
          <Card.Footer>
            <Card.Footer.Item className="has-background-success-light">
              <CopyUrlButton />
              <ViewButton osmId={data.osm_id} />
              <EditButton osmId={data.osm_id} />
            </Card.Footer.Item>
            {/* <div
                className="has-background-success-light card-footer-item is-block has-text-centered is-size-7 has-text-weight-semibold p-1"
                id="sidebar-footer-button-left">
                <a className="has-background-success-light card-footer-item has-text-centered is-size-7 has-text-weight-semibold"
                  href="#" rel="noopener"
                  target="_blank"></a>
              </div> */}
          </Card.Footer>
        </Card>
      </div>
    )
  } else if (action === "addNode") {
    console.log(`Action: '${action}' not implemented.`)
  } else if (action === "init") {
    return <div id="sidebar-div"></div>
  } else {
    console.log(`Unknown action: '${action}'.`)
  }
}
