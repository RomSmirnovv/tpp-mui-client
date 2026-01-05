import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { BASE_URL } from '../../config';

const VerifyEmail = () => {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
	const [message, setMessage] = React.useState('');

	React.useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage('Токен подтверждения не найден');
			return;
		}

		const verifyEmail = async () => {
			try {
				const response = await fetch(`${BASE_URL}/auth/verify-email/${token}`, {
					method: 'GET',
					credentials: 'include'
				});

				const data = await response.json();

				if (response.ok) {
					setStatus('success');
					setMessage(data.message || 'Email успешно подтвержден');
					// Перенаправляем на страницу входа через 3 секунды
					setTimeout(() => {
						navigate('/login', { 
							state: { message: 'Email подтвержден. Теперь вы можете войти в систему.' } 
						});
					}, 3000);
				} else {
					setStatus('error');
					setMessage(data.error || data.message || 'Ошибка при подтверждении email');
				}
			} catch (error) {
				setStatus('error');
				setMessage('Произошла ошибка при подтверждении email');
			}
		};

		verifyEmail();
	}, [token, navigate]);

	return (
		<Container component="main" maxWidth="sm">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					minHeight: '50vh',
					justifyContent: 'center'
				}}
			>
				{status === 'loading' && (
					<>
						<CircularProgress sx={{ mb: 2 }} />
						<Typography variant="h6" component="h1">
							Подтверждение email...
						</Typography>
					</>
				)}

				{status === 'success' && (
					<>
						<CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
						<Typography variant="h5" component="h1" gutterBottom>
							Email подтвержден!
						</Typography>
						<Alert severity="success" sx={{ mt: 2, mb: 2, width: '100%' }}>
							{message}
						</Alert>
						<Typography variant="body2" color="text.secondary">
							Вы будете перенаправлены на страницу входа...
						</Typography>
						<Button
							variant="contained"
							sx={{ mt: 3 }}
							onClick={() => navigate('/login')}
						>
							Перейти к входу
						</Button>
					</>
				)}

				{status === 'error' && (
					<>
						<ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
						<Typography variant="h5" component="h1" gutterBottom>
							Ошибка подтверждения
						</Typography>
						<Alert severity="error" sx={{ mt: 2, mb: 2, width: '100%' }}>
							{message}
						</Alert>
						<Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
							<Button
								variant="contained"
								onClick={() => navigate('/login')}
							>
								Перейти к входу
							</Button>
							<Button
								variant="outlined"
								component={Link}
								to="/register"
							>
								Регистрация
							</Button>
						</Box>
					</>
				)}
			</Box>
		</Container>
	);
};

export default VerifyEmail;
