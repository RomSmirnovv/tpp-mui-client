import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Badge, Box, TextField, CircularProgress } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import styles from './index.module.css';
import { IUser } from '../../redux/api/types';
import Messages from './messages';
import Rooms from './rooms/index.tsx';
import SendMessage from './sendMessage/index.tsx';
import { useGetUserQuery } from '../../redux/api/userApi.ts';
import { useSocket } from '../../contexts/SocketContext';

const ChatWidget = () => {
	const {data: user} = useGetUserQuery(null)
	const socket = useSocket();
	const [activeRoom, setActiveRoom] = React.useState('all-chat');
	const [unreadMessages, setUnreadMessages] = React.useState(false);

	// Не показываем виджет, если socket не готов или пользователь не загружен
	if (!socket || !user) {
		return null;
	}

	return (
		<Box sx={{ width: '400px', position: 'fixed', right: 30, bottom: 0, zIndex: 99 }}>
			<Accordion sx={{ boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)', backgroundColor: '#e6eff5', borderRadius: '5px' }}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1-content"
					id="panel1-header"
				>
					<Brightness1Icon sx={{ mr: 1, fontSize: 10, mt: 1, color: 'green' }} />
					Online Chat
					{unreadMessages && <Badge className='badge-chat' color="primary" variant="dot" component="div" sx={{ position: 'absolute', top: '-5px', right: 30, fontSize: '30px' }}></Badge>}
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={{ display: 'flex' }}>
						<Rooms socket={socket} user={user} activeRoom={activeRoom} setActiveRoom={setActiveRoom} setUnreadMessages={setUnreadMessages} />
						<div style={{ height: '650px', width: '85%', backgroundColor: 'white', border: '1px solid #e7e7e7', borderRadius: '0 5px 5px 0' }}>
							<div className={styles.chat__messages}>
								<Messages socket={socket} user={user} activeRoom={activeRoom} setUnreadMessages={setUnreadMessages} />
							</div>
							<div className={styles.chat__form}>
								<SendMessage socket={socket} user={user} activeRoom={activeRoom} setUnreadMessages={setUnreadMessages} />
							</div>
						</div>
					</Box>
				</AccordionDetails>
			</Accordion>
		</Box >
	);
}

export default ChatWidget;