import { Injectable, InternalServerErrorException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDTO, SignUpDTO } from "./dto/auth.dto";
import { v4 as uuid } from "uuid";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenPayload, ResponseAPI } from "src/types";
import { Response } from "express";
@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signUp(signUpDTO: SignUpDTO, res: Response) {
		const { email, password } = signUpDTO;
		const hashedPassword = await argon.hash(password);
		try {
			const user = await this.prisma.user.create({
				data: {
					id: uuid(),
					email,
					password: hashedPassword,
				},
			});

			const { access_token, refresh_token } = await this.getTokens(user.id, user.email);
			await this.updateRefreshTokenHash({ userId: user.id, refresh_token });
			const response: ResponseAPI = {
				message: "Sign up success",
				payload: { access_token, refresh_token },
				statusCode: 201,
			};
			this.sendRefreshTokenCookie(refresh_token, res);
			return res.status(201).send(response);
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

	async login(loginDTO: LoginDTO, res: Response) {
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
					message: "Sign in failed",
					statusCode: 400,
				};
				return res.status(400).send(response);
			}
			const { access_token, refresh_token } = await this.getTokens(user.id, user.email);
			await this.updateRefreshTokenHash({ userId: user.id, refresh_token });
			const response: ResponseAPI = {
				message: "Sign in success",
				payload: { access_token, refresh_token },
				statusCode: 200,
			};
			this.sendRefreshTokenCookie(refresh_token, res);
			return res.send(response);
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === "P2025") {
					const response: ResponseAPI = {
						payload: {
							email: "Email does not exists",
						},
						message: "Signed up failed",
						statusCode: 400,
					};
					throw new BadRequestException(response);
				}
			}
		}
	}

	async refreshTokens({ userId, refresh_token }: RefreshTokenPayload, res: Response) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		const userNotFoundResponse: ResponseAPI = {
			message: "User not found",
			payload: {},
			statusCode: 400,
		};
		if (!user) throw new BadRequestException(userNotFoundResponse);

		const rtMatches = await argon.verify(user.hashedRefreshToken, refresh_token);
		const unmatchRefreshTokenResponse: ResponseAPI = {
			message: "Invalid refresh token",
			payload: {},
			statusCode: 403,
		};
		if (!rtMatches) throw new ForbiddenException(unmatchRefreshTokenResponse);

		const { access_token, refresh_token: newRefreshToken } = await this.getTokens(user.id, user.email);
		await this.updateRefreshTokenHash({ userId: user.id, refresh_token: newRefreshToken });
		const response: ResponseAPI = {
			message: "Refresh token success",
			payload: { access_token, refresh_token },
			statusCode: 200,
		};
		this.sendRefreshTokenCookie(newRefreshToken, res);
		return res.status(200).send(response);
	}

	async getTokens(userId: string, email: string) {
		const payload = { userId, email };

		const [access_token, refresh_token] = await Promise.all([
			this.jwt.signAsync(payload, {
				secret: this.config.get("ACCESS_JWT_SECRET"),
				expiresIn: "15m",
			}),
			this.jwt.signAsync(payload, {
				secret: this.config.get("REFRESH_JWT_SECRET"),
				expiresIn: "7d",
			}),
		]);

		return { access_token, refresh_token };
	}

	sendRefreshTokenCookie(refreshToken: string, res: Response) {
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			expires: new Date(new Date().getTime() + 1000 * 6 * 15),
			sameSite: "strict",
		});
	}

	async updateRefreshTokenHash({ userId, refresh_token }: RefreshTokenPayload) {
		const hashedRefreshToken = await argon.hash(refresh_token);
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hashedRefreshToken,
			},
		});
	}
}
