import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../config';
import { useGetUserQuery } from '../redux/api/userApi';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { data: user } = useGetUserQuery(null);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!user?._id || !user?.workspaceId) {
			console.log('⚠️ Socket: Пользователь не загружен, ожидание...');
			return;
		}

		// Получаем токен из cookies
		const getTokenFromCookies = () => {
			const cookies = document.cookie.split(';');
			const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
			return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
		};

		const token = getTokenFromCookies();

		if (!token) {
			console.error('❌ Socket: Токен не найден в cookies');
			return;
		}

		console.log('🔌 Socket: Создание подключения...');

		const newSocket = io(BASE_URL, {
			auth: {
				token: token,
			},
			withCredentials: true, // Важно для передачи cookies
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			reconnectionDelayMax: 5000,
		});

		newSocket.on('connect', () => {
			console.log('✅ Socket: Подключено', newSocket.id);
		});

		newSocket.on('disconnect', (reason) => {
			console.log('❌ Socket: Отключено', reason);
		});

		newSocket.on('connect_error', (error) => {
			console.error('❌ Socket: Ошибка подключения', error.message);
		});

		newSocket.on('error', (error) => {
			console.error('❌ Socket: Ошибка', error);
		});

		setSocket(newSocket);

		return () => {
			console.log('🔌 Socket: Закрытие подключения...');
			newSocket.close();
		};
	}, [user?._id, user?.workspaceId]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const socket = useContext(SocketContext);
	return socket; // Возвращаем null если socket не готов, компоненты должны проверять
};
