import { Route, Routes } from 'react-router-dom';
import Login from '../../pages/login';
import PrivateRouter from '../private-router';
import Home from '../../pages/home/indesx';
import Staff from '../../pages/staff';
import Register from '../../pages/register';

const Router = () => {
	return (
		<>
			<Routes>
				<Route element={<PrivateRouter />}>
					<Route index element={<Home />} />
					<Route path='staff' element={<Staff />} />
				</Route>
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />
			</Routes>
		</>
	);
}

export default Router;