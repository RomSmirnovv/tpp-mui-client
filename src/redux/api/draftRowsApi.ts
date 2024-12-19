import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IDraftRow, UserId } from './types';
import { BASE_URL } from '../../config';

export const draftRowsApi = createApi({
    reducerPath: 'draftRowsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/`,
    }),
    tagTypes: ['DraftRows'],
    endpoints: (builder) => ({
        getAllDraftRows: builder.query<IDraftRow[], void>({
            query() {
                return {
                    url: 'draftrow',
                    method: 'GET',
                };
            }
        }),
        getDraftRows: builder.query<IDraftRow, UserId>({
            query(userId) {
                return {
                    url: `draftrow/${userId}`,
                    method: 'GET',
                };
            },
            providesTags: ['DraftRows'],
        }),
        editDraftRow: builder.mutation<IDraftRow, IDraftRow>({
            query: (draftrow) => ({
                url: `draftrow/${draftrow._id}`,
                method: 'PATCH',
                body: draftrow
            }),
            invalidatesTags: ['DraftRows'],
        }),
        addDraftRow: builder.mutation<IDraftRow, IDraftRow>({
            query: (draftrow) => ({
                url: 'draftrow',
                method: 'POST',
                body: draftrow
            }),
            invalidatesTags: ['DraftRows'],
        }),
        deleteDraftRow: builder.mutation<IDraftRow, void>({
            query: (draftrow) => ({
                url: `draftrow/${draftrow._id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DraftRows'],
        })
    }),
});



export const {
    useGetAllDraftRowsQuery,
    useGetDraftRowsQuery,
    useEditDraftRowMutation,
    useAddDraftRowMutation,
    useDeleteDraftRowMutation
} = draftRowsApi;
