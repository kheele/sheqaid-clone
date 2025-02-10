import * as React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";

const classes = {
  flexContainer: "ReactVirtualizedDemo-flexContainer",
  tableRow: "ReactVirtualizedDemo-tableRow",
  tableRowHover: "ReactVirtualizedDemo-tableRowHover",
  tableCell: "ReactVirtualizedDemo-tableCell",
  noClick: "ReactVirtualizedDemo-noClick",
};

const styles = ({ theme }) => ({
  // temporary right-to-left patch, waiting for
  // https://github.com/bvaughn/react-virtualized/issues/454
  "& .ReactVirtualized__Table__headerRow": {
    ...(theme.direction === "rtl" && {
      paddingLeft: "0 !important",
    }),
    ...(theme.direction !== "rtl" && {
      paddingRight: undefined,
    }),
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  [`& .${classes.tableRow}`]: {
    cursor: "pointer",
  },
  [`& .${classes.tableRowHover}`]: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  [`& .${classes.tableCell}`]: {
    flex: 1,
  },
  [`& .${classes.noClick}`]: {
    cursor: "initial",
  },
});

function MuiVirtualizedTable({ columns, rowHeight, headerHeight, onRowClick, ...tableProps }) {
  const getRowClassName = ({ index }) =>
    clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });

  const headerRenderer = ({ label, columnIndex }) => (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
      variant="head"
      style={{ height: headerHeight }}
      align={columns[columnIndex].numeric || false ? "right" : "left"}
    >
      <span>{label}</span>
    </TableCell>
  );

  const cellRenderer = ({ cellData, columnIndex }) => (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, {
        [classes.noClick]: onRowClick == null,
      })}
      variant="body"
      style={{ height: rowHeight }}
      align={(columnIndex != null && columns[columnIndex].numeric) || false ? "right" : "left"}
    >
      {cellData}
    </TableCell>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          height={height}
          width={width}
          rowHeight={rowHeight}
          gridStyle={{
            direction: "inherit",
          }}
          headerHeight={headerHeight}
          {...tableProps}
          rowClassName={getRowClassName}
        >
          {columns.map(({ dataKey, ...other }, index) => (
            <Column
              key={dataKey}
              headerRenderer={(headerProps) =>
                headerRenderer({
                  ...headerProps,
                  columnIndex: index,
                })
              }
              className={classes.flexContainer}
              cellRenderer={cellRenderer}
              dataKey={dataKey}
              {...other}
            />
          ))}
        </Table>
      )}
    </AutoSizer>
  );
}

MuiVirtualizedTable.defaultProps = {
  headerHeight: 48,
  rowHeight: 48,
};

MuiVirtualizedTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  // eslint-disable-next-line react/require-default-props
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = styled(MuiVirtualizedTable)(styles);

function ReactVirtualizedTable({ sx, columns, rows, onRowClick }) {
  return (
    <Paper sx={{ height: "100%", width: "calc(100% - 40px)", margin: "20px", ...sx }}>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={columns}
        onRowClick={onRowClick}
      />
    </Paper>
  );
}

ReactVirtualizedTable.defaultProps = {
  sx: {},
};

ReactVirtualizedTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  sx: PropTypes.objectOf(PropTypes.object),
  // eslint-disable-next-line react/require-default-props
  onRowClick: PropTypes.func,
};

export default ReactVirtualizedTable;
