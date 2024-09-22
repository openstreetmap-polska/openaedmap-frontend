import { mdiAccount, mdiLoginVariant, mdiLogoutVariant } from "@mdi/js";
import Icon from "@mdi/react";
import React, { type FC } from "react";
import { Button, Navbar } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import { useAppContext } from "~/appContext";

interface LogInButtonProps {
	inNavBar: boolean;
}

const LogInButton: FC<LogInButtonProps> = ({ inNavBar }) => {
	const { t } = useTranslation();
	const {
		authState: { auth, osmUsername },
		handleLogIn,
		handleLogOut,
	} = useAppContext();

	if (auth?.authenticated()) {
		return (
			<Navbar.Item className="has-text-white is-fullwidth" hoverable>
				<Navbar.Item>
					<Icon className="icon mr-2" path={mdiAccount} size={1.0} />
					{osmUsername}
				</Navbar.Item>
				<Navbar.Dropdown className="has-background-green is-fullwidth">
					<Navbar.Item onClick={handleLogOut}>
						<Icon path={mdiLogoutVariant} size={1.0} className="icon mr-2" />
						{t("navbar.logout")}
					</Navbar.Item>
				</Navbar.Dropdown>
			</Navbar.Item>
		);
	}
	return (
		<Navbar.Item renderAs="div" className="py-0" px={1}>
			<Button
				className="is-fullwidth"
				color={inNavBar ? "white" : undefined}
				outlined
				onClick={handleLogIn}
			>
				<Icon path={mdiLoginVariant} size={1.0} className="icon mr-2" />
				{t("navbar.login")}
			</Button>
		</Navbar.Item>
	);
};

export default LogInButton;
