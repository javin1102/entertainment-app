"use client";
import { AuthFormLayout, AuthInput } from "@/app/Components/auth";
import { RedButton } from "@/app/Components/general";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { useValidateAuthForm } from "@/app/hooks/use-validate-form";
import axios, { AxiosError } from "axios";
import { AuthForm } from "@/app/types/auth";
const SignUp = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const repeatPasswordRef = useRef<HTMLInputElement>(null);
	const [state, dispatchValidateForm] = useValidateAuthForm();
	useEffect(() => {
		if (!state.isValid) return;
		const body: AuthForm = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
			repeatPassword: repeatPasswordRef.current?.value,
		};

		const sendRequest = async () => {
			try {
				console.log(body);

				const res = await axios.post(process.env.API_URL + "/auth/signup", body);
				console.log(res.data);
				// if (emailRef.current) emailRef.current.value = "";
				// if (passwordRef.current) passwordRef.current.value = "";
				// if (repeatPasswordRef.current) repeatPasswordRef.current.value = "";
			} catch (err) {
				const axiosErr = err as AxiosError;
				console.log(axiosErr);
			}
		};
		sendRequest();
	}, [state]);
	const validateForm = () => {
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
		<div className="w-full flex flex-col justify-center items-center py-24">
			<Image src="/logo.svg" alt="logo icon" width={50} height={50} className="mb-24" />
			<AuthFormLayout>
				<h1 className="heading-lg-text">Sign Up</h1>
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
				<AuthInput
					inputState={state.repeatPasswordInput}
					ref={repeatPasswordRef}
					attributes={{ placeholder: "Repeat Password", type: "password" }}
				/>
				<RedButton attributes={{ type: "button", className: "mt-10", onClick: validateForm }}>
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
