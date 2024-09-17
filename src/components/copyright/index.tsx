import { Typography } from '@mui/material';

const Copyright = (props: any) => {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{<a href="/">Тех Пром Продукт © </a>}
			{new Date().getFullYear()}
		</Typography>
	);
}

export default Copyright;