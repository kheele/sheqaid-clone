// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import style from "./ExpensesDialog.lazy.css";

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';

import ExpensesRenderRow from "./ExpensesRenderRow";
import {THead} from "components/tables";
import {ClearableInput} from "components/inputs";

import {updateEmployeeExpense} from "mutations/update";
import TabView from "./TabView";
import {findByIdOrgExpensesDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgExpensesDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";
import {exportExcelEmployeeExpenses} from "mutations/exportExcel";
import {listEmployeeExpense} from "../../../../../mutations/listByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "ExpensesDialog";
    title = "Expenses";
    titleSingular = "Expense";
    permissionKey = "Expenses";
    module = "Expenses";
    onUpdate = updateEmployeeExpense;
    exportExcel = exportExcelEmployeeExpenses;
    // hasSignatures = true;
    filterNodeGrid = 5;
    filterNodeMarginB = 35;
    style = style;

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, TabView,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onAction = this.onAction.bind(this);
    }

    // </editor-fold>

    onRemove(id) {

    }

    //<editor-fold desc="onBuildQuery">
    onBuildQuery(params) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {tabView: {status}} = this.refs;
        const {
            employee_id,
            category,
            currency_country_id,
            paid_with,
            date,
            amount,
            date_submitted,
            date_approved,
            date_compensated,
        } = filterData || {};

        const args = {
            listByLogged: listEmployeeExpense,
            employee_id,
            category,
            currency_country_id,
            paid_with,
            date,
            amount,
            date_submitted,
            date_approved,
            date_compensated,
            //
            status,
        };

        if (status) {
            // args.status = status === "Completed" ? "Paid Out" : status;
        }
        return args;
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgExpensesDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgExpensesDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    onAction(evt, btn) {
        const {idx, id, status} = btn.props;

        progressDialog.open();

        // const {list} = this.refs.root;
        // const item = list[idx];
        updateEmployeeExpense({id, status}).then(res => {
            infoDialog.open("Record successfully updated");
            // list.removeIf(v => v.id === id);
        }).catch(err => {
            console.log('updateEmployeeExpense err', err);
            infoDialog.open("Record couldn't be updated. Please try again.");
        }).finally(() => {
            progressDialog.close();
        });
    }

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput ref="type" name="type" type="select" placeholder="Expense Type..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.selfState.lists.types} returnValue/>
            <ClearableInput ref="due_to" name="due_to" type="select" placeholder="Expense Due To..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
                            values={this.selfState.lists.due_to} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="date" name="date" type="date" placeholder="Start Date..."
                            className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
        </>;
    }

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const types = ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'];
        const due_to = [{label: 'Occurred Incident', value: 'Occurred Incident'}, {label: 'Other', value: 'Other'}];
        return <>
            <ClearableInput name="type" type="select" placeholder="Expense Type..." className="form-control"
                            onChange={onChange} values={types} returnValue/>
            <ClearableInput name="due_to" type="select" placeholder="Expense Due To..." className="form-control"
                            onChange={onChange} values={due_to} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Start Date..." className="form-control"
                            onChange={onChange}/>
        </>;
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadAll">
    renderTHeadAll({view}) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const {tabView: {isUnsubmitted, isAwaitingApproval, isAwaitingPayment, isCompleted, isRejected}} = this.refs;
        let frag = <>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Employee</div>
        </>;
        if (view === 'Employee') {
            return <THead>
                {frag}
                <div className="td">Department</div>
                <div className="td">Job Position</div>
                {hasProjects && <div className="td sm-hidden">Location</div>}
                <div className="td fixed-flex min-w-105">Latest On</div>
                <div className="td fixed-flex min-w-240">Stats</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else {
            return <THead>
                {frag}
                <div className="td fixed-flex min-w-120">Date</div>
                {isCompleted && <div className="td fixed-flex min-w-120">Date Paid</div>}
                <div className="td fixed-flex min-w-140">Amount</div>
                <div className="td fixed-flex min-w-160">Currency</div>
                <div className="td fixed-flex min-w-160">Paid With</div>
                <div className="td">Category</div>
                <div className="td fixed-flex min-w-260">Attachment</div>
                <div className="td fixed-flex min-w-140">Status</div>
                {!isCompleted && !isRejected && <div className="td fixed-flex min-w-160">Actions</div>}
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        const {tabView: {status}} = this.refs;
        return <ExpensesRenderRow key={item.id} idx={idx} item={item} view={view} status={status}
                                  onAction={this.onAction}
                                  onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
