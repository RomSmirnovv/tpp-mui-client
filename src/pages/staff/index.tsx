import { Box, Button, Container } from '@mui/material';
import Header from '../../components/header';
import Footer from '../../components/footer';
import StaffTable from '../../components/staff-table';
import AddUserModal from '../../components/add-user-modal';
import { useState } from 'react';
import { useAppSelector } from '../../redux/store';
import ChatWidget from '../../components/chat-widget';

const Staff = () => {
	const currentUser = useAppSelector((state) => state.userState.user) || {};
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);


	return (
		<>
			<Header user={currentUser} />
			<Container sx={{ my: 3 }} maxWidth="xl">
				<Box sx={{ textAlign: 'left' }}>
					<Button variant="contained" onClick={handleOpen}>Добавить сотрудника</Button>
				</Box>
				<Box sx={{ my: 3 }}>
					<StaffTable />
				</Box>
				<AddUserModal open={open} handleClose={handleClose} />
			</Container>
			<Footer />
			<ChatWidget user={currentUser} />
		</>
	);
}

export default Staff;