import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
	key: "root",
	storage,
};

export const store = configureStore({
	reducer: {
		user: persistReducer(persistConfig, userSlice.reducer),
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: [thunk],
});

export const persistor = persistStore(store);

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
