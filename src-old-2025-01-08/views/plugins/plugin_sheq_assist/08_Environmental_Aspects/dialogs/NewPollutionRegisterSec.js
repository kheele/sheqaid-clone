import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewPollutionRegisterSec.lazy.css";
import {Button, ClearableInput} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';

@observer
class NewPollutionRegisterSec extends React.Component {

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
		return <div id="NewPollutionRegisterSec" className="NewPollutionRegisterSec">
			<Controls path={this.props.path}/>
		</div>;
	}
}

@observer
class Controls extends React.Component {

	@observable state = {
		list: [null]
	};
	form = {};
	ctrl_refs = {};
	
    constructor() {
        super();
		
		this.onLoadList = this.onLoadList.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onReset = this.onReset.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
	
	onLoadList() {
		return Promise.resolve(this.state.list);
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
	
	onChange(val, name) {
		const {calc} = this.state;
		if(!val.isEmpty()) {
			this.form[name] = val;
		} else {
			delete this.form[name];
		}
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
	
	renderItem(n, onClick) {
		const item = this.state.list[n];
		if(item) {
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td"><span>{item.department_or_area_or_workplace}</span></div>
				<div className="td"><span>{item.pollution_agent_list}</span></div>
				<div className="td"><span>{item.pollution}</span></div>
				<div className="td"><span>{item.comments_or_recommendation_to_rectify_or_control_pollution}</span></div>
				<div className="td"><span>{item.action_by_who}</span></div>
				<div className="td"><span>{item.completion_date}</span></div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new">
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.department_or_area_or_workplace = ref}} name="department_or_area_or_workplace" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.pollution_agent_list = ref}} name="pollution_agent_list" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.pollution = ref}} name="pollution" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.comments_or_recommendation_to_rectify_or_control_pollution = ref}} name="comments_or_recommendation_to_rectify_or_control_pollution" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.action_by_who = ref}} name="action_by_who" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.completion_date = ref}} name="completion_date" type="date" placeholder="Select..." required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex">
					<Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
    }
	
	render() {
		return (<div className="controls-wrapper">
			<div className="controls">
				<Table>
					<THead>
						<div className="td">Department / Area / Workplace</div>
						<div className="td">List Pollution Agents</div>
						<div className="td">Pollution</div>
						<div className="td">Comments/Recommendation To Rectify/Control Pollution</div>
						<div className="td">Action By Who</div>
						<div className="td">Completion Date</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Pollution Survey Register" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

export default NewPollutionRegisterSec;
