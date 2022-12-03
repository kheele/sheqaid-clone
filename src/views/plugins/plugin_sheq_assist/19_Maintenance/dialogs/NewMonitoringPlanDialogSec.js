import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewMonitoringPlanDialogSec.lazy.css";
import {Button, ClearableInput} from '../../../../../components/inputs';
import {Table, TBody, THead, TRow} from '../../../../../components/tables';

@observer
class NewMonitoringPlanDialogSec extends React.Component {

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
		return <div id="NewMonitoringPlanDialogSec" className="NewMonitoringPlanDialogSec">
			<Controls path={this.props.path}/>
		</div>;
	}
}

@observer
class Controls extends React.Component {

	@observable state = {
		list: [null],
		lists: {
			equipment_type: ['Mobile Equipment', 'Plant', 'Small Plant'],
			service: ['Within Service Time', 'Due For Service']
		},
		cost_price: 12.50
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
			const isHours = item.equipment_type.contains('Plant');
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td"><span>{item.equipment_type}</span></div>
				<div className="td"><span>{item.equipment_name}</span></div>
				<div className="td"><span>{item.equipment_id}</span></div>
				<div className="td"><span>{item.service}</span></div>
				<div className="td fixed-flex min-w-190"><span>{item.fuel_usage} litres / week</span></div>
				<div className="td fixed-flex min-w-140"><span>{item.working_hrs_or_km}{isHours ? 'hours' : 'km'} / week</span></div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new">
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.equipment_type = ref}} name="equipment_type" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.state.lists.equipment_type}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.equipment_name = ref}} name="equipment_name" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.equipment_id = ref}} name="equipment_id" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.service = ref}} name="service" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.state.lists.service}/>
				</div>
				<div className="td fixed-flex min-w-190 td-number flex">
					<ClearableInput ref={ref => {this.ctrl_refs.fuel_usage = ref}} name="fuel_usage" type="number" required isClearable={false} className="form-control" onChange={this.onChange}/>
					<label className="fixed-flex min-w-110 text-center">litres / week</label>
				</div>
				<div className="td fixed-flex min-w-140 td-number flex">
					<ClearableInput ref={ref => {this.ctrl_refs.working_hrs_or_km = ref}} name="working_hrs_or_km" type="number" isClearable={false} required className="form-control" onChange={this.onChange}/>
					<label className="fixed-flex min-w-60 text-center">/ week</label>
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
						<div className="td">Equipment Type</div>
						<div className="td">Equipment Name</div>
						<div className="td">Equipment / Reg. No.</div>
						<div className="td">Service</div>
						<div className="td fixed-flex min-w-190">Fuel Usage</div>
						<div className="td fixed-flex min-w-140">Working<br />Hours / Kilometres</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Equipment Monitoring Plan" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

//stats per tool: [fuel] / week / month
//report all tools: cost / month [later]
//Add MaintanancePlan before this form

export default NewMonitoringPlanDialogSec;
