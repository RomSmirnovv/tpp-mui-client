import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';

const SendMessage = ({ user, socket, activeRoom, setUnreadMessages }) => {
	const [messageInput, setMessageInput] = useState('');

	const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		if (data.get('message') === '') return
		const message = {
			message: data.get('message'),
			userId: user._id,
			room: activeRoom,
			fullName: user.name + ' ' + user.surname,
			dateTime: moment().format('DD.MM.YYYY HH:mm:ss')
		}
		setMessageInput('');
		socket.emit('send_message', { message });
	}

	return (
		<Box
			component="form"
			sx={{ padding: '10px', textAlign: 'left' }}
			onSubmit={handleSendMessage}
			noValidate
			autoComplete="off"
		>
			<TextField
				id="message"
				name='message'
				label="Сообщение"
				multiline
				sx={{ width: '100%', fontSize: '14px' }}
				value={messageInput}
				onChange={(e) => setMessageInput(e.target.value)}
				onClick={() => setUnreadMessages(false)}
				rows={3}
			/>
			<Button
				type="submit"
				variant="contained"
				style={{ marginTop: '10px' }}
			>Отправить</Button>
		</Box>
	);
}

export default SendMessage;