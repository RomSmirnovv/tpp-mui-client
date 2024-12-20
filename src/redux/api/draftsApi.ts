import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IDraft, UserId } from './types';
import { BASE_URL } from '../../config';

export const draftsApi = createApi({
    reducerPath: 'draftsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/`,
    }),
    tagTypes: ['Draft'],
    endpoints: (builder) => ({
        getAllDraft: builder.query<IDraft[], void>({
            query() {
                return {
                    url: 'draft',
                    method: 'GET',
                };
            }
        }),
        getDraft: builder.query<IDraft, string>({
            query(id) {
                return {
                    url: `draft/${id}`,
                    method: 'GET',
                };
            },
            providesTags: ['Draft'],
        }),
        getAllDraftsByUser: builder.query<IDraft, string>({
            query(userId) {
                return {
                    url: `drafts/${userId}`,
                    method: 'GET',
                };
            },
            providesTags: ['Draft'],
        }),
        editdraft: builder.mutation<IDraft, IDraft>({
            query: (draft) => ({
                url: `draft/${draft._id}`,
                method: 'PATCH',
                body: draft
            }),
            invalidatesTags: ['Draft'],
        }),
        adddraft: builder.mutation<IDraft, IDraft>({
            query: (draft) => ({
                url: 'draft',
                method: 'POST',
                body: draft
            }),
            invalidatesTags: ['Draft'],
        }),
        deletedraft: builder.mutation<IDraft, void>({
            query: (draftId) => ({
                url: `draft/${draftId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Draft'],
        })
    }),
});



export const {
    useGetAllDraftQuery,
    useGetDraftQuery,
    useGetAllDraftsByUserQuery,
    useEditdraftMutation,
    useAdddraftMutation,
    useDeletedraftMutation
} = draftsApi;
