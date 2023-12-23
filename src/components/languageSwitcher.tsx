import React from "react";
import i18n from "i18next";
import { Navbar } from "react-bulma-components";
import { languages } from "../i18n";

export default function LanguageSwitcher() {
    return (
        <Navbar.Item px={1}>
            <div className="select">
                <select
                    id="language-switcher"
                    value={i18n.resolvedLanguage ?? "en"}
                    onChange={(e) => {
                        i18n.changeLanguage(e.target.value);
                    }}
                >
                    {Object.keys(languages).map((language) => (
                        <option
                            key={language}
                            value={language}
                        >
                            {languages[language].nativeName}
                        </option>
                    ))}
                </select>
            </div>
        </Navbar.Item>
    );
}
