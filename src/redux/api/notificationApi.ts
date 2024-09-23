import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INotification, NotificationId, UserId } from './types';
import { BASE_URL } from '../../config';

export const notificationApi = createApi({
	reducerPath: 'notificationApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/`,
	}),
	tagTypes: ['Notification'],
	endpoints: (builder) => ({
		createNotification: builder.mutation<INotification, INotification>({
			query(notification) {
				return {
					url: 'notification',
					method: 'POST',
					body: notification
				};
			},
			invalidatesTags: ['Notification'],
		}),
		getNotificationsByUser: builder.query<INotification, UserId>({
			query(userId) {
				return {
					url: `notifications/${userId}`,
					method: 'GET',
				};
			},
			providesTags: ['Notification'],
		}),
		editNotification: builder.mutation<INotification, INotification>({
			query(notification) {
				return {
					url: `notification/${notification._id}`,
					method: 'PATCH',
					body: notification
				};
			},
			invalidatesTags: ['Notification'],
		})
	})
});



export const {
	useGetNotificationsByUserQuery,
	useEditNotificationMutation,
	useCreateNotificationMutation
} = notificationApi;
