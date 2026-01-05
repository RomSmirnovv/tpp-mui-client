import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config';

export interface IWorkspaceRegister {
	companyName: string;
	logo?: File;
	colors: string[];
	email: string;
	phone: string;
	employeesCount: number;
	adminName: string;
	adminSurname: string;
	adminPatronymic?: string;
	adminRole: string;
	adminBirthDate?: string;
	adminLogin: string;
	adminPassword: string;
}

export interface IWorkspace {
	_id: string;
	name: string;
	logo: string;
	colors: string[];
	email: string;
	phone: string;
	employeesCount: number;
	columns?: string[];
	createdAt: string;
	updatedAt: string;
	admin?: {
		_id: string;
		name: string;
		surname: string;
		patronymic?: string;
		role: number;
		birthDate?: string;
	};
}

export interface IWorkspaceRegisterResponse {
	message: string;
	workspace: {
		_id: string;
		name: string;
		logo: string;
		colors: string[];
		email: string;
	};
	admin: {
		_id: string;
		name: string;
		surname: string;
		login: string;
		role: number;
	};
}

export const workspaceApi = createApi({
	reducerPath: 'workspaceApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/workspace/`,
	}),
	tagTypes: ['Workspace'],
	endpoints: (builder) => ({
		registerWorkspace: builder.mutation<IWorkspaceRegisterResponse, FormData>({
			query(data) {
				return {
					url: 'register',
					method: 'POST',
					body: data,
				};
			},
		}),
		getWorkspace: builder.query<IWorkspace, string>({
			query(id) {
				return {
					url: id,
					method: 'GET',
				};
			},
			providesTags: ['Workspace'],
		}),
		getWorkspaceByUserId: builder.query<IWorkspace, string>({
			query(userId) {
				return {
					url: `user/${userId}`,
					method: 'GET',
				};
			},
			providesTags: ['Workspace'],
		}),
		updateWorkspace: builder.mutation<IWorkspace, { id: string; data: FormData }>({
			query({ id, data }) {
				return {
					url: id,
					method: 'PUT',
					body: data,
				};
			},
			invalidatesTags: ['Workspace'],
		}),
	}),
});

export const {
	useRegisterWorkspaceMutation,
	useGetWorkspaceQuery,
	useGetWorkspaceByUserIdQuery,
	useUpdateWorkspaceMutation,
} = workspaceApi;
