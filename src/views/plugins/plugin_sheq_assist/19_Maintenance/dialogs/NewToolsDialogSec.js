import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewToolsDialogSec.lazy.css";
import {Button, ClearableInput} from '../../../../../components/inputs';
import {Table, TBody, THead, TRow} from '../../../../../components/tables';

@observer
class NewToolsDialogSec extends React.Component {

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
		return <div id="NewToolsDialogSec" className="NewToolsDialogSec">
			<Controls path={this.props.path}/>
		</div>;
	}
}

@observer
class Controls extends React.Component {

	@observable state = {
		lists: {
			categories: ['Electrical Tools', 'Vehicles', 'Plant', 'Small Plant', 'Hand Tools', 'Office Equipment', null]
		},
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
				<div className="td fixed-flex min-w-260"><span>{item.category}</span></div>
				<div className="td"><span>{item.name}</span></div>
				<div className="td fixed-flex min-w-160"><span>{item.barcode_or_qr_code}</span></div>
				<div className="td fixed-flex">
					<Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new">
				<div className="td fixed-flex min-w-260">
					<ClearableInput ref={ref => {this.ctrl_refs.category = ref}} name="category" type="select" placeholder="Select..." required className="form-control" onChange={this.onChange} values={this.state.lists.categories}/>
				</div>
				<div className="td">
					<ClearableInput ref={ref => {this.ctrl_refs.name = ref}} name="name" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex td-barcode min-w-160 min-h-55">
					<Button idx={n} action="scan" className="btn btn-primary pull-right" onClick={onClick}>
						<i className="fa fa-barcode icon-left"/>Scan Barcode
					</Button>
					<a href="#" onClick={this.onHowToScan}>How To Scan Barcode</a>
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
					<THead className="align-left">
						<div className="td fixed-flex min-w-260">Category</div>
						<div className="td">Name</div>
						<div className="td fixed-flex min-w-160">Barcode / QR Code</div>
						<div className="td fixed-flex"></div>
					</THead>
					<TBody ref="body" title="Tools" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
				</Table>
			</div>
		</div>);
	}
}

export default NewToolsDialogSec;
