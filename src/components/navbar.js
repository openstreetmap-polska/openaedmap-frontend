import React from 'react';
import './navbar.css';
import { Navbar } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './languageSwitcher';
import Icon from '@mdi/react';
import { mdiCog, mdiGithub, mdiHeartFlash } from '@mdi/js';


export default function SiteNavbar({ toggleSidebarShown }) {
    const { t } = useTranslation();
    return (
        <Navbar color='success' className='pl-1 has-background-green'>
            <Navbar.Brand>
                <Navbar.Item renderAs='div'>
                    <Icon path={mdiHeartFlash} size={1.3} className="icon" color="#fff" />
                    <span className="has-text-weight-light has-text-white-ter is-size-4 is-size-5-mobile pr-1 pl-1">
                    Open<span className="has-text-weight-semibold">AED</span>Map
                    </span>
                </Navbar.Item>
                <Navbar.Item className='is-hidden-touch' renderAs='div'>
                    <span className='has-text-white has-text-weight-light mr-3'>|</span>
                    <span className="has-text-weight-light is-size-6 is-size-7-touch pl-0">
                        {t('navbar.created_with_<3_by')}
                        &nbsp;
                        <a className="has-text-weight-medium navbarUrl"
                        href="https://openstreetmap.org.pl/" rel="noreferrer" target="_blank"
                        title={t('navbar.visit_osmp_website')}>{t('osmp')}</a>
                    </span>
                </Navbar.Item>
            </Navbar.Brand>
            <Navbar.Menu className='pr-2'>
                <Navbar.Container align='right'>
                    <LanguageSwitcher/>
                    <Navbar.Item renderAs='div' className='pb-0'>
                        <a onClick={() => toggleSidebarShown()}>
                            <Icon path={mdiCog} size='2rem' className='has-text-white mr-1' />
                        </a>
                    </Navbar.Item>
                    <Navbar.Item renderAs='div' className='pb-0'>
                        <a href='https://github.com/openstreetmap-polska/openaedmap-frontend' target='_blank' rel='noopener'>
                            <Icon title={t('navbar.visit_github')} alt='GitHub' path={mdiGithub} size='2rem' className='has-text-white mr-1' />
                        </a>
                    </Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    );
}
