import { AxiosResponse } from "axios";

export type Response = {
	payload: object | SignUpErrorPayload;
	message: string;
	statusCode: number;
};

export type SignUpResponsePayload = SignUpErrorPayload | SignUpSuccessPayload;
export type SignUpErrorPayload = {
	email?: string;
	password?: string;
	repeatPassword?: string;
};

export type SignUpSuccessPayload = {
	access_token?: string;
};
