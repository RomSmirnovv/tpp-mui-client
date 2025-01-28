import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '../../assets/images/logo.svg';
import { Badge } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../../redux/api/authApi';
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { useGetNotificationsByUserQuery } from '../../redux/api/notificationApi';
import NotificationItem from '../notification-item';
import { INotification, IUser } from '../../redux/api/types';
import moment from 'moment';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { io } from 'socket.io-client';
import { Howl, Howler } from "howler";
import notificationVoice from '../../assets/voices/notification.mp3'
import { BASE_URL } from '../../config';
import GroupIcon from '@mui/icons-material/Group';
import { useGetAllUsersQuery, useGetUserQuery } from '../../redux/api/userApi';


const getPages = (userRole: number) => {
	let pages: Array<string> = []
	if (userRole === 2) {
		pages = ['База данных', 'Сотрудники', 'Настройки'];
	}
	if (userRole === 3) {
		pages = ['База данных', 'Настройки'];
	}
	return pages;
}
const settings = ['Профиль', 'Выйти'];

type Props = {
	user: any
}

const socket = io(BASE_URL);

const Header = ({ user }: Props) => {
	const { data: currentUser } = useGetUserQuery(null);
	const navigate = useNavigate();
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
	const [anchorElUserAdmin, setAnchorElUserAdmin] = React.useState<null | HTMLElement>(null);
	const [anchorElNotification, setAnchorElNotification] = React.useState<null | HTMLElement>(null);
	const [logout, { isLoading: logoutIsLoading, error: logoutError }] = useLogoutUserMutation();
	const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useGetAllUsersQuery(null);

	const [notificationData, setNotificationData] = React.useState([])
	const [counterNoReaded, setCounterNoReaded] = React.useState(notificationData?.filter((item) => !item.readed).length);
	const [error, setError] = React.useState("");

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleOpenUserMenuAdmin = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUserAdmin(event.currentTarget);
	};
	const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNotification(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleCloseUserMenuAdmin = () => {
		setAnchorElUserAdmin(null);
	};

	const handleCloseNotificationMenu = () => {
		setAnchorElNotification(null);
	};

	const handleLogout = async () => {
		try {
			await logout();

		} catch (error) {
			const maybeError = isErrorWithMessage(error);

			if (maybeError) {
				setError(logoutError?.data.error);
			} else {
				setError("Неизвестная ошибка");
			}
		}
		navigate("/login", { replace: true });
	}

	const handleSelectUser = (user: IUser) => {
		if (currentUser._id === user._id) {
			navigate(`/`, { replace: true });
			navigate(0)
		} else {
			navigate(`/admin?userId=${user._id}`, { replace: true });
			navigate(0)
		}
	}

	React.useEffect(() => {
		const params = {
			room: user._id,
		}

		socket.emit('join', params);
	}, [socket])

	React.useEffect(() => {
		socket.on('getAllNotifications', (data) => {
			setNotificationData(data);
		});
	}, [socket])

	React.useEffect(() => {
		socket.on('readNotification', ({ data }) => {
			setNotificationData((notificationData) => {
				return notificationData.map((item) => {
					if (item._id === data._id) {
						return data
					}
					return item
				})
			})
		});
	}, [socket])

	React.useEffect(() => {
		socket.on('updateNotification', ({ data }) => {
			setNotificationData((_notificationData) => _notificationData.filter((item) => item._id !== data._id));
		})
	}, [socket])

	const Sound = new Howl({
		src: [notificationVoice],
		html5: true,
		ctx: new (window.AudioContext || window.webkitAudioContext)(),
	});

	React.useEffect(() => {
		socket.on('getNewNotifications', ({ data }) => {
			setNotificationData((_notificationData) => [..._notificationData, data]);
			Sound.play();
			Howler.ctx.resume();
		});
	}, [socket])



	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<img
						src={logo}
						loading="lazy"
						width={45}
						height={45}
						style={{ marginRight: '20px' }}
					/>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							<MenuItem key={1} onClick={handleCloseNavMenu}>
								<Typography textAlign="center">База данных</Typography>
							</MenuItem>
							{user.role == 2 ?
								<MenuItem key={2} onClick={handleCloseNavMenu}>
									<Typography textAlign="center">Сотрудники</Typography>
								</MenuItem>
								: null}
						</Menu>
					</Box>

					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						<NavLink to="/" style={{ margin: '10px', color: 'white', display: 'block', fontWeight: '400' }}>База данных</NavLink>
						{user.role == 2 ?
							<NavLink to="/staff" style={{ margin: '10px', color: 'white', display: 'block', fontWeight: '400' }}>Сотрудники</NavLink>
							: null}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Уведомления">
							<IconButton color="inherit" sx={{ mx: 2, w: 50, h: 50 }} onClick={handleOpenNotificationMenu}>
								<Badge id="foo" badgeContent={notificationData && notificationData.filter((notification: INotification) => !notification.readed).length} color="secondary">
									<NotificationsIcon sx={{ width: '2rem', height: '2rem' }} />
								</Badge>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px', height: '300px', overflow: 'auto' }}
							id="menu-appbar"
							anchorEl={anchorElNotification}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElNotification)}
							onClose={handleCloseNotificationMenu}
						>
							{notificationData && notificationData
								.sort((a, b) => a.notificationDateTime < b.notificationDateTime ? 1 : -1)
								.map((notification: INotification) => (
									<NotificationItem key={notification._id} notification={notification} />
								))}
							{notificationData && notificationData.length === 0 && <MenuItem><Typography textAlign="center">Нет уведомлений</Typography></MenuItem>}
						</Menu>
					</Box>
					{currentUser.role == 2 ?
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Выбрать пользователя">
								<IconButton onClick={handleOpenUserMenuAdmin} sx={{ p: 0 }}>
									<GroupIcon sx={{ width: '2rem', height: '2rem', color: 'white', mr: 2 }} />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								anchorEl={anchorElUserAdmin}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUserAdmin)}
								onClose={handleCloseUserMenuAdmin}
							>
								{users && users.map((user: IUser) => (
									<MenuItem key={user._id} onClick={() => handleSelectUser(user)}>
										<Typography textAlign="center">{user.surname} {user.name}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						: null}

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Профиль">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt={`${user.surname} ${user.name}`} src="/static/images/avatar/2.jpg" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<MenuItem key={settings[0]}>
								<NavLink to="/"><Typography onClick={() => navigate(`/`, { replace: true })} textAlign="center">{settings[0]}</Typography></NavLink>
							</MenuItem>
							<MenuItem key={settings[1]} onClick={handleLogout}>
								<Typography textAlign="center">{settings[1]}</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Header;