import { Container } from '@mui/material';
import Header from '../../components/header';
import HeaderBaseTable from '../../components/header-base-table';
import BaseTable from '../../components/base-table';
import { useAppSelector } from '../../redux/store';
import ChatWidget from '../../components/chat-widget';
import { useState } from 'react';

const Home = () => {
	const currentUser = useAppSelector((state) => state.userState.user) || {};
	const [selectedRows, setSelectedRows] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [updateColumns, setUpdateColumns] = useState(false);



	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);
	return (
		<>
			{currentUser &&
				<>

					<Header user={currentUser} />
					<Container sx={{ my: 3 }} maxWidth="xl">
						<HeaderBaseTable user={currentUser} selectedRows={selectedRows} openModal={openModal} setOpenModal={setOpenModal} handleCloseModal={handleCloseModal} setUpdateColumns={setUpdateColumns} updateColumns={updateColumns} />
						<BaseTable user={currentUser} setSelectedRows={setSelectedRows} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} openModal={openModal} updateColumns={updateColumns} />
					</Container>
					<ChatWidget user={currentUser} />
				</>
			}
		</>
	);
}

export default Home;