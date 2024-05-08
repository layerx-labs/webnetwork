interface TableRowProps<T> {
  data: T;
  columns: (keyof T)[];
  isEditableColumn: (column: keyof T) => boolean;
}

export function TableRow<T>({
  data,
  columns,
  isEditableColumn
}: TableRowProps<T>) {
  return(
    <tr>
      {columns.map(column => (
        <td key={`table-row-${column.toString()}`}>
          {isEditableColumn(column) ? 
            <input className="form-control" value={data[column.toString()]} /> : data[column.toString()]}
        </td>
      ))}
    </tr>
  );
}