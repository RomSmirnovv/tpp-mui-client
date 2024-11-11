import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { useGetAllUsersQuery } from '../../redux/api/userApi';
import { useAddListMutation, useGetAllListQuery } from '../../redux/api/listApi';
import { useState } from 'react';
import { useAddCompanyMutation, useEditCompanyMutation, useGetCompaniesQuery } from '../../redux/api/companyApi';

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


const CopyListModal = ({ selectedListName, user, open = false, handleClose = () => { } }) => {
    const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useGetAllUsersQuery(null);
    const { data: lists, isSuccess: isListsSuccess, isLoading: isListsLoading } = useGetAllListQuery();
    const [createCompany, { error: createCompanyError, isLoading: isCreatingCompany }] = useAddCompanyMutation();
    const [editCompany, { error: editCompanyError, isLoading: isEditingCompany }] = useEditCompanyMutation();
    const [addList, { error: addListError, isLoading: isCreatingList }] = useAddListMutation();
    const { data: companies, isSuccess: isCompaniesSuccess, isLoading: isCompaniesLoading } = useGetCompaniesQuery(user._id);
    const [listsByChangedUser, setListsByChangedUser] = useState<any[]>([]);

    const [openAlert, setOpenAlert] = useState(false);
    const [dataAlert, setDataAlert] = useState<any>(null);
    const [copyAndRecover, setCopyAndRecover] = useState('');

    const handleCopyList = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setOpenAlert(false);
        if (!data.get('user')) {
            setDataAlert({
                type: 'error',
                message: 'Вы не выбрали пользователя'
            })
            setOpenAlert(true);
        }
        if (!data.get('list') && !data.get('newlist')) {
            setDataAlert({
                type: 'error',
                message: 'Вы не выбрали куда копировать/переносить'
            })
            setOpenAlert(true);
        }
        let copyData = {
            userId: data.get('user'),
            fullName: users?.find(u => u._id === data.get('user'))?.surname + ' ' + users?.find(u => u._id === data.get('user'))?.name + ' ' + users?.find(u => u._id === data.get('user'))?.patronymic,
            listName: lists?.find(l => l._id === data.get('list'))?.name,
            delListName: lists?.find(l => l._id === data.get('list'))?.name
        }
        const companiesByList = companies?.filter(c => c.listName === selectedListName);
        if (data.get('newlist') != '') {
            const newList = {
                name: data.get('newlist'),
                checked: false,
                userId: data.get('user'),
            }
            await addList(newList as any).unwrap();
            copyData.listName = data.get('newlist');
            copyData.delListName = data.get('newlist');
        }
        if (copyAndRecover === 'copy') {
            if (companiesByList && companiesByList.length > 0) {
                for (let i = 0; i < companiesByList.length; i++) {
                    let oldCompany = companiesByList[i];
                    let newCompany = { ...oldCompany, listName: copyData.listName, delListName: copyData.delListName, userId: copyData.userId, fullName: copyData.fullName };
                    delete newCompany._id;
                    await createCompany(newCompany).unwrap();
                }
            }
            handleClose();
        }
        if (copyAndRecover === 'recover') {
            if (companiesByList && companiesByList.length > 0) {
                for (let i = 0; i < companiesByList.length; i++) {
                    let oldCompany = companiesByList[i];
                    let newCompany = { ...oldCompany, listName: copyData.listName, delListName: copyData.delListName, userId: copyData.userId, fullName: copyData.fullName };
                    await editCompany(newCompany).unwrap();
                }
            }
            handleClose();
        }
    }

    const handleChangeUsers = (event: React.FormEvent<HTMLFormElement>) => {
        setListsByChangedUser(() => lists?.filter(l => l.userId === event.target.value) || [])
    }
    const handleChangeLists = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event.target.value)
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
                        Скопировать/Перенести записи
                    </Typography>
                    {openAlert && <Alert severity={dataAlert.type}>{dataAlert.message}</Alert>}
                    <Box component="form" onSubmit={handleCopyList} sx={{ mt: 1 }} >
                        <FormControl fullWidth>
                            <InputLabel id="user-select-label">Кому перенести</InputLabel>
                            <Select
                                labelId="user-select-label"
                                id="user-select"
                                name='user'
                                onChange={handleChangeUsers}
                            >
                                {users && users.filter(u => u._id !== user._id).map((u) => (
                                    <MenuItem key={u._id} value={u._id}>{u.surname} {u.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {listsByChangedUser && listsByChangedUser.length > 0 && (
                            <>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel id="list-select-label">В какой лист перенести</InputLabel>
                                    <Select
                                        labelId="list-select-label"
                                        id="list-select"
                                        name='list'
                                        onChange={handleChangeLists}
                                    >
                                        {listsByChangedUser && listsByChangedUser.map((l) => (
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
                                onClick={() => setCopyAndRecover('copy')}
                            >
                                Копировать
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3, mb: 2, ml: 1 }}
                                onClick={() => setCopyAndRecover('recover')}
                            >
                                Перенести
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal >
        </>
    );
}

export default CopyListModal;