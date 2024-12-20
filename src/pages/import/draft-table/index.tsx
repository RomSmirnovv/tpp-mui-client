import { Autocomplete, Box, Button, Checkbox, Container, TextField, Typography } from "@mui/material";
import Header from "../../../components/header";
import ChatWidget from "../../../components/chat-widget";
import { useAppSelector } from "../../../redux/store";
import { useSearchParams } from "react-router-dom";
import { useGetDraftQuery } from "../../../redux/api/draftsApi";
import { useEditDraftColumnMutation, useGetDraftColumnsQuery } from "../../../redux/api/draftColumnsApi";
import { useGetDraftRowsQuery } from "../../../redux/api/draftRowsApi";
import ImportTable from "../import-table";
import { useEffect, useState } from "react";
import { useGetAllColumnsQuery } from "../../../redux/api/columnsApi";
import { translit } from "../../../utils/is-translit-string";
import moment from "moment";
import { Save } from "@material-ui/icons";
import SaveModal from "./save-modal";


const DraftTable = () => {
    const currentUser = useAppSelector((state) => state.userState.user) || {};
    const [searchParams, setSearchParams] = useSearchParams();
    const draftId = searchParams.get('draftId');

    const { data: draft } = useGetDraftQuery(draftId || '');
    const { data: columns } = useGetDraftColumnsQuery(draftId || '');
    const { data: rows } = useGetDraftRowsQuery(draftId || '');
    const { data: allColumns } = useGetAllColumnsQuery('');

    const [editDraftColumn, { isLoading: isEditDraftColumnLoading }] = useEditDraftColumnMutation();

    const [convertColumns, setConvertColumns] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [saveColumns, setSaveColumns] = useState([]);
    const [saveCompanies, setSaveCompanies] = useState([]);

    const handleChecked = async (event: any, params, column) => {
        const updateColumn = { ...column, checked: event.target.checked }
        try {
            await editDraftColumn(updateColumn)
        } catch (error) {

        }
    }

    const handleAutocomplete = async (event: any, value: any, params, column) => {
        console.log('params', params)
        let activeName = '';
        if (allColumns && allColumns?.find(column => column.slug === value.value)) {
            activeName = allColumns?.find(column => column.slug === value.value)?.slug
        }
        let updateColumn = '';
        if (activeName === '') {
            updateColumn = {
                ...column,
                saveField: translit(value.toLowerCase().trimStart().trimEnd()).split(' ').join('_').split('.').join(''),
                saveName: value
            }
        } else {
            updateColumn = {
                ...column,
                saveField: value.value,
                saveName: value.label
            }
        }
        try {
            await editDraftColumn(updateColumn)
        } catch (error) {

        }
    }

    const handleSaveTable = () => {
        // получаем массив колонок, которые нужно добавить в базу
        let saveRowsData = []
        const filteredColumns = columns.filter(column => column.checked === true);
        filteredColumns.forEach((x) => {
            if (!allColumns.find((item) => item.slug == x.saveField))
                saveRowsData.push(x)
        })
        const newColumns = saveRowsData.map((column) => ({
            name: column.saveName,
            slug: column.saveField,
            type: 'Текст',
            isDeleted: false
        }))
        setSaveColumns(newColumns)
        // редактируем массив строк, оставив только нужные поля
        const newRows = []
        rows.forEach((row) => {
            let newRow = {}
            filteredColumns.forEach((column) => {
                newRow[column.saveField] = row[column.slug]
            })
            newRow.userId = row.userId
            newRow.fullName = row.fullName
            newRow.updateDate = moment().format('YYYY-MM-DD HH:mm:ss')
            newRows.push(newRow)
        })
        setSaveCompanies(newRows)
        setOpenModal(true)
    }

    useEffect(() => {
        if (columns && columns.length > 0) {
            const columnsData = columns.map((column) => ({
                ...column,
                width: 190,
                sortable: false,
                disableColumnMenu: true,
                disableReorder: false,
                isDeleted: true,
                renderHeader: (params) => {
                    return (
                        <div>
                            <Box sx={{ display: 'flex', mb: 0.5 }}>
                                <Checkbox sx={{ ml: -1 }} checked={column.checked} disabled={isEditDraftColumnLoading} onChange={(event) => handleChecked(event, params, column)} />
                                <Typography sx={{ mt: 1 }}>{params.colDef.headerName}</Typography>
                            </Box>
                            <Autocomplete
                                id={params.field}
                                sx={{ width: 150 }}
                                freeSolo
                                className='import-autocomplete'
                                options={allColumns?.map((column) => ({ label: column.name, value: column.slug }))}
                                defaultValue={params.colDef.saveName}
                                onChange={(event, value) => handleAutocomplete(event, value, params, column)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>
                    );
                },
            }));
            setConvertColumns(columnsData);
        }
    }, [columns]);

    return (
        <>
            <Header user={currentUser} />
            <Container sx={{ my: 3, textAlign: 'left' }} maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 2, color: '#333', textAlign: 'left' }}>Отредактируйте и сохраните таблицу</Typography>

                <Button
                    variant="contained"
                    sx={{ mb: 3 }}
                    onClick={handleSaveTable}
                >Сохранить</Button>
                <SaveModal open={openModal} handleClose={() => setOpenModal(false)} userId={currentUser._id} columns={saveColumns} companies={saveCompanies} draftId={draftId} />
                {columns && columns.length > 0 && rows && rows.length > 0 ?
                    <ImportTable columns={convertColumns} rows={rows.map((row, index) => ({ ...row, id: index }))} /> : null}
            </Container>
            <ChatWidget user={currentUser} />
        </>
    );
}

export default DraftTable;