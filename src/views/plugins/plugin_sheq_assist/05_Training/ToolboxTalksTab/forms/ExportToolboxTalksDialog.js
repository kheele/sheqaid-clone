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
    SelectJobPositionInput, SelectToolboxTalkSubjectInput,
    SelectUserInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Toolbox Talk / Training Meeting';
    titlePlural = 'Toolbox Talks / Training Meetings';
    
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
    path = "plugin_sheq_assist/05_Trainings/toolbox-talks/";
    
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
        subject_id: null,
        subject_category: null,
        //
        training_frequency: null,
        date: null,
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
            training_frequency,
            date,
            subject_list,
            subject_category_list,
            trainer_list,
            job_position_list,
            employee_list,
        } = filterData || {};

        const listByLogged = sockets.of('trainings/toolbox-talks').fn('listByLogged');

        return listByLogged({
            client_id,
            project_id,
            site_id,
            //
            training_frequency,
            date,
            subject_list,
            subject_category_list,
            trainer_list,
            job_position_list,
            employee_list,
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
            <div className="td">Toolbox Talk / Training Meeting Subject</div>
            <div className="td">Subject Category</div>
            <div className="td">Institution Conducting Training</div>
            <div className="td">Training Conductor</div>
            <div className="td">Trainer Job Position</div>
            <div className="td fixed-flex min-w-140">Training Frequency</div>
            <div className="td fixed-flex min-w-120">Date</div>
            <div className="td fixed-flex min-w-80">Time From</div>
            <div className="td fixed-flex min-w-80">Time To</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {
            id, data:{
                created_at,
                
                subject,
                subject_category,
                training_frequency,
            }
        } = item;
        return <>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td fixed-flex min-w-100">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{training_provider_requirement || 'N/A'}</div>
            <div className="td">{hr ? ((hr.fname || hr.data.fname) + ' ' + (hr.lname || hr.data.lname)) : 'N/A'}</div>
            <div className="td">{job_title ? job_title.name : 'N/A'}</div>
            <div className="td">{isObject(subject) ? (subject.name || subject.data.name) : (subject || 'N/A')}</div>
            <div className="td fixed-flex min-w-100">{requirement || 'N/A'}</div>
            {renderActionsCol && renderActionsCol(item, n, onClick)}
        </>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <>
            <SelectUserInput ref="trainer_id" name="hr" placeholder="Training Conductor..." defaultUser required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_position_id" name="job_title" placeholder="Job Position For Training..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <SelectToolboxTalkSubjectInput ref="subject" name="subject" placeholder="Subject..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="training_provider_requirement" name="training_provider_requirement" type="radio" placeholder="Accreditation" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.training_provider_requirement}/>
            <ClearableInput ref="requirement" name="requirement" type="radio" placeholder="Requirement" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.requirement}/>
            <ClearableInput ref="status" name="status" type="radio" placeholder="Status" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.status}/>
        </>;
    }
    // </editor-fold>
}

export default ExportDialog;
