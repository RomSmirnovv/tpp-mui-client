import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../redux/store';
import { IColumn } from '../api/types';
import { columnApi } from '../api/columnsApi';

type InitialState = {
	columns: IColumn[] | null;
}

const initialState: InitialState = {
	columns: null,
};

const slice = createSlice({
	name: "columns",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(columnApi.endpoints.getColumns.matchFulfilled, (state, action) => {
				state.columns = action.payload;
			})
	},
});

export const { logout } = slice.actions;
export default slice.reducer;
export const selectLists = (state: RootState) => state.columns

