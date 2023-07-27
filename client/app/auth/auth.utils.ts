import { AuthForm } from "../types/auth";
import axios, { AxiosError } from "axios";
axios.defaults.baseURL = process.env.API_URL;
export const signUp = async ({ email, password, repeatPassword }: AuthForm) => {
	const body: AuthForm = { email, password, repeatPassword };
	try {
		const res = await axios.post("/auth/signup", body, {
			withCredentials: true,
		});
		return res.data;
	} catch (err) {
		const axiosErr = err as AxiosError;
		return axiosErr.response?.data;
	}
};

export const login = async ({ email, password }: AuthForm) => {
	const body: AuthForm = { email, password };
	try {
		const res = await axios.post("/auth/login", body, {
			withCredentials: true,
		});
		return res.data;
	} catch (err) {
		const axiosErr = err as AxiosError;
		return axiosErr.response?.data;
	}
};

export const authorize = async (access_token: string | undefined) => {
	try {
		const res = await axios.post("/auth/access", null, {
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		return res.data;
	} catch (err) {
		const axiosErr = err as AxiosError;
		return axiosErr.response?.data;
	}
};
