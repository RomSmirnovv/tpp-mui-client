import * as React from 'react';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEditUserMutation, useGetAllUsersQuery, useGetUserQuery } from '../../redux/api/userApi';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConfirmDialog from '../confirm-dialog';
import BlockUser from '../block-user';

const StaffTable = () => {
	const [selectedUser, setSelectedUser] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const [rows, setRows] = React.useState([]);
	const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useGetAllUsersQuery(null);
	const { data: currentUser } = useGetUserQuery(null);
	const [editUser, { error: editUserError, isLoading: isEditing, isSuccess: isEdited }] = useEditUserMutation();

	// Фильтруем пользователей по workspaceId текущего пользователя
	const filteredUsers = useMemo(() => {
		// Если нет списка пользователей или текущий пользователь не определён — ничего не показываем
		if (!users || !currentUser || !currentUser.workspaceId) return [];

		// Получаем workspaceId текущего пользователя в строковом виде, безопасно обрабатывая null / объект
		let currentWorkspaceId: any = currentUser.workspaceId;

		if (!currentWorkspaceId) return [];

		if (typeof currentWorkspaceId === 'object') {
			// Возможные варианты: { _id: '...' } или ObjectId
			const objId = (currentWorkspaceId as any)._id;
			if (!objId) return [];
			currentWorkspaceId = objId.toString();
		} else {
			currentWorkspaceId = currentWorkspaceId.toString();
		}

		// Фильтруем пользователей по workspaceId
		return users.filter((u: any) => {
			let userWorkspaceId: any = u.workspaceId;

			// Если у пользователя нет workspaceId — не включаем его
			if (!userWorkspaceId) return false;

			if (typeof userWorkspaceId === 'object') {
				const objId = (userWorkspaceId as any)._id;
				if (!objId) return false;
				userWorkspaceId = objId.toString();
			} else {
				userWorkspaceId = userWorkspaceId.toString();
			}

			return userWorkspaceId === currentWorkspaceId;
		});
	}, [users, currentUser?.workspaceId]);


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
		if (isUsersSuccess && filteredUsers) {
			for (let i = 0; i < filteredUsers.length; i++) {
				usersData[i] = {
					_id: filteredUsers[i]._id,
					surname: filteredUsers[i].surname,
					name: filteredUsers[i].name,
					patronymic: filteredUsers[i].patronymic,
					login: filteredUsers[i].login,
					phone: filteredUsers[i].phone,
					blocked: filteredUsers[i].blocked
				}
			}
			setRows(usersData);
		}
	}, [isUsersSuccess, isEdited, isEditing, filteredUsers]);


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