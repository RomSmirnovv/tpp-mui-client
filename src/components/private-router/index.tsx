import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetUserQuery } from '../../redux/api/userApi';
import FullScreenLoader from '../fullscreen-loader';

const PrivateRouter = () => {
	const [cookies] = useCookies(['logged_in']);
	const { data: currentUser, isLoading, isSuccess } = useGetUserQuery(null, { skip: !cookies.logged_in });

	if (!cookies.logged_in) {
		return <Navigate to='/login' />;
	}
	if (isLoading) {
		return <FullScreenLoader />
	}
	if (!currentUser) {
		return <Navigate to='/login' />
	}
	if (currentUser && cookies.logged_in) {
		return <Outlet />
	}
}

export default PrivateRouter;