import React from 'react';
import './navbar.css';
import { Button, Navbar } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './languageSwitcher';
import Icon from '@mdi/react';
import { mdiCog, mdiGithub, mdiHeartFlash, mdiInformation } from '@mdi/js';
import Login from './login';


export default function SiteNavbar({ toggleSidebarShown, auth, setModalState }) {
    const [isActive, setisActive] = React.useState(false);
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
                <Navbar.Burger
                        id='navbarBurger'
                        onClick={() => {
                            setisActive(!isActive);
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
                    <Navbar.Item renderAs='div' p={0}>
                        <Button onClick={() => toggleSidebarShown()} color={'white'} outlined={true}>
                            <Icon path={mdiCog} size='2rem' />
                        </Button>
                    </Navbar.Item>
                    <Navbar.Item renderAs='div' p={0}>
                     <Button onclick="window.location.href='https://github.com/openstreetmap-polska/openaedmap-frontend';" color={'white'} outlined={true}>
                            <Icon title={t('navbar.visit_github')} alt='GitHub logo' path={mdiGithub} size='2rem' />
                        </Button>
                    </Navbar.Item>
                    <Login auth={auth}/>
                    <Navbar.Item renderAs='div' p={0}>
                        <Button color={'white'} outlined={true} onClick={() => setModalState({visible: true, type: "info"})}>
                            <Icon path={mdiInformation} size='2rem' />
                            {t("navbar.about")}
                        </Button>
                    </Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    );
}
