import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Badge, Box, TextField } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import styles from './index.module.css';
import { io } from 'socket.io-client';
import { IUser } from '../../redux/api/types';
import Messages from './messages';
import Rooms from './rooms/index.tsx';
import SendMessage from './sendMessage/index.tsx';
import { BASE_URL } from '../../config.ts';

const socketChat = io(BASE_URL);

type Props = {
	user: IUser
}

const ChatWidget = ({ user }: Props) => {
	const [activeRoom, setActiveRoom] = React.useState('all-chat');
	const [unreadMessages, setUnreadMessages] = React.useState(false);

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
						<Rooms socket={socketChat} user={user} activeRoom={activeRoom} setActiveRoom={setActiveRoom} setUnreadMessages={setUnreadMessages} />
						<div style={{ height: '650px', width: '85%', backgroundColor: 'white', border: '1px solid #e7e7e7', borderRadius: '0 5px 5px 0' }}>
							<div className={styles.chat__messages}>
								<Messages socket={socketChat} user={user} setUnreadMessages={setUnreadMessages} />
							</div>
							<div className={styles.chat__form}>
								<SendMessage socket={socketChat} user={user} activeRoom={activeRoom} setUnreadMessages={setUnreadMessages} />
							</div>
						</div>
					</Box>
				</AccordionDetails>
			</Accordion>
		</Box >
	);
}

export default ChatWidget;