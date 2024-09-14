import { createSlice } from "@reduxjs/toolkit";
import { ICompany } from '../api/types';
import { companyApi } from '../../redux/api/companyApi';
import { RootState } from '../../redux/store';

type InitialState = {
	companies: ICompany[] | null;
}

const initialState: InitialState = {
	companies: null,
};

const slice = createSlice({
	name: "companies",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(companyApi.endpoints.getCompanies.matchFulfilled, (state, action) => {
				state.companies = action.payload;
			})
	},
});

export const { logout } = slice.actions;
export default slice.reducer;
export const selectCompanies = (state: RootState) => state.companies

