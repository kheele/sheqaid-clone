// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import NavItem from 'components/navs/NavItem';
import ActiveTab from "../../AEmployeeDocDialog/ActiveTab";

// import style from "./ApprovedTab.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ActiveTab">
@observer
class ApprovedTab extends ActiveTab {

    pageKey = "ApprovedTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.state.view = props.titleSingular;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {permissionKey, titleSingular} = this.props;
        const {isEmployee} = this;
        const isEditable = !isEmployee;

        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={this.onView} faIconLeft="eye" title="View"/>
            {isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"
                                    title={`Add ${titleSingular}`}/>}
            {isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            {/*<hr action="writable"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"*/}
            {/*         title="Save As PDF"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsExcel} faIconLeft="file-excel-o"*/}
            {/*         title="Save As Excel"/>*/}
        </Options>;
    }

    // </editor-fold>

    // </editor-fold>
}

// </editor-fold>

export default ApprovedTab;
