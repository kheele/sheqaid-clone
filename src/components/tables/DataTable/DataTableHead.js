/* */
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MD/MDBox";
import TableRow from "@mui/material/TableRow";
import DataTableHeadCell from "./DataTableHeadCell";

function Comp({ headerGroups, isSorted }) {
  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  return (
    <MDBox component="thead">
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <DataTableHeadCell
              {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
              width={column.width ? column.width : "auto"}
              align={column.align ? column.align : "left"}
              sorted={setSortedValue(column)}
            >
              {column.render("Header")}
            </DataTableHeadCell>
          ))}
        </TableRow>
      ))}
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
Comp.defaultProps = {
  isSorted: true,
};

// Typechecking props for the DataTableBodyCell
Comp.propTypes = {
  headerGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSorted: PropTypes.bool,
};

export default Comp;
