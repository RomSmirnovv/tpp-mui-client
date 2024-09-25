import { Alert, Autocomplete, Box, Button, Modal, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useAddCompanyMutation, useEditCompanyMutation } from '../../redux/api/companyApi';
import { useGetListByUserQuery, useGetOneListQuery } from '../../redux/api/listApi';
import { useEffect, useState } from 'react';
import { IList } from '../../redux/api/types';
import AddNotificationModal from '../add-notification-modal';
import { CITIES, getCities } from '../../utils/cities';

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


const EditCompanyModal = ({ options, company, open = false, handleClose = () => { } }) => {
	const [editCompany, { error: editCompanyError, isLoading: isEditCompanyLoading, isSuccess: isEditCompanySuccess }] = useEditCompanyMutation();
	const [list, setList] = useState<IList>({} as IList);
	const { data: lists, isSuccess: isListsSuccess, isLoading: isListsLoading } = useGetListByUserQuery(company.userId);
	const [addedCompany, setAddedCompany] = useState({});
	const [thisNotification, setThisNotification] = useState(false);
	const [openNotification, setOpenNotification] = useState(false)

	const handleEditCompany = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let updateCompany = { ...company }
		if (list && list.columns) {
			list.columns.filter((c) => c.checked === true).map((col) => {
				updateCompany[col.field] = data.get(col.field)
			})
			updateCompany.location = data.get('location')
		}
		console.log('updateCompany', updateCompany)
		try {
			const data = await editCompany(updateCompany).unwrap();
			handleClose();
			if (thisNotification) {
				setAddedCompany(data)
				setOpenNotification(true)
				setThisNotification(false)
			}
		} catch (error) {

		}
	}

	const handleCloseNotification = () => setOpenNotification(false)

	useEffect(() => {
		if (lists) {
			setList(lists.find((l) => l.checked === true) as IList)
		}
	}, [open])


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
						Изменить запись
					</Typography>
					<Box component="form" onSubmit={handleEditCompany} sx={{ mt: 1 }} >
						<TextField
							margin="normal"
							required
							fullWidth
							id='name'
							label='Название'
							name='name'
							autoComplete='name'
							defaultValue={company.name}
							autoFocus
						/>
						<Autocomplete
							id={`location-${company._id}`}
							options={options}
							disableClearable
							defaultValue={company.location}
							freeSolo={true}
							renderInput={(params) => <TextField sx={{ mt: 2 }} {...params} name="location" label="Город" />}
						/>
						{list && list.columns ?
							list.columns.filter((c) => c.checked === true && c.field != 'name' && c.field != 'color').map((col) => {
								return (
									<TextField
										key={col.key}
										margin="normal"
										fullWidth
										id={col.field}
										label={col.headerName}
										name={col.field}
										autoComplete={col.field}
										defaultValue={company[col.field]}
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
								Сохранить
							</Button>
							<Button
								type="submit"
								fullWidth
								variant="outlined"
								sx={{ mt: 3, mb: 2, ml: 1 }}
								onClick={() => setThisNotification(true)}
							>
								Сохранить с уведомлением
							</Button>
						</Box>
						{editCompanyError && <Alert severity="error">
							{editCompanyError.data.error}
						</Alert>}
					</Box>
				</Box>
			</Modal >
			<AddNotificationModal company={addedCompany} open={openNotification} handleClose={handleCloseNotification} />
		</>
	);
}

export default EditCompanyModal;