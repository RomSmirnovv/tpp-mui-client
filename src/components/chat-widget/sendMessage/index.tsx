import { Box, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import moment from 'moment';

const SendMessage = ({ user, socket, activeRoom, setUnreadMessages }) => {
	const [messageInput, setMessageInput] = useState('');
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Слушаем ошибки от сервера
	useEffect(() => {
		if (!socket) return;

		const errorHandler = (error: { message?: string }) => {
			setError(error.message || 'Ошибка отправки сообщения');
			setSending(false);
		};

		socket.on('error', errorHandler);

		return () => {
			socket.off('error', errorHandler);
		};
	}, [socket]);

	const sendMessage = (messageText: string) => {
		if (!socket || !messageText.trim() || !user?._id || !activeRoom) return;

		setSending(true);
		setError(null);

		const message = {
			message: messageText,
			userId: user._id,
			room: activeRoom,
			fullName: `${user.name || ''} ${user.surname || ''}`.trim(),
			dateTime: moment().format('DD.MM.YYYY HH:mm:ss')
		};

		try {
			socket.emit('send_message', { message });
			
			// Если через 5 секунд нет ошибки, считаем успешным
			setTimeout(() => {
				setSending(false);
			}, 5000);
		} catch (err) {
			setError('Ошибка отправки сообщения');
			setSending(false);
		}
	};

	const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const messageText = data.get('message') as string;
		if (!messageText || messageText.trim() === '') return;
		
		setMessageInput('');
		sendMessage(messageText);
	}

	const handleSendMessageOnEnter = async (value: string) => {
		if (!value || value.trim() === '') return;
		setMessageInput('');
		sendMessage(value);
	}

	return (
		<Box
			component="form"
			sx={{ padding: '10px', textAlign: 'left' }}
			onSubmit={handleSendMessage}
			noValidate
			autoComplete="off"
		>
			{error && (
				<Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>
					{error}
				</Alert>
			)}
			<TextField
				id="message"
				name='message'
				label="Сообщение"
				multiline
				sx={{ width: '100%', fontSize: '14px' }}
				value={messageInput}
				onChange={(e) => setMessageInput(e.target.value)}
				onClick={() => {
					setUnreadMessages(false);
					setError(null);
				}}
				onKeyPress={(ev) => {
					if (ev.key === 'Enter' && !ev.shiftKey) {
						handleSendMessageOnEnter(ev.currentTarget.value);
						ev.preventDefault();
					}
				}}
				disabled={sending || !socket}
				rows={3}
			/>
			<Button
				type="submit"
				variant="contained"
				disabled={sending || !socket || !messageInput.trim()}
				style={{ marginTop: '10px' }}
				startIcon={sending ? <CircularProgress size={16} /> : null}
			>
				{sending ? 'Отправляется...' : 'Отправить'}
			</Button>
		</Box>
	);
}

export default SendMessage;