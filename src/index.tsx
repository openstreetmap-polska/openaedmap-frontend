import React from "react";
import ReactDOM from "react-dom/client";
import "~/i18n";
import "~/mystyles.css";
import Main from "./Main";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>,
);
