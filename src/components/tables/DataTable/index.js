/* */
// <editor-fold desc="imports">
import { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import TableContainer from "@mui/material/TableContainer";
import DataTableFooter from "./DataTableFooter";
import DataTableTop from "./DataTableTop";
import DataTableCenter from "./DataTableCenter";
// </editor-fold>

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
}) {
  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 10;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      <DataTableTop
        entriesPerPage={entriesPerPage}
        canSearch={canSearch}
        setPageSize={setPageSize}
        pageSize={pageSize}
        entries={entries}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <DataTableCenter
        getTableProps={getTableProps}
        getTableBodyProps={getTableBodyProps}
        prepareRow={prepareRow}
        headerGroups={headerGroups}
        isSorted={isSorted}
        noEndBorder={noEndBorder}
        page={page}
        rows={rows}
      />
      <DataTableFooter
        showTotalEntries={showTotalEntries}
        pagination={pagination}
        pageOptions={pageOptions}
        nextPage={nextPage}
        previousPage={previousPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        gotoPage={gotoPage}
        pageIndex={pageIndex}
        pageSize={pageSize}
        rows={rows}
      />
    </TableContainer>
  );
}

// <editor-fold desc="DataTable.defaultProps">
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 20, entries: [10, 20, 30, 50, 100] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};
// </editor-fold>

// <editor-fold desc="DataTable.propTypes">
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};
// </editor-fold>

export default DataTable;
