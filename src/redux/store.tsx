import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import userReducer from './features/userSlice';
import { listApi } from './api/listApi';
import { columnApi } from './api/columnsApi';
import { companyApi } from './api/companyApi';
import { notificationApi } from './api/notificationApi';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[listApi.reducerPath]: listApi.reducer,
		[columnApi.reducerPath]: columnApi.reducer,
		[companyApi.reducerPath]: companyApi.reducer,
		[notificationApi.reducerPath]: notificationApi.reducer,
		authState: authApi.reducer,
		userState: userReducer,
		listState: listApi.reducer,
		columnsState: columnApi.reducer,
		companyState: companyApi.reducer,
		notificationState: notificationApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({}).concat([authApi.middleware, userApi.middleware, listApi.middleware, columnApi.middleware, companyApi.middleware, notificationApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 