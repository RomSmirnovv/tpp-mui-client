import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICompany, CompanyId, UserId } from './types';

const BASE_URL = 'http://31.128.39.245:5000';

export const companyApi = createApi({
	reducerPath: 'companyApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/`,
	}),
	tagTypes: ['Company'],
	endpoints: (builder) => ({
		getCompanies: builder.query<ICompany, UserId>({
			query(userId) {
				return {
					url: `companies/${userId}`,
					method: 'GET',
				};
			},
			providesTags: ['Company'],
		}),
		getOneCompany: builder.query<ICompany, CompanyId>({
			query: (companyId) => ({
				url: `company/${companyId}`,
				method: 'GET',
			}),
			providesTags: ['Company'],
		}),
		editCompany: builder.mutation<ICompany, ICompany>({
			query: (company) => ({
				url: `company/${company._id}`,
				method: 'PATCH',
				body: company
			}),
			invalidatesTags: ['Company'],
		}),
		addCompany: builder.mutation<ICompany, ICompany>({
			query: (company) => ({
				url: 'company',
				method: 'POST',
				body: company
			}),
			invalidatesTags: ['Company'],
		}),
		deleteCompany: builder.mutation<ICompany, string>({
			query: (companyId) => ({
				url: `company/${companyId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Company'],
		})
	}),
});



export const {
	useGetCompaniesQuery,
	useEditCompanyMutation,
	useAddCompanyMutation,
	useDeleteCompanyMutation,
	useGetOneCompanyQuery
} = companyApi;
