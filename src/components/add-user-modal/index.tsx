import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCreateUserMutation } from '../../redux/api/userApi';
import { IUser } from '../../redux/api/types';
import { useState } from 'react';

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

const AddUserModal = ({ open = false, handleClose = () => { } }) => {
	const [createUser, { isLoading: isCreateUserLoading, error: createUserError, isSuccess: isCreateUserSuccess }] = useCreateUserMutation();

	const [message, setMessage] = useState('');
	const handleLoginChange = (event) => {
		const result = event.target.value.replace(/[^a-z, 0-9, @, _, -, .]/gi, '');
		setMessage(result);
	};
	const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const newUser = {
			name: data.get('name') as string,
			surname: data.get('surname') as string,
			patronymic: data.get('patronymic') as string,
			phone: data.get('phone') as string,
			login: data.get('login') as string,
			password: data.get('password') as string,
			role: Number(data.get('role')) as number,
			// ВАЖНО: сервер ожидает поле birthDate
			birthDate: dayjs(data.get('birthDate') as string).format('DD.MM.YYYY') as string,
		}
		try {
			await createUser(newUser as any).unwrap();
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
					Добавить сотрудника
				</Typography>
				<Box component="form" onSubmit={handleAddUser} sx={{ mt: 1 }} >
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Роль</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							label="role"
							name='role'
							type='number'
							defaultValue={2}
						>
							<MenuItem value={2}>Администратор</MenuItem>
							<MenuItem value={3}>Менеджер</MenuItem>
						</Select>
					</FormControl>
					<TextField
						margin="normal"
						required
						fullWidth
						id="surname"
						label="Фамилия"
						name="surname"
						autoComplete="surname"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="name"
						label="Имя"
						name="name"
						autoComplete="name"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="patronymic"
						label="Отчество"
						name="patronymic"
						autoComplete="patronymic"
						autoFocus
					/>
					<FormControl fullWidth>
						<InputLabel sx={{ mt: -2, display: 'block', backgroundColor: 'white', px: 1 }}>Дата рождения</InputLabel>
						<TextField
							margin="normal"
							type="date"
							required
							fullWidth
							id="birthDate"
							name="birthDate"
							autoComplete="birthDate"
							autoFocus
						/>
					</FormControl>
					<TextField
						margin="normal"
						type="number"
						required
						fullWidth
						id="phone"
						label="Телефон"
						name="phone"
						autoComplete="phone"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="login"
						label="Логин (латиницей)"
						name="login"
						autoComplete="login"
						autoFocus
						value={message}
						onChange={handleLoginChange}
					/>
					<TextField
						margin="normal"
						type='password'
						required
						fullWidth
						id="password"
						label="Пароль"
						name="password"
						autoComplete="password"
						autoFocus
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={isCreateUserLoading}
					>
						Добавить пользователя
					</Button>
					{createUserError && <Alert severity="error">
						{createUserError.data.error}
					</Alert>}
				</Box>
			</Box>
		</Modal >
	);
}

export default AddUserModal;