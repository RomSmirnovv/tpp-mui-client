import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useAddCompanyMutation } from '../../redux/api/companyApi';
import { useState } from 'react';
import AddNotificationModal from '../add-notification-modal';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

const AddCompanyModal = ({ user, list, open = false, handleClose = () => { } }) => {
	const [addCompany, { error: addCompanyError, isLoading: isAdding, isSuccess: isAdded }] = useAddCompanyMutation();
	const [addedCompany, setAddedCompany] = useState({});
	const [thisNotification, setThisNotification] = useState(false);
	const [openNotification, setOpenNotification] = useState(false)

	const handleAddCompany = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let newCompany = {}
		if (list && list.columns) {
			newCompany = {
				'name': data.get('name'),
				'updateDate': moment().format('YYYY-MM-DD HH:mm:ss'),
				'listName': list.name,
				'delListName': list.name,
				'userId': user._id,
				'fullName': user.surname + ' ' + user.name + ' ' + user.patronymic
			}
			list.columns.filter((c) => c.checked === true).map((col) => {
				newCompany[col.field] = data.get(col.field)
			})
		}
		try {
			const { data } = await addCompany(newCompany);
			if (thisNotification) {
				setAddedCompany(data)
				setOpenNotification(true)
				setThisNotification(false)
			}
			handleClose();
		} catch (error) {

		}
	}

	const handleCloseNotification = () => setOpenNotification(false)


	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
						Добавить запись
					</Typography>
					<Box component="form" onSubmit={handleAddCompany} sx={{ mt: 1 }} >
						<TextField
							margin="normal"
							required
							fullWidth
							id='name'
							label='Название'
							name='name'
							autoComplete='name'
							autoFocus
						/>
						{list && list.columns ?
							list.columns.filter((c) => c.checked === true && c.field != 'name').map((col) => {
								return (
									<TextField
										key={col.key}
										margin="normal"
										fullWidth
										id={col.field}
										label={col.headerName}
										name={col.field}
										autoComplete={col.field}
										autoFocus
									/>
								)
							})
							: null}
						<Box sx={{ display: 'flex' }}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2, mr: 1 }}
							>
								Добавить
							</Button>
							<Button
								type="submit"
								fullWidth
								variant="outlined"
								sx={{ mt: 3, mb: 2, ml: 1 }}
								onClick={() => setThisNotification(true)}
							>
								Добавить с уведомлением
							</Button>
						</Box>
						{addCompanyError && <Alert severity="error">
							{addCompanyError.data.error}
						</Alert>}
					</Box>
				</Box>
			</Modal >
			<AddNotificationModal company={addedCompany} open={openNotification} handleClose={handleCloseNotification} />
		</>
	);
}

export default AddCompanyModal;