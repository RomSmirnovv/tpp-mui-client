import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEditUserMutation, useGetAllUsersQuery } from '../../redux/api/userApi';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConfirmDialog from '../confirm-dialog';
import BlockUser from '../block-user';

const StaffTable = () => {
	const [selectedUser, setSelectedUser] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const [rows, setRows] = React.useState([]);
	const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useGetAllUsersQuery(null);
	const [editUser, { error: editUserError, isLoading: isEditing, isSuccess: isEdited }] = useEditUserMutation();


	const handleOpen = (userId: any) => {
		setSelectedUser(userId);
		setOpen(true);
	}
	const handleClose = () => setOpen(false);

	const processRowUpdate = async (newRow: any, oldRow: any) => {
		try {
			await editUser(newRow).unwrap();
			return newRow;
		} catch (error) {
			return oldRow;
		}

	}

	const columns: GridColDef<(typeof rows)[number]>[] = [
		{
			field: 'surname',
			headerName: 'Фамилия',
			width: 250,
			editable: true,
		},
		{
			field: 'name',
			headerName: 'Имя',
			width: 250,
			editable: true,
		},
		{
			field: 'patronymic',
			headerName: 'Отчество',
			width: 250,
			editable: true,
		},
		{
			field: 'login',
			headerName: 'Логин',
			width: 250,
			editable: true,
		},
		{
			field: 'phone',
			headerName: 'Телефон',
			width: 250,
			editable: true,
		},
		{
			field: 'options',
			headerName: '',
			width: 150,
			renderCell: (user: any) => {
				return (<>
					<BlockUser user={user.row} />
					<DeleteOutlineOutlinedIcon sx={{ cursor: 'pointer', fontSize: 20, pl: 1 }} onClick={(e) => handleOpen(user.id)} />
					<ConfirmDialog open={open} handleClose={handleClose} selectedUser={selectedUser} />
				</>);
			}
		},
	];

	let usersData: any = [];
	React.useEffect(() => {
		setRows([]);
		if (isUsersSuccess && users) {
			for (let i = 0; i < users.length; i++) {
				usersData[i] = {
					_id: users[i]._id,
					surname: users[i].surname,
					name: users[i].name,
					patronymic: users[i].patronymic,
					login: users[i].login,
					phone: users[i].phone,
					blocked: users[i].blocked
				}
			}
			setRows(usersData);
		}
	}, [isUsersSuccess, isEdited, isEditing, users]);


	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns as any}
				disableRowSelectionOnClick
				disableColumnMenu
				hideFooter
				processRowUpdate={processRowUpdate}
				getRowId={(row) => row._id}
				loading={isUsersLoading || isEditing}
			/>
		</Box>
	);
}

export default StaffTable;