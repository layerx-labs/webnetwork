import ReactBootstrapTable, { TableProps as ReactTableProps } from "react-bootstrap/Table";

import { TableRow } from "components/table/table-row/table-row.controller";

interface TableProps<T> extends ReactTableProps {
  headers: {
    label: string;
    property: keyof T;
  }[];
  rows: T[];
  editableColumns?: (keyof T)[];
  onRowChange?: (changedRow: T) => void;
}

export function Table<T>({
  headers,
  rows,
  editableColumns,
  onRowChange,
  ...rest
}: TableProps<T>) {
  const columns = headers.map(({ property }) => property);

  const isEditableColumn = (column: keyof T) => editableColumns?.includes(column);

  return(
    <ReactBootstrapTable {...rest}>
      <thead>
        <tr>
          {headers.map(header => <th key={header.property.toString()}>{header.label}</th>)}
        </tr>
      </thead>

      <tbody>
        {rows?.map((row, index) => 
          <TableRow 
            key={`table-row-${index}`}
            data={row}
            index={index}
            columns={columns} 
            isEditableColumn={isEditableColumn}
            onRowChange={onRowChange}
          />)}
      </tbody>
    </ReactBootstrapTable>
  );
}