import { useCallback, useEffect, useState } from 'react';
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

const rows = [
	{ id: 1, name: 'Snow', preson: 'Jon', note: 35 },
	{ id: 2, name: 'Lannister', preson: 'Cersei', note: 42 },
	{ id: 3, name: 'Lannister', preson: 'Jaime', note: 45 },
	{ id: 4, name: 'Stark', preson: 'Arya', note: 16 },
]


const formatInitialColumns = (columns: GridColDef[]) => {
	let formatColumns = {}
	for (let i = 0; i < columns.length; i++) {
		Object.defineProperty(formatColumns, columns[i].field, {
			value: columns[i].checked
		})
	}
	return formatColumns;
}



const renderCell = {
	key: 9999,
	field: 'actions',
	headerName: 'Настройки',
	width: 100,
	hideable: false,
	checked: true,
	renderCell: (params: GridRenderCellParams) => <CompanyRowSettings params={params} />,
}


type Props = {
	user: IUser
}

const BaseTable = ({ user }: Props) => {
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
	}

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
	}

	const processRowUpdate = async (newRow: any, oldRow: any) => {
		try {
			await editCompany(newRow).unwrap();
			return newRow;
		} catch (error) {
			return oldRow;
		}
	}

	useEffect(() => {

		if (isListsSuccess) {
			const currentList = lists.find((list) => list.checked === true);
			setSelectedList(currentList);
			let currentColumns = currentList?.columns || [];
			let editCurrentColumns = currentColumns.map((column) => {
				if (column.field === 'color') {
					return {
						...column,
						renderCell: (params: GridRenderCellParams) => <CompanyRowColors params={params} />,
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
			let companiesData = companies.filter((com) => com.listName === selectedList?.name).map((company) => {
				return { ...company, id: company._id }
			})
			setCompanyes(companiesData)
		}
	}, [lists, companies, selectedList]);

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
				disableColumnFilter
				disableDensitySelector
				loading={isEditing}
				columnVisibilityModel={initialColumns}
				onColumnVisibilityModelChange={onColumnVisibilityModelChanged}
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				onColumnWidthChange={onColumnWidthChanged}
				processRowUpdate={processRowUpdate}
				getRowId={(row) => row._id}
				sx={{ mt: 1, height: '80vh' }}
			/>
		</>
	);
}
export default BaseTable;