import React from 'react';
import i18n from 'i18next';
import { languages } from '../i18n';
import 'bulma/css/bulma.min.css';
import { Navbar } from 'react-bulma-components';


export default function LanguageSwitcher(){
    return (
        <Navbar.Item hoverable="true" >
            <Navbar.Link key={i18n.resolvedLanguage}>
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