import { useEffect, useState } from "react";
import { authorize } from "../auth/auth.utils";
import { Response } from "../types";
import { useRouter } from "next/navigation";
export const useAuthenticate = (access_token: string | undefined) => {
	const [isAuthenticated, setIsAuthenticate] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();
	const sendAuthenticationRequest = async () => {
		setIsLoading(true);
		const res = (await authorize(access_token)) as Response;
		if (res.statusCode !== 200) {
			router.push("/auth/login");
			setIsAuthenticate(false);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		setIsAuthenticate(true);
	};
	useEffect(() => {
		sendAuthenticationRequest();
	}, []);
	return { isLoading, isAuthenticated };
};
