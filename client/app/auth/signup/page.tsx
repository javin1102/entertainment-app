"use client";
import { AuthFormLayout, AuthInput } from "@/app/Components/auth";
import { RedButton } from "@/app/Components/general";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useValidateAuthForm } from "@/app/hooks/use-validate-form";
import { SignUpErrorPayload, SignUpSuccessPayload } from "@/app/types";
import { useRouter } from "next/navigation";
const SignUp = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const repeatPasswordRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const [state, dispatchValidateForm, payload, isError] = useValidateAuthForm();
	useEffect(() => {
		if (state.isValid && !!(payload as SignUpSuccessPayload)?.access_token) {
			router.push("/");
		}
	}, [isError, state.isValid, payload]);

	const submitForm = () => {
		dispatchValidateForm({
			type: "signup",
			payload: {
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
				repeatPassword: repeatPasswordRef.current?.value,
			},
		});
	};

	return (
		<div className="w-full flex flex-col justify-center items-center fixed top-[50%] -translate-y-[50%] ">
			<Image src="/logo.svg" alt="logo icon" width={50} height={50} className="mb-12" />
			<AuthFormLayout>
				<h1 className="heading-lg-text">Sign Up</h1>
				<AuthInput
					errorMessage={isError ? (payload as SignUpErrorPayload)?.email : state.emailInputError?.errorMessage}
					ref={emailRef}
					attributes={{ placeholder: "Email Address", type: "email" }}
				/>
				<AuthInput
					errorMessage={isError ? (payload as SignUpErrorPayload)?.password : state.passwordInputError?.errorMessage}
					ref={passwordRef}
					attributes={{ placeholder: "Password", type: "password" }}
				/>
				<AuthInput
					errorMessage={
						isError ? (payload as SignUpErrorPayload)?.repeatPassword : state.repeatPasswordInputError?.errorMessage
					}
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
	);
};

export default SignUp;
