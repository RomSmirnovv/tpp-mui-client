import { useEffect, useState, useMemo } from 'react';
import { useGetAllUsersQuery } from '../../../redux/api/userApi';
import { Avatar, Tooltip } from '@mui/material';
import { compareRooms } from '../../../utils/compareRooms';

const Rooms = ({ user, socket, activeRoom, setActiveRoom, setUnreadMessages }) => {
	const [rooms, setRooms] = useState([]);
	const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useGetAllUsersQuery(null)

	// Фильтруем пользователей по workspaceId
	const filteredUsers = useMemo(() => {
		if (!users || !user?.workspaceId) return [];
		return users.filter(u => u.workspaceId === user.workspaceId);
	}, [users, user?.workspaceId]);

	const changeRoom = (room) => {
		if (!socket) return;

		setRooms(rooms.map((r) => {
			if (r.room.join('-') === room) {
				return {
					...r,
					active: true
				}
			} else {
				return {
					...r,
					active: false
				}
			}
		}))
		setActiveRoom(room)

		socket.emit('activeRoom', { activeRoom: room });
		setUnreadMessages(false)
	}

	useEffect(() => {
		if (!isUsersSuccess || !filteredUsers.length || !user?._id) return;

		const newRooms = compareRooms(filteredUsers, user._id);
		setRooms(newRooms);
		const defaultActiveRoom = newRooms.find((r) => r.active === true)?.room.join('-');
		if (defaultActiveRoom) {
			setActiveRoom(defaultActiveRoom);
		}
	}, [isUsersSuccess, filteredUsers, user?._id])

	useEffect(() => {
		if (!socket || !rooms.length) return;
		socket.emit('joinChat', rooms);
	}, [socket, rooms])
	return (
		<div style={{ height: '650px', width: '15%', backgroundColor: 'white', zIndex: 9, border: '1px solid #e7e7e7', borderRight: 'none', borderRadius: '5px 0 0 5px' }}>
			{rooms && rooms.map((room, i) => {
				return (
					<Tooltip title={room.name} key={i}>
						<Avatar onClick={() => changeRoom(room.room.join('-'))} alt={room.name} sx={{ margin: '10px auto', cursor: 'pointer' }} style={room.active ? { border: '2px solid green' } : { border: '2px solid white' }} src="/static/images/avatar/2.jpg" />
					</Tooltip>
				)
			})}
		</div>
	);
}

export default Rooms;