// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {getRiskRatingConsequenceList, getRiskRatingFrequencyList, getRiskRatingLikelihoodList} from '../../../utils';

import {Dates, execWhen} from "../../../../../utils/Utils";
import {Button, ClearableInput, Clickable, SelectEmployeeInput} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import {NavButtons, RiskRating} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import style from "./NewTrainingPlanItemDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewTrainingPlanItemDialog extends ANewDialog {
    pageKey = "NewTrainingPlanItemDialog";
    title = "Add Planning Item";

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
// </editor-fold>

@observer
class Controls extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            risk_type: ["Safety", "Health", "Environmental", "Quality", "Financial"].map(text => text + " Risk").map(text => {
                return {text, value: text, checked: false};
            }),
            frequency_1: getRiskRatingFrequencyList(),
            frequency_2: getRiskRatingFrequencyList(),
            frequency_3: getRiskRatingFrequencyList(),
            likelihood_1: getRiskRatingLikelihoodList(),
            likelihood_2: getRiskRatingLikelihoodList(),
            likelihood_3: getRiskRatingLikelihoodList(),
            consequence_1: getRiskRatingConsequenceList(),
            consequence_2: getRiskRatingConsequenceList(),
            consequence_3: getRiskRatingConsequenceList()
        },
        riskRatingSelected_1: {
            consequence: null,
            frequency: null,
            likelihood: null
        },
        riskRatingSelected_2: {
            consequence: null,
            frequency: null,
            likelihood: null
        },
        riskRatingSelected_3: {
            consequence: null,
            frequency: null,
            likelihood: null
        }
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeMany(["consequence_1", "consequence_2", "consequence_3"], this.onChangeConsequence.bind(this));
        this.form.addChangeMany(["frequency_1", "frequency_2", "frequency_3"], this.onChangeFrequency.bind(this));
        this.form.addChangeMany(["likelihood_1", "likelihood_2", "likelihood_3"], this.onChangeLikelihood.bind(this));
        this.form.addChangeMany(["risk_rating_1", "risk_rating_2", "risk_rating_3"], this.onChangeRiskRating.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeConsequence">
    onChangeConsequence(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['likelihood_' + num] || this.refs['frequency_' + num] || this.refs['risk_rating_' + num]).then(() => {
                const {
                    ['likelihood_' + num]: likelihood_ref, 
                    ['frequency_' + num]: frequency_ref, 
                    ['risk_rating_' + num]: risk_rating_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.consequence = val;
                if(likelihood_ref.hasValue) {
                    riskRatingSelected.likelihood = likelihood_ref.value;
                }
                if(frequency_ref.hasValue) {
                    riskRatingSelected.frequency = frequency_ref.value;
                }
            });
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeLikelihood">
    onChangeLikelihood(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['consequence_' + num] || this.refs['frequency_' + num] || this.refs['risk_rating_' + num]).then(() => {
                const {
                    ['consequence_' + num]: consequence_ref, 
                    ['frequency_' + num]: frequency_ref, 
                    ['risk_rating_' + num]: risk_rating_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.likelihood = val;
                if(consequence_ref.hasValue) {
                    riskRatingSelected.consequence = consequence_ref.value;
                }
                if(frequency_ref.hasValue) {
                    riskRatingSelected.frequency = frequency_ref.value;
                }
            });
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeFrequency">
    onChangeFrequency(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['consequence_' + num] || this.refs['likelihood_' + num] || this.refs['risk_rating_' + num]).then(() => {
                const {
                    ['consequence_' + num]: consequence_ref, 
                    ['likelihood_' + num]: likelihood_ref, 
                    ['risk_rating_' + num]: risk_rating_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.frequency = val;
                if(consequence_ref.hasValue) {
                    riskRatingSelected.consequence = consequence_ref.value;
                }
                if(likelihood_ref.hasValue) {
                    riskRatingSelected.likelihood = likelihood_ref.value;
                }
            });
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeRiskRating">
    onChangeRiskRating(el, name, val) {
        if (val) {
            const num = name.split('_').getLastElement();
            execWhen(() => this.refs['consequence_' + num] || this.refs['frequency_' + num] || this.refs['likelihood_' + num]).then(() => {
                const {
                    ['consequence_' + num]: consequence_ref,  
                    ['frequency_' + num]: frequency_ref,
                    ['likelihood_' + num]: likelihood_ref
                } = this.refs;

                const riskRatingSelected = this.state['riskRatingSelected_' + num];
                riskRatingSelected.consequence = val.consequence;
                riskRatingSelected.frequency = val.frequency;
                riskRatingSelected.likelihood = val.likelihood;

                const {
                    ['consequence_' + num]: consequence_list, 
                    ['frequency_' + num]: frequency_list,
                    ['likelihood_' + num]: likelihood_list
                } = this.state.lists;

                const consequence = consequence_list.find(item => item.value === val.consequence);
                const frequency = frequency_list.find(item => item.value === val.frequency);
                const likelihood = likelihood_list.find(item => item.value === val.likelihood);

                console.log('consequence', consequence, val.consequence, consequence_ref)
                console.log('frequency', frequency, val.frequency, frequency_ref)
                console.log('likelihood', likelihood, val.likelihood, likelihood_ref)

                consequence && consequence_ref.onChange(consequence);
                frequency && frequency_ref.onChange(frequency);
                likelihood && likelihood_ref.onChange(likelihood);
            });
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
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
            if (!form.isValid('frequency_1')) {
                infoDialog.open('Frequency / Exposure is required');
                return;
            }
            if (!form.isValid('likelihood_1')) {
                infoDialog.open('Probability / Likelihood is required');
                return;
            }
            if (!form.isValid('consequence_1')) {
                infoDialog.open('Consequence / Severity is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
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
        
        if (!form.isValid('frequency_1')) {
            infoDialog.open('Frequency / Exposure is required');
            return;
        }
        if (!form.isValid('likelihood_1')) {
            infoDialog.open('Probability / Likelihood is required');
            return;
        }
        if (!form.isValid('consequence_1')) {
            infoDialog.open('Consequence / Severity is required');
            return;
        }
        
        const {
            responsible_person, target_date, due_date,
            task_step, hazard, risk, risk_type,
            frequency_1, likelihood_1, consequence_1, risk_rating_1,
            control_measure_list,
            frequency_2, likelihood_2, consequence_2, risk_rating_2,
            control_measure_list_additional,
            frequency_3, likelihood_3, consequence_3, risk_rating_3
        } = form.data;
        const data = {
            task_step, hazard, risk,
            frequency_1, likelihood_1, consequence_1, risk_rating_1
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
        if(control_measure_list_additional) {
            data.control_measure_list_additional = control_measure_list_additional.filter(v => v !== null);
        }
        if(frequency_2) {
            data.frequency_2 = frequency_2;
        }
        if(frequency_3) {
            data.frequency_3 = frequency_3;
        }
        if(likelihood_2) {
            data.likelihood_2 = likelihood_2;
        }
        if(likelihood_3) {
            data.likelihood_3 = likelihood_3;
        }
        if(consequence_2) {
            data.consequence_2 = consequence_2;
        }
        if(consequence_3) {
            data.consequence_3 = consequence_3;
        }
        console.log(data)
        
        onSaved(data);
        this.props.close();
    }
    // </editor-fold>
    
    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
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
                        <ClearableInput ref="consequence_1" name="consequence_1" type="radio" placeholder="Consequence / Severity" defaultValue={item && item.consequence_1} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.consequence_1}/>
                        <ClearableInput ref="likelihood_1" name="likelihood_1" type="radio" placeholder="Probability / Likelihood" defaultValue={item && item.likelihood_1} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.likelihood_1}/>
                        <ClearableInput ref="frequency_1" name="frequency_1" type="radio" placeholder="Frequency / Exposure" defaultValue={item && item.frequency_1} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.frequency_1}/>
                    </div>
                    <div className="row sec-group">
                        <label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
                        <RiskRating selected={this.state.riskRatingSelected_1} ref="risk_rating_1" name="risk_rating_1" hasFrequency readonly onChange={this.form.onChange}/>
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
                        <ClearableInput ref="consequence_2" name="consequence_2" type="radio" placeholder="Consequence / Severity" defaultValue={item && item.consequence_2} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.consequence_2}/>
                        <ClearableInput ref="likelihood_2" name="likelihood_2" type="radio" placeholder="Probability / Likelihood" defaultValue={item && item.likelihood_2} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.likelihood_2}/>
                        <ClearableInput ref="frequency_2" name="frequency_2" type="radio" placeholder="Frequency / Exposure" defaultValue={item && item.frequency_2} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.frequency_2}/>
                    </div>
                    <div className="row sec-group">
                        <label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
                        <RiskRating selected={this.state.riskRatingSelected_2} ref="risk_rating_2" name="risk_rating_2" hasFrequency readonly onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        5. Additional Risk Control Measures 
                        <Clickable idx={5} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group w-full">
                        <NewRiskControlMeasureListAdditionalTable name="control_measure_list_additional" defaultValue={item && item.control_measure_list_additional && [...item.control_measure_list_additional, null]} onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group">
                        <label className="w-full margin-t-10 margin-b-0">Additional Risk Rating With Control Measures</label>
                        <ClearableInput ref="consequence_3" name="consequence_3" type="radio" placeholder="Consequence / Severity" defaultValue={item && item.consequence_3} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.consequence_3}/>
                        <ClearableInput ref="likelihood_3" name="likelihood_3" type="radio" placeholder="Probability / Likelihood" defaultValue={item && item.likelihood_3} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.likelihood_3}/>
                        <ClearableInput ref="frequency_3" name="frequency_3" type="radio" placeholder="Frequency / Exposure" defaultValue={item && item.frequency_3} required vertical className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.frequency_3}/>
                    </div>
                    <div className="row sec-group">
                        <label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
                        <RiskRating selected={this.state.riskRatingSelected_3} ref="risk_rating_3" name="risk_rating_3" hasFrequency readonly onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={5} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="NewRiskControlMeasureListTable">
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
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewRiskControlMeasureListAdditionalTable">
@observer
class NewRiskControlMeasureListAdditionalTable extends ATableSavable {
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
            let lname, fname;
            if(item.responsible_person) {
                const {data, lname: _lname, fname: _fname} = item.responsible_person;
                lname = _lname || data.lname;
                fname = _fname || data.fname;
            }
            const {text, responsible_person, cost, date_completed} = item;
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td">
                    <span className="counter">{n + 1}</span>
                    <span>{text}</span>
                </div>
		<div className="td"><span>{lname ? (lname + ' ' + fname) : 'N/A'}</span></div>
		<div className="td fixed-flex min-w-120"><span>{cost || 'N/A'}</span></div>
		<div className="td fixed-flex min-w-175"><span>{date_completed ? Dates.formatDate(date_completed) : 'N/A'}</span></div>
		<div className="td fixed-flex min-w-50 padding-l-0">
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
		<div className="td">
                    <SelectEmployeeInput ref={this.onSetRef} name="responsible_person" placeholder="Responsible Person..." className="form-control" onChange={this.onChange}/>
                </div>
		<div className="td fixed-flex min-w-120">
                    <ClearableInput name="cost" type="number" placeholder="Cost" required className="form-control" onChange={this.onChange}/>
                </div>     
		<div className="td fixed-flex min-w-175">
                    <ClearableInput name="date_completed" type="date" placeholder="Due Date..." required className="form-control" onChange={this.onChange}/>
                </div>                   
		<div className="td fixed-flex min-w-50 padding-l-0">
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
                <div className="td">Additional Risk Control Measure</div>
                <div className="td">Responsible Person</div>
                <div className="td fixed-flex min-w-120">Cost</div>
                <div className="td fixed-flex min-w-175">Due Date</div>
                <div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60"></div>
            </THead>
            <TBody ref="body" title="Additional Risk Control Measures" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}
// </editor-fold>

export default NewTrainingPlanItemDialog;
