export enum ModalType {
	NodeAddedSuccessfully = 0,
	NodeUpdatedSuccessfully = 1,
	NeedToLogin = 2,
	NeedMoreZoom = 3,
	About = 4,
	Error = 5,
	Partners = 6,
	ThanksForPhoto = 7,
	ThanksForReport = 8,
}

export interface ModalState {
	type: ModalType;
	nodeId: string;
	currentZoom: number;
	errorMessage: string;
	visible: boolean;
}

export const initialModalState: ModalState = {
	visible: false,
	type: ModalType.About,
	nodeId: "0",
	currentZoom: 0,
	errorMessage: "",
};
