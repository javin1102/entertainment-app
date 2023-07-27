export type AuthError = {
	isError: boolean;
	errorMessage?: string;
};

export interface AuthForm {
	email: string | undefined;
	password: string | undefined;
	repeatPassword?: string | undefined;
}

export interface AuthFormState extends AuthForm {
	isValid: boolean;
	emailError?: AuthError;
	passwordError?: AuthError;
	repeatPasswordError?: AuthError;
}
