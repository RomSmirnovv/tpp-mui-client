import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser } from '../features/userSlice';
import { IUser } from './types';
import { BASE_URL } from '../../config';

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/`,
	}),
	tagTypes: ['User'],
	endpoints: (builder) => ({
		getAllUsers: builder.query<IUser[], null>({
			query() {
				return {
					url: 'user',
					method: 'GET',
					credentials: 'include',
				};
			},
			providesTags: ['User'],
		}),
		getUser: builder.query<IUser, null>({
			query() {
				return {
					url: 'userme',
					credentials: 'include',
				};
			},
			transformResponse: (result: { data: { user: IUser } }) =>
				result.data.user,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch (error) { }
			},
			providesTags: ['User'],
		}),
		editUser: builder.mutation<IUser, IUser>({
			query: (body) => ({
				url: 'user',
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['User'],
		}),
		createUser: builder.mutation<IUser, IUser>({
			query: (body) => ({
				url: 'user',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
		}),
		deleteUser: builder.mutation<IUser, string>({
			query: (id) => ({
				url: `user/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
		})
	}),
});



export const {
	useGetUserQuery,
	useGetAllUsersQuery,
	useEditUserMutation,
	useCreateUserMutation,
	useDeleteUserMutation
} = userApi;
