import { createSlice } from "@reduxjs/toolkit";
import { notificationApi } from "../../redux/api/notificationApi";
import { INotification } from '../api/types';

type InitialState = {
	notifications: INotification[] | null;
}

const initialState: InitialState = {
	notifications: null,
};

const slice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(notificationApi.endpoints.getNotificationsByUser.matchFulfilled, (state, action) => {
				state.notifications = action.payload;
			})
	},
});

export const { logout } = slice.actions;
export default slice.reducer;

