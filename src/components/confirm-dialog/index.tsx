// ConfirmDialog.jsx
// material ui
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	IconButton,
	Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useDeleteUserMutation } from '../../redux/api/userApi';

type Props = {
	selectedUser: string;
	open: boolean;
	handleClose: () => void;
};

const ConfirmDialog = ({ selectedUser, open, handleClose }: Props) => {
	const [deleteUser, { isLoading: isDeletingUser, error: deleteUserError }] = useDeleteUserMutation();


	const handleRemove = async () => {
		try {
			await deleteUser(selectedUser).unwrap();
			handleClose();
		} catch (error) {

		}
	}

	return (
		<Dialog open={open} maxWidth="sm" fullWidth>
			<DialogTitle>Удалить сотрудника?</DialogTitle>
			<DialogContent>
				<Typography>Вы действительно хотите удалить сотрудника?</Typography>
			</DialogContent>
			<DialogActions>
				<Button color="secondary" variant="contained" onClick={handleRemove}>
					Удалить
				</Button>
				<Button color="primary" variant="contained" onClick={handleClose}>
					Отмена
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
