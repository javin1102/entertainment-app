import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, Response, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, SignUpDTO } from "./dto/auth.dto";
import { SignUpPipe } from "../pipe/SignUp.pipe";
import { Response as ExpressResponse, Request } from "express";
import { LoginPipe } from "src/pipe/Login.pipe";
import { RefreshTokenPayload } from "src/types";
import { AuthGuard } from "@nestjs/passport";
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@UsePipes(new SignUpPipe())
	@Post("/signup")
	signUp(@Body() signUpDTO: SignUpDTO, @Response() res: ExpressResponse) {
		return this.authService.signUp(signUpDTO, res);
	}
	@UsePipes(new LoginPipe())
	@HttpCode(HttpStatus.OK)
	@Post("/login")
	login(@Body() loginDTO: LoginDTO, @Response() res: ExpressResponse) {
		return this.authService.login(loginDTO, res);
	}

	@UseGuards(AuthGuard("jwt-refresh"))
	@Post("/refresh")
	refreshTokens(@Req() req: Request) {
		const { user } = req;
		const { userId, refresh_token } = user as RefreshTokenPayload;
		return this.authService.refreshTokens({ userId, refresh_token });
		// return user;
	}
}
