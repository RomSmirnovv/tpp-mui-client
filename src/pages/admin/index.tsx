import { Container } from '@mui/material';
import Header from '../../components/header';
import HeaderBaseTable from '../../components/header-base-table';
import BaseTable from '../../components/base-table';
import { useAppSelector } from '../../redux/store';
import ChatWidget from '../../components/chat-widget';
import { useGetUserByProfileQuery } from '../../redux/api/userApi';
import { useEffect, useState } from 'react';

const Admin = () => {
	const queryParameters = new URLSearchParams(window.location.search)
	const [selectedRows, setSelectedRows] = useState([]);
	const userId = queryParameters.get("userId")
	const { data: currentUser } = useGetUserByProfileQuery(userId || null)
	// const currentUser = useAppSelector((state) => state.userState.user) || {};
	return (
		<>
			{currentUser &&
				<>
					<Header user={currentUser} />
					<Container sx={{ my: 3 }} maxWidth="xl">
						<HeaderBaseTable user={currentUser} selectedRows={selectedRows} />
						<BaseTable user={currentUser} setSelectedRows={setSelectedRows} admin={true} />
					</Container>
					<ChatWidget user={currentUser} />
				</>
			}
		</>
	);
}

export default Admin;