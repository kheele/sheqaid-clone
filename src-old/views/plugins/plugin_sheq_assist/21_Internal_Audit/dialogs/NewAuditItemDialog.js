import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {execWhen} from "../../../../../utils/Utils";
import {Button, ClearableInput, Clickable} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import {onSelectLoadAuditElements, onSelectLoadAuditSubElements} from '../../../utils';

import style from "./NewAuditItemDialog.lazy.css";

@observer
class NewAuditItemDialog extends ANewDialog {
    pageKey = "NewAuditItemDialog";
    title = "Add Audit Item";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }

    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>{this.state.item ? "Edit" : "Add"} Item
            </Button>
        </React.Fragment>;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
        lists: {
            elements: [],
            sub_elements: [],
            audit_summary: ['Major NCR', 'Minor NCR', 'Complaint', 'Observation', 'Good Practice', 'Note'],
            achieved_score: [0, 1, 2, 3, 4, 5]
        },
        loadedSelectLists: false,
        compliance: null
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeMany(["possible_score", "achieved_score"], this.onChangeScores.bind(this));
    }
    
    componentDidMount() {
        const loads = {elements: onSelectLoadAuditElements, sub_elements: onSelectLoadAuditSubElements};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k] = res.distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }
    
    onChangeScores(val, name) {
            execWhen(() => this.refs.possible_score && this.refs.achieved_score).then(() => {
                const {possible_score, achieved_score} = this.refs;
                let perc;
                const max = possible_score.value;
                val = achieved_score.value;
                if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
                    perc = ((parseInt(val) / max) * 100); 
                } else if (isNullable(val)) {
                    perc = null;
                }
                this.state.compliance = perc;
            });
    }

    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 2) {
            if (!form.isValid('audit_findings')) {
                infoDialog.open('Audit Findings is required');
                return;
            }
            if (!form.isValid('audit_summary')) {
                infoDialog.open('Audit Summary is required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('achieved_score')) {
                infoDialog.open('Achieved Score is required');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;
           
        if (!form.isValid('element')) {
            infoDialog.open('Element / Heading is required');
            return;
        }
        if (!form.isValid('sub_element')) {
            infoDialog.open('Sub-Element / Sub-Heading is required');
            return;
        }
        if (!form.isValid('audit_summary')) {
            infoDialog.open('Audit Summary is required');
            return;
        }
        if (!form.isValid('achieved_score')) {
            infoDialog.open('Achieved Score is required');
            return;
        }
        
        const {
            element, sub_element,
//            responsible_person, target_date, due_date,
            audit_findings, audit_summary,
            possible_score, achieved_score,
            comments
        } = form.data;
        const data = {
            element, sub_element,
            audit_findings, audit_summary,
            possible_score, achieved_score, compliance: this.state.compliance
        };
//        if(responsible_person) {
//            data.responsible_person = responsible_person;
//        }
//        if(target_date) {
//            data.target_date = target_date;
//        }
//        if(due_date) {
//            data.due_date = due_date;
//        }
        
        if(comments) {
            data.comments = comments;
        }
        console.log(data)
        
        onSaved(data);
        this.props.close();

//        const {
//            audit_findings: audit_findings_ref, 
//            audit_summary: audit_summary_ref, 
//            possible_score: possible_score_ref, 
//            achieved_score: achieved_score_ref, 
//            comments: comments_ref
//        } = this.refs;
//        audit_findings_ref.reset();
//        audit_summary_ref.reset();
//        possible_score_ref.reset();
//        achieved_score_ref.reset();
//        comments_ref.reset();
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, dialog} = this.props;
        const {item} = this;
        let responsible_personDefault = null;
        if(item && item.responsible_person) {
            const {id, fname, lname, data} = item.responsible_person;
            responsible_personDefault = {label: (lname || data.lname) + ' ' + (fname || data.fname), value: item.responsible_person};
        }
        
        let element = item && item.element || dialog.extraProp('element');
        let sub_element = item && item.sub_element || dialog.extraProp('sub_element');
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Element/Heading & Sub-Element/Sub-Heading
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <SelectWrapper state={this.state} name="element" placeholder="Element / Heading..." defaultValue={element} className="col-lg-10 pull-left-1 form-control" onChange={this.form.onChange} values="elements"/>
                        <SelectWrapper state={this.state} name="sub_element" placeholder="Sub-Element / Sub-Heading..." defaultValue={sub_element} className="col-lg-10 pull-left-1 form-control" onChange={this.form.onChange} values="sub_elements"/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Audit Findings & Summary
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput ref="audit_findings" name="audit_findings" type="textarea" placeholder="Audit Findings" defaultValue={item && item.audit_findings} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="audit_summary" name="audit_summary" type="select" placeholder="Audit Summary" defaultValue={item && item.audit_summary} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.audit_summary} returnValue/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        3. Score & Compliance
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput ref="possible_score" name="possible_score" type="number" placeholder="Possible Score" defaultValue={5} isEditable={false} className="col-lg-6 margin-b-10 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="achieved_score" name="achieved_score" type="number" placeholder="Achieved Score" min='0' max={5} defaultValue={item && item.achieved_score} required className="col-lg-6 margin-b-10 form-control" onChange={this.form.onChange}/>
                        <hr/>
                        <label className="hor-center">Compliance</label>
                        <Compliance state={this.state}/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        4. Comments / Root Cause
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput ref="comments" name="comments" type="textarea" placeholder="Comments / Root Cause" defaultValue={item && item.comments} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class Compliance extends React.Component {
    render() {
        const {onChange, state: {compliance}} = this.props;
        let color;
        if(isNumber(compliance)) {
            if(compliance < 25) {
                color = 'red';
            } else if(compliance < 50) {
                color = 'orange';
            } else if(compliance < 75) {
                color = 'yellow';
            } else if(compliance >= 75) {
                color = 'green';
            }
        } else {
            color = 'grey';
        }
        return <div key={Math.random()} className={"Compliance w-80 h-80 hor-center " + color}>{isNumber(compliance) ? (compliance + '%') : 'N/A'}</div>;
    }
}

@observer
class SelectWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, className, onChange, defaultValue, values} = this.props;
        if(!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue} required className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

export default NewAuditItemDialog;
