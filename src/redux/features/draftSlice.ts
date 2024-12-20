import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../../redux/store';
import { IDraft } from '../api/types';
import { draftsApi } from '../api/draftsApi';

type InitialState = {
    drafts: IDraft[] | null;
}

const initialState: InitialState = {
    drafts: null,
};

const slice = createSlice({
    name: "drafts",
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(draftsApi.endpoints.getAllDraft.matchFulfilled, (state, action) => {
                state.drafts = action.payload;
            })
    },
});

export const { logout } = slice.actions;
export default slice.reducer;
export const selectDrafts = (state: RootState) => state.drafts

