import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

type Props = {
    columns: any[];
    rows: any[];
}

const ImportTable = ({ columns, rows }: Props) => {

    return (
        <div style={{ height: 600, width: '100%' }}>

            <DataGrid
                rows={rows}
                columns={columns}
                className='import-table'
            />
        </div>
    )
}

export default ImportTable;