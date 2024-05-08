interface TableRowProps<T> {
  data: T;
  columns: (keyof T)[];
  isEditableColumn: (column: keyof T) => boolean;
  onRowChange?: (changedRow: T) => void;
}

export function TableRow<T>({
  data,
  columns,
  isEditableColumn,
  onRowChange,
}: TableRowProps<T>) {
  function onChange(column: keyof T) {
    return (e) => {
      onRowChange?.({
        ...data,
        [column]: e.target.value
      });
    };
  }

  return(
    <tr>
      {columns.map(column => (
        <td key={`table-row-${column.toString()}`}>
          {isEditableColumn(column) ? 
            <input 
              className="form-control" 
              value={data[column.toString()]}
              onChange={onChange(column)}
            /> : data[column.toString()]}
        </td>
      ))}
    </tr>
  );
}