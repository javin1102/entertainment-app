import type { AuthForm, AuthFormState, AuthInputState } from "../types/auth";
import { useReducer } from "react";
import { validateEmail } from "../utils";
type DispatchType = {
	type: "login" | "signup";
	payload: AuthForm;
};

export const validateReducerFn: React.Reducer<AuthFormState, DispatchType> = (state, action) => {
	if (action.type === "login") {
		const { email, password } = action.payload;
		const { emailInputState, passwordInputState } = validateLoginForm({ email, password });

		return {
			isValid: !emailInputState.isError && !passwordInputState.isError,
			emailInput: emailInputState,
			passwordInput: passwordInputState,
		};
	} else if (action.type === "signup") {
		const { email, password, repeatPassword } = action.payload;
		const { emailInputState, passwordInputState, repeatPasswordInputState } = validateSignUpForm({
			email,
			password,
			repeatPassword,
		});
		return {
			isValid: !emailInputState.isError && !passwordInputState.isError && !repeatPasswordInputState.isError,
			emailInput: emailInputState,
			passwordInput: passwordInputState,
			repeatPasswordInput: repeatPasswordInputState,
		};
	}
	return state;
};
const intState: AuthFormState = {
	isValid: false,
};
export const useValidateAuthForm = (): [AuthFormState, React.Dispatch<DispatchType>] => {
	const [state, dispatch] = useReducer<React.Reducer<AuthFormState, DispatchType>>(validateReducerFn, intState);
	return [state, dispatch];
};

function validateLoginForm(loginForm: AuthForm) {
	const { email, password } = loginForm;
	let emailInputState: AuthInputState = {
		isError: false,
		errorMessage: "",
	};
	let passwordInputState: AuthInputState = {
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
	const { email, password, repeatPassword } = signUpForm;
	let emailInputState: AuthInputState = {
		isError: false,
		errorMessage: "",
	};

	let passwordInputState: AuthInputState = {
		isError: false,
		errorMessage: "",
	};

	let repeatPasswordInputState: AuthInputState = {
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

	return { emailInputState, passwordInputState, repeatPasswordInputState };
}
