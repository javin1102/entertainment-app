import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { SignUpDTO } from "../auth/dto/auth.dto";
import { ResponseAPI } from "src/types";
import { isEmail } from "class-validator";
@Injectable()
export class SignUpPipe implements PipeTransform {
	transform(value: SignUpDTO) {
		const response: ResponseAPI = {
			payload: {},
			message: "Sign up failed",
			statusCode: 400,
		};
		console.log(value);

		let isError = false;
		if (!isEmail(value.email)) {
			response.payload = { email: "Invalid email" };
			isError = true;
		}
		if (value.password.length < 8) {
			response.payload = { ...response.payload, password: "At least 8 characters" };
			isError = true;
		}
		if (value.password !== value.repeatPassword) {
			response.payload = { ...response.payload, repeatPassword: "Password does not match" };
			isError = true;
		}
		if (isError) throw new BadRequestException(response);
		return value;
	}
}
