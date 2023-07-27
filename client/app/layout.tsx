"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
const outfit = Outfit({ subsets: ["latin"] });
export const metadata: Metadata = {
	title: "Entertainment app",
	description: "Bookmark your favorite movies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={outfit.className}>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						{children}
					</PersistGate>
				</Provider>
			</body>
		</html>
	);
}
