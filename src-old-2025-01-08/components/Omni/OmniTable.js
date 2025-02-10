// <editor-fold desc="imports">
import * as React from "react";
// import { QueryRenderer } from "react-relay";
import PropTypes from "prop-types";
import {CircularProgress} from "@mui/material";
// import environment from "Environment";
import MDBox from "../MD/MDBox";
import {OmniMenuControllerProvider} from "context/OmniMenuProvider";
import OmniMenu from "../OmniMenu";
import DataTable from "../tables/DataTable";
import MKBox from "../MK/MKBox";
// </editor-fold>

// eslint-disable-next-line camelcase
function Comp(
    {
        permissionModKey,
        permissionOtherKey,
        readonly,
        override = false,
        showTotalEntries,
        entriesPerPage,
        canSearch,
        actions,
        columns,
        rows,
        onClick,
        onView,
        onEdit,
        onRemove,
        sx
    }
) {
    return (
        <MDBox sx={{...(sx || {})}}>
            <OmniMenuControllerProvider>
                <OmniMenu
                    permissionModKey={permissionModKey}
                    permissionOtherKey={permissionOtherKey}
                    readonly={readonly}
                    override={override}
                    actions={actions}
                    onClick={onClick}
                    onView={onView}
                    onEdit={onEdit}
                    onRemove={onRemove}
                />
                <DataTable
                    table={{columns, rows}}
                    showTotalEntries={showTotalEntries}
                    isSorted
                    canSearch={canSearch}
                    noEndBorder
                    entriesPerPage={entriesPerPage}
                />
            </OmniMenuControllerProvider>
        </MDBox>
    );
}

Comp.defaultProps = {
    showTotalEntries: true,
    entriesPerPage: true,
    canSearch: true,
    actions: [],
    onClick: null,
};

// <editor-fold desc="Comp.propTypes">
Comp.propTypes = {
    showTotalEntries: PropTypes.bool,
    entriesPerPage: PropTypes.bool,
    canSearch: PropTypes.bool,
    query: PropTypes.objectOf(PropTypes.object).isRequired,
    connection_key: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClick: PropTypes.func,
};
// </editor-fold>

export default Comp;
