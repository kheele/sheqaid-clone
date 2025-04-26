import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewEnviroRASec.lazy.css";
import {Button, ClearableInput} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';

@observer
class NewEnviroRASec extends React.Component {

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
		return <div id="NewEnviroRASec" className="NewEnviroRASec">
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
			workers.emit(this.props.path + "create", data).then(res => {
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
				<div className="td"><span>{item.hazard}</span></div>
				<div className="td"><span>{item.receptor}</span></div>
				<div className="td"><span>{item.pathway}</span></div>
				<div className="td"><span>{item.risk_management}</span></div>
				<div className="td"><span>{item.probability_of_exposure}</span></div>
				<div className="td"><span>{item.consequence}</span></div>
				<div className="td"><span>{item.overall_risk}</span></div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new">
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.hazard = ref}} name="hazard" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.receptor = ref}} name="receptor" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.pathway = ref}} name="pathway" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.risk_management = ref}} name="risk_management" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.probability_of_exposure = ref}} name="probability_of_exposure" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={['Low', 'Medium', 'High', 'Extreme']}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.consequence = ref}} name="consequence" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.overall_risk = ref}} name="overall_risk" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
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
						<div className="td">Hazard</div>
						<div className="td">Receptor</div>
						<div className="td">Pathway</div>
						<div className="td">Risk Management</div>
						<div className="td">Probability Of Exposure</div>
						<div className="td">Consequence</div>
						<div className="td">What Is The Overall Risk</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Environmental Risk Assessment" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

export default NewEnviroRASec;
