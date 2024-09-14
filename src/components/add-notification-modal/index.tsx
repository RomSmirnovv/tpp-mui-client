import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material';
import moment from 'moment';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/ru';
import { useCreateNotificationMutation } from '../../redux/api/notificationApi';

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

const AddNotificationModal = ({ company, open = false, handleClose = () => { } }) => {
	const [addNotification, { isLoading: isAddNotificationLoading, error: addNotificationError }] = useCreateNotificationMutation();

	const handleAddNotification = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const dataDate = data.get('date')
		const createdDate = dayjs(dataDate).format('YYYY-MM-DD')
		const notificationDate = dayjs(dataDate).format('DD.MM.YYYY')
		const notificationTime = dayjs(dataDate).format('HH:mm')
		if (!dataDate) return
		const newNotification = {
			message: company.name,
			createdDate: createdDate,
			notificationDateTime: dataDate,
			notificationDate,
			notificationTime,
			userId: company.userId,
			companyId: company._id,
			readed: false,
			sended: false
		}
		try {
			await addNotification(newNotification).unwrap();
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
					Добавить уведомление
				</Typography>
				<Box component="form" onSubmit={handleAddNotification} sx={{ mt: 1 }} >

					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
						<DemoContainer components={['DateTimePicker']}>
							<DateTimePicker label="Выберите время и дату" name='date' format="YYYY-MM-DD HH:mm" disablePast={true} />
						</DemoContainer>
					</LocalizationProvider>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Добавить
					</Button>
					{addNotificationError && <Alert severity="error">
						{addNotificationError.data.error}
					</Alert>}
				</Box>
			</Box>
		</Modal >
	);
}

export default AddNotificationModal;