import React from "react";
import './sidebar.css';
import '../Main.css';
import 'bulma/css/bulma.min.css';
import { Card, Columns, Image, Button } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import opening_hours from "opening_hours";


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

  console.log(action);
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

      return (
        <div className={visible ? "sidebar": "sidebar is-invisible"} id="sidebar-div">
          <Card>
            <Card.Header id="sidebar-header" className={accessColourClass(data.access)}>
              <Columns centered flex="true" className="mr-0">
                <Columns.Column className="is-one-fifth is-one-sixth-mobile">
                  <Image m={2} src="./img/card-image.png" alt="" size={48}></Image>
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
              </div>
            </Card.Content>
            <Card.Footer>
              <div
                className="has-background-success-light card-footer-item is-block has-text-centered is-size-7 has-text-weight-semibold p-1"
                id="sidebar-footer-button-left">
                <a className="has-background-success-light card-footer-item has-text-centered is-size-7 has-text-weight-semibold"
                  href="#" rel="noopener"
                  target="_blank"></a>
              </div>
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
