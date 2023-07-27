import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get("REFRESH_JWT_SECRET"),
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: { userId: string; email: string }) {
		const refresh_token = req.get("Authorization").replace("Bearer", "").trim();
		return {
			...payload,
			refresh_token,
		};
	}
}
