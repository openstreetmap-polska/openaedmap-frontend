import * as React from "react";
import { useContext } from "react";
import { initialModalState, ModalState } from "./model/modal";
import { AuthState, initialAuthState } from "./model/auth";
import SidebarAction from "./model/sidebarAction";
import { DefibrillatorData } from "./model/defibrillatorData";

interface AppContextType {
    authState: AuthState,
    modalState: ModalState,
    setModalState: (modalState: ModalState) => void,
    sidebarAction: SidebarAction,
    setSidebarAction: (sidebarAction: SidebarAction) => void,
    sidebarData: DefibrillatorData | null,
    setSidebarData: (sidebarData: DefibrillatorData | null) => void,
    handleLogIn: () => void,
    handleLogOut: () => void,
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
};
export const AppContext = React.createContext(defaultAppContext);
export const useAppContext = () => useContext(AppContext);