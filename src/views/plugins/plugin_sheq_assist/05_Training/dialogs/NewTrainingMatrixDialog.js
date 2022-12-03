// <editor-fold defaultstate="collapsed" desc="imports">
import React, {createRef} from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {execWhen} from 'utils/Utils';
import TrainingPlanListByCourse from "components/FormListComponents/TrainingPlanListByCourse";

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
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {onSelectLoadTrainingFrequencies} from '../../../utils';

import style from "./NewTrainingMatrixDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewTrainingMatrixDialog extends ANewDialog {
    pageKey = "TrainingMatrix";
    title = "Create Training Matrix";

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
            status: [{text: "Outstanding", value: "Outstanding", checked: false}, {
                text: "Completed",
                value: "Completed",
                checked: false
            }],
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
                if(sector_list) {
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
                const jobPositionList = training_plan_list.
                filter(({data: {job_position}}) => !!job_position).
                map(({data: {job_position}}) => job_position).
                distinct();
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
                infoDialog.open('Company is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('course_or_module')) {
                infoDialog.open('Course is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant, isNoProjects} = storage.is;

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
            status,
            date_range,
            cost,
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

        console.log('training_plan', training_plan)

        //0
        if (client) {
            if (client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
                data.client_id = id;
            } else {
                data.client = client;
            }
        }
        if (project) {
            if (project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
                data.project_id = id;
            } else {
                data.project = project;
            }
        }
        if (site) {
            if (site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
                data.site_id = id;
            } else {
                data.site = site;
            }
        }

        //1
        if (course_or_module) {
            const {id, data: _data, name} = course_or_module;
            data.course_or_module = {id, name: name || _data.name};
        }
        if (training_plan) {
            data.training_plan = parseInt(training_plan.group, 10);
        }

        //2
        if (allocation) {
            data.allocation = allocation.map(({id, data: {name}}) => ({id, name}));
        }
        if (job_title) {
            data.job_title = job_title.map(({id, data: {name}}) => ({id, name}));
        }
        if (sector_list) {
            data.sector_list = sector_list.slice();
        }

        //3
        if (status) {
            data.status = status;
        }
        if (date_range) {
            const {start, end} = date_range;
            data.date_range = {};
            if (start) {
                data.date_range.start = start.getTime();
            }
            if (end) {
                data.date_range.end = end.getTime();
            }
        }
        if (cost) {
            data.cost = cost;
        }

        //4
        if (institution_conducting_training) {
            data.institution_conducting_training = institution_conducting_training;
        }
        if (hr) {
            const {id = null, data: _data, fname, lname} = hr;
            data.hr = {id, fname: fname || _data.fname, lname: lname || _data.lname};
        }
        if (job_desc) {
            if (isString(job_desc)) {
                data.job_desc = job_desc;
            } else {
                const {id, data: {name}} = job_desc;
                data.job_desc = {id, name};
            }
        }

        //5
        if (requirement_legal) {
            data.requirement_legal = requirement_legal;
        }
        if (requirement) {
            data.requirement = requirement;
        }
        if (!!max_participants_per_course) {
            data.max_participants_per_course = max_participants_per_course;
        }
        if (training_standard) {
            data.training_standard = training_standard;
        }
        if (training_frequency) {
            data.training_frequency = training_frequency;
        }
        if (training_provider_requirement) {
            /*["Accredited", "Non-Accredited"]*/
            data.training_provider_requirement = training_provider_requirement;
        }

        //6
        if (competency_evaluation) {
            data.competency_evaluation = competency_evaluation;
        }
        if (unit_standard) {
            data.unit_standard = unit_standard;
        }
        if (unit_standard_desc) {
            data.unit_standard_desc = unit_standard_desc;
        }
        if (credits) {
            data.credits = credits;
        }
        if (nqf_level) {
            data.nqf_level = nqf_level;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                                 onChange={this.form.onChange}/>
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
                                           className="col-lg-12 form-control" onChange={this.form.onChange} add={false}
                                           returnValue/>
                <br />
                <TrainingPlanListByCourse ref={this.trainingPlanListRef} name="training_plan" onChange={this.form.onChange}/>
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
                                        className="col-lg-12 form-control" onChange={this.form.onChange} add={false}/>
                <SelectJobPositionInput name="job_title" type="select_multi" placeholder="Job Position For Training..." required
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="sector_list" type="checkbox" placeholder="Sector(s)" required vertical={3}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
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
                <ClearableInput name="status" type="radio" placeholder="Training Status" required vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.status}/>
                <DateRangeInput name="date_range" className="col-lg-12 form-control" placeholder=""
                                onChange={this.form.onChange}>
                    <label className="min-w-100">Start Date</label>
                    <label className="min-w-100">End Date</label>
                </DateRangeInput>
                <ClearableInput name="cost" type="number" placeholder="Cost" required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
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
                                placeholder="Institution Conducting Training" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <SelectUserInput name="hr" placeholder="Training Conductor..." defaultUser showOtherPerson
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobPositionInput name="job_desc" placeholder="Job Position..."
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
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.requirement_legal}/>
                <ClearableInput name="requirement" type="radio" placeholder="Requirement"
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.requirement}/>
                <ClearableInput name="max_participants_per_course" type="number"
                                placeholder="Max. Participants Per Course" className="col-lg-8 pull-left-2 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="training_standard" type="number" placeholder="Training Standard (Minimum Days)"
                                className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="training_frequency" placeholder="Training Frequency..."
                               className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}
                               values="training_frequency"/>
                <ClearableInput name="training_provider_requirement" type="radio"
                                placeholder="Training Provider Requirement" vertical
                                className="col-lg-11 pull-left-0_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.training_provider_requirement}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Guideline To Available Unit Standards That May Be Used"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput name="competency_evaluation" type="radio" placeholder="Competency Evaluation" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.competency_evaluation}/>
                <ClearableInput name="unit_standard" type="text" placeholder="Unit Standard"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="unit_standard_desc" type="textarea" placeholder="Unit Standard Description"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="credits" type="number" placeholder="Credits" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="nqf_level" type="number" placeholder="NQF Level" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="SelectWrapper">
@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, className, onChange, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} className={className}
                               onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

// </editor-fold>

export default NewTrainingMatrixDialog;
