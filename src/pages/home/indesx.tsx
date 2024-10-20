import { Container } from '@mui/material';
import Header from '../../components/header';
import HeaderBaseTable from '../../components/header-base-table';
import BaseTable from '../../components/base-table';
import { useAppSelector } from '../../redux/store';
import ChatWidget from '../../components/chat-widget';

const Home = () => {
	const currentUser = useAppSelector((state) => state.userState.user) || {};
	return (
		<>
			{currentUser &&
				<>

					<Header user={currentUser} />
					<Container sx={{ my: 3 }} maxWidth="xl">
						<HeaderBaseTable user={currentUser} />
						<BaseTable user={currentUser} />

					</Container>
					<ChatWidget user={currentUser} />
				</>
			}
		</>
	);
}

export default Home;