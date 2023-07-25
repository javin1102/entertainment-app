import { IsEmail, IsNotEmpty, Length } from "class-validator";
export class LoginDTO {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Length(8)
	@IsNotEmpty()
	password: string;
}

export class SignUpDTO {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Length(8)
	@IsNotEmpty()
	password: string;

	@Length(8)
	@IsNotEmpty()
	repeatPassword: string;
}
