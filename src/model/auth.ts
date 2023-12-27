export interface AuthState {
	auth: OSMAuth.OSMAuthInstance | null;
	osmUsername: string;
}

export const initialAuthState: AuthState = {
	auth: null,
	osmUsername: "",
};
