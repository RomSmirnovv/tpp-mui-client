import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IList, UserId } from './types';

const BASE_URL = 'http://localhost:5000';

export const listApi = createApi({
	reducerPath: 'listApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/`,
	}),
	tagTypes: ['List'],
	endpoints: (builder) => ({
		getListByUser: builder.query<IList[], UserId>({
			query(userId) {
				return {
					url: `lists/${userId}`,
					method: 'GET',
				};
			},
			providesTags: ['List'],
		}),
		getOneList: builder.query<IList, UserId>({
			query: (listId) => ({
				url: `list/${listId}`,
				method: 'GET',
			}),
			providesTags: ['List'],
		}),
		editList: builder.mutation<IList, IList>({
			query: (list) => ({
				url: 'list',
				method: 'PATCH',
				body: list
			}),
			invalidatesTags: ['List'],
		}),
		addList: builder.mutation<IList, IList>({
			query: (list) => ({
				url: 'list',
				method: 'POST',
				body: list
			}),
			invalidatesTags: ['List'],
		}),
		deleteList: builder.mutation<IList, string>({
			query: (listId) => ({
				url: `list/${listId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['List'],
		})
	}),
});



export const {
	useGetListByUserQuery,
	useEditListMutation,
	useAddListMutation,
	useDeleteListMutation,
	useGetOneListQuery
} = listApi;
