import { Box } from '@mui/material';
import { ICompany } from '../../redux/api/types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useEditCompanyMutation } from '../../redux/api/companyApi';
import EditCompanyModal from '../edit-company-modal';
import { useState } from 'react';
import DeleteCompanyModal from '../delete-company-modal';
import EditFileLinkModal from '../edit-filelink-modal';
import EditListCompany from '../edit-list-company';
import AddNotificationModal from '../add-notification-modal';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ConfirmRecoveryCompany from '../confirm-recovery-company';
import moment from 'moment';
import { useGetNotificationsByUserQuery } from '../../redux/api/notificationApi';

type Props = {
	params: Object
	options: any
}

const CompanyRowSettings = ({ params, options }: Props) => {
	const [openEdit, setOpenEdit] = useState(false)
	const [openRecovery, setOpenRecovery] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	const [openFileLink, setOpenFileLink] = useState(false)
	const [openEditList, setOpenEditList] = useState(false)
	const [openNotification, setOpenNotification] = useState(false)
	const [editCompany, { isLoading: isEditCompanyLoading }] = useEditCompanyMutation()
	const { data: notifications } = useGetNotificationsByUserQuery(params.row.userId);


	const handleOpenEdit = () => setOpenEdit(true)
	const handleCloseEdit = () => setOpenEdit(false)

	const handleOpenDelete = () => setOpenDelete(true)
	const handleCloseDelete = () => setOpenDelete(false)

	const handleOpenFileLink = () => setOpenFileLink(true)
	const handleCloseFileLink = () => setOpenFileLink(false)

	const handleOpenEditList = () => setOpenEditList(true)
	const handleCloseEditList = () => setOpenEditList(false)

	const handleOpenNotification = () => setOpenNotification(true)
	const handleCloseNotification = () => setOpenNotification(false)

	const handleOpenRecovery = () => setOpenRecovery(true)
	const handleCloseRecovery = () => setOpenRecovery(false)


	const toggleStar = async () => {
		if (params.row) {
			const favorite = params.row.favorite
			const updateCompany = { ...params.row, favorite: !favorite }
			try {
				await editCompany(updateCompany).unwrap();
			} catch (error) {

			}
		}
	}

	const handleRecoveryCompany = () => { }


	return (
		<>
			{params.row.listName === 'Корзина' ?
				<Box sx={{ display: 'flex' }}>
					<AutorenewIcon onClick={handleOpenRecovery} sx={{ m: 0.5, fontSize: 18, cursor: 'pointer' }} titleAccess="Восстановить запись" />
				</Box>
				:
				<>
					<Box sx={{ display: 'flex', mt: 0.5 }}>
						<AccessTimeIcon onClick={handleOpenNotification} sx={{ m: 0.1, fontSize: 18, cursor: 'pointer' }} titleAccess={notifications && notifications.find(n => n.companyId === params.row.id) ? notifications.find(n => n.companyId === params.row.id).notificationDateTime : `Добавить уведомление`} />
						{params.row.favorite ?
							<StarOutlinedIcon sx={{ m: 0.1, fontSize: 18, cursor: 'pointer', color: '#ceb129' }} titleAccess="Удалить из избранного" onClick={toggleStar} disabled={isEditCompanyLoading} />
							:
							<StarOutlineIcon sx={{ m: 0.1, fontSize: 18, cursor: 'pointer' }} titleAccess="В избранное" onClick={toggleStar} disabled={isEditCompanyLoading} />
						}

						<AttachFileIcon onClick={handleOpenFileLink} sx={{ m: 0.1, fontSize: 18, cursor: 'pointer' }} titleAccess="Ссылка на файл" />
					</Box>
					<Box sx={{ display: 'flex', mb: 0.5 }}>
						<EditIcon onClick={handleOpenEdit} sx={{ m: 0.1, fontSize: 18, cursor: 'pointer' }} titleAccess="Редактировать запись" />
						<DeleteOutlineIcon onClick={handleOpenDelete} sx={{ m: 0.1, fontSize: 18, cursor: 'pointer' }} titleAccess="Удалить запись" />
						<ContentCopyOutlinedIcon onClick={handleOpenEditList} sx={{ m: 0.1, fontSize: 18, cursor: 'pointer' }} titleAccess="Копировать/Перенести в другой лист" />
					</Box>
					<div style={{ lineHeight: '14px', marginBottom: '3px', fontSize: '12px', fontStyle: 'italic' }}>{moment(params.row.updateDate).format('DD.MM.YYYY HH:mm:ss')}</div>
					<div style={{ lineHeight: '14px', marginBottom: '3px', fontSize: '12px', fontStyle: 'italic', color: 'red' }}>{params.row.editIsAdmin ? 'Изменил админ.' : ''}</div>
				</>
			}
			<EditCompanyModal options={options} company={params.row} open={openEdit} handleClose={handleCloseEdit} />
			<DeleteCompanyModal company={params.row} open={openDelete} handleClose={handleCloseDelete} />
			<EditFileLinkModal company={params.row} open={openFileLink} handleClose={handleCloseFileLink} />
			<EditListCompany company={params.row} open={openEditList} handleClose={handleCloseEditList} />
			<AddNotificationModal company={params.row} open={openNotification} handleClose={handleCloseNotification} />
			<ConfirmRecoveryCompany company={params.row} open={openRecovery} handleClose={handleCloseRecovery} />
		</>
	);
}

export default CompanyRowSettings;