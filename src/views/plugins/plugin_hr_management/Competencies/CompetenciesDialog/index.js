// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ExportDialog from '../ExportDialog.js';

import {EditDialog, NewDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';
import CompetenciesRenderRow from "./CompetenciesRenderRow";
import {THead} from "components/tables";
import {ClearableInput, SelectTrainingCourseInput} from "components/inputs";

import {updateEmployeeCompetency} from "mutations/update";
import {findByIdOrgCompetenciesDashboardStatsByLogged} from "mutations/employeeOrgDashboard";
import {findByIdOrgCompetenciesDateRangeDashboardStatsByLogged} from "mutations/employeeOrgDateRangeDashboard";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "CompetenciesDialog";
    title = "Competencies";
    titleSingular = "Competency";
    permissionKey = "Competencies";
    module = "Competencies";
    onUpdate = updateEmployeeCompetency;
    filterNodeGrid = 5;

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
            type,
            competency_type,
            course_id,
            issued_date,
        } = filterData || {};
        return {
            path: 'employees/docs/competencies',
            type,
            competency_type,
            course_id,
            issued_date,
        };
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        return findByIdOrgCompetenciesDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        return findByIdOrgCompetenciesDateRangeDashboardStatsByLogged();
    }

    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        return <>
            <SelectTrainingCourseInput
                name="course"
                placeholder="Course..."
                className="form-control"
                onChange={onChange}
                add={false}
            />
            {createTypeInput(onChange)}
            {createCompetencyTypeInput(onChange)}
            <ClearableInput
                name="issued_date"
                type="date"
                placeholder="Date Of Issue..."
                className="form-control"
                onChange={onChange}
            />
        </>;
    }

    //</editor-fold>

    renderExportFilterNode(onChange) {
        return <>
            <SelectTrainingCourseInput
                name="course"
                placeholder="Course..."
                className="form-control"
                onChange={onChange}
                add={false}
            />
            {createTypeInput(onChange)}
            {createCompetencyTypeInput(onChange)}
            <ClearableInput
                name="issued_date"
                type="date"
                placeholder="Date Of Issue..."
                className="form-control"
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
                <div className="td fixed-flex min-w-140">Accreditation No.</div>
                <div className="td fixed-flex min-w-120">Certificate Type</div>
                <div className="td fixed-flex min-w-160">Competency Type</div>
                <div className="td">Course</div>
                <div className="td fixed-flex min-w-105">Issued Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <CompetenciesRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }

    // </editor-fold>

}

const createTypeInput = (onChange) => {
    const type = [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}];
    return <ClearableInput
        name="type"
        type="radio"
        className="form-control"
        onChange={onChange}
        values={type}
        returnValue
    />;
};

const createCompetencyTypeInput = (onChange) => {
    const competency_type = [
        {label: 'Behavioural', value: 'Behavioural'},
        {label: 'Technical / Functional', value: 'Technical / Functional'},
        {label: 'Leadership', value: 'Leadership'},
    ];
    return <ClearableInput
        name="competency_type"
        type="select"
        placeholder="Competency Type..."
        className="form-control"
        onChange={onChange}
        values={competency_type}
        returnValue
    />;
};

export default Dialog;
//206