import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { SignUpDTO } from "../src/auth/dto/auth.dto";

describe("AppController (e2e)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
		await app.listen(3333);
		prisma = app.get(PrismaService);
		await prisma.cleanDB();
	});

	afterAll(() => {
		app.close();
	});

	it("signup", () => {
		const requestBody: SignUpDTO = {
			email: "askdask@asdkas.com",
			password: "javinrio112",
			repeatPassword: "javinrio112",
		};
		return request(app.getHttpServer()).post("/auth/signup").send(requestBody).expect(201).expect("Sign up");
	});
});
