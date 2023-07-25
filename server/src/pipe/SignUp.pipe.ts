import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { SignUpDTO } from "../auth/dto/auth.dto";
@Injectable()
export class SignUpPipe implements PipeTransform {
	transform(value: SignUpDTO) {
		if (value.password !== value.repeatPassword) throw new BadRequestException("Password doesn't match");
		return value;
	}
}
