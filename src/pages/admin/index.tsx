import { Container } from '@mui/material';
import Header from '../../components/header';
import HeaderBaseTable from '../../components/header-base-table';
import BaseTable from '../../components/base-table';
import { useAppSelector } from '../../redux/store';
import ChatWidget from '../../components/chat-widget';
import { useGetUserByProfileQuery, useGetUserQuery } from '../../redux/api/userApi';
import { useEffect, useState } from 'react';

const Admin = () => {
	const queryParameters = new URLSearchParams(window.location.search)
	const [selectedRows, setSelectedRows] = useState([]);
	const userId = queryParameters.get("userId")
	
	// Используем useGetUserQuery для получения текущего пользователя (без необходимости userId в query)
	const { data: currentUserFromToken, isLoading: isLoadingUser } = useGetUserQuery(null);
	// Если userId передан в query, используем его, иначе используем пользователя из токена
	const { data: currentUserFromProfile } = useGetUserByProfileQuery(userId || null, { skip: !userId });
	
	const currentUser = currentUserFromProfile || currentUserFromToken;
	
	// const currentUser = useAppSelector((state) => state.userState.user) || {};
	return (
		<>
			{isLoadingUser ? (
				<Container sx={{ my: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
					<div>Загрузка...</div>
				</Container>
			) : currentUser ? (
				<>
					<Header user={currentUser} />
					<Container sx={{ my: 3 }} maxWidth="xl">
						<HeaderBaseTable user={currentUser} selectedRows={selectedRows} />
						<BaseTable user={currentUser} setSelectedRows={setSelectedRows} admin={true} />
					</Container>
					<ChatWidget user={currentUser} />
				</>
			) : (
				<Container sx={{ my: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
					<div>Пользователь не найден</div>
				</Container>
			)}
		</>
	);
}

export default Admin;