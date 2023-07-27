import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../types/user";
import jwt_decode from "jwt-decode";
const defaultUserValue: User = {
	access_token: "",
	email: "",
};
export const userSlice = createSlice({
	name: "user",
	initialState: defaultUserValue,
	reducers: {
		setUser: (state, action: PayloadAction<string>) => {
			const access_token = action.payload;
			const decodedToken: { email: string } = jwt_decode(access_token);
			const { email } = decodedToken;
			state.access_token = access_token;
			state.email = email;
		},

		test: () => {},
	},
});

export const setUser = userSlice.actions.setUser;
