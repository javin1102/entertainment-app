import { AxiosResponse } from "axios";
import { AuthError } from ".";

export type Response = {
	payload: object;
	message: string;
	statusCode: number;
};

export type AuthResponsePayload = AuthErrorPayload | AuthSuccessPayload;
export type AuthResponse = {
	isError: boolean;
	payload: AuthResponsePayload | null | undefined;
};
export type AuthErrorPayload = {
	email?: string;
	password?: string;
	repeatPassword?: string;
};

export type AuthSuccessPayload = {
	access_token: string;
	refresh_token: string;
};
