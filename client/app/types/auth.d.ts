export type AuthInputError = {
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
	emailInputError?: AuthInputError;
	passwordInputError?: AuthInputError;
	repeatPasswordInputError?: AuthInputError;
}
