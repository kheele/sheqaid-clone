import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from 'views/plugins/utils';

import {execWhen} from "utils/Utils";
import {Button, ClearableInput, Clickable, SelectEmployeeInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {NavButtons, RiskRating} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewRiskAssessmentItemDialog.lazy.css";

@observer
class NewRiskAssessmentItemTaskBasedDialog extends ANewDialog {
    pageKey = "NewRiskAssessmentItemDialog";
    title = "Add Task Based Risk Assessment Item";

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
            risk_type: ["Safety", "Health", "Environmental", "Quality", "Financial"].map(text => text + " Risk").map(text => {
                return {text, value: text, checked: false};
            }),
            consequence_1: getRiskRatingConsequenceList(),
            consequence_2: getRiskRatingConsequenceList(),
            likelihood_1: getRiskRatingLikelihoodList(),
            likelihood_2: getRiskRatingLikelihoodList()
        },
        riskRatingSelected_1: {
            consequence: null,
            likelihood: null
        },
        riskRatingSelected_2: {
            consequence: null,
            likelihood: null
        }
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeMany(["consequence_1", "consequence_2"], this.onChangeConsequence.bind(this));
        this.form.addChangeMany(["likelihood_1", "likelihood_2"], this.onChangeLikelihood.bind(this));
        this.form.addChangeMany(["risk_rating_1", "risk_rating_2"], this.onChangeRiskRating.bind(this));
    }

    onChangeConsequence(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['likelihood_' + num] || this.refs['risk_rating_' + num]).then(() => {
                const {
                    ['likelihood_' + num]: likelihood_ref, 
                    ['risk_rating_' + num]: risk_rating_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.consequence = val;
                if(likelihood_ref.hasValue) {
                    riskRatingSelected.likelihood = likelihood_ref.value;
                }
            });
        }
    }
    
    onChangeLikelihood(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['consequence_' + num] || this.refs['risk_rating_' + num]).then(() => {
                const {
                    ['consequence_' + num]: consequence_ref, 
                    ['risk_rating_' + num]: risk_rating_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.likelihood = val;
                if(consequence_ref.hasValue) {
                    riskRatingSelected.consequence = consequence_ref.value;
                }
            });
        }
    }
    
    onChangeRiskRating(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['consequence_' + num] || this.refs['likelihood_' + num]).then(() => {
                const {
                    ['consequence_' + num]: consequence_ref, 
                    ['likelihood_' + num]: likelihood_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.consequence = val.consequence;
                riskRatingSelected.likelihood = val.likelihood;

                const {
                    ['consequence_' + num]: consequence_list, 
                    ['likelihood_' + num]: likelihood_list
                } = this.state.lists;

                const consequence = consequence_list.find(item => item.value === val.consequence);
                const likelihood = likelihood_list.find(item => item.value === val.likelihood);

                consequence && consequence_ref.onChange(consequence);
                likelihood && likelihood_ref.onChange(likelihood);
            });
        }
    }
    
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 2) {
            if (!form.isValid('task_step')) {
                infoDialog.open('Basic Task Step is required');
                return;
            }
            if (!form.isValid('hazard')) {
                infoDialog.open('Hazard / Potential Hazard is required');
                return;
            }
            if (!form.isValid('risk')) {
                infoDialog.open('Risk / Potential Risk is required');
                return;
            }
            if (!form.isValid('risk_type')) {
                infoDialog.open('Risk Type(s) is/are required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('consequence_1')) {
                infoDialog.open('Consequence / Severity is required');
                return;
            }
            if (!form.isValid('likelihood_1')) {
                infoDialog.open('Likelihood / Probability is required');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;
           
        if (!form.isValid('task_step')) {
            infoDialog.open('Basic Task Step is required');
            return;
        }
        if (!form.isValid('hazard')) {
            infoDialog.open('Hazard / Potential Hazard is required');
            return;
        }
        if (!form.isValid('risk')) {
            infoDialog.open('Risk / Potential Risk is required');
            return;
        }
        if (!form.isValid('risk_type')) {
            infoDialog.open('Risk Type(s) is/are required');
            return;
        }
        
        if (!form.isValid('consequence_1')) {
            infoDialog.open('Consequence / Severity is required');
            return;
        }
        if (!form.isValid('likelihood_1')) {
            infoDialog.open('Likelihood / Probability is required');
            return;
        }
        
        const {
            responsible_person, target_date, due_date,
            task_step, hazard, risk, risk_type,
            consequence_1, likelihood_1, risk_rating_1, risk_rank_1,
            control_measure_list,
            consequence_2, likelihood_2, risk_rating_2, risk_rank_2
        } = form.data;
        const data = {
            task_step, hazard, risk,
            consequence_1, likelihood_1, risk_rating_1, risk_rank_1
        };
        if(risk_type) {
            data.risk_type = risk_type.map(v => {
               if(isString(v)) return v;
               return v.value;
            });
        }
        if(responsible_person) {
            data.responsible_person = responsible_person;
        }
        if(target_date) {
            data.target_date = target_date;
        }
        if(due_date) {
            data.due_date = due_date;
        }
        if(control_measure_list) {
            data.control_measure_list = control_measure_list.filter(v => v !== null);
        }
        if(consequence_2) {
            data.consequence_2 = consequence_2;
        }
        if(likelihood_2) {
            data.likelihood_2 = likelihood_2;
        }
        if(risk_rating_2) {
            data.risk_rating_2 = risk_rating_2;
        }
        if(risk_rank_2) {
            data.risk_rank_2 = risk_rank_2;
        }
        console.log(data)
        
        onSaved(data);
        this.props.close();
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {item} = this;
        let responsible_personDefault = null;
        if(item && item.responsible_person) {
            const {id, fname, lname, data} = item.responsible_person;
            responsible_personDefault = {label: (lname || data.lname) + ' ' + (fname || data.fname), value: item.responsible_person};
        }
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. General Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required defaultValue={responsible_personDefault} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="target_date" type="date" placeholder="Target Date..." defaultValue={item && item.target_date} required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="due_date" type="date" placeholder="Due Date..." defaultValue={item && item.due_date} required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Hazard & Risk Details
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="task_step" type="text" placeholder="Basic Task Step" defaultValue={item && item.task_step} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="hazard" type="text" placeholder="Hazard / Potential Hazard" defaultValue={item && item.hazard} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="risk" type="text" placeholder="Risk / Potential Risk" defaultValue={item && item.risk} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="risk_type" type="checkbox" placeholder="Risk Type(s)" defaultValue={item && item.risk_type} required vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.risk_type} returnValue/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        3. Risk Rating Without Control Measures 
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput ref="consequence_1" name="consequence_1" type="radio" placeholder="Consequence / Severity" defaultValue={item && item.consequence_1} className="col-lg-6 form-control" vertical onChange={this.form.onChange} values={this.state.lists.consequence_1}/>
                        <ClearableInput ref="likelihood_1" name="likelihood_1" type="radio" placeholder="Likelihood / Probability" defaultValue={item && item.likelihood_1} className="col-lg-6 form-control" vertical onChange={this.form.onChange} values={this.state.lists.likelihood_1}/>
                    </div>
                    <div className="row sec-group">
                        <label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
                        <RiskRating selected={this.state.riskRatingSelected_1} ref="risk_rating_1" name="risk_rating_1" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        4. Risk Control Measures 
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group w-full">
                        <NewRiskControlMeasureListTable name="control_measure_list" defaultValue={item && [...item.control_measure_list, null]} onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <label className="w-full margin-t-10 margin-b-0">Risk Rating With Control Measures</label>
                        <ClearableInput ref="consequence_2" name="consequence_2" type="radio" placeholder="Consequence / Severity" defaultValue={item && item.consequence_2} className="col-lg-6 form-control" vertical onChange={this.form.onChange} values={this.state.lists.consequence_2}/>
                        <ClearableInput ref="likelihood_2" name="likelihood_2" type="radio" placeholder="Likelihood / Probability" defaultValue={item && item.likelihood_2} className="col-lg-6 form-control" vertical onChange={this.form.onChange} values={this.state.lists.likelihood_2}/>
                    </div>
                    <div className="row sec-group">
                        <label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
                        <RiskRating selected={this.state.riskRatingSelected_2} ref="risk_rating_2" name="risk_rating_2" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewRiskControlMeasureListTable extends ATableSavable {
    @observable
    selfState = {
        
    };
    constructor(props) {
        super(props);
        
        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if(item) {
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td">
                    <span className="counter">{n + 1}</span>
                    <span>{item.text}</span>
                </div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new" className="padding-l-0">
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        return (<Table className="w-full padding-0 margin-0">
            <THead>
                <div className="td">Risk Control Measure</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60"></div>
            </THead>
            <TBody ref="body" title="Risk Control Measures" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewRiskAssessmentItemTaskBasedDialog;
