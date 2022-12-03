// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen} from '../../../../../utils/Utils';
import {onSelectLoadTrainingFrequencies} from '../../../utils';

import {
    Button,
    ClearableInput,
    DateRangeInput,
    SelectClientInput,
    SelectJobCategoryInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectToolboxTalkCourseInput, SelectToolboxTalkSubjectCategoryInput,
    SelectUserInput, UploadButton
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import style from "./NewToolboxTalkDialog.lazy.css";
import Divider from "@mui/material/Divider";
import {SelectTable, THead} from "../../../../../components/tables";
import {NewEmployeeListTable} from "../../../../../components/FormTableComponents";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewToolboxTalkDialog extends ANewDialog {
    pageKey = "ToolboxTalk";
    title = "Create Toolbox Talk / Training Meeting";

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
            training_frequency: ['Non-Expiry', '5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
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
        this.form.addChangeOne("employee_list", this.onChangeEmployeeList.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeHR">
    onChangeHR(el, val) {
        execWhen(() => this.refs.job_desc).then(job_desc_ref => {
            if (val) {
                if (val.data) {
                    let {optional_info} = val.data;
                    if (optional_info) {
                        const {job_position} = optional_info;
                        job_position && job_desc_ref.onChange({label: job_position.name, value: job_position});
                    }
                } else if (val.job_position) {
                    const {job_position} = val;
                    job_position && job_desc_ref.onChange({label: job_position.name, value: job_position});
                }
            } else {
                job_desc_ref.reset();
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeEmployeeList">
    onChangeEmployeeList(el, val) {
        execWhen(() => this.refs.selectEmployeeTable).then(selectEmployeeTable => {
            if (val) {
                console.log('onChangeEmployeeList', val)
                selectEmployeeTable.list = val;
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
            //0
            client, project, site,
            //1
            course_or_module,
            training_frequency, subject_category, date, time_from, time_to,
            //2
            institution_conducting_training,
            hr,
            job_desc,
            //3
            doc,
            //4
            attendance_register_doc,
            employee_list,
            attendance_register_list,
        } = form.data;
        const data = {};

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
        if (training_frequency) {
            data.training_frequency = training_frequency;
        }
        if (subject_category) {
            data.subject_category = subject_category;
        }
        if (date) {
            data.date = date.getTime();
        }
        if (time_from) {
            data.time_from = time_from;
        }
        if (time_to) {
            data.time_to = time_to;
        }

        //2
        if (institution_conducting_training) {
            data.institution_conducting_training = institution_conducting_training;
        }
        if (hr) {
            const {id = null, data: _data, fname, lname, job_position} = hr;
            const _job_position = job_position || _data.job_position;
            data.hr = {
                id,
                fname: fname || _data.fname,
                lname: lname || _data.lname,
                job_position: _job_position ? (_job_position.name || _job_position.data.name) : null
            };
        }
        if (job_desc) {
            if (isString(job_desc)) {
                data.job_desc = job_desc;
            } else {
                const {id, data: {name}} = job_desc;
                data.job_desc = {id, name};
            }
        }

        //3
        if (doc) {
            data.doc = doc.path;
        }

        //4
        if (attendance_register_doc) {
            data.attendance_register_doc = attendance_register_doc.path;
        }
        if(attendance_register_list) {
            data.attendance_register_list = attendance_register_list.
            map(({employee, employee: {id, data: {fname, lname, email, phone, id_num, passport_num}}}) => ({
                id, fname, lname, email, phone, id_num, passport_num
            }));
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
        const {loggedClientName} = storage.selected;
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
                <SelectToolboxTalkCourseInput name="course_or_module" placeholder="Course..."
                                              className="col-lg-12 form-control" onChange={this.form.onChange}
                                              add={false} returnValue/>
                <SelectWrapper state={this.state} name="training_frequency" placeholder="Training Frequency..."
                               className="col-lg-8 pull-left-2 form-control" onChange={this.form.onChange}
                               values="training_frequency"/>
                <SelectToolboxTalkSubjectCategoryInput name="subject_category" placeholder="Subject Category..."
                                                       className="col-lg-12 form-control"
                                                       onChange={this.form.onChange}/>
                <ClearableInput name="date" type="date" placeholder="Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <div
                    className="flex col-lg-12 bg-eee margin-t-10 margin-b-5 border-radius-20 padding-t-20 padding-b-10 padding-l-10 padding-r-10">
                    <ClearableInput name="time_from" type="time" placeholder="Time From..."
                                    className="border-radius-0 border-radius-l-20 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="time_to" type="time" placeholder="Time To..."
                                    className="border-radius-0 border-radius-r-20 form-control"
                                    onChange={this.form.onChange}/>
                </div>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Person / Institution Conducting Training"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="institution_conducting_training" type="text"
                                placeholder="Institution Conducting Training" defaultValue={loggedClientName}
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <SelectUserInput name="hr" placeholder="Training Conductor..." defaultUser showOtherPerson
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectJobPositionInput name="job_desc" placeholder="Job Position..."
                                        desc="Job Position For Training Conductor" className="col-lg-12 form-control"
                                        onChange={this.form.onChange} add/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Attach Toolbox Talk / Training Meeting Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Document (PDF, Word)"
                    type={['Word', 'PDF', 'Image']}
                    showOnlyIcon
                    className="col-lg-6 hor-center"
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Attendance Register"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        activeAlways
                        idx={4.1}
                        title="4.1 Attach Attendance Register File"
                    >
                        <UploadButton
                            name="attendance_register_doc"
                            buttonTitle="Document (PDF, Word)"
                            type={['Word', 'PDF', 'Image']}
                            showOnlyIcon
                            className="col-lg-6 hor-center"
                            onChange={this.form.onChange}
                        />
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={4.2}
                        title="4.2 Add Employee Attendance List"
                    >
                        <NewEmployeeListTable ref="employee_list" name="employee_list" onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={4.3}
                        title="4.3 Attendance Register List"
                    >
                        <SelectTable ref="selectEmployeeTable"
                                     replaceCols name="attendance_register_list"
                                     desc="Employees" title="Selected Employee(s)"
                                     className="col-lg-12 no-padding min-h-400 SelectEmployeeTable"
                                     renderTHead={renderTHeadEmployees}
                                     renderItem={renderItemEmployees}
                                     isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
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
        const {state, name, placeholder, className, onChange, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} className={className}
                               onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderTHeadEmployees">
function renderTHeadEmployees() {
    return <THead>
        <div className="td fixed-flex min-w-30">#</div>
        <div className="td">Name</div>
        <div className="td fixed-flex min-w-150">ID/Passport No.</div>
        <div className="td">Job Position</div>
        <div className="td">Site</div>
        <div className="td fixed-flex min-w-90">Signature</div>
        <div className="td fixed-flex no-padding min-w-70"></div>
    </THead>;
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderItemEmployees">
function renderItemEmployees(item, n) {
    const {id, data, employee} = item;
    const {
        fname,
        lname,
        id_num,
        passport_num,
        job_position,
        client,
        project,
        site
    } = (employee ? employee.data : employee) || data || item;
    console.log('renderItemEmployees: item', item)
    return <React.Fragment key={id_num || passport_num} className="tr-readonly">
        <div className="td fixed-flex min-w-30">{n + 1}</div>
        <div className="td">{fname + ' ' + lname}</div>
        <div className="td fixed-flex min-w-150">{id_num || passport_num}</div>
        <div className="td">{job_position ? job_position.name : 'N/A'}</div>
        <div className="td"></div>
        <div className="td fixed-flex min-w-90"></div>
    </React.Fragment>;
}

// </editor-fold>

export default NewToolboxTalkDialog;
