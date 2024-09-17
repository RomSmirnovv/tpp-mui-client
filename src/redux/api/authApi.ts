import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGenericResponse, IToken, IUser } from './types';
import { userApi } from './userApi';
import { setUser } from '../features/userSlice';

const BASE_URL = 'http://5.35.85.172:5000';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/auth/`,
	}),
	tagTypes: ['Auth'],
	endpoints: (builder) => ({
		refresh: builder.mutation<IToken, void>({
			query() {
				return {
					url: 'refresh',
					method: 'POST',
					credentials: 'include',
				}
			},
		}),
		registerUser: builder.mutation<IGenericResponse, IUser>({
			query(data) {
				return {
					url: 'register',
					method: 'POST',
					body: data,
				};
			},
		}),
		loginUser: builder.mutation<IToken, { login: string, password: string }>({
			query(data) {
				return {
					url: 'sign-in',
					method: 'POST',
					body: data,
					credentials: 'include',
				};
			},
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					await dispatch(userApi.endpoints.getUser.initiate(null));
				} catch (error) { }
			},
		}),
		logoutUser: builder.mutation<void, void>({
			query() {
				return {
					url: 'logout',
					method: 'POST',
					credentials: 'include',
				};
			},
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(setUser(null as any));
				} catch (error) { }
			},
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useLoginUserMutation,
	useLogoutUserMutation,
	useRefreshMutation
} = authApi;
