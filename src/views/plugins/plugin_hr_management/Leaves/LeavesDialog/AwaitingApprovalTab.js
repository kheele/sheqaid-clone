// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import NavItem from 'components/navs/NavItem';
import ActiveTab from "../../AEmployeeDocDialog/ActiveTab";
import LoggedUserSettings from "utils/LoggedUserSettings";
import updateEmployeeLeave from "mutations/all/EmployeeLeave/updateEmployeeLeave";

// import style from "./AwaitingApprovalTab.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ActiveTab">
@observer
class AwaitingApprovalTab extends ActiveTab {

    pageKey = "AwaitingApprovalTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.state.view = props.titleSingular;

        this.updateStatus = this.updateStatus.bind(this);
        this.onApprove = this.onApprove.bind(this);
        this.onReject = this.onReject.bind(this);
    }

    // </editor-fold>

    updateStatus(evt, btn, status) {
        const {idx} = btn.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id, data} = item;

        progressDialog.open();
        updateEmployeeLeave({id, status}).then(res => {
            if (res) {
                data.status = status;
                list.removeAt(idx);
                infoDialog.open(`Time-Off successfully ${status.toLowerCase()}.`);
            } else {
                infoDialog.open(`Time-Off couldn't be ${status.toLowerCase()}. Please try again later.`);
            }
        }).catch(err => {
            infoDialog.open("An error occurred. Please try again.");
            console.error(err);
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        });
    }

    onApprove(evt, btn) {
        this.updateStatus(evt, btn, "Approved");
    }

    onReject(evt, btn) {
        this.updateStatus(evt, btn, "Rejected");
    }

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {permissionKey, titleSingular} = this.props;
        const {isEmployee} = this;
        const isEditable = !isEmployee;

        const isApprover = LoggedUserSettings.isEmployeeTimeOffApproversViewers();

        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={this.onView} faIconLeft="eye" title="View"/>
            {/*{isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"*/}
            {/*                        title={`Add ${titleSingular}`}/>}*/}
            {isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            {isApprover && <>
                <hr action="writable"/>
                <NavItem action="edit" btn={btn} onClick={this.onApprove} faIconLeft="check" title="Approve"/>
                <NavItem action="edit" btn={btn} onClick={this.onReject} faIconLeft="cancel" title="Reject"/>
            </>}
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

export default AwaitingApprovalTab;
