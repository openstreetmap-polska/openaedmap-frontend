import React from 'react';
import './navbar.css';
import { Button, Navbar } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher, LanguageSwitcherMobile } from './languageSwitcher';
import Icon from '@mdi/react';
import { mdiMapLegend, mdiGithub, mdiHeartFlash} from '@mdi/js';
import LogInButton from './logInButton';
import {initialModalState, ModalType} from "../model/modal";
import {useAppContext} from "../appContext";


export default function SiteNavbar({ toggleSidebarShown }) {
    const {setModalState} = useAppContext();
    const [isActive, setIsActive] = React.useState(false);
    const { t } = useTranslation();
    return (
        <Navbar color='success' className='has-background-green'>
            <Navbar.Brand>
                <Navbar.Item renderAs='div' pr={1}>
                    <Icon path={mdiHeartFlash} size={1.2} className="icon" color="#fff" />
                    <span className="has-text-weight-light has-text-white-ter is-size-4 is-size-5-mobile p-1">
                    Open<span className="has-text-weight-semibold">AED</span>Map
                    </span>
                </Navbar.Item>
                <Navbar.Item className='is-hidden-touch' renderAs='div' pl={1}>
                    <span className='has-text-grey-light has-text-weight-light mr-3'>|</span>
                    <span className="has-text-weight-light is-size-6 pl-0">
                        {t('navbar.created_with_<3_by')}
                        &nbsp;
                        <a className="has-text-weight-medium navbarUrl"
                        href="https://openstreetmap.org.pl/" rel="noreferrer" target="_blank"
                        title={t('navbar.visit_osmp_website')}>{t('osmp')}</a>
                    </span>
                </Navbar.Item>
                <LanguageSwitcherMobile/>
                <Navbar.Burger
                        id='navbarBurger'
                        onClick={() => {
                            setIsActive(!isActive);
                        }}
                        className={`${isActive ? "is-active" : ""}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarMenu"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                </Navbar.Burger>
            </Navbar.Brand> 
            <Navbar.Menu className={`pr-2 has-background-green ${isActive ? "is-active" : ""}`} id='navbarMenu'>
                <Navbar.Container align='right'>
                    <LanguageSwitcher/>
                    <LogInButton inNavBar={true}/>
                    <Navbar.Item renderAs='div' p={1}>
                        <Button color={'white'} outlined={true} onClick={() => setModalState({...initialModalState, visible: true, type: ModalType.About})}>
                            {t("navbar.about")}
                        </Button>
                    </Navbar.Item>
                    <Navbar.Item renderAs='div' p={1}>
                        <a href='https://github.com/openstreetmap-polska/openaedmap-frontend' target='_blank' rel='noreferrer' className='is-white is-outlined button'>
                            <Icon title={t('navbar.visit_github')} alt='GitHub' path={mdiGithub} size='2rem'/>
                        </a>
                    </Navbar.Item>
                    <Navbar.Item renderAs='div' p={1}>
                        <Button onClick={() => toggleSidebarShown()} color={'white'} outlined={true}>
                            <Icon path={mdiMapLegend} size='2rem' />
                        </Button>
                    </Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    );
}
