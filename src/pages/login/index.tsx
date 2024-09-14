import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useLoginUserMutation } from '../../redux/api/authApi';
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Alert } from '@mui/material';
import Copyright from '../../components/copyright';


const Login = () => {
	const navigate = useNavigate();
	const [error, setError] = React.useState("");
	const [login, { isLoading, error: loginError }] = useLoginUserMutation();
	const [cookies] = useCookies(['logged_in']);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);


		try {
			await login({ login: data.get('login') as string, password: data.get('password') as string }).unwrap();
			navigate("/");
		} catch (error) {
			const maybeError = isErrorWithMessage(error);

			if (maybeError) {
				setError(loginError?.data.error);
			} else {
				setError("Неизвестная ошибка");
			}
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Войти в аккаунт
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="login"
						label="Логин"
						name="login"
						autoComplete="login"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Пароль"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Запомнить меня"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={isLoading}
					>
						Войти
					</Button>
					{loginError && <Alert severity="error">
						{loginError.data.error}
					</Alert>}
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}

export default Login;