import { useState } from 'react';
import { IList } from '../../redux/api/types';
import { TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEditListMutation } from '../../redux/api/listApi';

type Props = {
	editing: boolean
	setEditing: (value: boolean) => void
	setAlertOpen: (value: boolean) => void;
	setAlertMessage: (value: string) => void;
	setAlertVariant: (value: 'error' | 'info' | 'success' | 'warning' | undefined) => void;
	selectedEditList: string
	list: IList
}

const EditingListName = ({ editing, setAlertOpen, setAlertMessage, setAlertVariant, setEditing, list, selectedEditList }: Props) => {
	const [value, setValue] = useState(list.name);
	const [editList, { isSuccess: isEdited, isLoading: isEditing }] = useEditListMutation();

	const saveListName = async () => {
		const updateList = { ...list, name: value };
		try {
			await editList(updateList as any).unwrap();
			setEditing(false);
			setAlertVariant('success');
			setAlertMessage('Лист успешно изменен');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		} catch (error) {
			setAlertVariant('error');
			setAlertMessage('При изменении листа произошла ошибка');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		}
	}

	return (
		<>
			{list._id == selectedEditList && editing ? (<TextField
				id="standard-basic"
				label="Standard"
				variant="standard"
				onBlur={saveListName}
				value={value}
				onChange={e => setValue(e.target.value)}
			/>) : list.name}
		</>
	);
}

export default EditingListName;