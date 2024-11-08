// <editor-fold defaultstate="collapsed" desc="imports">
import React, {createRef} from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen} from 'utils/Utils';
import TrainingPlanListByCourse from "components/FormListComponents/TrainingPlanListByCourse";

import {
    ClearableInput,
    DateRangeInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectJobCategoryInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSectorInput,
    SelectSiteInput,
    SelectTrainingCourseInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {onSelectLoadTrainingFrequencies} from '../../../../utils';

import style from "./NewTrainingMatrixDialog.lazy.css";
import insertTrainingMatrix from "mutations/all/TrainingMatrix/insertTrainingMatrix";
import {findByIdClient} from "mutations/findById";
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
            status: [
                {text: "Outstanding", value: "Outstanding", checked: false},
                {text: "Completed", value: "Completed", checked: false}
            ],
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

                if (data) {
                    set(data);
                } else {
                    findByIdClient(id).then(val => {
                        if (val) {
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
                infoDialog.open('Company is required');
                return;
            }
        }
        if (idx === 1) {
            if (!form.isValid('course')) {
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
        if (!form.isValid('course')) {
            infoDialog.open('Course is required');
            return;
        }
        //3
//        if (!form.isValid('job_position_list')) {
//            infoDialog.open('Job Position For Training is required');
//            return;
//        }
        //4
//        if (!form.isValid('status')) {
//            infoDialog.open('Training Status is required');
//            return;
//        }
        //5
//        if (!form.isValid('trainer')) {
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
//        if (!form.isValid('provider_requirement')) {
//            infoDialog.open('Training Provider Requirement is required');
//            return;
//        }

        const {
            //1
            client, project, site,
            //2
            course, training_plan,
            //3
            job_category_list,
            job_position_list,
            sector_list,
            //4
            status,
            date_range,
            cost,
            //5
            institution_conducting_training,
            trainer,
            trainer_job_position,
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
        const data = {
            //1
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //2
            course_id: course && course.id,
            // training_plan_list: {
            //     data: ((training_plan && training_plan.list) || []).map(({id}) => ({training_id: id}))
            // },
            //3
            job_category_list: {
                data: (job_category_list || []).map(({id}) => ({job_category_id: id}))
            },
            job_position_list: {
                data: (job_position_list || []).map(({id}) => ({job_position_id: id}))
            },
            sector_list: {
                data: (sector_list || []).map(({id}) => ({sector_id: id}))
            },
            //4
            status,
            date_range_start: date_range && Dates.formatDateSQL(date_range.start),
            date_range_end: date_range && Dates.formatDateSQL(date_range.end),
            cost,
            //5
            institution_conducting_training,
            trainer_id: trainer && trainer.id,
            trainer_external: (trainer && !trainer.id) ? {data: trainer} : null,
            trainer_job_position_id: trainer_job_position && trainer_job_position.id,
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
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertTrainingMatrix(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
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
                <SelectTrainingCourseInput name="course" placeholder="Course..."
                                           className="col-lg-12 form-control" onChange={this.form.onChange} add={false}
                                           returnValue/>
                <br/>
                <TrainingPlanListByCourse ref={this.trainingPlanListRef} name="training_plan"
                                          onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Sector & Job Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectJobCategoryInput ref="job_category_list" name="job_category_list" type="select_multi"
                                        placeholder="Allocation / Job Category..."
                                        className="col-lg-12 form-control" onChange={this.form.onChange} add={false}/>
                <SelectJobPositionInput ref="job_position_list" name="job_position_list" type="select_multi"
                                        placeholder="Job Position(s) For Training..." required
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSectorInput ref="sector_list" name="sector_list" type="select_multi" placeholder="Sector(s)..."
                                   required
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                <SelectEmployeeInput name="trainer" placeholder="Training Conductor..." showOtherPerson
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobPositionInput name="trainer_job_position" placeholder="Job Position..."
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
                <ClearableInput name="provider_requirement" type="radio"
                                placeholder="Training Provider Requirement" vertical
                                className="col-lg-11 pull-left-0_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.provider_requirement}/>
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
