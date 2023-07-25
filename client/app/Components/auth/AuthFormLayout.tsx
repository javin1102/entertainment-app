import React from "react";

export const AuthFormLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<div className="w-[90%] px-8 pt-8 pb-10 mx-auto bg-semi-dark-blue rounded-[1.5rem] sm:max-w-[35rem]">
			{children}
		</div>
	);
};
