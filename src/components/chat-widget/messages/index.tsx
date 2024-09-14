import { useEffect, useRef, useState } from 'react';
import styles from '../index.module.css';
import useSound from 'use-sound'
import messageVoice from '../../../assets/voices/message.mp3'

const Messages = ({ socket, user, setUnreadMessages }) => {
	const [messages, setMessages] = useState([]);
	const [playSound] = useSound(messageVoice)

	const messagesColumnRef = useRef(null);


	function sortMessagesByDate(messages) {
		return messages.sort(
			(a, b) => parseInt(a.dateTime) - parseInt(b.dateTime)
		);
	}

	useEffect(() => {
		socket.on('getMessage', ({ message }) => {
			setMessages((prev) => [...prev, message])
			if (message.userId !== user._id) {
				playSound();
				setUnreadMessages(() => true);
			}
		});

		return () => socket.off('getMessage');
	}, [socket]);


	useEffect(() => {
		socket.on('getAllMessages', (data) => {
			let messagesData = sortMessagesByDate(data);
			setMessages(messagesData);
		});

		return () => socket.off('getAllMessages');
	}, [socket]);

	useEffect(() => {
		if (messages.length > 2) {
			messagesColumnRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			});
		}
	}, [messages]);

	return (
		<div className='messages__container'>
			{messages && messages.length > 0 ? messages.map((message, i) => (
				<div className={message.userId === user._id ? styles.message__right : styles.message__left} key={i}>
					<span style={{ fontWeight: 'bold', display: 'block' }}>{message.fullName}</span>
					<span style={{ display: 'block' }}>{message.message}</span>
					<span style={{ display: 'block', fontSize: '11px', color: 'gray', marginTop: '5px' }}>{message.dateTime}</span>
				</div>
			))
				: <> Нет сообщений</>}
			<div ref={messagesColumnRef}></div>
		</div>
	);
}

export default Messages;