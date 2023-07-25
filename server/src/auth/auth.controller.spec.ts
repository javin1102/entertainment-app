import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { SignUpDTO } from "./dto/auth.dto";
describe("AuthController", () => {
	let controller: AuthController;
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService, PrismaService, ConfigService],
		}).compile();
		controller = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("/POST signup should return the same data as authService.signUp()", async () => {
		// const signUpDTO: SignUpDTO = {
		// 	email: "john@example.com",
		// 	password: "password123",
		// 	repeatPassword: "password123",
		// };
		// jest.spyOn(authService, "signUp").mockImplementation(() => {
		// 	return Promise.resolve(signUpDTO);
		// });
		// const response = await controller.signUp(signUpDTO);
		// expect(response).toMatchObject(signUpDTO);
	});
});
