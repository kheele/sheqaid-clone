import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewEmergencyRollCallRegisterSec.lazy.css";
import {Button, ClearableInput} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';

@observer
class NewEmergencyRollCallRegisterSec extends React.Component {

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
		return <div id="NewEmergencyRollCallRegisterSec" className="NewEmergencyRollCallRegisterSec">
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
				<div className="td"><span>{item.employee_name}</span></div>
				<div className="td"><span>{item.present}</span></div>
				<div className="td"><span>{item.missing}</span></div>
				<div className="td"><span>{item.not_at_work}</span></div>
				<div className="td"><span>{item.injured}</span></div>
				<div className="td"><span>{item.unresponsive}</span></div>
				<div className="td"><span>{item.room_or_office}</span></div>
				<div className="td"><span>{item.contacts}</span></div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new">
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.employee_name = ref}} name="employee_name" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.present = ref}} name="present" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.missing = ref}} name="missing" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.not_at_work = ref}} name="not_at_work" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.injured = ref}} name="injured" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.unresponsive = ref}} name="unresponsive" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.room_or_office = ref}} name="room_or_office" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.contacts = ref}} name="contacts" type="text" placeholder="Select..." required className="form-control" onChange={this.onChange}/>
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
						<div className="td">Employee Name</div>
						<div className="td">Present</div>
						<div className="td">Missing</div>
						<div className="td">Not At Work</div>
						<div className="td">Injured</div>
						<div className="td">Unresponsive</div>
						<div className="td">Room / Office</div>
						<div className="td">Contacts</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Emergency Roll Call Attendance Register" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

export default NewEmergencyRollCallRegisterSec;
