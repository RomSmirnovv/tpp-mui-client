import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { useEditUserMutation } from '../../redux/api/userApi';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { useState } from 'react';
import { Alert } from '@mui/material';

type Props = {
	user: any
}

interface State extends SnackbarOrigin {
	open: boolean;
}

const BlockUser = ({ user }: Props) => {
	const [state, setState] = useState<State>({
		open: false,
		vertical: 'bottom',
		horizontal: 'center',
	});
	const { vertical, horizontal, open } = state;
	const [editUser, { error: editUserError, isLoading: isEditing, isSuccess: isEdited }] = useEditUserMutation();

	const handleToggleBlockUser = async () => {
		const updateUser = { ...user, blocked: !user.blocked };
		try {
			await editUser(updateUser).unwrap();
			setState({ open: true, vertical: 'top', horizontal: 'center' });
		} catch (error) { }

	}

	const handleClose = () => {
		setState({ ...state, open: false });
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={state.open}
				key={vertical + horizontal}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert
					onClose={handleClose}
					severity="success"
					variant="filled"
					sx={{ width: '100%' }}
				>
					{user.blocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован'}
				</Alert>
			</Snackbar>
			{user.blocked ? <LockOutlinedIcon sx={{ cursor: 'pointer', fontSize: 20, color: 'red' }} onClick={handleToggleBlockUser} /> : <LockOpenOutlinedIcon sx={{ cursor: 'pointer', fontSize: 20, color: 'green' }} onClick={handleToggleBlockUser} />}
		</>
	);
}

export default BlockUser;