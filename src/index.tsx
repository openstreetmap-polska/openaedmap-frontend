import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import i18next from "i18next";
import Main from "./Main";
import "./i18n";

i18next.on("languageChanged", (lang) => {
    document.documentElement.setAttribute("lang", lang);
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
);
