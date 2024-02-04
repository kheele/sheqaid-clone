// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, getRandomRolor} from 'utils/Utils';
import {
    ActionsButton,
    ClearableInput,
    DateRangeInput,
    SelectEmployeeInput,
    SelectJobPositionInput, SelectTrainingCourseInput,
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Internal Audit';
    titlePlural = 'Internal Audits';
    
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
    path = "plugin_sheq_assist/21_Internal_Audit/audit/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            status: [{text: "Outstanding", value: "Outstanding", checked: false}, {text: "Completed", value: "Completed", checked: false}],
            sector_list: ['Chemicals', 'Construction', 'Fire Management', 'Harvesting', 'Manufacturing', 'Mining', 'Silviculture', 'Transport', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            requirement: [{text: "Compulsory", value: "Compulsory"}, {text: "Optional", value: "Optional"}],
            requirement_legal: [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
            training_frequency: ['Non-Expiry', '5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
            provider_requirement: [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}],
            competency_evaluation: [{text: "On Day Of Evaluation", value: "OnDayOfEvaluation"}, {text: "Last Day Of Evaluation", value: "LastDayOfEvaluation"}]
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
        trainer_id: null,
        job_position_id: null,
        //
        course_id: null,
        //
        provider_requirement: null,
        requirement: null,
        status: null,
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
            representative_list,
            auditor,
            type,
            scope,
            date_range,
        } = filterData || {};

        const listByLogged = sockets.of('audits').fn('listByLogged');

        return listByLogged({
            client_id,
            project_id,
            site_id,
            //
            representative_list,
            auditor,
            type,
            scope,
            date_range,
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
            <div className="td">Course</div>
            <div className="td">Training Conductor</div>
            <div className="td">Institution Conducting Training</div>
            <div className="td">Job Position(s)</div>
            <div className="td fixed-flex min-w-100">Requirement</div>
            <div className="td fixed-flex min-w-120">Accreditation</div>
            <div className="td fixed-flex min-w-100">Training Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {id, data:{created_at, status, provider_requirement, institution_conducting_training, trainer, trainer_external, job_position_list, course, requirement, certificate_expiration}} = item;
        console.log('job_position_list', job_position_list.slice());
        return <>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td">{course ? course.name : 'N/A'}</div>
            <div className="td">{(trainer || trainer_external) ? (trainer || trainer_external).full_name : 'N/A'}</div>
            <div className="td">{institution_conducting_training || 'N/A'}</div>
            <div className="td">{job_position_list ? job_position_list.filter(v => !!v).map(({job_position}) => job_position.name).join(', ') : 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{requirement || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{provider_requirement || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{status || 'N/A'}</div>
            {renderActionsCol && renderActionsCol(item, n, onClick)}
        </>;
    }
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <>
            <SelectEmployeeInput ref="trainer_id" name="trainer" placeholder="Training Conductor..." defaultUser required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Job Position For Training..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <SelectTrainingCourseInput ref="course_id" name="course" placeholder="Course..." className="col-lg-12 form-control" onChange={this.form.onChange} add={false} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="provider_requirement" name="provider_requirement" type="radio" placeholder="Accreditation" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.provider_requirement}/>
            <ClearableInput ref="requirement" name="requirement" type="radio" placeholder="Requirement" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.requirement}/>
            <ClearableInput ref="status" name="status" type="radio" placeholder="Status" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.status}/>
        </>;
    }
    // </editor-fold>
}

export default ExportDialog;
