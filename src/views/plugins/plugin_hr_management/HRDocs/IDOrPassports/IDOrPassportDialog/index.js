// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ExportDialog from '../ExportDialog.js';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../../AEmployeeDocDialog';
import IDOrPassportRenderRow from "./IDOrPassportRenderRow";
import {THead} from "components/tables";

import {updateEmployeeDocDocumentIDOrPassport} from "mutations/update";
import {findByIdOrgIDOrPassportDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgIDOrPassportDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";
import {exportExcelEmployeeDocDocumentIDOrPassports} from "mutations/exportExcel";
import {ClearableInput, SelectTrainingCourseInput} from "../../../../../../components/inputs";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "IDOrPassportDialog";
    title = "ID/Passports";
    titleSingular = "ID/Passport";
    permissionKey = "IDOrPassports";
    module = "IDOrPassports";
    onUpdate = updateEmployeeDocDocumentIDOrPassport;
    exportExcel = exportExcelEmployeeDocDocumentIDOrPassports;
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
            desc,
        } = filterData || {};
        return {
            path: 'employees/documents/id-or-passports',
            desc,
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgIDOrPassportDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgIDOrPassportDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput
                name="type"
                type="radio"
                placeholder="Certificate Type"
                vertical
                className="col-lg-12 h-110 margin-0 form-control"
                onChange={onChange}
                values={this.selfState2.lists.type}
                returnValue
            />
            <ClearableInput
                name="competency_type"
                type="select" placeholder="Competency Type..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
                values={this.selfState2.lists.competency_type}
                returnValue
            />
            <SelectTrainingCourseInput
                name="course"
                placeholder="Course..."
                className="col-lg-12 margin-0 form-control"
                onChange={onChange}
                add={false}
            />
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput
                name="issued_date"
                type="date"
                placeholder="Date Of Issue..."
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
                <div className="td fixed-flex min-w-105">Type</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <IDOrPassportRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
