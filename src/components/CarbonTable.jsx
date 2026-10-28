import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react'

export default function CarbonTable({ title, description, headers, rows, renderCell }) {
  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows: preparedRows, headers: preparedHeaders, getHeaderProps, getRowProps, getTableProps }) => (
        <TableContainer title={title} description={description}>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {preparedHeaders.map((header) => {
                  const headerProps = getHeaderProps({ header })
                  return (
                    <TableHeader {...headerProps} key={header.key}>
                      {header.header}
                    </TableHeader>
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {preparedRows.map((row) => {
                const rowProps = getRowProps({ row })
                return (
                  <TableRow {...rowProps} key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {renderCell ? renderCell(cell, row) : cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  )
}
