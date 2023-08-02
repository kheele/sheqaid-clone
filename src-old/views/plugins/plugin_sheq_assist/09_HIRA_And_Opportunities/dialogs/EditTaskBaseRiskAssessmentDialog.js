import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../../utils/Form';

import {ShouldUpdate} from "../../../../../utils/Utils";
import {
    ClearableInput,
    Clickable,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import RiskAssessmentItemTaskBasedTable from './RiskAssessmentItemTaskBasedTable';

import style from "./EditTaskBaseRiskAssessmentDialog.lazy.css";

@observer
class EditTaskBaseRiskAssessmentDialog extends AEditDialog {
    pageKey = "EditTaskBaseRiskAssessmentDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Task Base Risk Assessment";
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
        const {form, item: {data: old_data}} = this;
           
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
        
        const data = {};
        
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        ShouldUpdate.check(data, old_data, activity, 'activity');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.check(data, old_data, risk_tolerance, 'risk_tolerance');
        
        if(list) {
            data.list = toJS(list.map(oldVal => {
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
            }));
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    activity, expiry_date, risk_tolerance, list
                }
            }
        } = this;
        risk_tolerance = isNumber(risk_tolerance) ? {label: String(risk_tolerance), value: risk_tolerance} : null;
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
                                <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required showAll className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required showAll className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                            </div>
                            <div className="margin-t-5 margin-l-20">
                                <label>Basic Details</label>
                                <ClearableInput name="activity" type="text" placeholder="Description Of Task" defaultValue={activity} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <ClearableInput name="expiry_date" type="date" placeholder="Revision Date..." defaultValue={expiry_date} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                                <ClearableInput name="risk_tolerance" type="select" placeholder="Risk Tolerance" defaultValue={risk_tolerance} required className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange} values={this.state.lists.risk_tolerance} add returnValue/>
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
                        <RiskAssessmentItemTaskBasedTable name="list" defaultValue={list} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

export default EditTaskBaseRiskAssessmentDialog;
