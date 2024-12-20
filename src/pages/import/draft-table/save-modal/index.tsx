import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { useGetAllUsersQuery } from '../../redux/api/userApi';
import { useState } from 'react';
import { useAddCompanyMutation, useEditCompanyMutation, useGetCompaniesQuery } from '../../../../redux/api/companyApi';
import { useAddListMutation, useGetListByUserQuery } from '../../../../redux/api/listApi';
import { useAddColumnMutation } from '../../../../redux/api/columnsApi';
import { useDeleteDraftColumnMutation, useGetDraftColumnsQuery } from '../../../../redux/api/draftColumnsApi';
import { useDeleteDraftRowMutation, useGetDraftRowsQuery } from '../../../../redux/api/draftRowsApi';
import { useDeletedraftMutation } from '../../../../redux/api/draftsApi';
import { useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


const SaveModal = ({ columns, companies, draftId, userId, open = false, handleClose = () => { } }) => {
    const { data: lists, isSuccess: isListsSuccess, isLoading: isListsLoading } = useGetListByUserQuery(userId);
    const [createCompany, { error: createCompanyError, isLoading: isCreatingCompany }] = useAddCompanyMutation();
    const [addList, { error: addListError, isLoading: isCreatingList }] = useAddListMutation();
    const [addColumn, { error: addColumnError, isLoading: isCreatingColumn }] = useAddColumnMutation();
    const [listsByChangedUser, setListsByChangedUser] = useState<any[]>([]);
    const [deleteDraftColumns, { error: deleteDraftColumnsError, isLoading: isDeletingDraftColumns }] = useDeleteDraftColumnMutation();
    const [deleteDraftRows, { error: deleteDraftRowsError, isLoading: isDeletingDraftRows }] = useDeleteDraftRowMutation();
    const [deleteDfart, { error: deleteDfartError, isLoading: isDeletingDfart }] = useDeletedraftMutation();
    const navigate = useNavigate();

    const { data: draftcolumns } = useGetDraftColumnsQuery(draftId || '');
    const { data: draftrows } = useGetDraftRowsQuery(draftId || '');

    const [openAlert, setOpenAlert] = useState(false);
    const [dataAlert, setDataAlert] = useState<any>(null);
    const [copyAndRecover, setCopyAndRecover] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCopyList = async (event: React.FormEvent<HTMLFormElement>) => {

    }
    const handleChangeLists = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event.target.value)
    }

    const handleSaveData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setOpenAlert(false);
        if (!data.get('list') && !data.get('newlist')) {
            setDataAlert({
                type: 'error',
                message: 'Вы не выбрали куда сохранять записи'
            })
            setOpenAlert(true);
        }
        // если новый лист - создаем
        let listName = '';
        if (data.get('newlist') != '') {
            const newList = {
                name: data.get('newlist'),
                checked: false,
                userId: data.get('user'),
            }
            await addList(newList as any).unwrap();
            listName = newList.name;
        } else {
            listName = data.get('list') ? lists?.find(l => l._id === data.get('list'))?.name : listName;
        }

        // Добавляем в записи название листа в listName и delListName
        const companiesWithListName = companies?.map((c) => ({
            ...c,
            listName: listName,
            delListName: listName
        }))

        // включаем loading
        setLoading(true);

        // добавляем колонки, если есть новые
        if (columns.length > 0) {
            for (let i = 0; i < columns.length; i++) {
                await addColumn(columns[i]).unwrap();
            }
        }

        // сохраняем записи
        companiesWithListName.forEach(async (c) => {
            await createCompany(c).unwrap();
        })

        // удаляем строки черновика
        if (draftrows && draftrows.length > 0) {
            draftrows.forEach(async (row) => {
                await deleteDraftRows(row).unwrap();
            })
        }

        // удаляем колонки черновика
        if (draftcolumns && draftcolumns.length > 0) {
            draftcolumns.forEach(async (column) => {
                await deleteDraftColumns(column).unwrap();
            })
        }

        // удаляем черновик
        await deleteDfart(draftId).unwrap();

        // редирект на базу
        navigate('/', { replace: true });

        console.log('columns', columns)
        console.log('draftId', draftId)
    }


    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3, color: 'grey' }}>
                        Сохранить записи
                    </Typography>
                    {openAlert && <Alert severity={dataAlert.type}>{dataAlert.message}</Alert>}
                    {loading && <CircularProgress />}
                    <Box component="form" onSubmit={handleSaveData} sx={{ mt: 1 }} >
                        {lists && lists.length > 0 && (
                            <>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel id="list-select-label">В какой лист сохранить</InputLabel>
                                    <Select
                                        labelId="list-select-label"
                                        id="list-select"
                                        name='list'
                                        onChange={handleChangeLists}
                                    >
                                        {lists && lists.map((l) => (
                                            <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <TextField
                                        name="newlist"
                                        label="Или добавьте новый лист"
                                    />
                                </FormControl>
                            </>
                        )}
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, mr: 1 }}
                            >
                                Сохранить
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal >
        </>
    );
}

export default SaveModal;