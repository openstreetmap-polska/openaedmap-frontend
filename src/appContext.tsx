import * as React from "react";
import {useContext} from "react";
import {initialModalState, ModalState} from "./model/modal";
import {AuthState, initialAuthState} from "./model/auth";

interface AppContextType {
    authState: AuthState,
    modalState: ModalState,
    setModalState: (modalState: ModalState) => void,
    handleLogIn: () => void,
    handleLogOut: () => void,
}
const defaultAppContext: AppContextType = {
    authState: initialAuthState,
    modalState: initialModalState,
    setModalState: () => {},
    handleLogIn: () => {},
    handleLogOut: () => {},
};
export const AppContext = React.createContext(defaultAppContext);
export const useAppContext = () => useContext(AppContext);