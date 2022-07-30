import { mdiMagnify, mdiPencil } from "@mdi/js";
import Icon from '@mdi/react';
import 'bulma/css/bulma.min.css';
import i18n from 'i18next';
import opening_hours from "opening_hours";
import React from "react";
import { Card, Columns, Image } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import '../Main.css';
import './sidebar.css';


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

  function parseOpeningHours(openingHours) {
    if (openingHours) {
        if (openingHours.includes('24/7')) {
            return t('opening_hours.24_7');
        } else {
            let hoursPrettified;
            try {
                let hours = openingHours.toString();
                let oh = new opening_hours(hours, undefined, 2);
                hoursPrettified = oh.prettifyValue({
                    conf: {
                        locale: i18n.resolvedLanguage
                    },
                });
            } catch (error) {
                console.log('Error when parsing opening hours');
                console.log(error);
                return undefined;
            }
            return hoursPrettified;
        }
    } else {
        return undefined;
    }
  }

  function isCurrentlyOpen(openingHours) {
    if (openingHours) {
      if (openingHours.includes('24/7')) {
          return true;
      } else {
          const hours = openingHours.toString();
          const oh = new opening_hours(hours, undefined, 2);
          const isOpen = oh.getState();
          return isOpen;
      }
    }
  }
  
  function renderCurrentlyOpenStatus(openingHours) {
    if (isCurrentlyOpen(openingHours)) {
        return <sup className="pl-1"><span className="tag is-success is-light">{t('opening_hours.open')}</span></sup>
    } else {
        return <sup className="pl-1"><span className="tag is-danger is-light">{t('opening_hours.closed')}</span></sup>
    }
  }

  console.log("Opening left sidebar with action: ", action, " and data:");
  console.log(data);

    const { t } = useTranslation();
    // const closeSidebar = () => document.getElementById("sidebar-div").classList.add("is-invisible")

    if (action === "showDetails") {
      const noData = <span className="has-text-grey-light is-italic has-text-weight-light">{t('sidebar.no_data')}</span>

      const accessText = data.access ? " - " + t(`access.${data.access}`) : ""

      const indoor = data.indoor ? <span className="has-text-weight-medium">{t(`indoor.${data.indoor}`)}</span> : noData

      const locationDescription = data[`defibrillator_location_${i18n.resolvedLanguage}`] || data["defibrillator_location"]
      const location = locationDescription ? <span className="has-text-weight-medium">{locationDescription}</span> : noData

      const ohours = data.opening_hours
      const openingHours = (ohours && parseOpeningHours(ohours)) ? <span><span className="has-text-weight-medium">{parseOpeningHours(ohours)}</span>{renderCurrentlyOpenStatus(ohours)}</span> : noData

      const descriptionText = data[`description_${i18n.resolvedLanguage}`] || data["description"]
      const description = descriptionText ? <span className="has-text-weight-medium">{descriptionText}</span> : noData

      const contactNumber = data.phone ? <span className="has-text-weight-medium">{data.phone}</span> : noData

      const operator = data.operator ? <span className="has-text-weight-medium">{data.operator}</span> : noData

      const noteText = data[`note_${i18n.resolvedLanguage}`] || data["note"]
      const note = noteText ? <span className="has-text-weight-medium">{noteText}</span> : noData

      const editButton = osmId => {
        return <a key={"edit_url_" + osmId} href={"https://www.openstreetmap.org/edit?node=" + osmId}
          className="button is-small is-success mx-1"
          rel={"noreferrer"} target={"_blank"}>
            <Icon path={mdiPencil} size={1.0} className="icon" color="#fff" />
            <span>{t("sidebar.edit")}</span>
        </a>
      }

      const viewButton = osmId => {
        return <a key={"view_url_" + osmId} href={"https://www.openstreetmap.org/node/" + osmId}
          className="button is-small is-success mx-1"
          rel={"noreferrer"} target={"_blank"}>
            <Icon path={mdiMagnify} size={1.0} className="icon" color="#fff" />
            <span>{t("sidebar.view")}</span>
        </a>
      }

      return (
        <div className={visible ? "sidebar": "sidebar is-invisible"} id="sidebar-div">
          <Card>
            <Card.Header id="sidebar-header" className={accessColourClass(data.access)}>
              <Columns centered flex="true" className="mr-0">
                <Columns.Column className="is-one-fifth is-one-sixth-mobile">
                  <Image m={2} className='icon' src="./img/logo-aed.svg" color="white" alt="" size={48} />
                </Columns.Column>
                <Columns.Column>
                  <p className="title is-5 py-2 has-text-white-ter has-text-weight-light" 
                     id="sidebar-caption">{t('sidebar.caption_info') + accessText}</p>
                </Columns.Column>
                <button
                  aria-label={t('sidebar.close')}
                  className='delete is-medium is-hidden-touch is-pulled-right close-button mr-2 mt-5'
                  onClick={closeSidebar}
                />
                <button
                  aria-label={t('sidebar.close')}
                  className='delete is-large is-hidden-desktop is-pulled-right close-button mr-2 mt-5'
                  onClick={closeSidebar}
                />
              </Columns>
            </Card.Header>
            <Card.Content py={3} >
              <div className="content" id="sidebar-content-div">
                <p className="has-text-weight-light">{t('sidebar.indoor') + "?: "}{indoor}</p>
                <p className="has-text-weight-light">{t('sidebar.location') + ": "}{location}</p>
                <p className="has-text-weight-light">{t('sidebar.opening_hours') + ": "}{openingHours}</p>
                <p className="has-text-weight-light">{t('sidebar.description') + ": "}{description}</p>
                <p className="has-text-weight-light">{t('sidebar.contact_number') + ": "}{contactNumber}</p>
                <p className="has-text-weight-light">{t('sidebar.operator') + ": "}{operator}</p>
                <p className="has-text-weight-light">{t('sidebar.note') + ": "}{note}</p>
              </div>
            </Card.Content>
            <Card.Footer>
              <Card.Footer.Item className="has-background-success-light">
                {viewButton(data.osm_id)}
                {editButton(data.osm_id)}
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
      return (
        <div id="sidebar-div"></div>
      )
    } else {
      console.log(`Unknown action: '${action}'.`)
    }
  }
