export type ResponseAPI = {
	payload: object;
	message: string;
	statusCode: number;
};

export type RefreshTokenPayload = {
	userId: string;
	refresh_token: string;
	email?: string;
	iat?: number;
	exp?: number;
};

export type AccessTokenPayload = {
	userId: string;
	access_token: string;
	email?: string;
	iat?: number;
	exp?: number;
};
