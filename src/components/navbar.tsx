import React, { FC } from "react";
import "./navbar.css";
import { Button, Navbar } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import Icon from "@mdi/react";
import { mdiMapLegend, mdiGithub } from "@mdi/js";
import { LanguageSwitcher, LanguageSwitcherMobile } from "./languageSwitcher";
import LogInButton from "./logInButton";
import { initialModalState, ModalType } from "../model/modal";
import { useAppContext } from "../appContext";
import ReactStoreBadges from "../3rdparty/react-store-badges";

const SiteNavbar: FC<SiteNavbarProps> = ({ toggleSidebarShown }) => {
    const { setModalState } = useAppContext();
    const [isActive, setIsActive] = React.useState(false);
    const { t, i18n: { resolvedLanguage } } = useTranslation();
    return (
        <Navbar color="success" className="has-background-green">
            <Navbar.Brand>
                <Navbar.Item renderAs="a" href="/" pr={1} pl={1}>
                    <svg className="navbarLogo" viewBox="0 0 60 60" role="presentation">
                        {/* TODO: extract svg logo */}
                        {/* eslint-disable-next-line max-len */}
                        <path d="M16.283 18.614c-6.594.058-12.469 6.32-10.7 14.606 1.35 6.317 8.359 14.53 20.587 22.493C38.4 47.75 45.41 39.537 46.758 33.22c1.77-8.286-4.106-14.548-10.7-14.606-3.39-.05-7.628 1.67-9.888 5.822-2.259-4.153-6.498-5.872-9.887-5.822zm4.996 2.292a9.981 9.981 0 013.966 3.995l.531.975-2.532 11.319 9.556-6.637-4.21 18.274h2.477l-4.956 5.287-2.956-6.61 2.478.835 1.374-10.172-7.972 5.516 2.244-22.782zM49.08 3.165v5.23h-5.434v5.228h5.435v5.23h5.434v-5.23h5.435V8.394h-5.435V3.165z" />
                    </svg>
                    <span className="has-text-weight-light has-text-white-ter is-size-4 is-size-5-mobile p-1">
                        Open
                        <span className="has-text-weight-semibold">AED</span>
                        Map
                    </span>
                </Navbar.Item>
                <Navbar.Item className="is-hidden-touch" renderAs="div" pl={1} pr={1}>
                    <span className="has-text-weight-light is-size-6 pl-0">
                        {t("navbar.created_with_<3_by")}
                        &nbsp;
                        <a
                            className="has-text-weight-medium navbarUrl"
                            href="https://openstreetmap.org.pl/"
                            rel="noreferrer"
                            target="_blank"
                            title={t("navbar.visit_osmp_website")}
                        >
                            {t("osmp")}
                        </a>
                    </span>
                </Navbar.Item>
                <Navbar.Item className="is-hidden-touch" renderAs="div" pl={1} pr={1}>
                    <span className="has-text-weight-light is-size-6 pr-1">
                        {t("navbar.hosted_by")}
                        {" "}
                    </span>
                    <a
                        href="https://cloudferro.com"
                        rel="noreferrer"
                        target="_blank"
                        title="CloudFerro"
                    >
                        <img alt="CloudFerro" src="img/cloudferro_logo.png" />
                    </a>
                </Navbar.Item>
                <LanguageSwitcherMobile />
                <Navbar.Burger
                    id="navbarBurger"
                    onClick={() => {
                        setIsActive(!isActive);
                    }}
                    className={`${isActive ? "is-active" : ""}`}
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarMenu"
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </Navbar.Burger>
            </Navbar.Brand>
            <Navbar.Menu className={`pr-2 has-background-green ${isActive ? "is-active" : ""}`} id="navbarMenu">
                <Navbar.Container align="right">
                    <LanguageSwitcher />
                    <LogInButton inNavBar />
                    <Navbar.Item renderAs="div" p={1}>
                        <Button
                            color="white"
                            outlined
                            onClick={
                                () => setModalState({ ...initialModalState, visible: true, type: ModalType.About })
                            }
                        >
                            {t("navbar.about")}
                        </Button>
                    </Navbar.Item>
                    <Navbar.Item renderAs="div" p={1}>
                        <Button onClick={() => toggleSidebarShown()} color="white" outlined>
                            <Icon path={mdiMapLegend} size="2rem" />
                        </Button>
                    </Navbar.Item>
                    <Navbar.Item renderAs="div" p={1}>
                        <a
                            href="https://github.com/openstreetmap-polska/openaedmap-frontend"
                            target="_blank"
                            rel="noreferrer"
                            className="is-white is-outlined button"
                        >
                            <Icon title={t("navbar.visit_github")} description="GitHub" path={mdiGithub} size="2rem" />
                        </a>
                    </Navbar.Item>
                    <Navbar.Item className="p-0" renderAs="div">
                        <ReactStoreBadges
                            platform="android"
                            url="https://play.google.com/store/apps/details?id=pl.enteam.aed_map"
                            language={resolvedLanguage}
                        />
                    </Navbar.Item>
                    <Navbar.Item className="p-0" renderAs="div">
                        <ReactStoreBadges
                            platform="ios"
                            url="https://apps.apple.com/app/mapa-aed/id1638495701"
                            language={resolvedLanguage}
                        />
                    </Navbar.Item>
                    <Navbar.Item className="is-hidden-desktop" textColor="white" renderAs="div" pl={0} pr={0}>
                        <span color="white" className="has-text-weight-light is-size-6 pr-1">
                            {t("navbar.hosted_by")}
                            {" "}
                        </span>
                        <img alt="CloudFerro" src="img/cloudferro_logo.png" />
                    </Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    );
};

interface SiteNavbarProps {
    toggleSidebarShown: () => void
}

export default SiteNavbar;
