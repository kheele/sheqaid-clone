// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../../AEmployeeDocDialog';
import LicensesRenderRow from "./LicensesRenderRow";
import {THead} from "components/tables";

import {updateEmployeeLicense} from "mutations/update";
import {findByIdOrgLicensesDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";
import {findByIdOrgLicensesDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {exportExcelEmployeeLicenses} from "mutations/exportExcel";
import {ClearableInput} from "../../../../../../components/inputs";
import {listEmployeeLicense} from "../../../../../../mutations/listByLogged";
import {Dates} from "../../../../../../utils/Dates";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "LicensesDialog";
    title = "Licenses";
    titleSingular = "License";
    permissionKey = "Licenses";
    module = "Licenses";
    onUpdate = updateEmployeeLicense;
    exportExcel = exportExcelEmployeeLicenses;
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
            notes,
            date,
        } = filterData || {};
        return {
            listByLogged: listEmployeeLicense,
            notes,
            date: Dates.formatDateSQL(date),
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgLicensesDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgLicensesDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput ref="notes" name="notes" type="text" placeholder="License Description"
                            className="col-lg-12 margin-0 form-control" onChange={onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="date" name="date" type="date" placeholder="Date..."
                            className="col-lg-12 margin-0 form-control" onChange={onChange}/>
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
                <div className="td">License Description</div>
                <div className="td fixed-flex min-w-105">Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <LicensesRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
