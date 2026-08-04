import { mdiMapLegend } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { type FC, useId } from "react";
import { Button, Navbar } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import ReactStoreBadges from "~/3rdparty/reactStoreBadges";
import { useAppContext } from "~/appContext";
import { useLanguage } from "~/i18n";
import { initialModalState, ModalType } from "~/model/modal";
import LanguageSwitcher from "./languageSwitcher";
import LogInButton from "./logInButton";
import "./navbar.css";

const SiteNavbar: FC<SiteNavbarProps> = ({ toggleSidebarShown }) => {
	const { setModalState } = useAppContext();
	const [isActive, setIsActive] = React.useState(false);
	const { t } = useTranslation();
	const language = useLanguage();
	const navbarMenuId = useId();
	return (
		<Navbar className="has-background-success">
			<Navbar.Brand>
				<Navbar.Item renderAs="a" href="/" pr={1} pl={1}>
					<img
						alt="OpenAEDMap logo"
						src="/img/logo-aed.svg"
						className="ml-1"
						width="35px"
						height="35px"
						style={{ maxHeight: "35px" }}
					/>
					<span className="has-text-weight-light has-text-white-ter is-size-4 is-size-5-mobile p-1">
						Open
						<span className="has-text-weight-semibold">AED</span>
						Map
					</span>
				</Navbar.Item>
				<Navbar.Item className="is-hidden-touch" renderAs="div" pl={1} pr={1}>
					<span className="has-text-weight-light has-text-white is-size-6 pl-0">
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
					<span className="has-text-weight-light has-text-white is-size-6 pr-1">
						{t("navbar.hosted_by")}{" "}
					</span>
					<a
						href="https://cloudferro.com"
						rel="noreferrer"
						target="_blank"
						title="CloudFerro"
					>
						<img alt="CloudFerro" src="/img/cloudferro_logo.png" />
					</a>
				</Navbar.Item>
				<LanguageSwitcher />
				<button
					type="button"
					tabIndex={0}
					aria-label="menu"
					aria-expanded="false"
					onClick={() => {
						setIsActive(!isActive);
					}}
					className={`${isActive ? "is-active" : ""} navbar-burger`}
					data-target={navbarMenuId}
				>
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
				</button>
			</Navbar.Brand>
			<Navbar.Menu
				className={`pr-2 has-background-success ${isActive ? "is-active" : ""}`}
				id={navbarMenuId}
			>
				<Navbar.Container align="right">
					<LogInButton inNavBar />
					<Navbar.Item renderAs="div" p={1}>
						<Button
							color="white"
							outlined
							onClick={() =>
								setModalState({
									...initialModalState,
									visible: true,
									type: ModalType.About,
								})
							}
						>
							{t("navbar.about")}
						</Button>
					</Navbar.Item>
					<Navbar.Item renderAs="div" p={1}>
						<Button onClick={() => toggleSidebarShown()} color="white" outlined>
							<Icon path={mdiMapLegend} size="1.6rem" />
						</Button>
					</Navbar.Item>
					<Navbar.Item p={1} renderAs="div">
						<ReactStoreBadges
							platform="android"
							url="https://play.google.com/store/apps/details?id=pl.enteam.aed_map"
							language={language}
						/>
					</Navbar.Item>
					<Navbar.Item p={1} renderAs="div">
						<ReactStoreBadges
							platform="ios"
							url="https://apps.apple.com/app/mapa-aed/id1638495701"
							language={language}
						/>
					</Navbar.Item>
					<Navbar.Item
						className="is-hidden-desktop"
						textColor="white"
						renderAs="div"
						pl={0}
						pr={0}
					>
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
					<Navbar.Item
						className="is-hidden-desktop"
						textColor="white"
						renderAs="div"
						pl={0}
						pr={0}
					>
						<span
							color="white"
							className="has-text-weight-light is-size-6 pr-1"
						>
							{t("navbar.hosted_by")}{" "}
						</span>
						<img alt="CloudFerro" src="/img/cloudferro_logo.png" />
					</Navbar.Item>
				</Navbar.Container>
			</Navbar.Menu>
		</Navbar>
	);
};

interface SiteNavbarProps {
	toggleSidebarShown: () => void;
}

export default SiteNavbar;
