// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {
    ClearableInput,
    DateRangeInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTrainingCourseInput
} from 'components/inputs';
import {THead} from 'components/tables';

import CompetenciesRenderRow from "./CompetenciesDialog/CompetenciesRenderRow";
import ListPDFReader from './printers/ListPDFReader';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Competency';
    titlePlural = 'Competencies';

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            type: [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}],
            competency_type: [{label: 'Behavioural', value: 'Behavioural'}, {label: 'Technical / Functional', value: 'Technical / Functional'}, {label: 'Leadership', value: 'Leadership'}],
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        },
        searchList: []
    };
    @observable
    filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        department_id: null,
        job_position_id: null,
        employee: null,
        //
        type: null,
        competency_type: null,
        course_or_module: null,
        job_title: null,
        //
        issued_date: null,
        expiry_date: null,
        date_range: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td">Employee</div>
            <div className="td fixed-flex min-w-105">Latest On</div>
            <div className="td fixed-flex min-w-240">Competency Certificates</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        return <CompetenciesRenderRow key={item.id} idx={n} item={item} renderActionsCol={renderActionsCol} onClick={onClick}/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>    
            <SelectDepartmentInput ref="department_id" name="department" placeholder="Department..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="type" name="type" type="radio" placeholder="Type" vertical className="col-lg-12 h-110 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
            <ClearableInput ref="competency_type" name="competency_type" type="select" placeholder="Competency Type..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.competency_type} returnValue/>
            <SelectTrainingCourseInput ref="course_or_module" name="course_or_module" placeholder="Course..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} add={false}/>
            <SelectJobPositionInput ref="job_title" name="job_title" placeholder="Job Title..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="issued_date" name="issued_date" type="date" placeholder="Date Of Issue..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.expiry_date} returnValue/>
            <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Expiry Date Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <ListPDFReader ref="pdfReader"/>
        </React.Fragment>;
    }
    // </editor-fold>
}

export default ExportDialog;
//450