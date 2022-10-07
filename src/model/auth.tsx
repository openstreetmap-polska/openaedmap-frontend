export interface AuthState {
    auth: any, // TODO: typing
    osmUsername: string,
}

export const initialAuthState: AuthState = {
    auth: null,
    osmUsername: "",
};