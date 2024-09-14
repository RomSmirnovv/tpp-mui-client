import { Box, MenuItem, Typography } from '@mui/material';
import { INotification } from '../../redux/api/types';
import OpenCompanyModal from '../open-company-modal';
import { useState } from 'react';
import { useEditNotificationMutation } from '../../redux/api/notificationApi';

type Props = {
	notification: INotification
}

const NotificationItem = ({ notification }: Props) => {
	const [editNotification] = useEditNotificationMutation();
	const [open, setOpen] = useState(false);

	const handleClose = () => setOpen(false);

	const hadleOpenCompany = async () => {
		const updateNotification = { ...notification, readed: true };
		try {
			await editNotification(updateNotification).unwrap();
		} catch (error) {

		}
		setOpen(true);
	}

	return (
		<>
			<MenuItem key={0} sx={{ cursor: 'default' }} style={!notification.readed ? { backgroundColor: '#efefef' } : { backgroundColor: 'white' }}>
				<Box sx={{ display: 'flex', justifyContent: 'flex-start', minWidth: '350px' }}>
					<Box sx={{ p: 1, pr: 2, borderRight: '1px solid grey' }}>
						<Typography textAlign="left"><b>{notification.notificationDate}</b></Typography>
						<Typography textAlign="left" sx={{ fontWeight: 'light', fontSize: '14px', fontStyle: 'italic' }}>{notification.notificationTime}</Typography>
					</Box>
					<Box sx={{ p: 1, textAlign: 'left' }}>
						<Typography textAlign="left">{notification.message}</Typography>
						<Typography textAlign="left" sx={{ fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }} onClick={hadleOpenCompany} >Открыть запись</Typography>
					</Box>
				</Box>
			</MenuItem>
			<OpenCompanyModal companyId={notification.companyId} open={open} handleClose={handleClose} />
		</>
	);
}

export default NotificationItem;