import React from 'react';
import i18n from 'i18next';
import { languages } from '../i18n';
import { Navbar } from 'react-bulma-components';
import Icon from '@mdi/react'
import { mdiTranslate } from '@mdi/js';


export default function LanguageSwitcher(){
    return (
        <Navbar.Item hoverable="true" >
            <Navbar.Link key={i18n.resolvedLanguage}>
                <Icon path={mdiTranslate} size={1.3} className="icon mr-2" color="#fff" />
                {languages[i18n.resolvedLanguage].nativeName}
            </Navbar.Link>
            <Navbar.Dropdown>
            {Object.keys(languages).map((lng) => {
                if (i18n.resolvedLanguage !== lng) {
                    return (
                        <Navbar.Item key={lng} onClick={() => {i18n.changeLanguage(lng);}}>
                            {languages[lng].nativeName}
                        </Navbar.Item>
                    );
                }
            })}
            </Navbar.Dropdown>
        </Navbar.Item>
    );
}