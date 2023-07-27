import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get("ACCESS_JWT_SECRET"),
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: { sub: string; email: string }) {
		const access_token = req.get("Authorization").replace("Bearer", "").trim();
		return {
			...payload,
			access_token,
		};
	}
}
