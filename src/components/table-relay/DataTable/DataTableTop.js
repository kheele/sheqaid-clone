/* */

import PropTypes from "prop-types";
import MDBox from "components/MD/MDBox";
import Autocomplete from "@mui/material/Autocomplete";
import { useAsyncDebounce } from "react-table";
import { useState } from "react";
import MDTypography from "../../MD/MDTypography";
import MDInput from "../../MD/MDInput";

function Comp({
  entriesPerPage,
  canSearch,
  entries,
  pageSize,
  setPageSize,
  globalFilter,
  setGlobalFilter,
}) {
  // Search input value state
  const [search, setSearch] = useState(globalFilter);
  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  if (!entriesPerPage && !canSearch) return null;

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value);

  return (
    <MDBox
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="15px"
      mb="10px"
      ml="20px"
      mr="20px"
      borderRadius="20px"
      border="15px solid #f0f2f5"
    >
      {entriesPerPage && (
        <MDBox display="flex" alignItems="center">
          <Autocomplete
            disableClearable
            value={pageSize.toString()}
            options={entries}
            onChange={(event, newValue) => {
              setEntriesPerPage(parseInt(newValue, 10));
            }}
            size="small"
            sx={{ width: "6rem" }}
            renderInput={(params) => <MDInput {...params} />}
          />
          <MDTypography variant="caption" color="secondary" fontSize="14px">
            &nbsp;&nbsp;entries per page
          </MDTypography>
        </MDBox>
      )}
      {canSearch && (
        <MDBox width="18rem" ml="auto">
          <MDInput
            placeholder="Search..."
            value={search}
            size="small"
            fullWidth
            onChange={({ currentTarget }) => {
              setSearch(search);
              onSearchChange(currentTarget.value);
            }}
          />
        </MDBox>
      )}
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
Comp.defaultProps = {
  entriesPerPage: { defaultValue: 20, entries: [10, 20, 30, 50, 100] },
  canSearch: false,
};

// Typechecking props for the DataTableBodyCell
Comp.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(PropTypes.string).isRequired,
  globalFilter: PropTypes.string.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
};

export default Comp;
