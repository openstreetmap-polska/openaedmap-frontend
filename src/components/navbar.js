import React from 'react';
import './navbar.css';
import 'bulma/css/bulma.min.css';
import { Navbar } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './languageSwitcher';


export default function SiteNavbar(){
    const { t } = useTranslation();

    return (

        <Navbar color='success' className='pl-1'>
            <Navbar.Brand>
                <Navbar.Item renderAs='div'>
                    <span className="has-text-weight-light has-text-white-ter is-size-4 is-size-5-mobile pr-1 pl-2">
                    Open<span className="has-text-weight-semibold pl-1">AED</span>Map
                    </span>
                </Navbar.Item>
                <Navbar.Item className='is-hidden-touch' renderAs='div'>
                    <span className='has-text-white has-text-weight-light mr-3'>|</span>
                    <span className="has-text-weight-light is-size-6 is-size-7-touch pl-0">
                        {t('navbar.created_with_<3_by')}
                        <a className="has-text-weight-medium navbarUrl"
                        href="https://openstreetmap.org.pl/" rel="noreferrer" target="_blank"
                        title={t('navbar.visit_osmp_website')}>{t('osmp')}</a>
                    </span>
                </Navbar.Item>
            </Navbar.Brand>
            <Navbar.Menu className='pr-2'>
                <Navbar.Container align='right'>
                    <LanguageSwitcher/>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    );
}
