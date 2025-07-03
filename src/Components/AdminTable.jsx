// components/AdminTable.js
const AdminTable = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                    key={row._id}
                    className={row.status === "cancelled" ? "text-red-600" : ""}
                    >
                    {columns.map(col => (
                        <td key={col.key} className="px-4 py-2">
                        {col.render ? col.render(row) : row[col.key]}
                        </td>
                    ))}
                    </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  };
  
  export default AdminTable;
  