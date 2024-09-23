import { Alert, Box, Button, Link, Modal, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useAddCompanyMutation, useEditCompanyMutation } from '../../redux/api/companyApi';
import { useGetListByUserQuery, useGetOneListQuery } from '../../redux/api/listApi';
import { useEffect, useState } from 'react';
import { IList } from '../../redux/api/types';

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

const EditFileLinkModal = ({ company, open = false, handleClose = () => { } }) => {
	const [editCompany, { error: editCompanyError, isLoading: isEditCompanyLoading, isSuccess: isEditCompanySuccess }] = useEditCompanyMutation();

	const handleEditFileLink = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let updateCompany = { ...company }
		updateCompany.fileLink = data.get('fileLink') as string;
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
					Изменить ссылку на файл
				</Typography>
				<Box component="form" onSubmit={handleEditFileLink} sx={{ mt: 1 }} >
					<TextField
						margin="normal"
						fullWidth
						id='fileLink'
						label='Ссылка на файл'
						name='fileLink'
						autoComplete='fileLink'
						defaultValue={company.fileLink}
						autoFocus
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Сохранить
					</Button>
					{company.fileLink != '' ? <Link href={company.fileLink} target="_blank">Перейти</Link> : null}
					{editCompanyError && <Alert severity="error">
						{editCompanyError.data.error}
					</Alert>}
				</Box>
			</Box>
		</Modal >
	);
}

export default EditFileLinkModal;