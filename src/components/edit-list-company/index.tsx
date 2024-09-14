import { Alert, Box, Button, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
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

const EditListCompany = ({ company, open = false, handleClose = () => { } }) => {
	const [editCompany, { error: editCompanyError, isLoading: isEditCompanyLoading, isSuccess: isEditCompanySuccess }] = useEditCompanyMutation();
	const [addCompany, { error: addCompanyError, isLoading: isAddCompanyLoading, isSuccess: isAddCompanySuccess }] = useAddCompanyMutation();
	const { data: lists, isSuccess: isGetListSuccess } = useGetListByUserQuery(company.userId);
	const [copy, setCopy] = useState(false);

	const handleEditListCompany = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		if (copy) {
			let newCompany = { ...company, listName: data.get('listName') as string, delListName: data.get('listName') as string };
			delete newCompany._id;
			try {
				await addCompany(newCompany).unwrap();
				handleClose();
			} catch (error) {

			}
		} else {
			let updateCompany = { ...company, listName: data.get('listName') as string, delListName: data.get('listName') as string };
			try {
				await editCompany(updateCompany).unwrap();
				handleClose();
			} catch (error) {

			}
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
					Переместить/Копировать в другой лист
				</Typography>
				<Box component="form" onSubmit={handleEditListCompany} sx={{ mt: 1 }} >
					<Select
						name='listName'
						defaultValue={company.listName}
						style={{ width: '100%', marginBottom: '10px' }}
					>
						{lists?.map((list: IList) => (
							<MenuItem key={list._id} value={list.name}>{list.name}</MenuItem>
						))}
					</Select>
					<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mr: 1 }}
							onClick={() => setCopy(false)}
						>
							Переместить
						</Button>
						<Button
							type="submit"
							fullWidth
							variant="outlined"
							sx={{ ml: 1 }}
							onClick={() => setCopy(true)}
						>
							Копировать
						</Button>
					</Box>
					{editCompanyError && <Alert severity="error">
						{editCompanyError.data.error}
					</Alert>}
				</Box>
			</Box>
		</Modal >
	);
}

export default EditListCompany;