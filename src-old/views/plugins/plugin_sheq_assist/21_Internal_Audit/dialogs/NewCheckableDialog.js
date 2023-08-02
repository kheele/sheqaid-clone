// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';

import {
    Clickable,
    SelectAssetInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectLoadFormsTemplateInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import SelectEmployeesDialog from '../../../../../components/templates/SelectEmployeesDialog';
import {NavButtons} from '../../../../../components/FormComponents';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import {AnswerQuestions} from '../../../../../components/checkables';

import style from "./NewCheckableDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewCheckableDialog extends ANewDialog {
    pageKey = "NewCheckableDialog";

    constructor(props) {
        super(props, style);
    }
    
    get title() {
        return this.props.title;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    @observable
    state = {
        selectedTemplate: null
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        const {dialog} = props;
        
        const item = this.item;
        this.state.selectedTemplate = item;
        
        if(item) {
            dialog.setTitle("Create " + item.data.form.type);
        }
        
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("template", this.onChangeTemplate.bind(this));
    }
    // </editor-fold>

    onChangeTemplate(el, val) {
        this.state.selectedTemplate = val;
    }
    
    // <editor-fold defaultstate="collapsed" desc="onChangeAnswer">
    onChangeAnswer(parentId, ques, idx) {
        return new Promise((resolve, reject) => {
            const {item} = this;
            if(!item) {
                resolve();
                return;
            }
            if(this.toOnChangeAnswer) {
                resolve();
            } else {
                this.toOnChangeAnswer = setTimeout(() => {
                    clearTimeout(this.toOnChangeAnswer);
                    this.toOnChangeAnswer = null;
                    ques = toJS(ques);

                    if(!questionHasChat(ques)) {
                        ques.message_list = [];
                    }

                    console.log('ques', ques.message_list)
            //        btn.text("Saving...").disabled();
//                    neonBinding.events.emit(this.path + "answer/ques", item.id, {parentId, ques, idx}).then(res => {            
//                        resolve(res);
//                    }).catch(reject);
                }, 2000);
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {questions}} = this;
        
        if (!form.isValid('template')) {
            infoDialog.open('Template is required');
            return;
        }
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('project')) {
            infoDialog.open('Project is required');
            return;
        }
        if (!form.isValid('site')) {
            infoDialog.open('Site is required');
            return;
        }

        progressDialog.open('Please wait...');
        const template = await questions.getForm();
        
        const {client, project, site} = form.data;
        const data = {
            template//{name, desc, type, questions,title_page_list}
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
    
    // <editor-fold defaultstate="collapsed" desc="path">
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
        return "plugin_sheq_assist/21_Internal_Audit/" + path;
    }
    // </editor-fold>

    get item() {//template
        return this.props.state.item;
    }
    
    get selectedTemplateDefault() {
        const {selectedTemplate: value} = this.state;
        if(value) {
            const {data: {form: {name: label}}} = value;
            return {label, value};
        }
        return null;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {selectedTemplate} = this.state;
        console.log('template', selectedTemplate)
        
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {props: {type}}
            },
            item
        } = this;
        type = item ? item.data.form.type : type;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Company / Project / Site Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">    
                        <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Template Details
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">    
                        <SelectLoadFormsTemplateInput name="template" placeholder="Template" type={type} defaultValue={this.selectedTemplateDefault} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                {selectedTemplate && <div className="row">
                    <label>
                        3. Questionnaire Details
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group padding-r-10">  
                        <AnswerQuestions 
                            ref="questions" 
                            item={selectedTemplate} 
                            SelectEmployeesDialog={SelectEmployeesDialog} 
                            SelectEmployeeInput={SelectEmployeeInput}
                            SelectAssetInput={SelectAssetInput}
                            onChange={this.onChangeAnswer}
                        />
                    </div>
                    <NavButtons idx={3} onBack={onFormBack}/>
                </div>}
            </div>
        </div>);
    }
    // </editor-fold>
}

function questionHasChat(ques) {
    return !(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list)));
}

export default NewCheckableDialog;
