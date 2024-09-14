import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useAddCompanyMutation, useEditCompanyMutation } from '../../redux/api/companyApi';

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

const DeleteCompanyModal = ({ company, open = false, handleClose = () => { } }) => {
	const [editCompany, { error: editCompanyError, isLoading: isEditCompanyLoading, isSuccess: isEditCompanySuccess }] = useEditCompanyMutation();

	const handleDeleteCompany = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let updateCompany = { ...company, listName: 'Корзина', delComment: data.get('delComment') };
		try {
			await editCompany(updateCompany).unwrap();
			handleClose();
		} catch (error) {

		}
	}


	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
					Удалить запись
				</Typography>
				<Box component="form" onSubmit={handleDeleteCompany} sx={{ mt: 1 }} >
					<TextField
						margin="normal"
						fullWidth
						id='delComment'
						label='Комментарий'
						name='delComment'
						autoComplete='delComment'
						autoFocus
						multiline
						rows={4}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Удалить
					</Button>
					{editCompanyError && <Alert severity="error">
						{editCompanyError.data.error}
					</Alert>}
				</Box>
			</Box>
		</Modal >
	);
}

export default DeleteCompanyModal;