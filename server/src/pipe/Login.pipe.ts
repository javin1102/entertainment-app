import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { LoginDTO } from "../auth/dto/auth.dto";
import { ResponseAPI } from "src/types";
import { isEmail } from "class-validator";
@Injectable()
export class LoginPipe implements PipeTransform {
	async transform(value: LoginDTO) {
		const response: ResponseAPI = {
			payload: {},
			message: "Sign up failed",
			statusCode: 400,
		};

		let isError = false;
		if (!isEmail(value.email)) {
			response.payload = { email: "Invalid email" };
			isError = true;
		}
		if (value.password.length < 8) {
			response.payload = { ...response.payload, password: "At least 8 characters" };
			isError = true;
		}
		if (isError) throw new BadRequestException(response);
		return value;
	}
}
