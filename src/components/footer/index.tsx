import { Container } from '@mui/material';
import Copyright from '../copyright';

const Footer = () => {
	return (
		<Container fixed={true} sx={{ pt: 4 }}>
			<Copyright />
		</Container>
	);
}

export default Footer;