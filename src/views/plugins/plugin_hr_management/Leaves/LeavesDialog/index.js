// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import style from "./LeavesDialog.lazy.css";

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';
import LeavesRenderRow from "./LeavesRenderRow";
import {THead} from "components/tables";
import {Button, ClearableInput} from "components/inputs";

import {updateEmployeeLeave} from "mutations/update";
import ProfileUserDialog from "../../../../default/Users/ProfileDialog";
import EditUserDialog from "../../../../default/Users/EditDialog";
import NewEmployeeDialog from "../../Employees/forms/NewDialog";
import TabView from "./TabView";
import {findByIdOrgLeavesDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgLeavesDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";
import {exportExcelEmployeeLeaves} from "mutations/exportExcel";
import {listEmployeeLeave} from "../../../../../mutations/listByLogged";
import LeaveAllocationsDialog from "../LeaveAllocationsDialog";
import LeavePoliciesDialog from "../LeavePoliciesDialog";
import LeaveTypesDialog from "../LeaveTypesDialog";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "LeavesDialog";
    title = "Time-Off";
    titleSingular = "Time-Off";
    permissionKey = "Leaves";
    module = "Leaves";
    onUpdate = updateEmployeeLeave;
    exportExcel = exportExcelEmployeeLeaves;
    filterNodeGrid = 5;
    filterNodeMarginB = 35;
    style = style;

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, TabView,
    };

    selfState2 = {
        lists: {
            types: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'],
            due_to: [{label: 'Occurred Incident', value: 'Occurred Incident'}, {label: 'Other', value: 'Other'}],
        },
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onRequestTimeOff = this.onRequestTimeOff.bind(this);

        this.onViewLeaveTypes = this.onViewLeaveTypes.bind(this);
        this.onViewLeavePolicies = this.onViewLeavePolicies.bind(this);
        this.onViewLeaveAllocations = this.onViewLeaveAllocations.bind(this);
    }

    // </editor-fold>

    get renderTopActions() {
        return <>
            <Button
                className="btn btn-primary pull-right btn-remove padding-h-15 margin-r-5"
                onClick={this.onRequestTimeOff}
            >
                Request Time-off
            </Button>
            <Button
                className="btn btn-primary pull-right btn-remove padding-h-15 margin-r-5"
                onClick={this.onViewLeaveTypes}
            >
                Leave Types
            </Button>
            <Button
                className="btn btn-primary pull-right btn-remove padding-h-15 margin-r-5"
                onClick={this.onViewLeavePolicies}
            >
                Leave Policies
            </Button>
            <Button
                className="btn btn-primary pull-right btn-remove padding-h-15 margin-r-5"
                onClick={this.onViewLeaveAllocations}
            >
                Leave Allocations
            </Button>

            <LeaveTypesDialog ref="leaveTypesDialog"/>
            <LeavePoliciesDialog ref="leavePoliciesDialog"/>
            <LeaveAllocationsDialog ref="leaveAllocationsDialog"/>

            <NewDialog ref="newDialog" isSelfRequest/>
            <ProfileUserDialog ref="profileUserDialog" EditDialog={EditUserDialog}
                               NewEmployeeDialog={NewEmployeeDialog}/>
        </>;
    }

    onRequestTimeOff(evt, btn) {
        const {isEmployee} = storage.is;
        if (isEmployee) {
            const {loggedUser: {user}} = storage;
            this.refs.newDialog.open(user);
        } else {
            const {loggedUser: {user, user: {data: {linked_employee_id}}}} = storage;
            if (!linked_employee_id) {
                return infoDialog.action("Register As Employee", () => {
                    infoDialog.close();
                    this.refs.profileUserDialog.extraProp('linked_employee', true).open(user).then(() => {
                    });
                }).open(<p>
                    Your Account is not linked to any Employee Profile.<br/>
                    Please link your account with your Employee Profile.
                </p>);
            }
            this.refs.newDialog.open({id: linked_employee_id});
        }
    }

    onViewLeaveTypes(evt, btn) {
        this.refs.leaveTypesDialog.open();
    }

    onViewLeavePolicies(evt, btn) {
        this.refs.leavePoliciesDialog.open();
    }

    onViewLeaveAllocations(evt, btn) {
        this.refs.leaveAllocationsDialog.open();
    }

    //</editor-fold>

    //<editor-fold desc="onBuildQuery">
    onBuildQuery(params) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {tabView: {status}} = this.refs;
        const {
            type,
            due_to,
            date,
        } = filterData || {};

        const args = {
            listByLogged: listEmployeeLeave,
            type,
            due_to,
            date,
        };

        if (status) {
            args.status = status;
        }
        return args;
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgLeavesDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgLeavesDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const types = ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'];
        const due_to = [{label: 'Occurred Incident', value: 'Occurred Incident'}, {label: 'Other', value: 'Other'}];
        return <>
            <ClearableInput name="type" type="select" placeholder="Leave Type..." className="form-control"
                            onChange={onChange} values={types} returnValue/>
            <ClearableInput name="due_to" type="select" placeholder="Leave Due To..." className="form-control"
                            onChange={onChange} values={due_to} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Start Date..." className="form-control"
                            onChange={onChange}/>
        </>;
    }

    // </editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput
                name="type"
                type="select"
                placeholder="Leave Type..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
                values={this.selfState2.lists.types}
                returnValue
            />
            <ClearableInput
                name="due_to"
                type="select"
                placeholder="Leave Due To..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
                values={this.selfState2.lists.due_to}
                returnValue
            />
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput
                name="date"
                type="date"
                placeholder="Start Date..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
            />
        </>;
    }

    // <editor-fold defaultstate="collapsed" desc="renderTHeadAll">
    renderTHeadAll({view}) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        if (view === 'Employee') {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td">Department</div>
                <div className="td">Job Position</div>
                {hasProjects && <div className="td sm-hidden">Location</div>}
                <div className="td fixed-flex min-w-105">Latest On</div>
                <div className="td fixed-flex min-w-240">Stats</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td fixed-flex min-w-180">Leave Type</div>
                <div className="td fixed-flex min-w-160">Leave Due To</div>
                <div className="td">Reason Of Leave</div>
                <div className="td fixed-flex min-w-120 font-size-12">Days Booked</div>
                <div className="td fixed-flex min-w-105">Start Date</div>
                <div className="td fixed-flex min-w-105">End Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <LeavesRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
}

export default Dialog;
