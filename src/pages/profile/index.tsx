import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useGetUserQuery, useEditUserMutation } from '../../redux/api/userApi';
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useNavigate } from 'react-router-dom';
import { Alert, Grid } from '@mui/material';
import Copyright from '../../components/copyright';
import Header from '../../components/header';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const Profile = () => {
	const navigate = useNavigate();
	const [error, setError] = React.useState("");
	
	const { data: user, isLoading: isLoadingData, error: fetchError } = useGetUserQuery(null);
	const [editUser, { isLoading: isUpdating, error: updateError }] = useEditUserMutation();
	
	// Состояния формы
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [patronymic, setPatronymic] = React.useState("");
	const [login, setLogin] = React.useState("");
	const [birthDate, setBirthDate] = React.useState<Dayjs | null>(null);
	const [phone, setPhone] = React.useState("");

	// Загрузка данных пользователя
	React.useEffect(() => {
		if (user) {
			setName(user.name || '');
			setSurname(user.surname || '');
			setPatronymic(user.patronymic || '');
			setLogin(user.login || '');
			setPhone(user.phone || '');
			if (user.birthDate) {
				// Парсим дату в формате DD.MM.YYYY
				const [day, month, year] = user.birthDate.split('.');
				if (day && month && year) {
					setBirthDate(dayjs(`${year}-${month}-${day}`));
				}
			}
		}
	}, [user]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		// Валидация
		if (!name || !surname || !login) {
			setError("Заполните все обязательные поля");
			return;
		}

		try {
			const userData = {
				_id: user?._id,
				name,
				surname,
				patronymic: patronymic || '',
				login,
				phone: phone || '',
				birthDate: birthDate ? birthDate.format('DD.MM.YYYY') : '',
				role: user?.role,
				projects: user?.projects || [],
				workspaceId: user?.workspaceId
			};

			await editUser(userData).unwrap();
			alert("Профиль успешно обновлен!");
			navigate("/");
		} catch (error) {
			const maybeError = isErrorWithMessage(error);
			if (maybeError) {
				setError((error as any).data?.error || "Ошибка при обновлении профиля");
			} else {
				setError("Неизвестная ошибка");
			}
		}
	};

	if (isLoadingData) {
		return (
			<Container component="main" maxWidth="md">
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
					<Typography>Загрузка данных...</Typography>
				</Box>
			</Container>
		);
	}

	if (fetchError || !user) {
		return (
			<Container component="main" maxWidth="md">
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
					<Alert severity="error">
						{isErrorWithMessage(fetchError) ? (fetchError as any).data?.error : "Ошибка загрузки данных профиля"}
					</Alert>
				</Box>
			</Container>
		);
	}

	return (
		<>
			<Header />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Container component="main" maxWidth="md">
					<CssBaseline />
				<Box
					sx={{
						marginTop: 4,
						marginBottom: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<PersonIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Редактирование профиля
					</Typography>
					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={4}>
								<TextField
									required
									fullWidth
									id="surname"
									label="Фамилия"
									name="surname"
									value={surname}
									onChange={(e) => setSurname(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<TextField
									required
									fullWidth
									id="name"
									label="Имя"
									name="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									id="patronymic"
									label="Отчество"
									name="patronymic"
									value={patronymic}
									onChange={(e) => setPatronymic(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="login"
									label="Логин"
									name="login"
									value={login}
									onChange={(e) => setLogin(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									id="phone"
									label="Телефон"
									name="phone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<DatePicker
									label="День рождения"
									value={birthDate}
									onChange={(newValue) => setBirthDate(newValue)}
									slotProps={{
										textField: {
											fullWidth: true,
										},
									}}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									id="role"
									label="Роль"
									name="role"
									value={user.role === 2 ? 'Администратор' : user.role === 1 ? 'Пользователь' : 'Неизвестно'}
									disabled
									helperText="Роль нельзя изменить"
								/>
							</Grid>
						</Grid>

						{error && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{error}
							</Alert>
						)}

						{updateError && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{(updateError as any).data?.error || "Ошибка при обновлении профиля"}
							</Alert>
						)}

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={isUpdating}
						>
							{isUpdating ? "Сохранение..." : "Сохранить изменения"}
						</Button>

						<Button
							fullWidth
							variant="text"
							onClick={() => navigate("/")}
						>
							Отмена
						</Button>
					</Box>
				</Box>
				<Copyright sx={{ mt: 4, mb: 4 }} />
			</Container>
		</LocalizationProvider>
		</>
	);
};

export default Profile;
