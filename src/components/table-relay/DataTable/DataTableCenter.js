/* */

import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";
import MKBox from "../../MK/MKBox";

function Comp({
  getTableProps,
  headerGroups,
  isSorted,
  getTableBodyProps,
  prepareRow,
  rows,
  noEndBorder,
  page,
}) {
  if (rows.isEmpty()) {
    return (
      <>
        <Table>
          <DataTableHead headerGroups={headerGroups} isSorted={isSorted} />
        </Table>
        <MKBox
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", pt: 20, pb: 20 }}
        >
          Records not available
        </MKBox>
      </>
    );
  }

  return (
    <Table {...getTableProps()}>
      <DataTableHead headerGroups={headerGroups} isSorted={isSorted} />
      <DataTableBody
        getTableBodyProps={getTableBodyProps}
        prepareRow={prepareRow}
        rows={rows}
        noEndBorder={noEndBorder}
        page={page}
      />
    </Table>
  );
}

Comp.propTypes = {
  getTableProps: PropTypes.func.isRequired,
  getTableBodyProps: PropTypes.func.isRequired,
  headerGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.arrayOf(PropTypes.object).isRequired,
  prepareRow: PropTypes.func.isRequired,
  noEndBorder: PropTypes.bool.isRequired,
  isSorted: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Comp;
