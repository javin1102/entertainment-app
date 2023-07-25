"use client";
import { AuthFormLayout, AuthInput } from "@/app/Components/auth";
import { RedButton } from "@/app/Components/general";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useValidateAuthForm } from "@/app/hooks/use-validate-form";
const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [state, dispatchValidateForm] = useValidateAuthForm();
	useEffect(() => {
		if (!state.isValid) return;
		if (emailRef.current) emailRef.current.value = "";
		if (passwordRef.current) passwordRef.current.value = "";
	}, [state]);
	const validateForm = () =>
		dispatchValidateForm({
			type: "login",
			payload: {
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
			},
		});
	return (
		<div className="w-full flex flex-col justify-center items-center py-24">
			<Image src="/logo.svg" alt="logo icon" width={50} height={50} className="mb-24" />
			<AuthFormLayout>
				<h1 className="heading-lg-text">Login</h1>
				<AuthInput
					inputState={state.emailInput}
					ref={emailRef}
					attributes={{ placeholder: "Email Address", type: "email" }}
				/>
				<AuthInput
					inputState={state.passwordInput}
					ref={passwordRef}
					attributes={{ placeholder: "Password", type: "password" }}
				/>
				<RedButton attributes={{ type: "button", className: "mt-10", onClick: validateForm }}>
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
	);
};

export default Login;
