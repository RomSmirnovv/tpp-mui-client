import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	IconButton,
	Typography,
} from '@material-ui/core';
import { useDeleteListMutation } from '../../redux/api/listApi';
import { ICompany } from '../../redux/api/types';
import { useEditCompanyMutation } from '../../redux/api/companyApi';

type Props = {
	company: ICompany;
	open: boolean;
	handleClose: () => void;
};


const ConfirmRecoveryCompany = ({ company, open, handleClose }: Props) => {
	const [editCompany, { isLoading: isEditCompanyLoading }] = useEditCompanyMutation();


	const handleRecovery = async () => {
		let delList = 'Основной';
		if (company.delListName != 'Корзина') {
			delList = company.delListName
		}
		const updateCompany = { ...company, listName: delList, delListName: delList, delComment: '' };
		console.log(updateCompany);
		try {
			await editCompany(updateCompany).unwrap();
			handleClose();
		} catch (error) {
		}
	}

	return (
		<Dialog open={open} maxWidth="sm" fullWidth>
			<DialogTitle>Восстановить запись?</DialogTitle>
			<DialogContent>
				<Typography>Вы действительно хотите восстановить запись?</Typography>
			</DialogContent>
			<DialogActions>
				<Button color="secondary" variant="contained" onClick={handleRecovery}>
					Восстановить
				</Button>
				<Button color="primary" variant="contained" onClick={handleClose}>
					Отмена
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmRecoveryCompany;
