// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ExportDialog from '../ExportDialog.js';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';
import MedicalsRenderRow from "./MedicalsRenderRow";
import {THead} from "components/tables";
import {ClearableInput,} from "components/inputs";

import updateEmployeeMedical from "mutations/all/EmployeeMedical/updateEmployeeMedical";
import {findByIdOrgMedicalsDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgMedicalsDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "MedicalsDialog";
    title = "Medical Management";
    titleSingular = "Medical";
    permissionKey = "Medicals";
    module = "Medicals";
    onUpdate = updateEmployeeMedical;
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
            annexture_3,
        } = filterData || {};
        return {
            path: 'employees/docs/medicals',
            annexture_3,
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgMedicalsDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgMedicalsDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const annexture_3 = [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}];
        return <>
            <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?" className="form-control"
                            onChange={onChange} values={annexture_3} returnValue/>
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
                <div className="td">Restrictions</div>
                <div className="td fixed-flex min-w-120">Annexture 3?</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <MedicalsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

export default Dialog;
