import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
const envFilePath = process.env.NODE_ENV === "local" ? ".env.local" : ".env";

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath,
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
