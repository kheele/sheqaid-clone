// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, getRandomRolor} from '../../../../../../utils/Utils';
import {
    ActionsButton,
    ClearableInput,
    DateRangeInput,
    SelectEmployeeInput,
    SelectJobPositionInput, SelectTrainingCourseInput,
    SelectUserInput
} from '../../../../../../components/inputs';
import {THead, TRow} from '../../../../../../components/tables';

import {AControls, AExportDialog} from '../../../../../../components/exports/AExportDialog';
import byLogged
    from "../../../../plugin_hr_management/Competencies/CompetenciesDialog/Query/List/listAllCompetencyByLogged";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Training Matrix';
    titlePlural = 'Training Matrixes';
    
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
    path = "plugin_sheq_assist/05_Trainings/training-matrix/";
    
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
            training_provider_requirement: [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}],
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
        hr_id: null,
        job_title_id: null,
        //
        course_or_module_id: null,
        //
        training_provider_requirement: null,
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
    onLoadList({isNew, filterData}) {
        const {
            client_id,
            project_id,
            site_id,
            //
            hr_id,
            job_title_id,
            //
            course_or_module_id,
            //
            training_provider_requirement,
            requirement,
            status,
        } = filterData || {};

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        const limit = 50;

        const args = {
            client_id,
            project_id,
            site_id,
            //
            hr_id,
            job_title_id,
            //
            course_or_module_id,
            //
            training_provider_requirement,
            requirement,
            status,
            //
            // limit,
            //
            exact_orgs: true,
        };

        return byLogged(args);
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex min-w-120">Accreditation</div>
            <div className="td">Training Conductor</div>
            <div className="td">Job Title</div>
            <div className="td">Course</div>
            <div className="td fixed-flex min-w-100">Requirement</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {id, data:{created_at, status, training_provider_requirement, institution_conducting_training, hr, job_title, course_or_module, requirement, certificate_expiration}} = item;
        console.log('job_title', job_title);
        return <TRow key={"item-" + n} className="w-full">
            <div className="td fixed-flex min-w-100">{status || 'N/A'}</div>
            <div className="td fixed-flex min-w-120">{training_provider_requirement || 'N/A'}</div>
            <div className="td">{hr ? ((hr.fname || hr.data.fname) + ' ' + (hr.lname || hr.data.lname)) : 'N/A'}</div>
            <div className="td">{job_title ? job_title.filter(v => !!v).map(({name}) => name).join(', ') : 'N/A'}</div>
            <div className="td">{isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : (course_or_module || 'N/A')}</div>
            <div className="td fixed-flex min-w-100">{requirement || 'N/A'}</div>
            {renderActionsCol && renderActionsCol(item, n, onClick)}
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>
            <SelectUserInput ref="hr_id" name="hr" placeholder="Training Conductor..." defaultUser required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectJobPositionInput ref="job_title_id" name="job_title" placeholder="Job Position For Training..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <SelectTrainingCourseInput ref="course_or_module_id" name="course_or_module" placeholder="Course..." className="col-lg-12 form-control" onChange={this.form.onChange} add={false} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="training_provider_requirement" name="training_provider_requirement" type="radio" placeholder="Accreditation" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.training_provider_requirement}/>
            <ClearableInput ref="requirement" name="requirement" type="radio" placeholder="Requirement" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.requirement}/>
            <ClearableInput ref="status" name="status" type="radio" placeholder="Status" vertical className="col-lg-12 h-105 form-control" onChange={this.form.onChange} values={this.state.lists.status}/>
        </React.Fragment>;
    }
    // </editor-fold>
}

export default ExportDialog;
