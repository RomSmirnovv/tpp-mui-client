import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../redux/store';
import { IDraftColumn } from '../api/types';
import { draftColumnsApi } from '../api/draftColumnsApi';

type InitialState = {
    draftcolumns: IDraftColumn[] | null;
}

const initialState: InitialState = {
    draftcolumns: null,
};

const slice = createSlice({
    name: "draftcolumns",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(draftColumnsApi.endpoints.getDraftColumns.matchFulfilled, (state, action) => {
                state.draftcolumns = action.payload;
            })
    },
});

export const { logout } = slice.actions;
export default slice.reducer;
export const selectDraftColumns = (state: RootState) => state.draftcolumns

