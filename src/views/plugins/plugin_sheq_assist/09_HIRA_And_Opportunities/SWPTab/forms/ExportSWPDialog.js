// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, getRandomRolor} from 'utils/Utils';
import {
    ActionsButton,
    ClearableInput,
    DateRangeInput, SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput, SelectTrainingCourseInput,
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Training Matrix';
    titlePlural = 'Training Matrices';
    
    get excludePDF() {
        return true;
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/09_HIRA_And_Opportunities/swp/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
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
        category: null,
        work_task: null,
        location: null,
        department_id: null,
        person_approving_procedure_id: null,
        sign_sheet_employee_id: null,
        //
        expiry_range: null,
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            client_id,
            project_id,
            site_id,
            //
            category,
            work_task,
            location,
            department_id,
            person_approving_procedure_id,
            sign_sheet_employee_id,
            //
            expiry_range,
        } = filterData || {};
        
        const listByLogged = sockets.of('hira-and-opportunities/swp').fn('listByLogged');
        
        return listByLogged({
            client_id,
            project_id,
            site_id,
            //
            category,
            work_task,
            location,
            department_id,
            person_approving_procedure_id,
            sign_sheet_employee_id,
            //
            expiry_range,
            //
            exact_orgs: true,
            //
            limit: 0,
            offset: 0,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Category</div>
            <div className="td">Work Task</div>
            <div className="td">Location</div>
            <div className="td">Department</div>
            <div className="td">Person Approving</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {id, data: {created_at, category, work_task, location, department, person_approving_procedure, doc}} = item;
        return <>
            <div className="td fixed-flex min-w-40">{id}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{category}</div>
            <div className="td">{work_task}</div>
            <div className="td">{location}</div>
            <div className="td">{department ? department.name : "N/A"}</div>
            <div className="td">{person_approving_procedure && person_approving_procedure.full_name || "N/A"}</div>
            {renderActionsCol && renderActionsCol(item, n, onClick)}
        </>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <>
            <SelectDepartmentInput ref="department_id" name="department_id" placeholder="Department activity takes place..." className="col-lg-12 form-control"
                                   onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="person_approving_procedure_id" name="person_approving_procedure_id" placeholder="Person(s) Approving Procedure..."
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="sign_sheet_employee_id" name="sign_sheet_employee_id" placeholder="Employee on Sign Sheet List..."
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
            
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="category" name="category" type="text" placeholder="Category" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <ClearableInput ref="work_task" name="work_task" type="text" placeholder="Work Task" className="col-lg-12 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput ref="location" name="location" type="text" placeholder="Area activity takes place" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <DateRangeInput name="expiry_range" className="col-lg-12 form-control"
                            placeholder="Expiry Date Reported" placeholderWidthClass="min-w-135" onChange={this.form.onChange}/>
        </>;
    }
    // </editor-fold>
}

export default ExportDialog;
