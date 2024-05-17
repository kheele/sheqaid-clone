// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {
ClearableInput,
        ProfileField,
        SelectEmployeeInput,
        SelectQuestionnaireTemplateInput,
        SelectUserInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewQuestionnaireDialog.lazy.css";
import insertSafetyFilesQuestionnaire
        from "mutations/all/Questionnaires/SafetyFilesQuestionnaires/insertSafetyFilesQuestionnaire";
import {Dates} from "utils/Dates";
import {execWhen} from "utils/Utils";
import Divider from "@mui/material/Divider";
import findByIdSafetyFilesQuestionnaireTemplate
        from "mutations/all/Questionnaires/SafetyFilesQuestionnaireTemplate/findByIdSafetyFilesQuestionnaireTemplate";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewQuestionnaireDialog extends ANewDialog {
    pageKey = "NewQuestionnaireDialog";
    title = "Create Safety File Questionnaire";

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
    path = "plugin_sheq_assist/contractors/questionnaires/";

    @observable
    state = {
        lists: {
            answered_by: [
                {text: 'Sender', value: 'Sender', checked: false},
                {text: 'Recipient', value: 'Recipient', checked: false}
            ]
        },
        selectedTemplate: null,
        answered_by: null,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);
        this.getDialogDOM = this.getDialogDOM.bind(this);

        this.loadTemplate = this.loadTemplate.bind(this);

        this.form = new Form();
        this.form.addChangeOne("answered_by", this.onChangeAnsweredBy.bind(this));
        this.form.addChangeOne("template", this.onChangeTemplate.bind(this));
    }

    // </editor-fold>

    async componentWillMount() {
        const {dialog} = this.props;

        const template = dialog.extraProp('template');
        if (template) {
            await this.loadTemplate(template);
            this.state.answered_by = this.state.selectedTemplate.data.answered_by;
        }
    }

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    async onChangeAnsweredBy(el, val) {
        this.state.answered_by = val;
    }

    async onChangeTemplate(el, val) {
        if (val) {
            const {selectedTemplate} = this.state;
            if (!selectedTemplate || selectedTemplate.id !== val.id) {
                await this.loadTemplate(val);
            }
        } else {
            // ref.item = this.state.selectedTemplate = val;
        }
    }

    // </editor-fold>

    async loadTemplate(val) {
        progressDialog.open();
        this.props.dialog.execWhen(() => this.refs.questions).then(async ref => {
            try {
                val = await findByIdSafetyFilesQuestionnaireTemplate(val.id);

                if (val) {
                    ref.item = this.state.selectedTemplate = val;
                } else {
                    infoDialog.open("Could not load the template. Please check your internet connection and try again.");
                }
            } catch (err) {
                console.error('loadTemplate', err);
            } finally {
                progressDialog.close();
            }
        });
    }

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
            // if (!form.isValid('asset_type')) {
            // 	infoDialog.open('Asset Type is required');
            // 	return;
            // }
        }
        if (idx === 3) {
            if (!questions.isValidForm()) {
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {questions: questionsRef}} = this;
        const {isConsultant} = storage.is;
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        if (!form.isValid('asset_type') && !form.isValid('asset')) {
            infoDialog.open('Asset Type / Asset must be selected');
            return;
        }

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

        const {
            client,
            project,
            site,
            //
            asset_type,
            asset,
            //
            responsible_person_list,
            responsible_person_other_list,
            responsible_user,
            due_date,
            //
            template,
        } = form.data;
        const data = {
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //
            asset_type,
            asset_id: asset && asset.id,
            //
            responsible_person_list: {
                data: [
                    ...(responsible_person_list || []).map(({id: employee_id, is_external, ...attrs}) => ({employee_id})),
                ],
            },
            responsible_person_other_list: {
                data: [
                    ...(responsible_person_other_list || []).map(({id: employee_other_id, ...attrs}) => {
                        if (employee_other_id) {
                            return {employee_other_id};
                        }
                        const data = {...attrs};
                        // delete data.is_external;
                        return {employee_other: {data}};
                    }),
                ],
            },
            responsible_user_id: responsible_user && responsible_user.id,
            due_date: due_date && Dates.formatDateSQL(due_date),
            //
            template_id: template && template.id,
            //
            name,
            desc,
            question_list: {data: question_list},
        };

        console.log(data)

        btn.text("Saving...").disabled();
        insertSafetyFilesQuestionnaire(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            progressDialog.close();
            btn.text("Save").enabled();
        });
    }

    // </editor-fold>

    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }

    get defaultTitlePageQuestions() {
        return [{questionText: "Completed By", questionType: "Short Answer"}];
    }

    get loggedContractor() {
        return storage.loggedContractor;
    }

    @computed
    get selectedTemplate() {
        const {selectedTemplate} = this.state;
        return selectedTemplate || this.props.state.item;
    }

    //Ray: Accounting & HR, (Ed, Love, Dave, And), Anel: Sales Manager, Charlemagne: , IT Manager
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {selectedTemplate: item, props: {onFormNext, onFormBack, onFormOpen}} = this;

        // const {data: {name: contractorName, username}} = this.loggedContractor;

        return <FormControls>
            <Row 
                rendered 
                active
                idx={1}
                title="1. Basic Details" 
                onFormOpen={onFormOpen} 
                onFormNext={!!this.state.answered_by && onFormNext}
                >
                <ClearableInput name="answered_by" type="radio" placeholder="Should Be Answered By" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.answered_by} returnValue/>
        
                <ClearableInput name="due_date" type="date" placeholder="Due Date..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            {this.state.answered_by === "Recipient" && <Row
                rendered
                idx={2}
                title="2. Recipient Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                >
                <ClearableInput 
                    name="company_name" 
                    placeholder="Company Name" 
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    />
                <ClearableInput 
                    name="company_email" 
                    placeholder="Email Address" 
                    className="col-lg-6 form-control"
                    onChange={this.form.onChange}
                    />
                <ClearableInput 
                    name="company_phone" 
                    placeholder="Phone Number" 
                    className="col-lg-6 form-control"
                    onChange={this.form.onChange}
                    />
            </Row>}
            {this.state.answered_by === "Sender" && <Row
                rendered
                idx={2}
                title="2. Responsible Persons"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                >
                <SelectEmployeeInput 
                    name="responsible_person_list" 
                    type="select_multi"
                    placeholder="Responsible Employee(s)..."
                    className="col-lg-12 form-control" 
                    onChange={this.form.onChange}
                    />
                <SelectEmployeeInput 
                    name="responsible_person_other_list" 
                    type="select_multi"
                    placeholder="Responsible External Person(s)..."
                    className="col-lg-12 form-control" 
                    onChange={this.form.onChange}
                    showOtherPersonsOnly
                    />
                <SelectUserInput 
                    name="responsible_user" 
                    placeholder="Responsible User..."
                    className="col-lg-12 form-control" 
                    onChange={this.form.onChange}
                    />
            </Row>}
            {!!this.state.answered_by && <Row
                rendered
                idx={3}
                title="3. Safety File Questionnaire"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                >
                <SelectQuestionnaireTemplateInput
                    name="template"
                    placeholder="Safety File Questionnaire Template"
                    defaultValue={this.selectedTemplate}
                    className="col-lg-12 w-900 margin-t-20 margin-b-15 hor-center form-control"
                    onChange={this.form.onChange}
                    byLogged={byLogged}
                    />
                <Divider sx={{mb: "20px"}}/>
                <TemplateQuestions
                    ref="questions"
                    getDialogDOM={this.getDialogDOM}
                    defaultType="Safety File Questions"
                    mainTitle="Safety File Questionnaire"
                    defaultDocTitle="Untitled Questionnaire"
                    defaultTitlePageQuestions={this.defaultTitlePageQuestions}
                    item={item}
                    SelectEmployeesDialog={SelectEmployeesDialog}
                    />
            </Row>}
        </FormControls>;
    }

    // </editor-fold>
}

const byLogged = sockets.of('safety-files').fn('listTemplatesByLogged');

export default NewQuestionnaireDialog;
