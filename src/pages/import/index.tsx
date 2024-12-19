import { Box, Checkbox, Container, TextField, Typography } from '@mui/material';
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
import { useGetAllColumnsQuery } from '../../redux/api/columnsApi';
import ImportTable from './import-table';

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
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jdata = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const columnsData: any[] = []
        const rowsData: any[] = []
        for (let i = 0; i < jdata[0].length; i++) {
            const slug = columns && columns?.find(column => column.name === jdata[0][i]) ? columns?.find(column => column.name === jdata[0][i])?.slug : translit(jdata[0][i].toLowerCase().trimStart().trimEnd()).split(' ').join('_').split('.').join('');
            columnsData.push({
                field: slug,
                headerName: jdata[0][i],
                slug: slug,
                checked: true,
                type: 'Текст',
                width: 190,
                sortable: false,
                disableColumnMenu: true,
                disableReorder: false,
                isDeleted: true,
                renderHeader: (params) => {
                    return (
                        <div>
                            <Box sx={{ display: 'flex', mb: 0.5 }}>
                                <Checkbox sx={{ ml: -1 }} defaultChecked onChange={(event) => handleChecked(event, params)} />
                                <Typography sx={{ mt: 1 }}>{params.colDef.name}</Typography>
                            </Box>
                            <Autocomplete
                                id={params.field}
                                sx={{ width: 150 }}
                                className='import-autocomplete'
                                options={columns?.map((column) => column.name)}
                                defaultValue={params.colDef.name}
                                onChange={(event, value) => handleAutocomplete(event, value, params)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>
                    );
                },
            })
        }
        for (let i = 1; i < jdata.length; i++) {
            if (jdata[i].length !== 0) {
                let currentRow = {}
                for (let k = 0; k < jdata[i].length; k++) {
                    currentRow.id = i - 1
                    currentRow[columnsData[k]?.slug === undefined ? '' : `${columnsData[k]?.slug}`] = jdata[i][k] === undefined ? '' : jdata[i][k];
                }
                rowsData.push(currentRow)
            }
        }

        columnsRef.current = columnsData;
        uploadColumnsRef.current = columnsData;
        rowsRef.current = rowsData;
        uploadRowsRef.current = rowsData;

        setState(() => true);
    };

    const handleChecked = (event: any, params) => {
        let updateColumns = uploadColumnsRef.current
        for (let i = 0; i < updateColumns.length; i++) {
            if (updateColumns[i].field === params.field) {
                updateColumns[i].checked = event.target.checked
            }
        }
        if (event.target.checked) {
            for (let m = 0; m < rowsRef.current.length; m++) {
                rowsRef.current[m][params.field] = uploadRowsRef.current[m][params.field]
            }
        } else {
            let filterRows = rowsRef.current
            // for (let n = 0; n < filterRows.length; n++) {
            //     delete filterRows[n][params.field];
            // }
            rowsRef.current = filterRows
            console.log('1', rowsRef.current)
            console.log('2', uploadRowsRef.current)
        }
    }

    const handleAutocomplete = async (event: any, value: any, params) => {
        // let activeColumn = saveColumns.find(column => column.field === params.field);
        // console.log('columnsData', columnsData)
        // console.log('uploadColumns', uploadColumns)
        // console.log('field', params.field)
        // console.log('activeColumn', activeColumn)
    }

    const handleSaveTable = () => {
        // получаем новые колонки которые нужно добавить
        let filterColumns = columnsRef.current.filter(column => column.checked === true)
        if (filterColumns) {
            let saveRowsData = []
            filterColumns.forEach((x) => {
                if (!columns.find((item) => item.name == x.name))
                    saveRowsData.push(x)
            })
            console.log('saveRowsData', saveRowsData)
        }

        // получаем строки которые нужно добавить
        console.log('filterRows', rowsRef.current)
    }

    return (
        <>
            {currentUser &&
                <>

                    <Header user={currentUser} />
                    <Container sx={{ my: 3, textAlign: 'left' }} maxWidth="xl">
                        <Typography variant="h4" sx={{ mb: 2, color: '#333', textAlign: 'left' }}>Загрузите файл Excel</Typography>

                        {uploadColumnsRef.current.length === 0 ?
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
                            </Button> :
                            <Button
                                variant="contained"
                                sx={{ mb: 3 }}
                                onClick={handleSaveTable}
                            >Сохранить</Button>
                        }
                        {uploadColumnsRef.current && uploadColumnsRef.current.length > 0 && state ?
                            <ImportTable columns={uploadColumnsRef.current} rows={uploadRowsRef.current} /> : null}
                    </Container>
                    <ChatWidget user={currentUser} />
                </>
            }
        </>
    );
}

export default Import;