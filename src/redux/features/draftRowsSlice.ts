import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../redux/store';
import { IDraftRow } from '../api/types';
import { draftRowsApi } from '../api/draftRowsApi';

type InitialState = {
    draftrows: IDraftRow[] | null;
}

const initialState: InitialState = {
    draftrows: null,
};

const slice = createSlice({
    name: "draftrows",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(draftRowsApi.endpoints.getDraftRows.matchFulfilled, (state, action) => {
                state.draftrows = action.payload;
            })
    },
});

export const { logout } = slice.actions;
export default slice.reducer;
export const selectDraftRows = (state: RootState) => state.draftrows

