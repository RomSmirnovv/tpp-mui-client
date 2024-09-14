import { createSlice } from "@reduxjs/toolkit";
import { listApi } from "../../redux/api/listApi";
import { IList } from '../api/types';

type InitialState = {
	lists: IList[] | null;
}

const initialState: InitialState = {
	lists: null,
};

const slice = createSlice({
	name: "lists",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(listApi.endpoints.getListByUser.matchFulfilled, (state, action) => {
				state.lists = action.payload;
			})
	},
});

export const { logout } = slice.actions;
export default slice.reducer;

