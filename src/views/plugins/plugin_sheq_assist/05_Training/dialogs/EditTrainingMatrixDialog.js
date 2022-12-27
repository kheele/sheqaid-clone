// <editor-fold defaultstate="collapsed" desc="imports">
import React, {createRef} from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen, ShouldUpdate} from '../../../../../utils/Utils';
import {onSelectLoadTrainingFrequencies} from '../../../utils';

import {
    ClearableInput,
    DateRangeInput,
    SelectClientInput,
    SelectJobCategoryInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectTrainingCourseInput,
    SelectUserInput
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import style from "./EditTrainingMatrixDialog.lazy.css";
import TrainingPlanListByCourse from "../../../../../components/FormListComponents/TrainingPlanListByCourse";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditTrainingMatrixDialog extends AEditDialog {
    pageKey = "EditTrainingMatrixDialog";
    title = "Edit Training Matrix";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/05_Trainings/training-matrix/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            status: [
                {text: "Outstanding", value: "Outstanding", checked: false},
                {text: "Completed", value: "Completed", checked: false}
            ],
            sector_list: ['Chemicals', 'Construction', 'Fire Management', 'Harvesting', 'Manufacturing', 'Mining', 'Silviculture', 'Transport', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            requirement: [{text: "Compulsory", value: "Compulsory"}, {text: "Optional", value: "Optional"}],
            requirement_legal: [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
            training_frequency: ['Non-Expiry', '5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
            training_provider_requirement: [{text: "Accredited", value: "Accredited"}, {
                text: "Non-Accredited",
                value: "Non-Accredited"
            }],
            competency_evaluation: [{
                text: "On Day Of Evaluation",
                value: "OnDayOfEvaluation"
            }, {text: "Last Day Of Evaluation", value: "LastDayOfEvaluation"}]
        },
        loadedSelectLists: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.trainingPlanListRef = createRef(null);

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("client", this.onChangeClient.bind(this));
        this.form.addChangeOne("course_or_module", this.onChangeCourse.bind(this));
        this.form.addChangeOne("hr", this.onChangeHR.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeClient">
    onChangeClient(el, val) {
        execWhen(() => this.refs.sector_list).then(async ref => {
            if (val) {
                const {id, data: {sector_list}} = val;
                if (sector_list) {
                    this.state.lists.sector_list = sector_list.map(value => {
                        return {value, text: value.data.name, checked: false};
                    });
                }

            } else {
                ref.reset();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeCourse">
    onChangeCourse(el, val) {
        execWhen(() => this.trainingPlanListRef && this.trainingPlanListRef.current).then(async ref => {
            if (val) {
                ref.setValue(val);
            } else {
                ref.setValue(null);
            }
        });
        execWhen(() => this.refs.job_title).then(async ref => {
            if (val) {
                const {id, data: {training_plan_list}} = val;
                const jobPositionList = training_plan_list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct();
                ref.value = jobPositionList;

            } else {
                ref.reset();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeHR">
    onChangeHR(el, val) {
        execWhen(() => this.refs.job_desc).then(job_desc_ref => {
            if (val) {
                let {optional_info} = val.data;
                if (optional_info) {
                    const {job_position} = optional_info;
                    job_position && job_desc_ref.onChange({label: job_position.name, value: job_position});
                }
            } else {
                job_desc_ref.reset();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const loads = {training_frequency: onSelectLoadTrainingFrequencies};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('course_or_module')) {
                infoDialog.open('Course is');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isConsultant} = storage.is;

        //1
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //2
        if (!form.isValid('course_or_module')) {
            infoDialog.open('Course is required');
            return;
        }
        //3
//        if (!form.isValid('job_title')) {
//            infoDialog.open('Job Position For Training is required');
//            return;
//        }
        //4
//        if (!form.isValid('status')) {
//            infoDialog.open('Training Status is required');
//            return;
//        }
        //5
//        if (!form.isValid('hr')) {
//            infoDialog.open('Training Conductor is required');
//            return;
//        }
        //6
//        if (!form.isValid('requirement_legal')) {
//            infoDialog.open('Legal Requirement option is required');
//            return;
//        }
//        if (!form.isValid('requirement')) {
//            infoDialog.open('Requirement is required');
//            return;
//        }
//        if (!form.isValid('training_provider_requirement')) {
//            infoDialog.open('Training Provider Requirement is required');
//            return;
//        }

        const {
            //1
            client, project, site,
            //2
            course_or_module, training_plan,
            //3
            allocation, job_title, sector_list,
            //4
            status, date_range, cost,
            //5
            institution_conducting_training, hr, job_desc,
            //6
            requirement_legal,
            requirement,
            max_participants_per_course,
            training_standard,
            training_frequency,
            training_provider_requirement,
            //7
            competency_evaluation,
            unit_standard,
            unit_standard_desc,
            credits,
            nqf_level
        } = form.data;
        const data = {};

        //1
        ShouldUpdate.checkClient(data, old_data, client, 'client');
        ShouldUpdate.checkProject(data, old_data, project, 'project');
        ShouldUpdate.checkSite(data, old_data, site, 'site');

        //2
        ShouldUpdate.checkCourseOrModule(data, old_data, course_or_module, 'course_or_module');
        ShouldUpdate.checkTrainingPlanYear(data, old_data, training_plan, 'training_plan');

        //3
        ShouldUpdate.checkJobPositionList(data, old_data, allocation, 'allocation');
        ShouldUpdate.checkJobPositionList(data, old_data, job_title, 'job_title');
        ShouldUpdate.checkBox(data, old_data, sector_list, 'sector_list');

        //4
        ShouldUpdate.check(data, old_data, status, 'status');
        if (date_range) {
            const {start, end} = date_range;
            const new_date_range = {};
            ShouldUpdate.checkDate(new_date_range, old_data.date_range, start, 'start');
            ShouldUpdate.checkDate(new_date_range, old_data.date_range, end, 'end');
            if (!Object.keys(new_date_range).isEmpty()) {
                data.date_range = new_date_range;
            }
        }
        ShouldUpdate.check(data, old_data, cost, 'cost');

        //5
        ShouldUpdate.check(data, old_data, institution_conducting_training, 'institution_conducting_training');
        ShouldUpdate.checkEmployee(data, old_data, hr, 'hr');
        ShouldUpdate.checkJobPosition(data, old_data, job_desc, 'job_desc');

        //6
        ShouldUpdate.check(data, old_data, requirement_legal, 'requirement_legal');
        ShouldUpdate.check(data, old_data, requirement, 'requirement');
        ShouldUpdate.check(data, old_data, max_participants_per_course, 'max_participants_per_course');
        ShouldUpdate.check(data, old_data, training_standard, 'training_standard');
        ShouldUpdate.check(data, old_data, training_frequency, 'training_frequency');
        ShouldUpdate.check(data, old_data, training_provider_requirement, 'training_provider_requirement');

        //7
        ShouldUpdate.check(data, old_data, competency_evaluation, 'competency_evaluation');
        ShouldUpdate.check(data, old_data, unit_standard, 'unit_standard');
        ShouldUpdate.check(data, old_data, unit_standard_desc, 'unit_standard_desc');
        ShouldUpdate.check(data, old_data, credits, 'credits');
        ShouldUpdate.check(data, old_data, nqf_level, 'nqf_level');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    //1
                    client, project, site,
                    //2
                    course_or_module, training_plan,
                    //3
                    allocation, job_title, sector_list,
                    //4
                    status, date_range, cost,
                    //5
                    institution_conducting_training, hr, job_desc,
                    //6
                    requirement_legal,
                    requirement,
                    max_participants_per_course,
                    training_standard,
                    training_frequency,
                    training_provider_requirement,
                    //7
                    competency_evaluation,
                    unit_standard,
                    unit_standard_desc,
                    credits,
                    nqf_level
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        return (<FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..."
                                                    defaultValue={RenderUtils.selectedClient.call(this)} showAll
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..."
                                    defaultValue={RenderUtils.selectedProject.call(this)} showAll
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)}
                                 showAll className={"col-lg-12 form-control"} onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Course Details"
                onFormOpen={onFormOpen}
                onFormBack={!isNoProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <SelectTrainingCourseInput name="course_or_module" placeholder="Course..."
                                           defaultValue={course_or_module} className="col-lg-12 form-control"
                                           onChange={this.form.onChange} add={false} returnValue/>
                <br/>
                <TrainingPlanListByCourse ref={this.trainingPlanListRef} name="training_plan"
                                          defaultValue={training_plan} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Sector & Job Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectJobCategoryInput name="allocation" type="select_multi" placeholder="Allocation / Job Category..."
                                        defaultValue={allocation} className="col-lg-12 form-control"
                                        onChange={this.form.onChange} add={false}/>
                <SelectJobPositionInput name="job_title" type="select_multi" placeholder="Job Position For Training..."
                                        defaultValue={job_title} className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                <ClearableInput name="sector_list" type="checkbox" placeholder="Sector(s)" defaultValue={sector_list}
                                vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.sector_list} returnValue/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Training Start & End Date"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="status" type="radio" placeholder="Training Status" defaultValue={status} vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status}/>
                <DateRangeInput name="date_range" className="col-lg-12 form-control" defaultValue={date_range}
                                placeholder="" onChange={this.form.onChange}>
                    <label className="min-w-100">Start Date</label>
                    <label className="min-w-100">End Date</label>
                </DateRangeInput>
                <ClearableInput name="cost" type="number" placeholder="Cost" defaultValue={cost}
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Person / Institution Conducting Training"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="institution_conducting_training" type="text"
                                placeholder="Institution Conducting Training"
                                defaultValue={institution_conducting_training} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <SelectUserInput name="hr" placeholder="Training Conductor..." defaultValue={hr} defaultUser
                                 showOtherPerson className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobPositionInput name="job_desc" placeholder="Job Position..." defaultValue={job_desc}
                                        desc="Job Position For Training Conductor" className="col-lg-12 form-control"
                                        onChange={this.form.onChange} add/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Standard"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="requirement_legal" type="radio" placeholder="Legal Requirement"
                                defaultValue={requirement_legal} className="col-lg-8 pull-left-2 form-control"
                                onChange={this.form.onChange} values={this.state.lists.requirement_legal}/>
                <ClearableInput name="requirement" type="radio" placeholder="Requirement" defaultValue={requirement}
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.requirement}/>
                <ClearableInput name="max_participants_per_course" type="number"
                                defaultValue={max_participants_per_course} placeholder="Max. Participants Per Course"
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="training_standard" type="number" defaultValue={training_standard}
                                placeholder="Training Standard (Minimum Days)"
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="training_frequency" defaultValue={training_frequency}
                               placeholder="Training Frequency..." className="col-lg-8 pull-left-2 form-control"
                               onChange={this.form.onChange} values="training_frequency"/>
                <ClearableInput name="training_provider_requirement" type="radio"
                                defaultValue={training_provider_requirement} placeholder="Training Provider Requirement"
                                vertical className="col-lg-11 pull-left-0_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.training_provider_requirement}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Guideline To Available Unit Standards That May Be Used"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput name="competency_evaluation" type="radio" defaultValue={competency_evaluation}
                                placeholder="Competency Evaluation" vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.competency_evaluation}/>
                <ClearableInput name="unit_standard" type="text" defaultValue={unit_standard}
                                placeholder="Unit Standard" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="unit_standard_desc" type="textarea" defaultValue={unit_standard_desc}
                                placeholder="Unit Standard Description" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="credits" type="number" defaultValue={credits} placeholder="Credits"
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="nqf_level" type="number" defaultValue={nqf_level} placeholder="NQF Level"
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectWrapper">
@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, defaultValue, className, onChange, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue}
                               className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

// </editor-fold>

export default EditTrainingMatrixDialog;
