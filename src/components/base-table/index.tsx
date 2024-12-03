import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useEditListMutation, useGetListByUserQuery } from '../../redux/api/listApi';
import { IList, IUser } from '../../redux/api/types';
import { useAppSelector } from '../../redux/store';
import { DataGrid, GridCallbackDetails, GridColDef, GridColumnOrderChangeParams, GridColumnResizeParams, GridColumnVisibilityModel, GridRenderCellParams, GridRowsProp, GridToolbar, MuiEvent } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { useEditCompanyMutation, useGetCompaniesQuery } from '../../redux/api/companyApi';
import { ruRU } from '@mui/x-data-grid/locales';
import { Button } from '@mui/material';
import CompanyRowSettings from '../company-row-settings';
import CompanyRowColors from '../company-row-colors';
import moment from 'moment'
import EditTextarea from '../edit-textarea';
import { getGridNumericOperators } from '@mui/x-data-grid';
import { CITIES, getCities } from '../../utils/cities';
import { DispatchProp } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';


const formatInitialColumns = (columns: GridColDef[]) => {
	let formatColumns = {}
	if (columns && columns.length > 0) {
		for (let i = 0; i < columns.length; i++) {
			Object.defineProperty(formatColumns, columns[i].field, {
				value: columns[i].checked
			})
		}
	}
	return formatColumns;
}

const optionsCities = getCities(CITIES)

type Props = {
	user: IUser
	setSelectedRows: Dispatch<SetStateAction<Array<string>>>;
}

const BaseTable = ({ user, setSelectedRows }: Props) => {
	const currentUser = useAppSelector((state) => state.userState.user) || {};
	const [state, setState] = useState(false)
	const [columns, setColumns] = useState([])
	const [companyes, setCompanyes] = useState([])
	const [initialColumns, setInitialColumns] = useState({})
	const [selectedList, setSelectedList] = useState<IList | null>(null)
	const { data: lists, isSuccess: isListsSuccess, isLoading: isListsLoading } = useGetListByUserQuery(user._id);
	const [editList, { isSuccess: isEdited, isLoading: isEditing }] = useEditListMutation();
	const { data: companies, isSuccess: isCompaniesSuccess } = useGetCompaniesQuery(user._id);
	const [editCompany, { isSuccess: isEditCompanySuccess, isLoading: isEditCompanyLoading }] = useEditCompanyMutation();
	const [isStar, setIsStar] = useState(false);
	const [filterCompanies, setFilterCompanies] = useState([])



	const renderCell = {
		key: 9999,
		field: 'actions',
		renderHeader: () => <div style={{ display: 'flex', alignItems: 'center' }}>Настройки {isStar ? <StarIcon onClick={() => setIsStar(false)} sx={{ fontSize: 18, lineHeight: 0, ml: 0.5, cursor: 'pointer', color: '#ceb129' }} /> : <StarOutlineIcon onClick={() => setIsStar(true)} sx={{ fontSize: 18, lineHeight: 0, ml: 0.5, cursor: 'pointer' }} />}</div>,
		width: 120,
		hideable: false,
		filterable: false,
		sortable: false,
		menuDisabled: true,
		checked: true,
		renderCell: (params: GridRenderCellParams) => <CompanyRowSettings options={optionsCities} params={params} />,
	}


	const localizedTextsMap = {
		columnsMenuButtonLabel: 'Меню',
	};
	const onColumnVisibilityModelChanged = async (model: GridColumnVisibilityModel) => {
		const fieldName = Object.keys(model)[0]
		const fieldValue = Object.values(model)[0]
		const currentList = lists.find((list) => list.checked === true);
		let updateColumns = columns.filter((column) => column.field != 'actions').map((column) => {
			if (column.field === fieldName) {
				return {
					...column,
					checked: fieldValue
				}
			} else {
				return column
			}
		})
		const updateList = { ...currentList, columns: updateColumns }
		try {
			await editList(updateList).unwrap();
		} catch (error) {
		}
	};
	const onColumnWidthChanged = async (params: GridColumnResizeParams) => {
		const fieldName = params.colDef.field
		const fieldValue = params.width
		const currentList = lists.find((list) => list.checked === true);
		let updateColumns = columns.filter((column) => column.field != 'actions').map((column) => {
			if (column.field === fieldName) {
				return {
					...column,
					width: fieldValue
				}
			} else {
				return column
			}
		})
		const updateList = { ...currentList, columns: updateColumns }
		try {
			await editList(updateList).unwrap();
		} catch (error) {
		}
	};
	const processRowUpdate = async (newRow: any, oldRow: any) => {
		if (user._id === currentUser._id) {
			newRow.editIsAdmin = false
		} else {
			newRow.editIsAdmin = true
		}
		if (oldRow.requirement != newRow.requirement || oldRow.offer != newRow.offer || oldRow.note != newRow.note) {
			newRow.updateDate = moment().format('YYYY-MM-DD HH:MM:ss')
		}
		try {
			await editCompany(newRow).unwrap();
			return newRow;
		} catch (error) {
			return oldRow;
		}
	};
	const getSelectedRows = (params) => {
		setSelectedRows(() => params);
	}

	useEffect(() => {

		if (isListsSuccess) {
			const currentList = lists.find((list) => list.checked === true);
			setSelectedList(currentList);
			let currentColumns = currentList?.columns || [];
			let editCurrentColumns = currentColumns.map((column) => {
				if (column.field === 'name') {
					return {
						...column,
						editable: true,
						renderCell: (params: GridRenderCellParams) => <><div style={{ lineHeight: '30px' }}>{params.value}</div><div style={{ lineHeight: '15px', fontStyle: 'italic', color: 'gray', fontSize: '12px' }}>{params.row.location}</div></>,
					}
				}
				if (column.field === 'note' || column.field === 'person' || column.field === 'phone' || column.field === 'email' || column.field === 'requirement' || column.field === 'offer' || column.field === 'offer') {
					return {
						...column,
						editable: true,
						type: 'string',
						renderEditCell: (params: GridRenderCellParams) => <EditTextarea {...params} />,
					}
				}
				if (column.field === 'color') {
					return {
						...column,
						type: 'singleSelect',
						filterOperators: getGridNumericOperators().filter(
							(operator) => operator.value === '=',
						),
						renderCell: (params: GridRenderCellParams) => <CompanyRowColors params={params} user={user} currentUser={currentUser} />,
					}
				}
				return {
					...column,
					editable: true,
				}
			})
			setColumns([...editCurrentColumns, renderCell]);
			setInitialColumns(formatInitialColumns(currentList?.columns))
		}
		if (isCompaniesSuccess) {
			let companiesData = companies.filter((com) => com.listName === selectedList?.name).sort((a, b) => a.updateDate < b.updateDate ? 1 : -1).map((company) => {
				return { ...company, id: company._id }
			})
			if (isStar) companiesData = companiesData.filter((company) => company.favorite === true);
			setCompanyes(companiesData)
			setFilterCompanies(companiesData)
		}
	}, [lists, companies, selectedList, isStar]);

	return (
		<>
			<DataGrid
				rows={companyes}
				columns={columns}
				slots={{
					toolbar: GridToolbar,
					columnMenuIcon: () => <>1</>
				}}
				slotProps={{
					toolbar: {
						csvOptions: { disableToolbarButton: true },
						printOptions: { disableToolbarButton: true },
						showQuickFilter: true,
					},
				}}
				disableDensitySelector
				checkboxSelection={user.role === 2}
				loading={isEditing}
				columnVisibilityModel={initialColumns}
				onColumnVisibilityModelChange={onColumnVisibilityModelChanged}
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				onColumnWidthChange={onColumnWidthChanged}
				processRowUpdate={processRowUpdate}
				getRowId={(row) => row._id}
				sx={{ mt: 1, mb: 2, height: '75vh', border: '1px solid #e0e0e0' }}
				getRowClassName={(params) => `row__color__${params.row.color && params.row.color.replace('#', '')} ${params.row.editIsAdmin ? 'row__height__large' : ''}`}
				onRowSelectionModelChange={getSelectedRows}
			/>
		</>
	);
}
export default BaseTable;