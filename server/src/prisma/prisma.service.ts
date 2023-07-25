import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class PrismaService extends PrismaClient {
	constructor(config: ConfigService) {
		console.log(config.get("DATABASE_URL"));
		super({
			datasources: {
				db: {
					url: config.get("DATABASE_URL"),
				},
			},
		});
	}

	cleanDB() {
		return this.$transaction([this.user.deleteMany()]);
	}
}
