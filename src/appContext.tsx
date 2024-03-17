import * as React from "react";
import { useContext } from "react";
import { type AuthState, initialAuthState } from "~/model/auth";
import type { Country } from "~/model/country";
import type { DefibrillatorData } from "~/model/defibrillatorData";
import { type ModalState, initialModalState } from "~/model/modal";
import SidebarAction from "./model/sidebarAction";

interface AppContextType {
	authState: AuthState;
	modalState: ModalState;
	setModalState: (modalState: ModalState) => void;
	sidebarAction: SidebarAction;
	setSidebarAction: (sidebarAction: SidebarAction) => void;
	sidebarData: DefibrillatorData | null;
	setSidebarData: (sidebarData: DefibrillatorData | null) => void;
	handleLogIn: () => void;
	handleLogOut: () => void;
	countriesData: Array<Country>;
	setCountriesData: (countriesData: Array<Country>) => void;
	countriesDataLanguage: string;
	setCountriesDataLanguage: (language: string) => void;
}
const defaultAppContext: AppContextType = {
	authState: initialAuthState,
	modalState: initialModalState,
	setModalState: () => {},
	sidebarAction: SidebarAction.init,
	setSidebarAction: () => {},
	sidebarData: null,
	setSidebarData: () => {},
	handleLogIn: () => {},
	handleLogOut: () => {},
	countriesData: [],
	setCountriesData: () => {},
	countriesDataLanguage: "",
	setCountriesDataLanguage: () => {},
};
export const AppContext = React.createContext(defaultAppContext);
export const useAppContext = () => useContext(AppContext);
