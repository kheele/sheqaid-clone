// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {execWhen, ShouldUpdate} from 'utils/Utils';
import {onSelectLoadTrainingFrequencies} from '../../../../utils';

import {
    ClearableInput,
    DateRangeInput,
    SelectClientInput,
    SelectJobCategoryInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectToolboxTalkSubjectInput, SelectToolboxTalkSubjectCategoryInput,
    SelectUserInput, UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditToolboxTalkDialog.lazy.css";
import {NewEmployeeListTable} from "components/FormTableComponents";
import {SelectTable} from "components/tables";
import findByIdTrainingToolboxTalk from "mutations/all/TrainingToolboxTalk/findByIdTrainingToolboxTalk";
import updateTrainingToolboxTalk from "mutations/all/TrainingToolboxTalk/updateTrainingToolboxTalk";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditToolboxTalkDialog extends AEditDialog {
    pageKey = "EditToolboxTalkDialog";
    title = "Edit Toolbox Talk / Training Meeting";
    findById = findByIdTrainingToolboxTalk;
    removeById = updateTrainingToolboxTalk;

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
    path = "plugin_sheq_assist/05_Trainings/toolbox-talks/";

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

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("hr", this.onChangeHR.bind(this));
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

    // <editor-fold defaultstate="collapsed" desc="onChangeCourse">
    onChangeSubject(el, val) {
        execWhen(() => this.refs.attendance_register_list).then(attendance_register_list => {
            if (val) {
                console.log('onChangeSubject', val)
                workers.emit('plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/list/search_by_name', val).then(list => {
                    // attendance_register_list.list = list[0].data;
                });

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

        const {
            //0
            client, project, site,
            //1
            training_frequency, subject_category,
            date, time_from, time_to,//list
            //2
            institution_conducting_training,//list
            hr,//list
            job_desc,
            //3
            doc,//list
            //4
            attendance_register_doc,//list
            attendance_register_list,//list
        } = form.data;
        const data = {};

        //0
        ShouldUpdate.checkClient(data, old_data, client, 'client');
        ShouldUpdate.checkProject(data, old_data, project, 'project');
        ShouldUpdate.checkSite(data, old_data, site, 'site');

        //1
        ShouldUpdate.check(data, old_data, training_frequency, 'training_frequency');
        ShouldUpdate.check(data, old_data, subject_category, 'subject_category');
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.check(data, old_data, time_from, 'time_from');
        ShouldUpdate.check(data, old_data, time_to, 'time_to');

        //2
        ShouldUpdate.check(data, old_data, institution_conducting_training, 'institution_conducting_training');
        ShouldUpdate.checkEmployee_deprecated(data, old_data, hr, 'hr');
        ShouldUpdate.checkJobPosition_deprecated(data, old_data, job_desc, 'job_desc');

        //3
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        //4
        ShouldUpdate.checkFile(data, old_data, attendance_register_doc, 'attendance_register_doc');
        ShouldUpdate.checkListToJS(data, old_data, attendance_register_list, 'attendance_register_list');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "update", this.item.id, data).then(res => {
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
    
    @computed get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }
        
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    //0
                    client, project, site,
                    //1
                    training_frequency, subject_category,
                    date, time_from, time_to,//list
                    //2
                    institution_conducting_training,//list
                    hr,//list
                    job_desc,
                    //3
                    doc,//list
                    //4
                    attendance_register_doc,//list
                    attendance_register_list,//list
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
                title="1. Subject Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <SelectWrapper state={this.state} name="training_frequency" placeholder="Training Frequency..."
                               defaultValue={training_frequency}
                               className="col-lg-6 form-control" onChange={this.form.onChange}
                               values="training_frequency"/>
                <SelectToolboxTalkSubjectCategoryInput name="subject_category" placeholder="Subject Category..."
                                                       defaultValue={subject_category}
                                                       className="col-lg-6 form-control"
                                                       onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                activeAlways
                idx={2}
                title="2. Toolbox Talk / Training Meeting"
            >
                <FormControls>
                    <Row
                        rendered
                        idx={2.1}
                        title="2.1. Date & Time"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-12 form-control"
                                        defaultValue={date} onChange={this.form.onChange}/>
                        <div
                            className="
                            flex col-lg-12 bg-eee margin-t-10 margin-b-5 border-radius-20
                            padding-t-20 padding-b-10 padding-l-10 padding-r-10
                            ">
                            <ClearableInput name="time_from" type="time" placeholder="Time From..."
                                            defaultValue={time_from} className="border-radius-0 border-radius-l-20 form-control"
                                            onChange={this.form.onChange}/>
                            <ClearableInput name="time_to" type="time" placeholder="Time To..."
                                            defaultValue={time_to} className="border-radius-0 border-radius-r-20 form-control"
                                            onChange={this.form.onChange}/>
                        </div>
                    </Row>
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2. Person / Institution Conducting Training"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ClearableInput name="institution_conducting_training" type="text"
                                        placeholder="Institution Conducting Training"
                                        defaultValue={institution_conducting_training}
                                        className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                        <SelectUserInput name="hr" placeholder="Training Conductor..."
                                         defaultUser showOtherPerson
                                         defaultValue={hr}
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_desc" placeholder="Job Position..."
                                                desc="Job Position For Training Conductor"
                                                defaultValue={job_desc}
                                                className="col-lg-12 form-control"
                                                onChange={this.form.onChange} add/>
                    </Row>
                    <Row
                        rendered
                        idx={2.3}
                        title="2.3. Attach Toolbox Talk / Training Meeting Document"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <UploadButton
                            name="doc"
                            buttonTitle="Document (PDF, Word)"
                            type={['Word', 'PDF', 'Image']}
                            showOnlyIcon
                            defaultValue={doc}
                            className="col-lg-6 hor-center"
                            onChange={this.form.onChange}
                        />
                    </Row>
                    <Row
                        rendered
                        idx={2.4}
                        title="2.4. Attendance Register"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <FormControls>
                            <Row
                                rendered
                                activeAlways
                                idx={2.41}
                                title="2.4.1 Attach Attendance Register File"
                            >
                                <UploadButton
                                    name="attendance_register_doc"
                                    buttonTitle="Document (PDF, Word)"
                                    type={['Word', 'PDF', 'Image']}
                                    showOnlyIcon
                                    defaultValue={attendance_register_doc}
                                    className="col-lg-6 hor-center"
                                    onChange={this.form.onChange}
                                />
                            </Row>
                            <Row
                                rendered
                                activeAlways
                                idx={2.42}
                                title="2.4.2 Add Employee Attendance List"
                            >
                                <NewEmployeeListTable ref="attendance_register_list" name="attendance_register_list"
                                                      defaultValue={[...(attendance_register_list || []), null]}
                                                      onChange={this.form.onChange}/>
                            </Row>
                        </FormControls>
                    </Row>
                </FormControls>
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

export default EditToolboxTalkDialog;
