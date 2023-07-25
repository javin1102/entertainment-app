import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { LoginDTO } from "./dto/auth.dto";
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get("JWT_SECRET"),
		});
	}

	validate(payload: { sub: string; email: string }) {
		return payload;
	}
}
