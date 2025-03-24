// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../../AEmployeeDocDialog';
import WorkPermitsRenderRow from "./WorkPermitsRenderRow";
import {THead} from "components/tables";
import {updateEmployeeWorkPermit} from "mutations/update";
import {findByIdOrgWorkPermitsDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgWorkPermitsDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";
import {exportExcelEmployeeWorkPermits} from "mutations/exportExcel";
import {ClearableInput} from "components/inputs";
import {Dates} from "utils/Dates";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "WorkPermitsDialog";
    title = "Work Permits";
    titleSingular = "Work Permit";
    permissionKey = "WorkPermits";
    module = "WorkPermits";
    onUpdate = updateEmployeeWorkPermit;
    exportExcel = exportExcelEmployeeWorkPermits;
    filterNodeMarginB = 35;

    dialogs = {
        NewDialog, EditDialog, ProfileDialog,
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
            date,
            notes,
        } = filterData || {};
        return {
            path: 'employees/docs/work-permits',
            date: Dates.formatDateSQL(date),
            notes,
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgWorkPermitsDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgWorkPermitsDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput
                name="notes"
                type="text"
                placeholder="Notes"
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
            />
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput
                name="date"
                type="date"
                placeholder="Date..."
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
                <div className="td">Notes</div>
                <div className="td fixed-flex min-w-105">Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <WorkPermitsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
