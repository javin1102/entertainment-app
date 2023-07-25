import { AuthForm, AuthFormState } from "../types/auth";
import { validateReducerFn } from "./use-validate-form";

describe("auth form validation", () => {
	describe("login ", () => {
		test("email is not valid", () => {
			const loginFormState: AuthFormState = {
				isValid: false,
			};
			const loginForm: AuthForm = {
				email: "asdsa@r",
				password: "tere",
			};

			const state = validateReducerFn(loginFormState, { type: "login", payload: loginForm });
			expect(state.emailInput?.errorMessage).toMatch(/invalid email/i);
			expect(state.isValid).toBe(false);
		});

		test("email is empty", () => {
			const loginFormState: AuthFormState = {
				isValid: false,
			};
			const state = validateReducerFn(loginFormState, { type: "login", payload: { email: "", password: "rwerwerwe" } });
			expect(state.emailInput?.errorMessage).toMatch(/can't be empty/i);
			expect(state.isValid).toBeFalsy();
		});

		test("email is valid", () => {
			const loginFormState = {
				isValid: false,
			};

			const state = validateReducerFn(loginFormState, {
				type: "login",
				payload: { email: "asds@sddd.com", password: "aasdaggs" },
			});
			expect(state.emailInput?.errorMessage).toBe("");
			expect(state.isValid).toBe(true);
		});

		test("password is not valid", () => {
			const loginFormState: AuthFormState = {
				isValid: false,
			};

			const state = validateReducerFn(loginFormState, {
				type: "login",
				payload: { email: "asds@sddd.com", password: "wer" },
			});
			expect(state.passwordInput?.errorMessage).toMatch(/at least 8 characters/i);
			expect(state.isValid).toBeFalsy();
		});

		test("password is empty", () => {
			const loginFormState: AuthFormState = {
				isValid: false,
			};
			const state = validateReducerFn(loginFormState, {
				type: "login",
				payload: { email: "asds@sddd.com", password: "" },
			});
			expect(state.passwordInput?.errorMessage).toMatch(/can't be empty/i);
			expect(state.isValid).toBeFalsy();
		});

		test("password is valid", () => {
			const loginFormState: AuthFormState = {
				isValid: false,
			};

			const state = validateReducerFn(loginFormState, {
				type: "login",
				payload: { email: "asds@sddd.com", password: "werwerewrr" },
			});
			expect(state.passwordInput?.errorMessage).toBe("");
			expect(state.isValid).toBeTruthy();
		});
	});
});
