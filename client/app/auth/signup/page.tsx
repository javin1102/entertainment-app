"use client";
import { AuthFormLayout, AuthInput } from "@/app/Components/auth";
import { RedButton } from "@/app/Components/general";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useValidateAuthForm } from "@/app/hooks/use-validate-form";
import { AuthErrorPayload } from "@/app/types";
import { useAuthenticate } from "@/app/hooks/use-authenticate";
import type { StoreState } from "../../store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const SignUp = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const repeatPasswordRef = useRef<HTMLInputElement>(null);
	const { formState, dispatchForm, response } = useValidateAuthForm("/");
	const user = useSelector((state: StoreState) => state.user);
	const { isLoading, isAuthenticated } = useAuthenticate(user.access_token);
	const router = useRouter();

	const emailError = response?.isError
		? (response.payload as AuthErrorPayload)?.email
		: formState.emailError?.errorMessage;

	const passwordError = response?.isError
		? (response.payload as AuthErrorPayload)?.password
		: formState.passwordError?.errorMessage;

	const repeatPasswordError = response?.isError
		? (response.payload as AuthErrorPayload)?.repeatPassword
		: formState.passwordError?.errorMessage;

	const redirectToHomePageIfAuthenticated = () => {
		if (!isAuthenticated) return;
		router.push("/");
	};

	useEffect(redirectToHomePageIfAuthenticated, [isAuthenticated]);

	const submitForm = () => {
		dispatchForm({
			type: "signup",
			payload: {
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
				repeatPassword: repeatPasswordRef.current?.value,
			},
		});
	};

	return (
		<>
			{!isAuthenticated && !isLoading && (
				<div className="w-full flex flex-col justify-center items-center fixed top-[50%] -translate-y-[50%] ">
					<Image src="/logo.svg" alt="logo icon" width={50} height={50} className="mb-12" />
					<AuthFormLayout>
						<h1 className="heading-lg-text">Sign Up</h1>
						<AuthInput
							errorMessage={emailError}
							ref={emailRef}
							attributes={{ placeholder: "Email Address", type: "email" }}
						/>
						<AuthInput
							errorMessage={passwordError}
							ref={passwordRef}
							attributes={{ placeholder: "Password", type: "password" }}
						/>
						<AuthInput
							errorMessage={repeatPasswordError}
							ref={repeatPasswordRef}
							attributes={{ placeholder: "Repeat Password", type: "password" }}
						/>
						<RedButton attributes={{ type: "button", className: "mt-10", onClick: submitForm }}>
							Create an account
						</RedButton>
						<div className="body-md-text mt-8 w-full text-center">
							Already have an account?
							<span className="text-red">
								<Link href="/auth/login"> Login</Link>
							</span>
						</div>
					</AuthFormLayout>
				</div>
			)}
		</>
	);
};

export default SignUp;
