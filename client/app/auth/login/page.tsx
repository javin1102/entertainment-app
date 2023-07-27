"use client";
import { AuthFormLayout, AuthInput } from "@/app/Components/auth";
import { RedButton } from "@/app/Components/general";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useValidateAuthForm } from "@/app/hooks/use-validate-form";
import { AuthErrorPayload } from "@/app/types";
import { useAuthenticate } from "@/app/hooks/use-authenticate";
import { useSelector } from "react-redux";
import type { StoreState } from "../../store/store";
import { useRouter } from "next/navigation";
const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
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

	const redirectToHomePageIfAuthenticated = () => {
		if (!isAuthenticated) return;
		router.push("/");
	};

	useEffect(redirectToHomePageIfAuthenticated, [isAuthenticated]);

	const submitForm = () =>
		dispatchForm({
			type: "login",
			payload: {
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
			},
		});
	return (
		<>
			{!isAuthenticated && !isLoading && (
				<div className="w-full flex flex-col justify-center items-center py-24">
					<Image src="/logo.svg" alt="logo icon" width={50} height={50} className="mb-24" />
					<AuthFormLayout>
						<h1 className="heading-lg-text">Login</h1>
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
						<RedButton attributes={{ type: "button", className: "mt-10", onClick: submitForm }}>
							Login to your account
						</RedButton>
						<div className="body-md-text mt-8 w-full text-center">
							Don't have an account?
							<span className="text-red">
								<Link href="/auth/signup"> Sign Up</Link>
							</span>
						</div>
					</AuthFormLayout>
				</div>
			)}
		</>
	);
};

export default Login;
