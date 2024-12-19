import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useAddColumnMutation } from '../../redux/api/columnsApi';
import { translit } from '../../utils/is-translit-string';
import { useNavigate } from 'react-router-dom';

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

type Props = {
	open?: boolean;
	handleClose?: () => void;
	setUpdateColumns?: React.Dispatch<React.SetStateAction<boolean>>;
	updateColumns?: boolean
}

const AddColumnModal = ({ open = false, handleClose, setUpdateColumns, updateColumns }: Props) => {
	const [createColumn, { error: createColumnError, isLoading, isSuccess }] = useAddColumnMutation();
	const navigate = useNavigate();

	const handleAddColumn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const newColumn = {
			name: data.get('name') as string,
			slug: translit(data.get('name') as string).split(' ').join('_'),
			type: 'Текст',
			isDeleted: true
		}
		try {
			await createColumn(newColumn as any).unwrap();
			handleClose();
			navigate(0);
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
					Добавить новую колонку
				</Typography>
				<Box component="form" onSubmit={handleAddColumn} sx={{ mt: 1 }} >
					<TextField
						margin="normal"
						required
						fullWidth
						id="name"
						label="Название"
						name="name"
						autoComplete="name"
						autoFocus
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Добавить
					</Button>
					{createColumnError && <Alert severity="error">
						{createColumnError.data.error}
					</Alert>}
				</Box>
			</Box>
		</Modal >
	);
}

export default AddColumnModal;