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
import { useDeleteListMutation } from '../../redux/api/listApi';

type Props = {
	selectedList: string;
	setAlertOpen: (value: boolean) => void;
	setAlertMessage: (value: string) => void;
	setAlertVariant: (value: 'error' | 'info' | 'success' | 'warning' | undefined) => void;
	open: boolean;
	handleClose: () => void;
};


const ConfirmDialogDeleteList = ({ selectedList, setAlertOpen, setAlertMessage, setAlertVariant, open, handleClose }: Props) => {
	// const [deleteUser, { isLoading: isDeletingUser, error: deleteUserError }] = useDeleteUserMutation();
	const [removeList] = useDeleteListMutation();


	const handleRemove = async () => {
		try {
			await removeList(selectedList._id).unwrap();
			handleClose();
			setAlertVariant('success');
			setAlertMessage('Лист успешно удален');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		} catch (error) {
			setAlertVariant('error');
			setAlertMessage('При удалении листа произошла ошибка');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		}
	}

	return (
		<Dialog open={open} maxWidth="sm" fullWidth>
			<DialogTitle>Удалить лист?</DialogTitle>
			<DialogContent>
				<Typography>Вы действительно хотите удалить лист?</Typography>
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

export default ConfirmDialogDeleteList;
