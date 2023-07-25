export type AuthInputState = {
	isError: boolean;
	errorMessage?: string;
};

export interface AuthForm {
	email: string | undefined;
	password: string | undefined;
	repeatPassword?: string | undefined;
}

export interface AuthFormState {
	isValid: boolean;
	emailInput?: AuthInputState;
	passwordInput?: AuthInputState;
	repeatPasswordInput?: AuthInputState;
}
