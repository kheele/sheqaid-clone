// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';
import WarningsRenderRow from "./WarningsRenderRow";
import {THead} from "components/tables";
import {ClearableInput, SelectEmployeeInput,} from "components/inputs";

import {updateEmployeeWarning} from "mutations/update";
import {findByIdOrgWarningsDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgWarningsDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";
import {exportExcelEmployeeWarnings} from "mutations/exportExcel";
import {listEmployeeWarning} from "../../../../../mutations/listByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "WarningsDialog";
    title = "Warnings";
    titleSingular = "Warning";
    permissionKey = "Warnings";
    module = "Warnings";
    // hasSignatures = true;
    onUpdate = updateEmployeeWarning;
    exportExcel = exportExcelEmployeeWarnings;
    filterNodeGrid = 5;

    dialogs = {
        NewDialog, EditDialog, ProfileDialog,
    };

    selfState2 = {
        lists: {
            warning_types: ['Verbal', 'Written', 'Final'],
        },
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
            issued_by_id,
            witness_id,
            type,
            date,
        } = filterData || {};
        return {
            listByLogged: listEmployeeWarning,
            issued_by_id,
            witness_id,
            type,
            date,
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgWarningsDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgWarningsDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const warning_types = ['Verbal', 'Written', 'Final'];
        return <>
            <SelectEmployeeInput ref="issued_by" name="issued_by" placeholder="Issued By..." className="form-control"
                                 onChange={onChange}/>
            <SelectEmployeeInput ref="witness" name="witness" placeholder="Witness..." className="form-control"
                                 onChange={onChange}/>
            <ClearableInput name="type" type="select" placeholder="Warning Type..." className="form-control"
                            onChange={onChange} values={warning_types} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Warning Date..." className="form-control"
                            onChange={onChange}/>
        </>;
    }

    //</editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <SelectEmployeeInput
                name="issued_by"
                placeholder="Issued By..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
            />
            <SelectEmployeeInput
                name="witness"
                placeholder="Witness..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
            />
            <ClearableInput
                name="type"
                type="select"
                placeholder="Warning Type..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
                values={this.selfState2.lists.warning_types}
                returnValue
            />
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput
                name="date"
                type="date"
                placeholder="Warning Date..."
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
                <div className="td">Issued By</div>
                <div className="td fixed-flex min-w-105">Witnesses</div>
                <div className="td">Warning Type</div>
                <div className="td">Details</div>
                <div className="td fixed-flex min-w-105">Warning Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <WarningsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
