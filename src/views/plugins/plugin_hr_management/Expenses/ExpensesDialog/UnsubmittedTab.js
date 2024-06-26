// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import NavItem from 'components/navs/NavItem';
import ActiveTab from "../../AEmployeeDocDialog/ActiveTab";

// import style from "./UnsubmittedTab.lazy.css";
import updateEmployeeExpense from "mutations/all/EmployeeExpense/updateEmployeeExpense";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ActiveTab">
@observer
class UnsubmittedTab extends ActiveTab {

    pageKey = "UnsubmittedTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // </editor-fold>

    onSubmit(evt, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const {id, data} = item;

        confirmDialog.open("Do you want to proceed?").then(res => {
            if (res) {
                const status = "Awaiting Approval";

                progressDialog.open();
                updateEmployeeExpense({id, status}).then(res => {
                    if (res) {
                        data.status = status;
                        list.removeAt(idx);
                        infoDialog.open(`Expense successfully ${status.toLowerCase()}.`);
                    } else {
                        infoDialog.open(`Expense couldn't be ${status.toLowerCase()}. Please try again later.`);
                    }
                }).catch(err => {
                    infoDialog.open("An error occurred. Please try again.");
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            }
        });
    }


    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {permissionKey, titleSingular} = this.props;
        const {isEmployee} = this;
        const isEditable = !isEmployee;

        const {list} = this.refs.root;
        const item = list[idx];
        const {id, data: {employee}} = item;

        const {user, user: {data: {settings_list, linked_employee_id}},} = storage.loggedUser;

        let isSubmitter;
        if (storage.is.isEmployee) {
            isSubmitter = employee.id === user.id;
        } else {
            isSubmitter = employee.id === linked_employee_id;
        }

        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={this.onView} faIconLeft="eye" title="View"/>
            {isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"
                                    title={`Add ${titleSingular}`}/>}
            {isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            {isSubmitter && <>
                <hr action="writable"/>
                <NavItem idx={idx} action="edit" btn={btn} onClick={this.onSubmit} faIconLeft="check" title="Submit"/>
            </>}
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

export default UnsubmittedTab;
