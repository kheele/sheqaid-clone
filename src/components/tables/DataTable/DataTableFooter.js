/* */
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MD/MDBox";
import Icon from "@mui/material/Icon";
import MDTypography from "../../MD/MDTypography";
import MDPagination from "../../MD/MDPagination";
import MDInput from "../../MD/MDInput";

function Comp({
  showTotalEntries,
  pageOptions,
  pagination,
  canPreviousPage,
  canNextPage,
  previousPage,
  gotoPage,
  nextPage,
  pageIndex,
  pageSize,
  rows,
}) {
  if (rows.isEmpty()) {
    return null;
  }
  // Render the paginations
  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));

  // Setting the entries starting point
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  return (
    <MDBox
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      m="15px 20px 20px"
      borderRadius="0 0 10px 10px"
      sx={{ background: "rgba(240, 242, 245, 0.6666)" }}
    >
      {showTotalEntries && (
        <MDBox mb={{ xs: 3, sm: 0 }}>
          <MDTypography variant="button" color="secondary" fontWeight="regular">
            Showing {entriesStart} to {entriesEnd} of {rows.length} entries
          </MDTypography>
        </MDBox>
      )}
      {pageOptions.length > 1 && (
        <MDPagination
          variant={pagination.variant ? pagination.variant : "gradient"}
          color={pagination.color ? pagination.color : "info"}
        >
          {canPreviousPage && (
            <MDPagination item onClick={() => previousPage()}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
            </MDPagination>
          )}
          {renderPagination.length > 6 ? (
            <MDBox width="5rem" mx={1}>
              <MDInput
                inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                value={customizedPageOptions[pageIndex]}
                onChange={(handleInputPagination, handleInputPaginationValue)}
              />
            </MDBox>
          ) : (
            renderPagination
          )}
          {canNextPage && (
            <MDPagination item onClick={() => nextPage()}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
            </MDPagination>
          )}
        </MDPagination>
      )}
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
Comp.defaultProps = {
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
};

// Typechecking props for the DataTableBodyCell
Comp.propTypes = {
  showTotalEntries: PropTypes.bool,
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
  pageOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  canPreviousPage: PropTypes.bool.isRequired,
  canNextPage: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  gotoPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Comp;
