import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewCalibrationRecordDialogSec.lazy.css";
import {Button, ClearableInput} from '../../../../../components/inputs';
import {Table, TBody, THead, TRow} from '../../../../../components/tables';

@observer
class NewCalibrationRecordDialogSec extends React.Component {

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
		return <div id="NewCalibrationRecordDialogSec" className="NewCalibrationRecordDialogSec">
			<Controls path={this.props.path}/>
		</div>;
	}
}

@observer
class Controls extends React.Component {

	@observable state = {
		list: [null],
		lists: {
			maintanace_type: ['Calibration', 'Type']
		}
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
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td"><span>{item.equipment_name}</span></div>
				<div className="td"><span>{item.equipment_id}</span></div>
				<div className="td"><span>{item.maintanace_type}</span></div>
				<div className="td"><span>{item.reference_standard}</span></div>
				<div className="td"><span>{item.certificate_num}</span></div>
				<div className="td"><span>{item.company_calibrating}</span></div>
				<div className="td fixed-flex min-w-160"><span>{item.calibration_date}</span></div>
				<div className="td fixed-flex min-w-160"><span>{item.next_calibration_date}</span></div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new">
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.equipment_name = ref}} name="equipment_name" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.equipment_id = ref}} name="equipment_id" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.maintanace_type = ref}} name="maintanace_type" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.state.lists.maintanace_type}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.reference_standard = ref}} name="reference_standard" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.certificate_num = ref}} name="certificate_num" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.company_calibrating = ref}} name="company_calibrating" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex min-w-160">
					<ClearableInput ref={ref => {this.ctrl_refs.calibration_date = ref}} name="calibration_date" type="date" placeholder="dd/mm/yyyy" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex min-w-160">
					<ClearableInput ref={ref => {this.ctrl_refs.next_calibration_date = ref}} name="next_calibration_date" type="date" placeholder="dd/mm/yyyy" required className="form-control" onChange={this.onChange}/>
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
						<div className="td">Equipment Name</div>
						<div className="td">Equipment/Reg. No.</div>
						<div className="td">Maintanace Type</div>
						<div className="td">Reference Standard</div>
						<div className="td">Certificate No.</div>
						<div className="td">Company Calibrating</div>
						<div className="td fixed-flex min-w-160">Calibration Date</div>
						<div className="td fixed-flex min-w-160">Next Calibration Date</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Equipment Calibration Record" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

export default NewCalibrationRecordDialogSec;
