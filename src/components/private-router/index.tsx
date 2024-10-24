import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetUserQuery } from '../../redux/api/userApi';
import Cookies from 'universal-cookie';
import FullScreenLoader from '../fullscreen-loader';

const PrivateRouter = () => {
	const cookies = new Cookies();
	const logged_in = cookies.get('logged_in');
	const { data: currentUser, isLoading, isSuccess } = useGetUserQuery(null, { skip: !logged_in });


	if (isLoading) {
		return <FullScreenLoader />
	}
	if (!logged_in || !currentUser) {
		return <Navigate to='/login' />
	}
	if (logged_in && currentUser) {
		return <Outlet />
	}
}

export default PrivateRouter;