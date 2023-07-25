import { AuthForm } from "../types/auth";
import axios, { AxiosError } from "axios";
export const doSignUp = async ({ email, password, repeatPassword }: AuthForm) => {
	const body: AuthForm = { email, password, repeatPassword };
	try {
		const res = await axios.post(process.env.API_URL + "/auth/signup", body);
		return res.data;
	} catch (err) {
		const axiosErr = err as AxiosError;
		return axiosErr.response?.data;
	}
};
