import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewEvaluationRecordSec.lazy.css";
import {ClearableInput} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';

@observer
class NewEvaluationRecordSec extends React.Component {

	constructor(props) {
        super(props);
    }
	
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount(){
		style.unuse();
	}
	
	render() {
		return <div id="NewEvaluationRecordSec" className="NewEvaluationRecordSec">
			<Controls path={this.props.path}/>
		</div>;
	}
}

@observer
class Controls extends React.Component {

	@observable state = {
		questions: {
			list: [
				{text: "Has the announcement been clearly heard/seen?", status: null},
				{text: "Was there any effort to stop the accident?", status: null},
				{text: "Did workers have adequate equipment at the place of the accident?", status: null},
				{text: "Was electricity turned off?", status: null},
				{text: "Were windows closed?", status: null},
				{text: "Were evacuation roads passable?", status: null},
				{text: "Did conjestion happen at the exit door?", status: null},
				{text: "Did employees arrive at the place for evacuation in acceptable time?", status: null},
				{text: "Did all employees arrive at the place for evacuation?", status: null},
				{text: "Was coming to the place of assembly done quietly and without panic?", status: null},
				{text: "Did employees bring personal belongings to the place of evacuation?", status: null},
				{text: "Were authorized services called for help?", status: null},
				{text: "Was time of authority's arrival acceptable?", status: null},
				{text: "Have the authorized persons in the organization been notified about the accident?", status: null},
				{text: "Did employees return to work after termination of emergency in an orderly manner?", status: null}
			]
		},
		drill_observations: {
			list: [
				{text: "Does procedure for Emergency Response need to be reviewed?", status: null},
				{text: "Is there a need for corrective actions?", status: null}
			]
		}
	};
	
    constructor() {
        super();
		
		this.onLoadQuestionsList = this.onLoadQuestionsList.bind(this);
		this.onLoadDrillObservationsList = this.onLoadDrillObservationsList.bind(this);
		this.renderQuestionsItem = this.renderQuestionsItem.bind(this);
		this.renderDrillObservationsItem = this.renderDrillObservationsItem.bind(this);
		
		this.onClick = this.onClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onReset = this.onReset.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
	
	onLoadQuestionsList() {
		return Promise.resolve(this.state.questions.list);
	}
	
	onLoadDrillObservationsList() {
		return Promise.resolve(this.state.drill_observations.list);
	}
	
	onClick(e, el) {
		const {list} = this.state;
		const {action} = el.props;
		if(action === "save") {
			//const data = toNoneNullObject(this.form);
			const elems = Object.keys(this.ctrl_refs).map(k => this.ctrl_refs[k]);
			const errors = elems.filter(node => !node.hasValue && node.props.required);
			if(!errors.isEmpty()) {
				errors.forEach(node => {
					node.setError();
				});
				alert("Fields highlighted red are required")
			} else {				
				list.push(this.form);
				elems.forEach(node => {
					node.reset();
				});
				this.form = {};
			}
		} else if(action === "delete") {
			const idx = el.props.idx;
			list.removeAt(idx);
		}
	}
	
	onChange(val, name, el) {
		console.log(val, name, el)
		/*const {calc} = this.state;
		if(!val.isEmpty()) {
			this.form[name] = val;
		} else {
			delete this.form[name];
		}*/
	}
	
	onReset(e) {
		this.state.form = {};
		
		this.refs.alert.hide();
		
		const submit = this.refs.submit;
		if(submit.disabled) {
			submit.innerText = "Save";
			submit.disabled = false;
		}
	}
	
	onSubmit(e) {
		e.preventDefault();
		
		//const alert = this.refs.alert;
		
		const data = toNoneNullObject(this.state.form);
		if(data) {
			const submit = this.refs.submit;
			submit.innerText = "Saving...";
			submit.setAttribute("disabled", true);
			neonBinding.events.emit(this.props.path + "create", data).then(res => {
				submit.innerText = "Save";
				submit.setAttribute("disabled", false);
				console.log("res", res)
			});
		} else {
		
		}
	}
	
	renderQuestionsItem(n) {
		const item = this.state.questions.list[n];
		return <TRow key={"item-" + n} className="tr-readonly">
			<div className="td"><span>{item.text}</span></div>
			<div className="td fixed-flex td-answers">
				<ClearableInput name={"question_" + n} type="radio" className="form-control" idx={n} data-list="questions" onChange={this.onChange} values={[{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}]}/>
			</div>
		</TRow>;
    }
	
	renderDrillObservationsItem(n) {
		const item = this.state.drill_observations.list[n];
		return <TRow key={"item-" + n} className="tr-readonly">
			<div className="td"><span>{item.text}</span></div>
			<div className="td fixed-flex td-answers">
				<ClearableInput name={"drill_observation_" + n} type="radio" className="form-control" idx={n} data-list="drill_observations" onChange={this.onChange} values={[{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}]}/>
			</div>
		</TRow>;
    }
	
	render() {
		return (<div className="controls-wrapper">
			<div className="controls">
				<Table>
					<THead>
						<div className="td">Questions</div>
						<div className="td fixed-flex td-answers">Yes</div>
						<div className="td fixed-flex td-answers">No</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Questions" renderItem={this.renderQuestionsItem} onClick={this.onClick} state={this.state.questions} onLoadList={this.onLoadQuestionsList} disablePullToRefresh={true}/>
				</Table>
				<Table>
					<THead>
						<div className="td">Drill Observations</div>
						<div className="td fixed-flex td-answers">Yes</div>
						<div className="td fixed-flex td-answers">No</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Drill Observations" renderItem={this.renderDrillObservationsItem} onClick={this.onClick} state={this.state.drill_observations} onLoadList={this.onLoadDrillObservationsList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

export default NewEvaluationRecordSec;
