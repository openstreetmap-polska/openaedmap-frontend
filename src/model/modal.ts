export enum ModalType {
    NodeAddedSuccessfully,
    NeedToLogin,
    NeedMoreZoom,
    About,
    Error,
}

export interface ModalState {
    type: ModalType,
    nodeId: string,
    currentZoom: number,
    errorMessage: string,
    visible: boolean,
}

export const initialModalState: ModalState = {
    visible: false,
    type: ModalType.About,
    nodeId: "0",
    currentZoom: 0,
    errorMessage: "",
};