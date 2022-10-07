import * as React from "react";
import {useContext} from "react";
import {initialModalState, ModalState} from "./model/modal";

interface AppContext {
    auth: any, // TODO: typing
    modalState: ModalState,
    setModalState: (modalState: ModalState) => void,
}
const defaultAppContext: AppContext = { auth: null, modalState: initialModalState, setModalState: () => {}};
export const AppContext = React.createContext(defaultAppContext);
export const useAppContext = () => useContext(AppContext);