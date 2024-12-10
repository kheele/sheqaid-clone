// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ExportDialog from '../ExportDialog.js';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';
import ContractsRenderRow from "./ContractsRenderRow";
import {THead} from "components/tables";
import {ClearableInput,} from "components/inputs";

import updateEmployeeContract from "mutations/all/EmployeeContract/updateEmployeeContract";
import {findByIdOrgContractsDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgContractsDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "ContractsDialog";
    title = "Contracts";
    titleSingular = "Contract";
    permissionKey = "Contracts";
    module = "Contracts";
    onUpdate = updateEmployeeContract;
    hasSignatures = true;
    filterNodeGrid = 5;
    filterNodeMarginB = 35;

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, ExportDialog,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    //<editor-fold desc="onBuildQuery">
    onBuildQuery(params) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            contract_type,
            payment_type,
            salary_interval,
        } = filterData || {};
        return {
            path: 'employees/docs/contracts',
            contract_type,
            payment_type,
            salary_interval,
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgContractsDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgContractsDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const contract_type = ['Fixed Term', 'Permanent'].map(label => {
            return {label, value: label};
        });
        const payment_types = [{label: 'Salary (Fixed Payment)', value: 'Salary'}, {
            label: 'Hourly Wage',
            value: 'Wage'
        }];
        const salary_intervals = [
            {label: 'Weekly', value: 'Weekly'},
            {label: 'Bi-Weekly', value: 'Bi-Weekly'},
            {label: 'Monthly', value: 'Monthly'}
        ];
        return <>
            <ClearableInput ref="contract_type" name="contract_type" type="select" placeholder="Contract Type..."
                            className="form-control" onChange={onChange} values={contract_type}
                            returnValue/>
            <ClearableInput ref="payment_type" name="payment_type" type="select" placeholder="Payment Type..."
                            className="form-control" onChange={onChange} values={payment_types}
                            returnValue/>
            <ClearableInput ref="salary_interval" name="salary_interval" type="select" placeholder="Salary Interval..."
                            className="form-control" onChange={onChange} values={salary_intervals}
                            returnValue/>
        </>;
    }

    //</editor-fold>

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
                <div className="td fixed-flex min-w-140">Contract Type</div>
                <div className="td fixed-flex min-w-120">Payment Type</div>
                <div className="td fixed-flex min-w-140">Salary Interval</div>
                <div className="td fixed-flex min-w-150">Time Range</div>
                <div className="td fixed-flex min-w-140">Working Hours</div>
                <div className="td fixed-flex min-w-105">Start Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <ContractsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
