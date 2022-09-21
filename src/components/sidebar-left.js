import 'bulma/css/bulma.min.css';
import i18n from 'i18next';
import React from "react";
import { Card, Image } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import '../Main.css';
import './sidebar.css';
import { CloseSidebarButton, CopyUrlButton, EditButton, ViewButton, AddAedButton } from './sidebar/buttons';
import { ContactNumberField, ContactPhoneFormField } from "./sidebar/contactNumber";
import { DescriptionField } from "./sidebar/description";
import { IndoorField, IndoorFormField } from "./sidebar/indoor";
import { LocationField, LocationFormField } from "./sidebar/location";
import { NoteField } from "./sidebar/note";
import { OpeningHoursField } from "./sidebar/openingHours";
import { OperatorField } from "./sidebar/operator";
import { AccessFormField } from "./sidebar/access";
import { getOpenChangesetId, addDefibrillatorToOSM } from '../osm';


const accessToColourMapping = {
  'yes': 'has-background-green',
  'no': 'has-background-grey',
  'private': 'has-background-blue',
  'permissive': 'has-background-blue',
  'customers': 'has-background-yellow',
  'default': 'has-background-gray',
};

function accessColourClass(access) {
  return accessToColourMapping[access] || accessToColourMapping['default'];
}

const parseForm = (formElements) => {
  let tags = {};
  // access
  const access = Array.from(formElements.aedAccess).filter(x => x.checked)
  if (access.length === 1) tags[access[0].attributes.tag.value] = access[0].attributes.value.value;
  //indoor
  const indoor = Array.from(formElements.aedIndoor).filter(x => x.checked)
  if (indoor.length === 1) tags[indoor[0].attributes.tag.value] = indoor[0].attributes.value.value;
  // location
  const location = formElements.aedLocation;
  if (location.value.trim()) tags[location.attributes.tag.value] = location.value.trim();
  //phone
  const phone = formElements.aedPhone;
  if (phone.value.trim()) tags[phone.attributes.tag.value] = phone.value.trim();

  return tags
}


export default function SidebarLeft({ action, data, closeSidebar, visible, marker, auth, openChangesetId, setOpenChangesetId, modalState, setModalState }) {
  const { t } = useTranslation();

  console.log("Opening left sidebar with action: ", action, " and data:", data);

  if (action === "showDetails") {

    const accessText = data.access ? " - " + t(`access.${data.access}`) : ""

    return (
      <div className={visible ? "sidebar" : "sidebar is-invisible"} id="sidebar-div">
        <Card>
          <Card.Header id="sidebar-header" shadowless="1" className={accessColourClass(data.access)} alignItems="center">
            <Image m={2} className='icon' src="./img/logo-aed.svg" color="white" alt="" size={48} />
            <span
              className="is-size-5 py-2 has-text-white-ter has-text-weight-light"
              id="sidebar-caption">
              {t('sidebar.caption_info') + accessText}
            </span>
            <CloseSidebarButton closeSidebarFunction={closeSidebar} />
          </Card.Header>
          <Card.Content pt={3} pb={1} className="content">
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

    const sendFormData = (event) => {
      event.preventDefault();
      event.target.classList.add("is-loading");
      const lngLat = marker.getLngLat();
      const tags = parseForm(event.target.form.elements);
      const data = {
        lng: lngLat.lng,
        lat: lngLat.lat,
        tags: tags,
      };
      console.log(lngLat);
      console.log(tags);
      getOpenChangesetId(auth, openChangesetId, setOpenChangesetId, i18n.resolvedLanguage)
        .then(changesetId => {
            return addDefibrillatorToOSM(auth, changesetId, data);
        })
        .then(newNodeId => {
          event.target.classList.remove("is-loading");
          closeSidebar();
          console.log("created new node with id: ", newNodeId);
          setModalState({visible: true, type: "nodeAddedSuccessfully", nodeId: newNodeId});
        })
        .catch(err => {
          event.target.classList.remove("is-loading");
          closeSidebar();
          console.log(err);
          const errorMessage = `${err} <br> status: ${err.status} ${err.statusText} <br> ${err.response}`;
          setModalState({visible: true, type: "error", errorMessage: errorMessage});
        });
    }
    return (
    <div className={visible ? "sidebar" : "sidebar is-invisible"} id="sidebar-div">
      <Card>
        <Card.Header id="sidebar-header" className="has-background-grey" shadowless="1" alignItems="center">
          <Image m={2} className='icon' src="./img/logo-aed.svg" color="white" alt="" size={48} />
          <span className="is-size-5 mr-3 has-text-white-ter has-text-weight-light">
            {t('sidebar.add_defibrillator')}
          </span>
          <CloseSidebarButton closeSidebarFunction={closeSidebar} />
        </Card.Header>
        <Card.Content pt={4} className="content">
          <form>
            <AccessFormField/>
            <IndoorFormField/>
            <LocationFormField lang={i18n.resolvedLanguage} />
            <ContactPhoneFormField/>
            <AddAedButton type="submit" nextStep={sendFormData} />
          </form>
        </Card.Content>
      </Card>
    </div>
    )
  } else if (action === "init") {
    return <div id="sidebar-div"></div>
  } else {
    console.log(`Unknown action: '${action}'.`)
  }
}
