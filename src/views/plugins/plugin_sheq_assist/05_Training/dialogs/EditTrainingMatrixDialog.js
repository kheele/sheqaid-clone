// <editor-fold defaultstate="collapsed" desc="imports">
import React, {createRef} from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen, ShouldUpdate} from 'utils/Utils';
import {onSelectLoadTrainingFrequencies} from 'views/plugins/utils';

import {
    ClearableInput,
    DateRangeInput,
    SelectClientInput,
    SelectJobCategoryInput,
    SelectJobPositionInput,
    SelectProjectInput, SelectSectorInput,
    SelectSiteInput,
    SelectTrainingCourseInput,
    SelectUserInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditTrainingMatrixDialog.lazy.css";
import TrainingPlanListByCourse from "components/FormListComponents/TrainingPlanListByCourse";
import findByIdClient from "mutations/all/Client/findByIdClient";
import updateTrainingMatrix from "mutations/all/TrainingMatrix/updateTrainingMatrix";
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
            provider_requirement: [{text: "Accredited", value: "Accredited"}, {
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
        this.form.addChangeOne("course", this.onChangeCourse.bind(this));
        this.form.addChangeOne("trainer", this.onChangeHR.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeClient">
    onChangeClient(el, val) {
        execWhen(() => this.refs.sector_list).then(async ref => {
            if (val) {
                const {id, data} = val;

                const set = (data) => {
                    const {sector_list} = data;
                    if (sector_list) {
                        ref.list = sector_list.map(({sector: value}) => {//{id, sector}
                            return {value, label: value.name};
                        });
                    }
                };

                if(data) {
                    set(data);
                } else {
                    findByIdClient(id).then(val => {
                        if(val) {
                            const {id, data} = val;
                            set(data);
                        }
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
        execWhen(() => this.refs.job_category_list).then(async ref => {
            if (val) {
                const {id, data: {training_plan_list}} = val;
                const list = training_plan_list.filter(({job_position}) => !!job_position && job_position.job_category).map(({job_position}) => job_position.job_category).map(({job_category}) => ({
                    ...job_category,
                    id: convertIdToBigint(job_category.id)
                })).distinct();
                console.log('job_category_list', list.slice())
                ref.value = list;
            } else {
                ref.reset();
            }
        });
        execWhen(() => this.refs.job_position_list).then(async ref => {
            if (val) {
                const {id, data: {training_plan_list}} = val;
                const list = training_plan_list.filter(({job_position}) => !!job_position).map(({job_position}) => ({
                    ...job_position,
                    id: convertIdToBigint(job_position.id)
                })).distinct();
                console.log('job_position_list', list.slice())
                ref.value = list;
            } else {
                ref.reset();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeHR">
    onChangeHR(el, val) {
        execWhen(() => this.refs.trainer_job_position).then(trainer_job_position_ref => {
            if (val) {
                let {job_position} = val.data;
                job_position && trainer_job_position_ref.onChange({label: job_position.name, value: job_position});
            } else {
                trainer_job_position_ref.reset();
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
            if (!form.isValid('course')) {
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
        if (!form.isValid('course')) {
            infoDialog.open('Course is required');
            return;
        }

        const {
            //1
            client, project, site,
            //2
            course, training_plan,
            //3
            job_category_list, job_position_list, sector_list,
            //4
            status, date_range, cost,
            //5
            institution_conducting_training, trainer, trainer_job_position,
            //6
            requirement_legal,
            requirement,
            max_participants_per_course,
            training_standard,
            training_frequency,
            provider_requirement,
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
        ShouldUpdate.checkCourseOrModule(data, old_data, course, 'course');
        ShouldUpdate.checkTrainingPlanYear(data, old_data, training_plan, 'training_plan');

        //3
        ShouldUpdate.checkJobCategoryList(data, old_data, job_category_list, 'job_category_list');
        ShouldUpdate.checkJobPositionList(data, old_data, job_position_list, 'job_position_list');
        ShouldUpdate.checkSectorList(data, old_data, sector_list, 'sector_list');

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
        ShouldUpdate.checkEmployee(data, old_data, trainer, 'trainer');
        ShouldUpdate.checkJobPosition(data, old_data, trainer_job_position, 'trainer_job_position');

        //6
        ShouldUpdate.check(data, old_data, requirement_legal, 'requirement_legal');
        ShouldUpdate.check(data, old_data, requirement, 'requirement');
        ShouldUpdate.check(data, old_data, max_participants_per_course, 'max_participants_per_course');
        ShouldUpdate.check(data, old_data, training_standard, 'training_standard');
        ShouldUpdate.check(data, old_data, training_frequency, 'training_frequency');
        ShouldUpdate.check(data, old_data, provider_requirement, 'provider_requirement');

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
        updateTrainingMatrix({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            if(res) {
                onSaved && onSaved(res.data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            } else {
                infoDialog.open("Record unable to update. Please try again.");
            }
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
                    course, training_plan,
                    //3
                    job_category_list, job_position_list, sector_list,
                    //4
                    status, date_range, cost,
                    //5
                    institution_conducting_training, trainer, trainer_job_position,
                    //6
                    requirement_legal,
                    requirement,
                    max_participants_per_course,
                    training_standard,
                    training_frequency,
                    provider_requirement,
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

        const sector_listDefault = sector_list ? sector_list.map(v => {
            const {sector: value, sector: {id, name}} = v;
            return {label: name, value};
        }) : null;
        const job_position_listDefault = job_position_list ? job_position_list.map(v => {
            const {job_position: value, job_position: {id, name}} = v;
            return {label: name, value};
        }) : null;
        const job_category_listDefault = job_category_list ? job_category_list.map(v => {
            const {job_category: value, job_category: {id, name}} = v;
            return {label: name, value};
        }) : null;

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
                <SelectTrainingCourseInput name="course" placeholder="Course..."
                                           defaultValue={course} className="col-lg-12 form-control"
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
                <SelectJobCategoryInput name="job_category_list" type="select_multi" placeholder="Allocation / Job Category..."
                                        defaultValue={job_category_listDefault} className="col-lg-12 form-control"
                                        onChange={this.form.onChange} add={false}/>
                <SelectJobPositionInput name="job_position_list" type="select_multi" placeholder="Job Position For Training..."
                                        defaultValue={job_position_listDefault} className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                <SelectSectorInput ref="sector_list" name="sector_list" type="select_multi" placeholder="Sector(s)..."
                                   defaultValue={sector_listDefault} className="col-lg-12 form-control"
                                   onChange={this.form.onChange}/>
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
                <SelectUserInput name="trainer" placeholder="Training Conductor..." defaultValue={trainer} defaultUser
                                 showOtherPerson className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobPositionInput name="trainer_job_position" placeholder="Job Position..." defaultValue={trainer_job_position}
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
                <ClearableInput name="provider_requirement" type="radio"
                                defaultValue={provider_requirement} placeholder="Training Provider Requirement"
                                vertical className="col-lg-11 pull-left-0_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.provider_requirement}/>
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
