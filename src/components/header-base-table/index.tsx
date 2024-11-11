import { Alert, Backdrop, Box, Button, Collapse, Stack } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState } from 'react';
import { useAddListMutation, useEditListMutation, useGetListByUserQuery } from '../../redux/api/listApi';
import { useAppSelector } from '../../redux/store';
import { IList, IUser, UserId } from '../../redux/api/types';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import styles from './index.module.css';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDialogDeleteList from '../confirm-dialog-delete-list';
import EditingListName from '../editing-list-name';
import AddColumnModal from '../add-column-modal';
import AddCompanyModal from '../add-company-modal';
import { useGetCompaniesQuery } from '../../redux/api/companyApi';
import CopyRowsModal from '../copy-rows-modal';
import CopyListModal from '../copy-list-modal';

type Props = {
	user: IUser
	selectedRows: string[]
}

const HeaderBaseTable = ({ user, selectedRows }: Props) => {
	const [open, setOpen] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertVariant, setAlertVariant] = useState<'error' | 'warning' | 'info' | 'success'>('info');
	const [editing, setEditing] = useState(false);
	const [alignment, setAlignment] = useState<string | null>('left');
	const [dataLists, setDataLists] = useState<IList[]>([]);
	const [activeList, setActiveList] = useState<any>(null);
	const [selectedEditList, setSelectedEditList] = useState<any>(null);
	const [selectedList, setSelectedList] = useState<any>(null);
	const { data: lists, isSuccess: isListsSuccess, isLoading: isListsLoading } = useGetListByUserQuery(user._id as UserId, { skip: !user._id });
	const { data: companies, isSuccess: isCompaniesSuccess } = useGetCompaniesQuery(user._id);
	const [editList, { isSuccess: isEdited, isLoading: isEditing }] = useEditListMutation();
	const [addList, { isSuccess: isCreated, isLoading: isCreating }] = useAddListMutation();
	const [openModal, setOpenModal] = useState(false);
	const [openAddCompanyModal, setOpenAddCompanyModal] = useState(false);
	const [copyRowsButtonVisible, setCopyRowsButtonVisible] = useState(false);
	const [openCopyRowsModal, setOpenCopyRowsModal] = useState(false);
	const [openCopyListModal, setOpenCopyListModal] = useState(false);

	const [copyRowsData, setCopyRowsData] = useState([]);

	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const handleOpenAddCompanyModal = () => setOpenAddCompanyModal(true);
	const handleCloseAddCompanyModal = () => setOpenAddCompanyModal(false);

	const handleChangeList = async (list: IList) => {
		const updateUser = { ...list, checked: true };
		try {
			await editList(updateUser as any).unwrap();
			setActiveList(updateUser);
			setAlertVariant('success');
			setAlertMessage('Лист успешно выбран');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		} catch (error) {
			setAlertVariant('error');
			setAlertMessage('При выборе листа произошла ошибка');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		}
	};

	const handleAddList = async () => {
		const newList = {
			name: 'Новый лист',
			checked: true,
			userId: user._id as UserId,
		}
		try {
			await addList(newList as any).unwrap();
			setActiveList(newList);
			setAlertVariant('success');
			setAlertMessage('Лист успешно добавлен');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		} catch (error) {
			setAlertVariant('error');
			setAlertMessage('При добавлении листа произошла ошибка');
			setAlertOpen(true);
			setTimeout(() => setAlertOpen(false), 3000);
		}
	}

	const handleDeleteList = async (list: IList) => {
		setSelectedList(list);
		setOpen(true);
	}
	const handleClose = () => setOpen(false);

	const handleSelectedEditList = (listId: any) => {
		setSelectedEditList(listId);
		setEditing(true);
	}

	const handleCopyRows = () => {
		setOpenCopyRowsModal(true)
	}
	const handleCopyList = () => {
		setOpenCopyListModal(true)
		// console.log('selectedRows', selectedRows)
		// if (dataLists) {
		// 	let activeList = dataLists.find(list => list.checked === true)
		// 	console.log('activeList', activeList)
		// }
		// if (companies && activeList) {
		// 	let rowsByActiveList = companies.filter(company => company.listName === activeList?.name)
		// 	console.log('rowsByActiveList', rowsByActiveList)
		// }
	}

	useEffect(() => {
		if (selectedRows.length > 0) {
			setCopyRowsButtonVisible(() => true)
		} else {
			setCopyRowsButtonVisible(() => false)
		}
	}, [selectedRows])


	useEffect(() => {
		if (lists) {
			setDataLists(lists)
			setActiveList(lists.find(list => list.checked === true))
		}
	}, [user, lists, activeList]);

	return (
		<>
			<Box sx={{ textAlign: 'left', mb: 3, mt: 3, display: 'flex' }}>
				{isListsSuccess &&
					<ToggleButtonGroup
						color="primary"
						value={activeList}
						exclusive
						disabled={isEditing}
					>
						{dataLists && dataLists.map((list) => (
							<ToggleButton key={list._id} value={list} className={styles.toggle__button}>


								{list.name != 'Основной' && list.name != 'Корзина' ? (
									<>
										<span onClick={() => handleChangeList(list)}><EditingListName list={list} editing={editing} setEditing={setEditing} selectedEditList={selectedEditList} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage} setAlertVariant={setAlertVariant} /></span>
										<EditIcon sx={{ cursor: 'pointer', fontSize: 17, pl: 1, color: 'primary.main', mt: '2px' }} titleAccess='Переименовать лист' onClick={() => handleSelectedEditList(list._id)} />
										<HighlightOffOutlinedIcon sx={{ cursor: 'pointer', fontSize: 17, pl: 1, color: 'primary.main', mt: '2px' }} onClick={() => handleDeleteList(list)} titleAccess='Удалить лист' />
									</>
								) :
									<span onClick={() => handleChangeList(list)}>{list.name}</span>
								}

							</ToggleButton>
						))}
					</ToggleButtonGroup>
				}
				<AddCircleOutlineOutlinedIcon sx={{ cursor: 'pointer', fontSize: 42, pl: 2, color: 'primary.main', mt: '8px' }} onClick={handleAddList} />
				<Button sx={{ ml: 2 }} variant="contained" onClick={handleOpenAddCompanyModal} >Добавить запись</Button>
				<Button sx={{ ml: 2 }} variant="outlined" onClick={handleOpenModal} >Добавить новую колонку</Button>
				{user.role === 2 ?
					<>
						{copyRowsButtonVisible && <Button sx={{ ml: 2 }} variant="outlined" onClick={handleCopyRows} >Копировать/Перенести записи</Button>}
						{<Button sx={{ ml: 2 }} variant="outlined" onClick={handleCopyList} >Копировать/Перенести лист</Button>}
					</>
					: null}
				<ConfirmDialogDeleteList selectedList={selectedList} open={open} handleClose={handleClose} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage} setAlertVariant={setAlertVariant} />
			</Box>

			<Collapse in={alertOpen}>
				<Alert severity={alertVariant}>{alertMessage}</Alert>
			</Collapse>
			<AddColumnModal open={openModal} handleClose={handleCloseModal} />
			<AddCompanyModal user={user} list={activeList} open={openAddCompanyModal} handleClose={handleCloseAddCompanyModal} />
			<CopyRowsModal selectedRows={selectedRows} user={user} open={openCopyRowsModal} handleClose={() => setOpenCopyRowsModal(false)} />
			<CopyListModal selectedListName={activeList?.name} user={user} open={openCopyListModal} handleClose={() => setOpenCopyListModal(false)} />
		</>
	);
}

export default HeaderBaseTable;