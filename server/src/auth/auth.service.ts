import { Injectable, InternalServerErrorException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDTO, SignUpDTO } from "./dto/auth.dto";
import { v4 as uuid } from "uuid";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from "@nestjs/config";
import { ResponseAPI } from "src/types";
@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signUp(signUpDTO: SignUpDTO) {
		const { email, password, repeatPassword } = signUpDTO;
		const hashedPassword = await argon.hash(password);
		try {
			const user = await this.prisma.user.create({
				data: {
					id: uuid(),
					email,
					password: hashedPassword,
				},
			});

			if (password !== repeatPassword) {
				const response: ResponseAPI = {
					message: "Sign up failed",
					payload: { repeatPassword: "Password does not match" },
					statusCode: 400,
				};
				throw new BadRequestException(response);
			}

			const payload = { sub: user.id, email: user.email };
			const access_token = await this.jwt.signAsync(payload, { secret: this.config.get("JWT_SECRET") });
			const response: ResponseAPI = {
				message: "Sign up success",
				payload: { access_token },
				statusCode: 201,
			};
			return response;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === "P2002") {
					const response: ResponseAPI = {
						payload: {
							email: "Email is taken",
						},
						message: "Sign up failed",
						statusCode: 400,
					};
					throw new BadRequestException(response);
				} else {
					const response: ResponseAPI = {
						payload: {},
						message: "Internal server error",
						statusCode: 500,
					};
					throw new InternalServerErrorException(response);
				}
			}
		}
	}

	async login(loginDTO: LoginDTO) {
		try {
			const user = await this.prisma.user.findFirstOrThrow({
				where: {
					email: loginDTO.email,
				},
			});

			const passwordMatches = await argon.verify(user.password, loginDTO.password);
			if (passwordMatches === false) {
				const response: ResponseAPI = {
					payload: {
						password: "Password does not match",
					},
					message: "Signed up failed",
					statusCode: 403,
				};
				throw new ForbiddenException(response);
			}
			const payload = { sub: user.id, email: user.email };
			return {
				access_token: await this.jwt.signAsync(payload, { secret: this.config.get("JWT_SECRET") }),
			};
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === "P2025") {
					const response: ResponseAPI = {
						payload: {
							email: "Email does not exists",
						},
						message: "Signed up failed",
						statusCode: 403,
					};
					throw new ForbiddenException(response);
				}
			}
		}
	}
}
