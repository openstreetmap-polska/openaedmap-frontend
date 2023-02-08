import React from "react";
import i18n from "i18next";
import { Navbar } from "react-bulma-components";
import Icon from "@mdi/react";
import { mdiEarth } from "@mdi/js";
import { useTranslation } from "react-i18next";
import { languages } from "../i18n";

export function LanguageSwitcher() {
    const { t } = useTranslation();
    const helpTranslationText = `🖋&nbsp;${t("navbar.help_translating")}`;
    return (
        <Navbar.Item touch={{ display: "hidden" }} desktop={{ only: true }} hoverable>
            <Navbar.Link className="has-text-white" key={i18n.resolvedLanguage}>
                <Icon path={mdiEarth} size={1} className="icon mr-2" />
                {languages[i18n.resolvedLanguage].nativeName}
            </Navbar.Link>
            <Navbar.Dropdown className="has-background-green navbarUrl">
                {Object.keys(languages).map((lng) => {
                    if (i18n.resolvedLanguage !== lng) {
                        return (
                            <Navbar.Item key={lng} onClick={() => { i18n.changeLanguage(lng); }}>
                                {languages[lng].nativeName}
                            </Navbar.Item>
                        );
                    } return null;
                }).filter((x) => x)}
                <Navbar.Divider />
                <Navbar.Item
                    href="https://github.com/openstreetmap-polska/openaedmap-frontend#translating"
                    rel="noreferrer"
                    target="_blank"
                >
                    { helpTranslationText}
                </Navbar.Item>
            </Navbar.Dropdown>
        </Navbar.Item>
    );
}

export function LanguageSwitcherMobile() {
    const [isActive, setIsActive] = React.useState(true);
    return (
        <Navbar.Item desktop={{ display: "hidden" }} hoverable>
            <Navbar.Link
                className="has-text-white"
                key={i18n.resolvedLanguage}
                onClick={() => {
                    setIsActive(!isActive);
                }}
            >
                <Icon path={mdiEarth} size={0.8} className="icon mr-2" />
                <span className="is-uppercase">{i18n.resolvedLanguage}</span>
            </Navbar.Link>
            <Navbar.Dropdown className={`has-background-green navbarUrl ${isActive ? "is-hidden" : ""}`}>
                {Object.keys(languages).map((language) => {
                    if (i18n.resolvedLanguage !== language) {
                        return (
                            <Navbar.Item key={language} onClick={() => { i18n.changeLanguage(language); }}>
                                {languages[language].nativeName}
                            </Navbar.Item>
                        );
                    } return null;
                }).filter((x) => x)}
            </Navbar.Dropdown>
        </Navbar.Item>
    );
}