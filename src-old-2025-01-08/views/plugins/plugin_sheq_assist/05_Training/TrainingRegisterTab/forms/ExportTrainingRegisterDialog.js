// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";

import {Dates} from 'utils/Utils';
import {
    ClearableInput,
    DateRangeInput,
    SelectEmployeeInput,
    SelectJobPositionInput, SelectTrainingCourseInput,
    SelectUserInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Training Register';
    titlePlural = 'Training Registers';
    
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
    exportFn = sockets.of('trainings/register').fn('export-excel');
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {},
        searchList: []
    };
    @observable
    filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        trainer_id: null,
        job_position_id: null,
        course_id: null,
        //
        unit_standard: null
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
            job_position_id,
            trainer_id,
            course_id,
            unit_standard,
        } = filterData || {};

        const listByLogged = sockets.of('trainings/register').fn('listByLogged');

        return listByLogged({
            client_id,
            project_id,
            site_id,
            //
            job_position_id,
            trainer_id,
            course_id,
            unit_standard,
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
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td fixed-flex min-w-110">Register Date</div>
            <div className="td">Training</div>
            <div className="td">Job Positions</div>
            <div className="td">Trainer</div>
            <div className="td fixed-flex min-w-120">Year</div>
            <div className="td fixed-flex min-w-120">Time</div>
            <div className="td fixed-flex min-w-120">Duration</div>
            <div className="td fixed-flex min-w-100">Attendants</div>
            <div className="td fixed-flex min-w-140">Attendance Rate</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {
            id, data: {
                created_at,
                client, project, site,
                training,
                trainer,
                trainer_external,
                institution_conducting_training,
                time_or_duration,
                time_from,
                time_to,
                date,
                list_proof,
                employee_list,
            }
        } = item;
        
        let {course, training_plan_list, job_position_list} = training || {};
        training_plan_list = training_plan_list || [];
        const year = training_plan_list.map(({year}) => year)[0];
        console.log('training_plan_list', training_plan_list.slice().map(({year}) => year))
        
        return <>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
            <div className="td">{course && course.name}</div>
            <div className="td">
                <Grid container spacing={1} columns={4}>
                    {(job_position_list || []).map(({job_position: {id, name}}) => <Grid item><Chip label={name}
                                                                                                    size="small"/></Grid>)}
                </Grid>
            </div>
            <div className="td">{trainer.full_name}</div>
            <div className="td fixed-flex min-w-120">{year || 'N/A'}</div>
            <div
              className="td fixed-flex min-w-120">{time_from && time_to ? `${time_from.substring(0, 5)} - ${time_to.substring(0, 5)}` : "N/A"}</div>
            <div className="td fixed-flex min-w-120">{time_or_duration}</div>
            <div className="td fixed-flex min-w-100">{employee_list ? employee_list.length : 'Uploaded'}</div>
            <div className="td fixed-flex min-w-140">{
                training_plan_list.isNotEmpty() ? (
                  employee_list ? (employee_list.length / training_plan_list.length * 100).toFixed(0) + '%' : 'N/A'
                ) : 'N/A'
            }</div>
            {renderActionsCol && renderActionsCol(item, n, onClick)}
        </>;
    }
    
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <>
            <SelectJobPositionInput ref="job_position_id" name="job_position_id"
                                    placeholder="Job Position For Training..."
                                    className="form-control" onChange={this.form.onChange}/>
            <SelectEmployeeInput ref="trainer_id" name="trainer_id" placeholder="Training Conductor..."
                                 className="form-control" onChange={this.form.onChange}/>
            <SelectTrainingCourseInput ref="course_id" name="course_id" placeholder="Course..."
                                       className="form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="unit_standard" name="unit_standard" type="text" placeholder="Unit Standard"
                            className="form-control" onChange={this.form.onChange}/>
        </>;
    }
    
    // </editor-fold>
}

export default ExportDialog;
