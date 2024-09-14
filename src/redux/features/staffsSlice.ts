import { createSlice } from "@reduxjs/toolkit";
import { staffApi } from "../../app/services/staffs";
import { User } from '../../app/services/auth';
import { RootState } from '../../app/store';

type InitialState = {
	users: User[] | null;
}

const initialState: InitialState = {
	users: null,
};

const slice = createSlice({
	name: "staffs",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(staffApi.endpoints.getUsers.matchFulfilled, (state, action) => {
				state.users = action.payload;
			})
	},
});

export const { logout } = slice.actions;
export default slice.reducer;
export const selectUsers = (state: RootState) => state.staffs

