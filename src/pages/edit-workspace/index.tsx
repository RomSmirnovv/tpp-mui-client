import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useGetWorkspaceQuery, useUpdateWorkspaceMutation } from '../../redux/api/workspaceApi';
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Grid, IconButton, Chip } from '@mui/material';
import Copyright from '../../components/copyright';
import Header from '../../components/header';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_URL } from '../../config';
import EditIcon from '@mui/icons-material/Edit';

const EditWorkspace = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [error, setError] = React.useState("");
	
	const { data: workspace, isLoading: isLoadingData, error: fetchError, refetch: refetchWorkspace } = useGetWorkspaceQuery(id || '');
	const [updateWorkspace, { isLoading: isUpdating, error: updateError }] = useUpdateWorkspaceMutation();
	
	// Состояния формы
	const [companyName, setCompanyName] = React.useState("");
	const [logo, setLogo] = React.useState<File | null>(null);
	const [logoPreview, setLogoPreview] = React.useState<string>("");
	const [removeLogo, setRemoveLogo] = React.useState(false);
	const [colors, setColors] = React.useState<string[]>(['#ff0000', '#ffff00', '#00ff00']); // Красный, желтый, зеленый по умолчанию
	const [email, setEmail] = React.useState("");
	const [phone, setPhone] = React.useState("");
	const [employeesCount, setEmployeesCount] = React.useState(1);
	const [columns, setColumns] = React.useState<string[]>([]);
	

	// Загрузка данных workspace
	React.useEffect(() => {
		if (workspace) {
			setCompanyName(workspace.name || '');
			setEmail(workspace.email || '');
			setPhone(workspace.phone || '');
			setEmployeesCount(workspace.employeesCount || 1);
			// Если есть сохраненные цвета, используем их, иначе дефолтные
			setColors(workspace.colors && workspace.colors.length > 0 ? workspace.colors : ['#ff0000', '#ffff00', '#00ff00']);
			setColumns(workspace.columns || []);
			
			if (workspace.logo) {
				setLogoPreview(`${BASE_URL}${workspace.logo}`);
			} else {
				setLogoPreview("");
			}
			// Сбрасываем флаг удаления и локальный файл при загрузке данных
			setRemoveLogo(false);
			setLogo(null);
		}
	}, [workspace]);

	// Обработка загрузки логотипа
	const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setError("Размер файла не должен превышать 5MB");
				return;
			}
			setLogo(file);
			setRemoveLogo(false); // Сбрасываем флаг удаления при загрузке нового логотипа
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveLogo = () => {
		setLogo(null);
		setLogoPreview("");
		setRemoveLogo(true);
	};


	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		// Валидация
		if (!companyName || !email || !phone) {
			setError("Заполните все обязательные поля");
			return;
		}

		// Создание FormData
		const formData = new FormData();
		formData.append('name', companyName);
		if (logo) {
			formData.append('logo', logo);
		}
		// Если логотип нужно удалить
		if (removeLogo) {
			formData.append('removeLogo', 'true');
		}
		colors.forEach((color, index) => {
			formData.append(`colors[${index}]`, color);
		});
		formData.append('email', email);
		formData.append('phone', phone);
		formData.append('employeesCount', employeesCount.toString());
		
		// Колонки
		columns.forEach((column, index) => {
			formData.append(`columns[${index}]`, column);
		});

		try {
			await updateWorkspace({ id: id || '', data: formData }).unwrap();
			// Сбрасываем флаг удаления после успешного сохранения
			setRemoveLogo(false);
			// Обновляем данные workspace для обновления кеша
			await refetchWorkspace();
			// После успешного обновления перенаправляем на главную страницу
			// или можно показать сообщение об успехе и остаться на странице
			alert("Данные компании успешно обновлены!");
			// Остаемся на странице редактирования или перенаправляем на главную
			// navigate("/", { state: { message: "Данные компании успешно обновлены." } });
		} catch (error) {
			const maybeError = isErrorWithMessage(error);
			if (maybeError) {
				setError((error as any).data?.error || "Ошибка при обновлении");
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

	if (fetchError || !workspace) {
		return (
			<Container component="main" maxWidth="md">
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
					<Alert severity="error">
						{isErrorWithMessage(fetchError) ? (fetchError as any).data?.error : "Ошибка загрузки данных компании"}
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
						<EditIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Редактирование компании
					</Typography>
					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
						<Grid container spacing={2}>
							{/* Информация о компании */}
							<Grid item xs={12}>
								<Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
									Информация о компании
								</Typography>
							</Grid>
							
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="companyName"
									label="Название компании"
									name="companyName"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email компании"
									name="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="phone"
									label="Телефон"
									name="phone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="employeesCount"
									label="Количество сотрудников"
									name="employeesCount"
									type="number"
									inputProps={{ min: 1 }}
									value={employeesCount}
									onChange={(e) => setEmployeesCount(parseInt(e.target.value) || 1)}
								/>
							</Grid>

							{/* Логотип */}
							<Grid item xs={12}>
								<Typography variant="subtitle2" sx={{ mb: 1 }}>
									Логотип компании
								</Typography>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									{logoPreview ? (
										<>
											<Avatar
												src={logoPreview}
												sx={{ width: 100, height: 100 }}
												variant="rounded"
											/>
											<IconButton onClick={handleRemoveLogo} color="error">
												<DeleteIcon />
											</IconButton>
										</>
									) : (
										<Button
											variant="outlined"
											component="label"
											startIcon={<PhotoCameraIcon />}
										>
											Загрузить логотип
											<input
												type="file"
												hidden
												accept="image/*"
												onChange={handleLogoChange}
											/>
										</Button>
									)}
								</Box>
							</Grid>

							{/* Цвета */}
							<Grid item xs={12}>
								<Typography variant="subtitle2" sx={{ mb: 2 }}>
									Выберите цвета, которыми сможете выделять строки в таблицах
								</Typography>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
									{[0, 1, 2].map((index) => (
										<Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
											<Box
												component="label"
												sx={{
													width: 60,
													height: 60,
													borderRadius: '50%',
													backgroundColor: colors[index] || '#e0e0e0',
													border: '2px solid #ccc',
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													position: 'relative',
													'&:hover': {
														borderColor: '#1976d2',
														transform: 'scale(1.1)',
														transition: 'all 0.2s'
													}
												}}
											>
												<input
													type="color"
													value={colors[index] || '#000000'}
													onChange={(e) => {
														const newColors = [...colors];
														newColors[index] = e.target.value;
														setColors(newColors);
													}}
													style={{
														position: 'absolute',
														width: '100%',
														height: '100%',
														opacity: 0,
														cursor: 'pointer'
													}}
												/>
											</Box>
											{colors[index] && (
												<Chip
													label={colors[index]}
													size="small"
													onDelete={() => {
														const newColors = [...colors];
														newColors.splice(index, 1);
														setColors(newColors);
													}}
													sx={{
														backgroundColor: colors[index],
														color: '#fff',
														'& .MuiChip-deleteIcon': {
															color: '#fff'
														}
													}}
												/>
											)}
										</Box>
									))}
								</Box>
							</Grid>


						</Grid>

						{error && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{error}
							</Alert>
						)}

						{updateError && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{(updateError as any).data?.error || "Ошибка при обновлении"}
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

export default EditWorkspace;
