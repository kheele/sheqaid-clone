// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';

import {Button, ClearableInput, ProfileField} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import {changeColors} from './Utils';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeDetailsPanel">
@observer
class EmployeeDetailsPanel extends React.Component {
    
    constructor() {
        super();
    }
    
    render() {
        const {item} = this.props;
        return <React.Fragment>
            <ProfileField value={item} renderer={v => (v.lname || v.data.lname)} placeholder="Last Name" className="col-lg-6"/>
            <ProfileField value={item} renderer={v => (v.fname || v.data.fname)} placeholder="First Name" className="col-lg-6"/>            
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ScreeningOutcome">
@observer
class ScreeningOutcome extends React.Component {
    
    constructor() {
        super();
    }
    
    render() {
        let {
            state: {
                totalScore, 
                symptoms_status, 
                lists: {outcome: values}
            },
            defaultValue, 
            onChange
        } = this.props;
        if(!defaultValue) {
            if(symptoms_status !== "Yes" || totalScore <= 3) {
                defaultValue = {label: "No Action Required", value: "No Action Required"};
            }
        }
        return <ClearableInput key={Math.random()} name="outcome" type="select" placeholder="Screening Outcome..." defaultValue={defaultValue} required className="col-lg-12 form-control" onChange={onChange} values={values} add returnValue/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewScreeningQuestionsTable">
@observer
class NewScreeningQuestionsTable extends ATableSavable {
    @observable
    selfState = {
        lists: {},
    };
    totalScore;
	
    constructor(props) {
        super(props);
        
        this.totalScore = new TotalScore(this.state);
        
        if(!('defaultValue' in props)) {
            this.state.list = [
                {text: "Temperature", key: "temperature", point_score: 0, status: null},
                {text: "Chills", key: "chillis", point_score: 1, status: "Unknown"},//
                {text: "Dry Cough", key: "dry_cough", point_score: 1, status: "Unknown"},//
                {text: "Sore Throat", key: "sore_throat", point_score: 1, status: "Unknown"},//
                {text: "Shortness of Breath", key: "shortness_of_breath", point_score: 1, status: "Unknown"},//
                {text: "Muscle Pains", key: "muscle_pains", point_score: 1, status: "Unknown"},//
                {text: "Diarrhea", key: "diarrhea", point_score: 1, status: "Unknown"},//
                {text: "Tiredness", key: "tireness", point_score: 1, status: "Unknown"},//
                {text: "Conjuctivitis (Redness Eyes)", key: "redness_of_eye", point_score: 1, status: "Unknown"},//
                {text: 'Lack of smell or taste', key: 'loss_of_smell_or_taste', point_score: 1, status: "Unknown"},
                {text: "Nausea or vomiting", key: "nausea_or_vomiting", point_score: 1, status: "Unknown"},//
                {text: "Dizziness", key: "dizziness", point_score: 1, status: "Unknown"},
                {text: "Headache", key: "headache", point_score: 1, status: "Unknown"},

                {extra: true, text: 'Have you been in contact with someone with COVID-19?', key: 'in_contact_with_covid_patient', point_score: 1, status: "Unknown"},            
                {extra: true, text: 'Have you been traveling or been at the following locations: Doctor; High risk area or event in the last 14 days?', key: 'last_14_days_travelled', point_score: 1, status: "Unknown"},
                {extra: true, text: "Do you deem yourself medically fit and to the best of your knowledge you don't have COVID-19?", key: 'am_medically_fit', point_score: 1, status: "Unknown"},
                {extra: true, text: 'Are you wearing a mask', key: 'are_you_wearing_a_mask', point_score: 1, status: "Yes"}
            ];
        }
        
        this.onChange = this.onChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    componentDidMount() {
        const {state, controls: {props: {dialog}}} = this.props;
	autorun(() => {
            const {score, colors} = this.totalScore;
            state.totalScore = score;
            changeColors(dialog, colors);
	});
    }	
    
    onChange(val, name, el) {
        const {idx} = el.props;
        const item = this.state.list[idx];
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item.status = val;
        } else if (isNullable(val)) {
            if(item.key === 'temperature') {
                item.status = null;
            } else {
                item.status = "No";
            }
        }
    }
    
    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        const {key, text, status} = item;
	const name = "item_" + n;
        this.selfState.lists[n] = [
            {value: "Yes", text: "Yes", checked: false}, 
            {value: "No", text: "No", checked: false}, 
            {value: "Unknown", text: "Unknown", checked: false}
        ];
        const options = this.selfState.lists[n];
	return <TRow key={"item-" + n} className="tr-readonly w-full">
            <div className="td td-question">
                <div className="w-full">
                    <h6 className="no-margin padding-r-10">{text}</h6>
                    {(key === 'temperature') && <div className="flex padding-r-10">
                        <p className="flex flex-center padding-5 margin-t-5 margin-b-0 text-center border-radius-l-20 pull-left font-size-11" style={{background: 'green', color: '#fff'}}>Between 35.1&deg;C and 38&deg;C</p>
                        <p className="flex flex-center padding-5 margin-t-5 margin-b-0 text-center pull-left font-size-11" style={{background: 'orange', color: '#fff'}}>35.0&deg;C and below</p>
                        <p className="flex flex-center padding-5 margin-t-5 margin-b-0 text-center border-radius-r-20 pull-left font-size-11" style={{background: 'red', color: '#fff'}}>Between 38.1&deg;C and 38.3&deg;C</p>
                    </div>}
                </div>
            </div>
            {!readonly && <div className="td fixed-flex padding-l-0 min-w-240">
                {key === 'temperature' && <ClearableInput ref={this.onSetRef} name={name} type="text" placeholder="Type No." defaultValue={status} className="form-control margin-t-25" idx={n} onChange={this.onChange}/>}
            	{key !== 'temperature' && <ClearableInput ref={this.onSetRef} name={name} type="radio" defaultValue={status} isClearable={false} className="form-control" idx={n} onChange={this.onChange} values={options}/>}
            </div>}
            {readonly && <div className="td fixed-flex min-w-130">
                {key === 'temperature' && <span className="form-control flex temperature margin-t-25">{status}</span>}
                {key !== 'temperature' && <span className="form-control flex">{status}</span>}
            </div>}
	</TRow>;
    }
    
    render() {
        return <Table className="w-full-calc-add-10 h-auto pull-left -margin-l-10 margin-t-15">
            <TBody ref="body" title="Question" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            <div className="total-score pull-left w-full">
                <h3 className="hor-center">Total Score</h3>
                <TotalScoreComponent totalScore={this.totalScore}/>
            </div>
        </Table>;
    }
    
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewVulnerableQuestionsTable">
@observer
class NewVulnerableQuestionsTable extends ATableSavable {
    @observable
    selfState = {
        lists: {},
    };
	
    constructor(props) {
        super(props);
        
        if(!('defaultValue' in props)) {
            this.state.list = [
                {text: "Asthma", status: "Unknown"},
                {text: "Chronic Lung Disease", status: "Unknown"},
                {text: "Diabetes", status: "Unknown"},
                {text: "Hypertension", status: "Unknown"},
                {text: "Serious Heart Conditions", status: "Unknown"},
                {text: "Chronic Kidney Disease", status: "Unknown"},
                {text: "Chronic Liver Disease", status: "Unknown"},
                {text: "Immunocompromised", status: "Unknown"},
                {text: "Previous Tuberculosis", status: "Unknown"},
                {text: "Current Tuberculosis", status: "Unknown"},
                {text: "HIV", status: "Unknown"},
                //Risk Factors
                {text: "Age => 60 years", status: "Unknown"},
                {text: "Smoking current", status: "Unknown"},
                {text: "Pregnancy => 28 weeks", status: "Unknown"},
                {text: "Obesity", status: "Unknown"},

                {text: "Received Flu Vaccine", status: "Unknown"}
            ];
        }
        
        this.onChange = this.onChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
	
    onChange(val, name, el) {
        const {idx} = el.props;
        const item = this.state.list[idx];
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item.status = val;
        } else if (isNullable(val)) {
            item.status = "Unknown";
        }
        
    }
	
    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        const {key, text, status} = item;
	const name = "item_" + n;
        this.selfState.lists[n] = [
            {value: "Yes", text: "Yes", checked: false}, 
            {value: "No", text: "No", checked: false},
            {text: "Unknown", value: "Unknown", checked: false}
        ];
        const options = this.selfState.lists[n];
	return <TRow key={"item-" + n} className="tr-readonly w-full">
            <div className="td td-question">
                <h6 className="no-margin pull-left">{text}</h6>
            </div>            
            {!readonly && <div className="td fixed-flex padding-l-0 min-w-240">
                <ClearableInput ref={this.onSetRef} name={name} type="radio" defaultValue={status} isClearable={false} className="form-control" idx={n} onChange={this.onChange} values={options}/>
            </div>}
            {readonly && <div className="td fixed-flex min-w-130">
                <span className="form-control flex">{status}</span>
            </div>}
	</TRow>;
    }

    render() {
        const {vulnerability_status} = this.props.state;
        if(vulnerability_status !== "Yes") return null;
        return <Table className="w-full-calc-add-10 h-auto pull-left -margin-l-10 margin-t-15">
            <THead className="align-left">
                <div className="td">Comordibidity Details</div>
                <div className="td fixed-flex min-w-240 no-padding"></div>
            </THead>
            <TBody ref="body" title="Question" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewHighRiskContactsTable">
@observer
class NewHighRiskContactsTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
        }
    };
    constructor(props) {
        super(props);
        this.insertAt = this.insertAt.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
	if(item) {
            return <TRow key={"item-" + n} className="tr-readonly w-full">
		<div className="td"><span>{item.fname}</span></div>
		<div className="td"><span>{item.lname}</span></div>
		<div className="td fixed-flex min-w-195"><span>{item.number}</span></div>
		<div className="td fixed-flex min-w-180"><span>{Dates.formatDate(item.date)}</span></div>
		{!readonly && <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>}
		{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </TRow>;
	} else {
            if(readonly) {
                return null;
            }
            return <TRow key="item-new w-full">
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="fname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="lname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-195">
                    <ClearableInput ref={this.onSetRef} name="number" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-180">
                    <ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="Date..." required className="form-control" onChange={this.onChange}/>
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
        const {readonly} = this.props;
        const {high_risk_contacts_num} = this.props.state;
        return (high_risk_contacts_num !== null && high_risk_contacts_num > 0) && <div className="row sec-group margin-t-10 padding-l-10 padding-r-10">
            <Table>
                <THead className="align-left">
                    <div className="td">First Name</div>
                    <div className="td">Last Name</div>
                    <div className="td fixed-flex min-w-195">Phone No.</div>
                    <div className="td fixed-flex min-w-180">Contact Date</div>
                    {!readonly && <div className="td fixed-flex padding-0 min-w-70"></div>}
                    {readonly && <div className="td fixed-flex padding-0 min-w-0"></div>}
                </THead>
                <TBody ref="body" title="High Risk Contacts" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
                <p className="hor-center margin-t-10">Please confirm each <b>person</b> by clicking on <b><i className="fa fa-check btn btn-primary padding-5"/> button</b></p>
            </Table>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="TotalScore, TotalScoreComponent">
class TotalScore {
	
    constructor(state) {
        this.state = state;
    }
	
    @computed get score() {
	const list = this.state.list.filter(item => !!item.status);
	if(list.isEmpty()) return 0;
        return list.filter(({key, status}) => {
            if(key === 'temperature') {
		if(!!status) {
                    if((isString(status) && status.isNumeric())) {
                        try{
                            parseFloat(status);
                            return true;
			} catch(e) {}
                    } else if(isNumber(status)) {
                        return true;
                    }
		}
		return false;
            } else if(key === 'are_you_wearing_a_mask' || key === 'am_medically_fit') {
                return status === "No";
            } else {
                return status === "Yes";
            }
        }).map(({key, status, point_score}) => {
            if(key === 'temperature') {
                status = parseFloat(status);
		if(status <= 35.0) {
                    return 0;//
		} else if(status >= 35.1/*36.5*/ && status <= 38) {
                    return 0;
		} else if(status > 38) {
                    return 1;
		}
            } else {
		return point_score;
            }
        }).reduce((n1, n2) => n1 + n2, 0);
    }
	
    @computed get colors() {
        const {score} = this;
	if(score <= 3) return {background: 'green', color: 'white'};
	else if(score >= 4 && score <= 5) return {background: 'orange', color: 'white'};
        return {background: 'red', color: 'white'};
    }
    
}

@observer
class TotalScoreComponent extends React.Component {
    
    render() {
        const {totalScore: {score, colors: {background, color}}} = this.props;
        return <h1 className="hor-center" style={{background, color}}>{score}</h1>;
    }
}
// </editor-fold>

export {EmployeeDetailsPanel, ScreeningOutcome, NewScreeningQuestionsTable, NewVulnerableQuestionsTable, NewHighRiskContactsTable};