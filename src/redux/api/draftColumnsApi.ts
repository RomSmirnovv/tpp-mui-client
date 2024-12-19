import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IDraftColumn, UserId } from './types';
import { BASE_URL } from '../../config';

export const draftColumnsApi = createApi({
    reducerPath: 'draftColumnsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/`,
    }),
    tagTypes: ['DraftColumns'],
    endpoints: (builder) => ({
        getAllDraftColumns: builder.query<IDraftColumn[], void>({
            query() {
                return {
                    url: 'draftcolumn',
                    method: 'GET',
                };
            }
        }),
        getDraftColumns: builder.query<IDraftColumn, UserId>({
            query(userId) {
                return {
                    url: `draftcolumns/${userId}`,
                    method: 'GET',
                };
            },
            providesTags: ['DraftColumns'],
        }),
        editDraftColumn: builder.mutation<IDraftColumn, IDraftColumn>({
            query: (draftcolumn) => ({
                url: `draftcolumn/${draftcolumn._id}`,
                method: 'PATCH',
                body: draftcolumn
            }),
            invalidatesTags: ['DraftColumns'],
        }),
        addDraftColumn: builder.mutation<IDraftColumn, IDraftColumn>({
            query: (draftcolumn) => ({
                url: 'draftcolumn',
                method: 'POST',
                body: draftcolumn
            }),
            invalidatesTags: ['DraftColumns'],
        }),
        deleteDraftColumn: builder.mutation<IDraftColumn, void>({
            query: (draftcolumn) => ({
                url: `draftcolumn/${draftcolumn._id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DraftColumns'],
        })
    }),
});



export const {
    useGetAllDraftColumnsQuery,
    useGetDraftColumnsQuery,
    useEditDraftColumnMutation,
    useAddDraftColumnMutation,
    useDeleteDraftColumnMutation
} = draftColumnsApi;
