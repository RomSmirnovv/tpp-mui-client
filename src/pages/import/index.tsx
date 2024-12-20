import { Box, Checkbox, Container, Stack, TextField, Typography } from '@mui/material';
import Header from '../../components/header';
import HeaderBaseTable from '../../components/header-base-table';
import BaseTable from '../../components/base-table';
import { useAppSelector } from '../../redux/store';
import ChatWidget from '../../components/chat-widget';
import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { translit } from '../../utils/is-translit-string';
import { DataGrid } from '@mui/x-data-grid';
import Autocomplete from '@mui/material/Autocomplete';
import { useGetAllColumnsQuery, useGetColumnsQuery } from '../../redux/api/columnsApi';
import ImportTable from './import-table';
import { useAdddraftMutation, useGetAllDraftsByUserQuery, useGetDraftQuery } from '../../redux/api/draftsApi';
import { useAddDraftColumnMutation, useGetDraftColumnsQuery } from '../../redux/api/draftColumnsApi';
import { useAddDraftRowMutation } from '../../redux/api/draftRowsApi';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import moment from 'moment';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Import = () => {
    const currentUser = useAppSelector((state) => state.userState.user) || {};
    const { data: drafts, isLoading: isDraftsLoading } = useGetAllDraftsByUserQuery(currentUser._id);

    const [addDraft, { isLoading: isDraftLoading }] = useAdddraftMutation();
    const [addDraftColumn, { isLoading: isAddDraftColumnLoading }] = useAddDraftColumnMutation();
    const [addDrafRow, { isLoading: isAddDrafRowLoading }] = useAddDraftRowMutation();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const { data: columns } = useGetAllColumnsQuery();



    const [openModal, setOpenModal] = useState(false);

    const columnsRef = useRef([]);
    const uploadColumnsRef = useRef([]);
    const rowsRef = useRef([]);
    const uploadRowsRef = useRef([]);

    const [state, setState] = useState(false);

    const paginationModel = { page: 0, pageSize: 15 };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleChangeFile = async (e: any) => {
        const file = e.target.files[0];

        // если есть файл сохраняем черновик
        if (file) {
            setIsLoading(true);
            const newDraft = { name: file.name, userId: currentUser._id };
            const res = await addDraft(newDraft)
            let draftId: string = '';
            if (res) {
                draftId = res.data._id
            }
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jdata = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


            if (draftId) {
                // если есть ID черновика сохраняем колоки черновика
                let columnsData = []
                for (let i = 0; i < jdata[0].length; i++) {
                    const slug = columns && columns?.find(column => column.name === jdata[0][i]) ? columns?.find(column => column.name === jdata[0][i])?.slug : translit(jdata[0][i].toLowerCase().trimStart().trimEnd()).split(' ').join('_').split('.').join('');
                    const column = {
                        headerName: jdata[0][i],
                        saveName: jdata[0][i],
                        slug: slug,
                        field: slug,
                        saveField: slug,
                        checked: true,
                        isDeleted: true,
                        width: 190,
                        type: 'Текст',
                        userId: currentUser._id,
                        draftId: draftId
                    };
                    await addDraftColumn(column)
                    columnsData.push(column)
                }

                // сохраняем строки черновика
                for (let i = 1; i < jdata.length; i++) {
                    if (jdata[i].length !== 0) {
                        let currentRow = {}
                        for (let k = 0; k < jdata[i].length; k++) {
                            currentRow.id = i - 1
                            currentRow[columnsData[k]?.slug === undefined ? '' : `${columnsData[k]?.slug}`] = jdata[i][k] === undefined ? '' : jdata[i][k];
                            currentRow.userId = currentUser._id
                            currentRow.draftId = draftId
                            currentRow.fullName = currentUser.surname + ' ' + currentUser.name + ' ' + currentUser.patronymic
                        }
                        await addDrafRow(currentRow)
                    }
                }
                setIsLoading(false);
                navigate(`/draft-table?draftId=${draftId}`, { replace: true });
            }

        }
    };

    return (
        <>
            {currentUser &&
                <>

                    <Header user={currentUser} />
                    <Container sx={{ my: 3, textAlign: 'left' }} maxWidth="xl">
                        <Typography variant="h4" sx={{ mb: 2, color: '#333', textAlign: 'left' }}>Загрузите файл Excel</Typography>
                        {drafts && drafts.length > 0 && !isLoading ?
                            <div style={{ marginBottom: 20 }}>
                                <Typography variant="h5" sx={{ mt: 2, mb: 3, color: '#333', textAlign: 'left' }}>У Вас есть несохраненные черновики</Typography>
                                {drafts.map((draft) => <><Chip label={`${draft.name} от ${moment(draft.createdAt).format('DD.MM.YYYY')}`} sx={{ cursor: 'pointer', mb: 1, mr: 1 }} onClick={() => navigate(`/draft-table?draftId=${draft._id}`, { replace: true })} /><br /></>)}
                            </div>
                            : null}
                        {!isLoading ?
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                sx={{ mb: 3 }}
                            >
                                Выбрать файл
                                <VisuallyHiddenInput
                                    type="file"
                                    accept='.xlsx, .xls'
                                    onChange={handleChangeFile}
                                    multiple
                                />
                            </Button> : <Typography variant="h5" sx={{ mt: 2, color: '#333', textAlign: 'left' }}>Подождите, пока загрузится таблица...</Typography>
                        }

                    </Container>
                    <ChatWidget user={currentUser} />
                </>
            }
        </>
    );
}

export default Import;