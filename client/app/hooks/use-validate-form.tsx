import type { AuthForm, AuthFormState, AuthError, AuthSuccessPayload } from "../types/index";
import { useEffect, useReducer, useState } from "react";
import { validateEmail } from "../utils";
import { Response, AuthErrorPayload, AuthResponse } from "../types";
import { login, signUp as signUp } from "../auth/auth.utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/user-slice";
type DispatchType = {
	type: "login" | "signup";
	payload: AuthForm | AuthErrorPayload;
};

const defaultAuthInputState: AuthError = {
	isError: false,
	errorMessage: "",
};

export const validateReducerFn: React.Reducer<AuthFormState, DispatchType> = (state, action) => {
	if (action.type === "login") {
		const { email, password } = action.payload as AuthForm;
		const { emailError, passwordError } = validateLoginForm({ email: email, password: password });

		return {
			isValid: !emailError.isError && !passwordError.isError,
			emailError,
			passwordError,
			email,
			password,
		};
	} else if (action.type === "signup") {
		const { email, password, repeatPassword } = action.payload as AuthForm;
		const { emailError, passwordError, repeatPasswordError } = validateSignUpForm({
			email,
			password,
			repeatPassword,
		});
		const isValid = !emailError.isError && !passwordError.isError && !repeatPasswordError.isError;

		return {
			isValid,
			emailError,
			passwordError,
			repeatPasswordError,
			email,
			password,
			repeatPassword,
		};
	}
	return state;
};
const intState: AuthFormState = {
	isValid: false,
	email: "",
	password: "",
};
export const useValidateAuthForm = (
	url: string,
): {
	formState: AuthFormState;
	dispatchForm: React.Dispatch<DispatchType>;
	response?: AuthResponse;
} => {
	const [formState, dispatchForm] = useReducer<React.Reducer<AuthFormState, DispatchType>>(validateReducerFn, intState);
	const { email, password, repeatPassword } = formState;
	const [response, setResponse] = useState<AuthResponse | null>(null);
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		if (formState.isValid) {
			const onSuccess = ({ access_token }: AuthSuccessPayload) => {
				dispatch(setUser(access_token));
				router.push(url);
			};
			if (!!repeatPassword) handleSignUp(email, password, repeatPassword, setResponse, onSuccess);
			else handleSignIn(email, password, setResponse, onSuccess);
		}
		return () => {
			setResponse(null);
		};
	}, [formState]);
	if (response) {
		return {
			formState,
			dispatchForm,
			response,
		};
	}

	return {
		formState,
		dispatchForm,
	};
};

function handleSignIn(
	email: string | undefined,
	password: string | undefined,
	setResponse: React.Dispatch<AuthResponse>,
	onSuccess: (tokens: AuthSuccessPayload) => void,
) {
	login({ email, password }).then(({ payload, statusCode }: Response) => {
		if (statusCode !== 200) {
			setResponse({ isError: true, payload });
			return;
		}
		setResponse({ isError: false, payload });
		const tokens = payload as AuthSuccessPayload;
		onSuccess(tokens);
	});
}

function handleSignUp(
	email: string | undefined,
	password: string | undefined,
	repeatPassword: string | undefined,
	setResponse: React.Dispatch<AuthResponse>,
	onSuccess: (tokens: AuthSuccessPayload) => void,
) {
	signUp({ email, password, repeatPassword }).then(({ payload, statusCode }: Response) => {
		if (statusCode !== 201) {
			setResponse({ isError: true, payload });
			return;
		}

		const tokens = payload as AuthSuccessPayload;
		setResponse({ isError: false, payload });
		onSuccess(tokens);
	});
}

function validateLoginForm(loginForm: AuthForm) {
	const { email: email, password: password } = loginForm;
	let emailError: AuthError = { ...defaultAuthInputState };
	let passwordError: AuthError = { ...defaultAuthInputState };
	if (!email || email.length === 0)
		emailError = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (!validateEmail(email))
		emailError = {
			isError: true,
			errorMessage: "Invalid email",
		};
	if (!password || password.length === 0)
		passwordError = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (password.length < 8)
		passwordError = {
			isError: true,
			errorMessage: "At least 8 characters",
		};
	return { emailError, passwordError };
}

function validateSignUpForm(signUpForm: AuthForm) {
	const { email: email, password: password, repeatPassword: repeatPassword } = signUpForm;
	let emailError: AuthError = { ...defaultAuthInputState };
	let passwordError: AuthError = { ...defaultAuthInputState };
	let repeatPasswordError: AuthError = { ...defaultAuthInputState };

	if (!email || email.length === 0)
		emailError = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (!validateEmail(email))
		emailError = {
			isError: true,
			errorMessage: "Invalid email",
		};

	if (!password || password.length === 0)
		passwordError = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (password.length < 8)
		passwordError = {
			isError: true,
			errorMessage: "At least 8 characters",
		};
	if (!repeatPassword || repeatPassword.length === 0)
		repeatPasswordError = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (repeatPassword !== password)
		repeatPasswordError = {
			isError: true,
			errorMessage: "Password does not match",
		};

	return {
		emailError,
		passwordError,
		repeatPasswordError,
	};
}
