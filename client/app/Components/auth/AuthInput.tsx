import { AuthInputState } from "@/app/types/auth";
import React, { forwardRef } from "react";

export const AuthInput: React.FC<{
	attributes: React.InputHTMLAttributes<HTMLInputElement>;
	inputState?: AuthInputState;
	ref?: React.ForwardedRef<HTMLInputElement>;
}> = forwardRef(({ attributes, inputState }, ref) => {
	const isError = inputState && inputState.isError;
	const borderColor = isError ? "border-red" : "border-greyish-blue";

	return (
		<div className={`body-md-text bg-transparent w-full relative`}>
			<input
				ref={ref}
				{...attributes}
				className={`placeholder:body-lg-text placeholder:leading-7 ${borderColor} focus:outline-none border-b-[1px] bg-transparent mt-4 w-full p-4 focus:caret-red`}
			/>
			{isError && (
				<span className="absolute top-1/2 right-8 inline-block w-max text-red">{inputState.errorMessage}</span>
			)}
		</div>
	);
});
