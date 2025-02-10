// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
	ClearableInput,
	RowOrgs,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput,
	SelectQuestionnaireTemplateInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import {AEditDialog} from 'components/dialogs';

import {TemplateQuestions} from 'components/templates';

import style from "./EditQuestionnaireDialog.lazy.css";
import {ShouldUpdate} from "utils/Utils";
import {updateJobObservationsQuestionnaire} from "mutations/update";
import Divider from "@mui/material/Divider";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditQuestionnaireDialog extends AEditDialog {
    pageKey = "EditQuestionnaireDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Questionnaire";
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/questionnaires/";

    @observable
    state = {
        lists: {
            interval: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually'].map(value => {
                return {value, label: value}
            })
        },
        selectedTemplate: null
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onFormSave = this.onFormSave.bind(this);

        this.getDialogDOM = this.getDialogDOM.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    get byLogged() {
        return sockets.of('structure-and-responsibility/job-appointments').fn('listTemplatesByLogged');
    }

    //</editor-fold>

    get selectedTemplate() {
        const {template} = this.item.data;
        return template;
    }

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
            refs: {questionsRef},
        } = this;

        const {idx} = btn.props;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateJobObservationsQuestionnaire({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }

            const {
                site, project, client,
            } = form.data;

            const data = {};

            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            const {
                job_position, employee,
            } = form.data;

            const data = {};

            ShouldUpdate.checkJobPosition(data, old_data, job_position, 'job_position');
            if (employee) {
                const {id, is_external, data: _data} = employee;
                if (is_external || _data && _data.is_external) {
                    ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_other');
                } else {
                    ShouldUpdate.checkEmployee(data, old_data, employee, 'employee');
                }
            }

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            const {
                responsible_person, responsible_department, interval, start_date, time,
            } = form.data;

            const data = {};

            ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');
            ShouldUpdate.checkDepartment(data, old_data, responsible_department, 'responsible_department');
            ShouldUpdate.check(data, old_data, interval, 'interval');
            ShouldUpdate.checkDate(data, old_data, start_date, 'start_date');
            ShouldUpdate.check(data, old_data, time, 'time');

            onSubmit(data);
            return;
        }

        if (idx === 3) {
            if (!questionsRef.isValidForm()) {
                return;
            }

            progressDialog.open('Please wait...');
            const qForm = await questionsRef.getForm();
            let {
                name,
                desc,
                type,
                title_page_list,
                question_list,
            } = qForm;

            question_list = [
                ...title_page_list.map(v => ({is_page_title: true, ...v})),
                ...question_list.map(v => ({is_page_title: false, ...v})),
            ];

            const data = {};

            //
            ShouldUpdate.check(data, old_data, name, 'name');
            ShouldUpdate.check(data, old_data, desc, 'desc');
            ShouldUpdate.checkListToJS(data, old_data, question_list, 'question_list');//TODO: save question_list independently on edit

            onSubmit(data);
            return;
        }

        return true;
    }

    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover}
            },
            byLogged,
            item, item: {
                id, data: {
                    created_at,
                    name,
                    desc,
                    status,
                    status_answered_by_sender,
                    answered_by = 'Sender',
                    is_template,
                    visibility,
                    page_title_list,
                    question_list,
                    //
                    template,
                    //
                    responsible_person,
                    responsible_department,
                    interval,
                    start_date,
                    time,
                    //
                    job_position,
                    employee,
                    employee_other,
                }
            }
        } = this;

        console.log(this.item)
        return <FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Basic Info"
                >
                    <SelectJobPositionInput
                        ref="job_position"
                        name="job_position" placeholder="Job Position..."
                        defaultValue={job_position}
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <SelectEmployeeInput
                        ref="employee"
                        name="employee" placeholder="Employee..."
                        defaultValue={employee || employee_other}
                        showOtherPerson
                        incContractors
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Responsible Person/Department & Schedule"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
                                     defaultValue={responsible_person} className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
                <SelectDepartmentInput name="responsible_department" placeholder="Responsible Department..."
                                       defaultValue={responsible_department} className="col-lg-12 form-control"
                                       onChange={this.form.onChange}/>

                <ClearableInput name="interval" type="select" placeholder="Interval..." defaultValue={interval}
                                className="col-lg-4 form-control" onChange={this.form.onChange}
                                values={this.state.lists.interval} returnValue/>
                <ClearableInput name="start_date" type="date" placeholder="Start Date..." defaultValue={start_date}
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="time" type="time" placeholder="Time..." defaultValue={time}
                                className="col-lg-4 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Job Observation Questionnaire"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <SelectQuestionnaireTemplateInput
                    name="template"
                    placeholder="Job Observation Questionnaire Template"
                    defaultValue={this.selectedTemplate}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    byLogged={byLogged}
                />
                <Divider/>
                <TemplateQuestions
                    ref="questions"
                    getDialogDOM={this.getDialogDOM}
                    isEditting
                    defaultType="Job Observations"
                    mainTitle="Job Observation Questionnaire"
                    defaultDocTitle="Untitled Questionnaire"
                    item={this.item}
                    SelectEmployeesDialog={SelectEmployeesDialog}
                />
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default EditQuestionnaireDialog;
