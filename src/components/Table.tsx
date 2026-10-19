// const Table = ({
//   columns,
//   renderRow,
//   data,
// }: {
//   columns: { header: string; accessor: string; className?: string }[];
//   renderRow: (item: any) => React.ReactNode;
//   data: any[];
// }) => {
//   return (
//     <table className="w-full mt-4">
//       <thead>
//         <tr className="text-left text-gray-500 text-sm">
//           {/* {columns.map((col) => (
//             <th key={col.accessor} className={col.className}>{col.header}</th>
//           ))} */}
//           {columns.map((col, index) => (
//             <th key={`${col.accessor}-${index}`} className={col.className}>
//               {col.header}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>{data.map((item) => renderRow(item))}</tbody>
//     </table>
//   );
// };

// export default Table;



const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-left">
        <thead className="bg-gray-50/80">
          <tr className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            {columns.map((col, index) => (
              <th
                key={`${col.accessor}-${index}`}
                className={`px-4 py-3 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-xs text-gray-400"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item) => renderRow(item))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
