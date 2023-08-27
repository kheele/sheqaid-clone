import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import {Button, ClearableInput,} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

@observer
class ButtonWrapper extends React.Component {

	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	onChange(e, btn) {
		const {item, onChange} = this.props;
		item.checked = !item.checked;
		onChange();
	}

	@computed
	get isChecked() {
		return this.props.item.checked;
	}

	render() {
		return <Button className="btn btn-primary hor-center w-40" onClick={this.onChange}>
			{this.isChecked ? <i className="fa fa-check"/> : <i className="fa fa-square"/>}
		</Button>;
	}
}

@observer
class SelectWrapper extends React.Component {

	render() {
		const {state, name, placeholder, className, onChange, values} = this.props;
		if (!state.loadedSelectLists) return null;
		return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className}
		                       onChange={onChange} values={state.lists[values]} returnValue add/>;
	}
}

@observer
class ANewListTable extends ATableSavable {
	@observable
	selfState = {};

	constructor(props) {
		super(props);
		this.insertAt = this.insertAt.bind(this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	renderItem(n, onClick) {
		const item = this.state.list[n];
		if (item) {
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
				<div className="td"><span>{item.text}</span></div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new" className="padding-l-0">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">
					<ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required
					                className="form-control" onChange={this.onChange}/>
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
			<THead className="align-left">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">{this.title}</div>
				<div className="td fixed-flex min-w-70 padding-0"></div>
			</THead>
			<TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
			       onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

@observer
class NewRiskListTable extends ANewListTable {
	title = "Risk Associated With The Equipment / Procedure";

	constructor(props) {
		super(props);
	}
}

@observer
class NewCloseDownListTable extends ANewListTable {
	title = "Close Down";

	constructor(props) {
		super(props);
	}
}

@observer
class NewSafetyPreRequesiteListTable extends ATableSavable {

	constructor(props) {
		super(props);

		this.onChangeInternal = this.onChangeInternal.bind(this);
		this.renderItem = this.renderItem.bind(this);

		this.state.list = [
			{desc: "Safety Glasses", checked: true},
			{desc: "Hearing Protection", checked: true},
			{desc: "Gloves", checked: false},
			{desc: "Welding Protection", checked: false},
			{desc: "Face Shields", checked: false},
			{desc: "Machine Guards", checked: false},
			{desc: "Pre-use Inspection", checked: false},
			{desc: "Warning Signs", checked: true},
			{desc: "Lock-out Tags", checked: false},
			{desc: "Secure Access", checked: false},
			{desc: "Trained Operator", checked: false},
			{desc: "Work Permit", checked: false},
			{desc: "Close Supervision", checked: false},
			{desc: "Weld Screens", checked: false},
			{desc: "Extinguishers", checked: false}
		];
	}

	onChangeInternal() {
		const {name} = this.props;
		const list = toJS(this.list);
		this.onChange(list, name, this);
		this.props.onChange && this.props.onChange(list, name, this);
	}

	renderItem(n, onClick) {
		const item = this.state.list[n];
		return <TRow key={"item-" + n} className="tr-readonly">
			<div className="td td-question"><h5 className="no-margin">{item.desc}</h5></div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={this.props.readonly} onChange={this.onChangeInternal}/>
			</div>
		</TRow>;
	}

	render() {
		return (<Table>
			<THead>
				<div className="td">Safety Pre-requesite</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60"></div>
			</THead>
			<TBody ref="body" title="Safety Pre-requesite" renderItem={this.renderItem} state={this.state}
			       onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

@observer
class NewCustomSafetyPreRequesiteListTable extends ANewListTable {
	title = "Custom Safety Pre-requesites";

	constructor(props) {
		super(props);
	}
}

@observer
class NewProcedureListTable extends ANewListTable {
	title = "Pre-start Check";

	constructor(props) {
		super(props);
	}
}

@observer
class NewKeyPointListTable extends ANewListTable {
	title = "Key Points";

	constructor(props) {
		super(props);
	}
}

@observer
class NewOperationListTable extends ANewListTable {
	title = "Operations";

	constructor(props) {
		super(props);
	}
}

export {
	ButtonWrapper,
	SelectWrapper,
	NewRiskListTable,
	NewCloseDownListTable,
	NewSafetyPreRequesiteListTable,
	NewCustomSafetyPreRequesiteListTable,
	NewProcedureListTable,
	NewKeyPointListTable,
	NewOperationListTable,
};
