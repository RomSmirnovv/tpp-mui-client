import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IColumn, ColumnId, UserId } from './types';

const BASE_URL = 'http://31.128.39.245:5000';

export const columnApi = createApi({
	reducerPath: 'columnApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/`,
	}),
	tagTypes: ['Columns'],
	endpoints: (builder) => ({
		getAllColumns: builder.query<IColumn[], void>({
			query() {
				return {
					url: 'column',
					method: 'GET',
				};
			}
		}),
		getColumns: builder.query<IColumn, UserId>({
			query(userId) {
				return {
					url: `columns/${userId}`,
					method: 'GET',
				};
			},
			providesTags: ['Columns'],
		}),
		editColumn: builder.mutation<IColumn, IColumn>({
			query: (column) => ({
				url: `column/${column._id}`,
				method: 'PATCH',
				body: column
			}),
			invalidatesTags: ['Columns'],
		}),
		addColumn: builder.mutation<IColumn, IColumn>({
			query: (column) => ({
				url: 'column',
				method: 'POST',
				body: column
			}),
			invalidatesTags: ['Columns'],
		}),
		deleteList: builder.mutation<IColumn, string>({
			query: (columnId) => ({
				url: `column/${columnId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Columns'],
		})
	}),
});



export const {
	useGetColumnsQuery,
	useEditColumnMutation,
	useAddColumnMutation,
	useDeleteListMutation,
	useGetAllColumnsQuery
} = columnApi;
