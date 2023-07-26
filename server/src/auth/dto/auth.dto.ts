import { IsEmail, IsString, Length, ValidateIf } from "class-validator";

export class ValidationErrorDTO {
	property: string;
	constraints: Record<string, string>;
}

export class LoginDTO {
	@ValidateIf(() => false)
	@IsEmail({}, {})
	email: string;
	@ValidateIf(() => false)
	@IsString({})
	password: string;
}

export class SignUpDTO {
	@ValidateIf(() => false)
	@IsEmail({}, {})
	email: string;
	@ValidateIf(() => false)
	@Length(8)
	password: string;
	@ValidateIf(() => false)
	repeatPassword: string;
}
