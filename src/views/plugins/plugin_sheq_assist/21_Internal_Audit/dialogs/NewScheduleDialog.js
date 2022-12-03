// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';

import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectLoadFormsTemplateInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import {TemplateQuestions} from '../../../../../components/templates';

import style from "./NewScheduleDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewScheduleDialog";

    constructor(props) {
        super(props, style);
    }
    
    get title() {
        return "Schedule " + this.props.title;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            interval: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually'].map(value => {
                return {value, label: value}
            })
        },
        selectedTemplate: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);
        
        const {dialog} = props;
        
        const item = this.item;
        this.state.selectedTemplate = item;
        
        if(item) {
            dialog.setTitle("Schedule " + item.data.form.type);
        }
        
        this.form = new Form();
        this.form.addChangeOne("template", this.onChangeTemplate.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeTemplate(el, val) {
        if(val) {
            val = val.value || val;
            const {selectedTemplate} = this.state;
            if(!selectedTemplate || selectedTemplate.id !== val.id) {
//                console.log('selectedTemplate', val)
                this.state.selectedTemplate = {...toJS(val)};
            }
        } else {
            this.state.selectedTemplate = val;
        }
    }
    // </editor-fold>
 
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('person')) {
                infoDialog.open('Person Responsible is required');
                return;
            }
            if (!form.isValid('interval')) {
                infoDialog.open('Interval is required');
                return;
            }
            if (!form.isValid('start_date')) {
                infoDialog.open('Start Date is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('template')) {
                infoDialog.open('Template is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {templateQuestionsWrapper}} = this;
        
        const {isConsultant, isNoProjects} = storage.is;
            
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        
        if (!form.isValid('person')) {
            infoDialog.open('Person Responsible is required');
            return;
        }
        if (!form.isValid('interval')) {
            infoDialog.open('Interval is required');
            return;
        }
        if (!form.isValid('start_date')) {
            infoDialog.open('Start Date is required');
            return;
        }
        
        if (!form.isValid('template')) {
            infoDialog.open('Template is required');
            return;
        }
        
        const {questions} = templateQuestionsWrapper.refs;
        if (!questions.isValidForm()) {
            return;
        }

        progressDialog.open('Please wait...');
        const qForm = await questions.getForm();
        
        const {
            client, project, site, 
            person, interval, start_date,
            template
        } = form.data;
        const data = {
            employee_id: person.id, 
            interval, 
            start_date: start_date.getTime(),
            template_id: template.id,
            form: qForm//{name, desc, type, questions,title_page_list}
        };
        
        if(client) {
            const {id, data: _data, name} = client;
            data.client = {id, name: name || _data.name};
            data.client_id = id;
        }
        if(project) {
            const {id, data: _data, name} = project;
            data.project = {id, name: name || _data.name};
            data.project_id = id;
        }
        if(site) {
            const {id, data: _data, name} = site;
            data.site = {id, name: name || _data.name};
            data.site_id = id;
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if(res === 'RESPONSIBLE_PERSON_NOT_EXISTS') {
                infoDialog.open("Responsible Person does not exist in the system.");
                return;
            }
            if(res === 'RESPONSIBLE_PERSON_EMAIL_NOT_EXISTS') {
                infoDialog.open("Responsible Person does not have an email address.");
                return;
            }
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }
    
    // <editor-fold defaultstate="collapsed" desc="get path">
    get path() {
        const {selectedTemplate} = this.state;
        let path;
        if(selectedTemplate) {
            switch (selectedTemplate.data.form.type) {
                case 'Inspection':
                    path = 'inspection';
                    break;
                case 'Register':
                    path = 'register';
                    break;
            }
        }
        return `plugin_sheq_assist/21_Internal_Audit/${path}/schedules/`;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="get item">
    get item() {//template
        return this.props.state.item;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="get selectedTemplateDefault">
    get selectedTemplateDefault() {
        const {selectedTemplate} = this.state;
        return selectedTemplate;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover, props: {type}}
            },
            item,
            state
        } = this;
        type = item ? item.data.form.type : type;

        const {isConsultant, isNoProjects} = storage.is;
        
        return <FormControls>
            {!isNoProjects && <Row 
                rendered  
                active
                idx={0}
                title="Company / Project / Site"  
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row 
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Schedule Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <SelectEmployeeInput name="person" placeholder="Person Responsible..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="interval" type="select" placeholder="Interval..." className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.interval} returnValue/>
                <ClearableInput name="start_date" type="date" placeholder="Start Date..." className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered
                idx={2}
                title="2. Template Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectLoadFormsTemplateInput name="template" placeholder="Template" type={type} defaultValue={this.selectedTemplateDefault} className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <TemplateQuestionsWrapper 
                ref="templateQuestionsWrapper" 
                state={state} 
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                getDialogDOM={this.getDialogDOM} 
            />
        </FormControls>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="TemplateQuestionsWrapper">
@observer
class TemplateQuestionsWrapper extends React.Component {
    
    render() {
        const {state: {selectedTemplate}, getDialogDOM, onFormOpen, onFormBack} = this.props;
        if(!selectedTemplate) return null;
        console.log('TemplateQuestionsWrapper', selectedTemplate)
        const {data: {form}} = selectedTemplate;
        return <Row 
            rendered
            idx={3}
            title="3. Questionnaire Details" 
            onFormOpen={onFormOpen} 
            onFormBack={onFormBack}>
            <TemplateQuestions 
                ref="questions" 
                key={new Date().getTime()}
                getDialogDOM={getDialogDOM} 
                item={selectedTemplate} 
                formData={form}
            />
        </Row>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="questionHasChat">
function questionHasChat(ques) {
    return !(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list)));
}
// </editor-fold>

export default NewDialog;
