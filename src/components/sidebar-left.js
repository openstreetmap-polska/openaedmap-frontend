import React from "react";
import './sidebar.css';
// import 'bulma/css/bulma.min.css';
import { Card, Columns, Image, Button } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';


const accessToColourMapping = {
  'yes': 'has-background-green',
  'no': 'has-background-grey',
  'private': 'has-background-grey',
  'permissive': 'has-background-link-dark',
  'customers': 'has-background-link-dark',
  'default': 'has-background-grey',
};

function accessColourClass(access) {
  return accessToColourMapping[access] || accessToColourMapping['default'];
}


export default function SidebarLeft({ action, data, closeSidebar, visible }) {
  console.log(action);
  console.log(data);

    const { t } = useTranslation();
    // const closeSidebar = () => document.getElementById("sidebar-div").classList.add("is-invisible")

    var headerColourClass = "";
    if (action === "showDetails") {
      headerColourClass = accessColourClass(data.access)
    } else if (action === "addNode") {
      console.log(`Action: '${action}' not implemented.`)
    } else if (action === "init") {
      // nothing to do
    } else {
      console.log(`Unknown action: '${action}'.`)
    }

    return (
      <div className={"sidebar" + visible ? "": " is-invisible"} id="sidebar-div">
        <Card>
          <Card.Header id="sidebar-header" className={headerColourClass}>
            <Columns centered flex="true" className="mr-0">
              <Columns.Column className="is-one-quarter is-one-fifth-mobile">
                <Image src="./img/card-image.png" alt="" size={64}></Image>
              </Columns.Column>
              <Columns.Column>
                <p className="title has-text-white-ter has-text-weight-light" id="sidebar-caption"></p>
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
            <div className="content" id="sidebar-content-div"></div>
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
  }
