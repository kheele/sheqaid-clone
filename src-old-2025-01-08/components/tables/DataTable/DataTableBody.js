/* */
import PropTypes from "prop-types";

import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import DataTableBodyCell from "./DataTableBodyCell";

function Comp({ getTableBodyProps, page, prepareRow, noEndBorder, rows }) {
  return (
    <TableBody {...getTableBodyProps()}>
      {page.map((row, key) => {
        prepareRow(row);
        return (
          <TableRow
            sx={{ background: key % 2 === 0 ? "#f4f4f4" : "#fff", borderBottom: "1px solid #eee" }}
            {...row.getRowProps()}
          >
            {row.cells.map((cell) => (
              <DataTableBodyCell
                noBorder={noEndBorder && rows.length - 1 === key}
                align={cell.column.align ? cell.column.align : "left"}
                sx={{fontSize: "13px"}}
                {...cell.getCellProps()}
              >
                {cell.render("Cell")}
              </DataTableBodyCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

// Typechecking props for the DataTableBodyCell
Comp.propTypes = {
  getTableBodyProps: PropTypes.func.isRequired,
  page: PropTypes.arrayOf(PropTypes.object).isRequired,
  prepareRow: PropTypes.func.isRequired,
  noEndBorder: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Comp;
