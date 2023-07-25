import "@testing-library/jest-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import Login from "./page";
describe("test", () => {
	const setup = () => {
		const utils = render(<Login />);
		const emailInput = screen.getByPlaceholderText(/Email Address/i) as HTMLInputElement;
		const passwordInput = screen.getByPlaceholderText(/Password/i) as HTMLInputElement;
		const buttonInput = screen.getByRole("button") as HTMLButtonElement;
		return {
			...utils,
			emailInput,
			passwordInput,
			buttonInput,
		};
	};

	test("check validate triggered", () => {
		const { buttonInput } = setup();
		const onclick = jest.fn();
		buttonInput.onclick = onclick;
		fireEvent.click(buttonInput);
		expect(onclick).toHaveBeenCalledTimes(1);
	});
});
