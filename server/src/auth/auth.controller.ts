import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, SignUpDTO } from "./dto/auth.dto";
import { SignUpPipe } from "../pipe/SignUp.pipe";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@UsePipes(new SignUpPipe())
	@Post("/signup")
	signUp(@Body() signUpDTO: SignUpDTO) {
		return this.authService.signUp(signUpDTO);
	}

	@HttpCode(HttpStatus.OK)
	@Post("/login")
	login(@Body() loginDTO: LoginDTO) {
		return this.authService.login(loginDTO);
	}
}