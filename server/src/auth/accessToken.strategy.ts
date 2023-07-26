import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get("ACCESS_JWT_SECRET"),
		});
	}

	validate(payload: { sub: string; email: string }) {
		return payload;
	}
}
