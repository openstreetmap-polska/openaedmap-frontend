export interface AuthState {
	auth: OSMAuth.osmAuth | null;
	osmUsername: string;
}

export const initialAuthState: AuthState = {
	auth: null,
	osmUsername: "",
};
