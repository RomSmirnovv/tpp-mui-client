import { Route, Routes } from 'react-router-dom';
import Login from '../../pages/login';
import PrivateRouter from '../private-router';
import Home from '../../pages/home/indesx';
import Staff from '../../pages/staff';
import Register from '../../pages/register';
import Admin from '../../pages/admin';
import Import from '../../pages/import';
import DraftTable from '../../pages/import/draft-table';

const Router = () => {
	return (
		<>
			<Routes>
				<Route element={<PrivateRouter />}>
					<Route index element={<Home />} />
					<Route path='staff' element={<Staff />} />
					<Route path='admin' element={<Admin />} />
					<Route path='import' element={<Import />} />
					<Route path='draft-table' element={<DraftTable />} />
				</Route>
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />
			</Routes>
		</>
	);
}

export default Router;