import { createSlice } from "@reduxjs/toolkit";
import { IUser } from '../api/types';

type InitialState = {
	user: IUser | null;
}

const initialState: InitialState = {
	user: null,
};

const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: () => initialState,
	},
});

export const { logout } = slice.actions;
export default slice.reducer;