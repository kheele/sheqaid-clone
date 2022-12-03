import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';
import {
    ClearableInput,
    Clickable,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import RiskAssessmentItemTaskBasedTable from './RiskAssessmentItemTaskBasedTable';

import style from "./NewTaskBaseRiskAssessmentDialog.lazy.css";

@observer
class NewTaskBaseRiskAssessmentDialog extends ANewDialog {
    pageKey = "NewTaskBaseRiskAssessmentDialog";
    title = "Create Task Base Risk Assessment";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/09_HIRA_And_Opportunities/task-base/";

    @observable
    state = {
        lists: {
            risk_tolerance: [1, 2, 3, 4].map(value => {
                return {label: String(value), value}
            })
        }
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!isObject(form.get('client'))) {
                infoDialog.open('Company is required');
                return;
            }
            if (!form.isValid('activity')) {
                infoDialog.open('Description Of Task is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('list') || form.get('list').isEmpty()) {
                infoDialog.open('Assessed Items are required');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;
           
        if (!isObject(form.get('client'))) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('activity')) {
            infoDialog.open('Description Of Task is required');
            return;
        }
        if (!form.isValid('list') || form.get('list').isEmpty()) {
            infoDialog.open('Assessed Items are required');
            return;
        }
        
        const {
            activity, expiry_date, risk_tolerance, list,
            site, project, client
        } = form.data;
        const data = {
            activity, 
            list: toJS(list.map(oldVal => {
                const {responsible_person, target_date, due_date, risk_type, control_measure_list, control_measure_list_additional} = oldVal;
                const val = {};
                if(responsible_person && responsible_person.data) {
                    const {id, data: {fname, lname}} = responsible_person;
                    val.responsible_person = {id, fname, lname};
                }
                if(target_date && isDate(target_date)) {
                    val.target_date = target_date.getTime();
                }
                if(due_date && isDate(due_date)) {
                    val.due_date = due_date.getTime();
                }
                
                if(risk_type) {
                    val.risk_type = toJS(risk_type);
                }
                if(control_measure_list) {
                    val.control_measure_list = toJS(control_measure_list.map(v => toJS(v)));
                }
                if(control_measure_list_additional) {
                    val.control_measure_list_additional = toJS(control_measure_list_additional.map(oldVal => {
                        const {text, responsible_person, cost, date_completed} = oldVal;
                        const val = {};
                        if(responsible_person && responsible_person.data) {
                            const {id, data: {fname, lname}} = responsible_person;
                            val.responsible_person = {id, fname, lname};
                        }
                        if(date_completed && isDate(date_completed)) {
                            val.date_completed = date_completed.getTime();
                        }
                        return {...oldVal, ...val};
                    }));
                }
                return {...oldVal, ...val};
            }))
        };
        
        if(client) {
            if(client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if(project) {
            if(project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
            } else {
                data.project = project;
            }
        }
        if(site) {
            if(site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
            } else {
                data.site = site;
            }
        }  
        
        if(expiry_date) {
            data.expiry_date = expiry_date.getTime();
        }
        if(risk_tolerance) {
            data.risk_tolerance = parseInt(risk_tolerance);
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
    
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. General Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">  
                        <div className="flex"> 
                            <div className="margin-t-5 margin-r-20">
                                <label>Company / Project / Site</label>
                                <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <SelectProjectInput name="project" placeholder="Project..." required showAll className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <SelectSiteInput name="site" placeholder="Site..." required showAll className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                            </div>
                            <div className="margin-t-5 margin-l-20">
                                <label>Basic Details</label>
                                <ClearableInput name="activity" type="text" placeholder="Description Of Task" required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <ClearableInput name="expiry_date" type="date" placeholder="Revision Date..." required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <ClearableInput name="risk_tolerance" type="select" placeholder="Risk Tolerance" required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange} values={this.state.lists.risk_tolerance} add returnValue/>
                            </div>
                        </div>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-table">
                    <label>
                        2. Assessed Items
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <RiskAssessmentItemTaskBasedTable name="list" isNew onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default NewTaskBaseRiskAssessmentDialog;
