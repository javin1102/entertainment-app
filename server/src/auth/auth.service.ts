import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDTO, SignUpDTO } from "./dto/auth.dto";
import { v4 as uuid } from "uuid";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { DefaultArgs, GetResult, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signUp(signUpDTO: SignUpDTO) {
		const { email, password } = signUpDTO;
		const hashedPassword = await argon.hash(password);
		const user = await this.prisma.user.create({
			data: {
				id: uuid(),
				email,
				password: hashedPassword,
			},
		});
		const payload = { sub: user.id, email: user.email };
		return {
			access_token: await this.jwt.signAsync(payload, { secret: this.config.get("JWT_SECRET") }),
		};
	}

	async login(loginDTO: LoginDTO) {
		let user;
		try {
			user = await this.prisma.user.findFirstOrThrow({
				where: {
					email: loginDTO.email,
				},
			});
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === "P2025") {
					throw new BadRequestException({ msg: "User not found" });
				}
			}
		}
		const passwordMatches = await argon.verify(user.password, loginDTO.password);
		if (passwordMatches === false) {
			throw new UnauthorizedException({ msg: "Password does not match" });
		}
		const payload = { sub: user.id, email: user.email };
		return {
			access_token: await this.jwt.signAsync(payload, { secret: this.config.get("JWT_SECRET") }),
		};
	}
}
