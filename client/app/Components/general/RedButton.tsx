import React from "react";
import { twMerge } from "tailwind-merge";
export const RedButton: React.FC<
	React.PropsWithChildren<{
		attributes?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	}>
> = ({ attributes, children }) => {
	const className = twMerge(
		"bg-red w-full text-center body-md-text px-4 py-4 rounded-lg active:bg-white active:text-black",
		attributes?.className,
	);
	return (
		<button {...attributes} className={className}>
			{children}
		</button>
	);
};
