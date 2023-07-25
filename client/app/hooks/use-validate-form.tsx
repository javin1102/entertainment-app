import type { AuthForm, AuthFormState, AuthInputError } from "../types/auth";
import { useEffect, useReducer, useState } from "react";
import { validateEmail } from "../utils";
import { Response, SignUpErrorPayload, SignUpResponsePayload, SignUpSuccessPayload } from "../types";
import { doSignUp as signUp } from "../auth/auth.utils";

type DispatchType = {
	type: "login" | "signup";
	payload: AuthForm | SignUpErrorPayload;
};

const defaultAuthInputState: AuthInputError = {
	isError: false,
	errorMessage: "",
};

export const validateReducerFn: React.Reducer<AuthFormState, DispatchType> = (state, action) => {
	if (action.type === "login") {
		const { email, password } = action.payload as AuthForm;
		const { emailInputState, passwordInputState } = validateLoginForm({ email: email, password: password });

		return {
			isValid: !emailInputState.isError && !passwordInputState.isError,
			emailInputError: emailInputState,
			passwordInputError: passwordInputState,
			email,
			password,
		};
	} else if (action.type === "signup") {
		const { email, password, repeatPassword } = action.payload as AuthForm;
		const { emailInputError, passwordInputError, repeatPasswordInputError } = validateSignUpForm({
			email,
			password,
			repeatPassword,
		});
		const isValid = !emailInputError.isError && !passwordInputError.isError && !repeatPasswordInputError.isError;

		return {
			isValid,
			emailInputError,
			passwordInputError,
			repeatPasswordInputError,
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
export const useValidateAuthForm = (): [
	AuthFormState,
	React.Dispatch<DispatchType>,
	SignUpResponsePayload,
	boolean,
] => {
	const [state, dispatch] = useReducer<React.Reducer<AuthFormState, DispatchType>>(validateReducerFn, intState);
	const { email, password, repeatPassword } = state;
	const [payload, setPayload] = useState<SignUpResponsePayload | null>();
	const [isError, setIsError] = useState<boolean>(false);
	useEffect(() => {
		setIsError(false);
		setPayload(null);
		if (state.isValid) {
			if (!!repeatPassword)
				signUp({ email, password, repeatPassword }).then((res: Response) => {
					if (res.statusCode !== 201) setIsError(true);
					setPayload(res.payload);
				});
		}
	}, [state.email, state.password, state.repeatPassword]);
	return [state, dispatch, payload!, isError];
};

function validateLoginForm(loginForm: AuthForm) {
	const { email: email, password: password } = loginForm;
	let emailInputState: AuthInputError = {
		isError: false,
		errorMessage: "",
	};
	let passwordInputState: AuthInputError = {
		isError: false,
		errorMessage: "",
	};
	if (!email || email.length === 0)
		emailInputState = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (!validateEmail(email))
		emailInputState = {
			isError: true,
			errorMessage: "Invalid email",
		};
	if (!password || password.length === 0)
		passwordInputState = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (password.length < 8)
		passwordInputState = {
			isError: true,
			errorMessage: "At least 8 characters",
		};
	return { emailInputState, passwordInputState };
}

function validateSignUpForm(signUpForm: AuthForm) {
	const { email: email, password: password, repeatPassword: repeatPassword } = signUpForm;
	let emailInputState: AuthInputError = { ...defaultAuthInputState };
	let passwordInputState: AuthInputError = { ...defaultAuthInputState };
	let repeatPasswordInputState: AuthInputError = { ...defaultAuthInputState };

	if (!email || email.length === 0)
		emailInputState = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (!validateEmail(email))
		emailInputState = {
			isError: true,
			errorMessage: "Invalid email",
		};

	if (!password || password.length === 0)
		passwordInputState = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (password.length < 8)
		passwordInputState = {
			isError: true,
			errorMessage: "At least 8 characters",
		};
	if (!repeatPassword || repeatPassword.length === 0)
		repeatPasswordInputState = {
			isError: true,
			errorMessage: "Can't be empty",
		};
	else if (repeatPassword !== password)
		repeatPasswordInputState = {
			isError: true,
			errorMessage: "Password does not match",
		};

	return {
		emailInputError: emailInputState,
		passwordInputError: passwordInputState,
		repeatPasswordInputError: repeatPasswordInputState,
	};
}
