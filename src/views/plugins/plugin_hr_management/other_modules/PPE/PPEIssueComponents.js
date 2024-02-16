// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';
import {CircularProgress} from "@mui/material";

import {ATableSavable, Table, TBody, THead, TRow} from "components/tables";
import {Button} from "components/inputs";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeePPEItemIssueTable">
@observer
class EmployeePPEItemIssueTable extends ATableSavable {
	@observable
	selfState = {
		lists: {}
	};
	
	constructor(props) {
		super(props);
		
		this.state.list = [];
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.selectAll = this.selectAll.bind(this);
		this.unselectAll = this.unselectAll.bind(this);
		this.onChangeInternal = this.onChangeInternal.bind(this);
		// this.onChangeGroup = this.onChangeGroup.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}
	
	async onLoadList(): * {
		const {
			state: {
				employee_list,
				team_list,
				department_list,
				job_position_list,
			},
		} = this.props;
		
		const loadBy = sockets.of("employees").fn("listByPPEIssue");
		return loadBy({
			employee_list,
			team_list,
			department_list,
			job_position_list,
		});
	}
	
	selectAll() {
		const {name, onChange} = this.props;
		const {groupCreate, groupEdit, groupView, groupDelete, groupShare,} = this.refs;
		groupCreate.selectAll();
		groupEdit.selectAll();
		groupView.selectAll();
		groupDelete.selectAll();
		groupShare.selectAll();
		
		this.list.forEach(({actions}) => {
			actions.create = true;
			actions.edit = true;
			actions.view = true;
			actions.remove = true;
			actions.share = true;
		});
		onChange && onChange(toJS(this.list), name, this);
	}
	
	unselectAll() {
		const {name, onChange} = this.props;
		const {groupCreate, groupEdit, groupView, groupDelete, groupShare,} = this.refs;
		groupCreate.unselectAll();
		groupEdit.unselectAll();
		groupView.unselectAll();
		groupDelete.unselectAll();
		groupShare.unselectAll();
		
		this.list.forEach(({actions}) => {
			actions.create = false;
			actions.edit = false;
			actions.view = false;
			actions.remove = false;
			actions.share = false;
		});
		onChange && onChange(toJS(this.list), name, this);
	}
	
	onChangeInternal(val) {
		const {name, onChange, disableOneChange} = this.props;
		const {list} = this;
		// list.sortBy('key.value');
		// list.sortBy('module.title');
		this.onChange(list, name, this);

		if (disableOneChange) {
			onChange && onChange(toJS(list), name, this);
		} else {
			const {item, action, oldVal, newVal, onComplete} = val;
			onChange && onChange({list: toJS(list), item, action, oldVal, newVal, onComplete}, name, this);
		}
	}

	// onChangeGroup(action, groupChecked) {
	// 	const {name, onChange, disableOneChange} = this.props;
	// 	const {list} = this;
	// 	list.sortBy('key.value');
	// 	list.sortBy('module.title');
	// 	list.forEach(({actions}) => {
	// 		actions[action] = groupChecked;
	// 	});
	// 	this.onChange(list, name, this);
	//
	// 	if (disableOneChange) {
	// 		onChange && onChange(toJS(list), name, this);
	// 	} else {
	//
	// 	}
	// }
	//
	
	renderItem(n, onClick) {
		const item = this.state.list[n];
		const {id, employee: {full_name, job_position, department, team, ppe_type_list, ppe_item_list}} = item;
		
		const {readonly, disableOneChange} = this.props;
		return <TRow key={"item-" + n} className="tr-readonly w-full">
			<div className="td td-question"><h5 className="no-margin">{full_name}</h5></div>
			<div className="td td-question"><h5 className="no-margin">{job_position && job_position.name || 'N/A'}</h5></div>
			<div className="td td-question"><h5 className="no-margin">{department && department.name || 'N/A'}</h5></div>
			<div className="td td-question"><h5 className="no-margin">{team && team.name || 'N/A'}</h5></div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="create"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="edit"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="view"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="remove"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="share"
				               onChange={this.onChangeInternal}/>
			</div>
		</TRow>;
	}
	
	render() {
		const {readonly, disableOneChange} = this.props;
		return (<Table className="pull-left w-full-calc-add-10 -margin-l-10">
			<THead>
				<div className="td">Employee</div>
				<div className="td">Job Position</div>
				<div className="td">Department</div>
				<div className="td">Team</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					Create
					<ButtonWrapper ref="groupCreate" readonly={readonly} disableOneChange={disableOneChange} group action="create"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					Edit
					<ButtonWrapper ref="groupEdit" readonly={readonly} disableOneChange={disableOneChange} group action="edit"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					View
					<ButtonWrapper ref="groupView" readonly={readonly} disableOneChange={disableOneChange} group action="view"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					Delete
					<ButtonWrapper ref="groupDelete" readonly={readonly} disableOneChange={disableOneChange} group action="remove"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60 margin-r-10">
					Share
					<ButtonWrapper ref="groupShare" readonly={readonly} disableOneChange={disableOneChange} group action="share"
					               onChange={this.onChangeGroup}/>
				</div>
			</THead>
			<TBody
				ref="body"
				title="Employee"
				renderItem={this.renderItem}
				state={this.state}
				onLoadList={this.onLoadList}
				disablePullToRefresh={true}/>
		</Table>);
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWrapper">
@observer
class ButtonWrapper extends React.Component {
	
	@observable state = {
		processing: false,
		groupChecked: false,
	};
	
	constructor(props) {
		super(props);
		
		this.selectAll = this.selectAll.bind(this);
		this.unselectAll = this.unselectAll.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	
	selectAll() {
		this.state.groupChecked = true;
	}
	
	unselectAll() {
		this.state.groupChecked = false;
	}
	
	onChange(e, btn) {
		let {group, action, onChange, disableOneChange} = this.props;
		if (group) {
			if (disableOneChange) {
				this.state.groupChecked = !this.state.groupChecked;
				onChange(action, this.state.groupChecked);
			} else {
				// this.processing = true;
				// setTimeout(() => {
				// 	extendObservable(actions, {[action]: newVal});
				// 	onChange({
				// 		item: toJS(item),
				// 		action,
				// 		oldVal,
				// 		newVal,
				// 		onComplete: savedItem => {
				// 			// console.log('res', savedItem)
				// 			this.state.groupChecked = !this.state.groupChecked;
				// 			this.processing = false;
				// 		},
				// 	});
				// });
			}
		} else {
			let {item, item: {actions}} = this.props;
			const oldVal = actions[action];
			const newVal = !oldVal;
			
			if (disableOneChange) {
				actions[action] = newVal;
				onChange();
			} else {
				this.processing = true;
				setTimeout(() => {
					extendObservable(actions, {[action]: newVal});
					onChange({
						item: toJS(item),
						action,
						oldVal,
						newVal,
						onComplete: savedItem => {
							// console.log('res', savedItem)
							if (savedItem && savedItem.data) {
								extendObservable(item, savedItem.data);
							}
							this.processing = false;
						},
					});
				});
			}
		}
	}
	
	set processing(val) {
		this.state.processing = val;
	}
	
	@computed
	get isChecked() {
		let {group, action} = this.props;
		if (group) {
			return this.state.groupChecked;
		} else {
			let {item: {actions}} = this.props;
			return actions[action];
		}
	}
	
	render() {
		let {group, readonly, action} = this.props;
		let key;
		if (group) {
			key = action;
		} else {
			const {item: {id}} = this.props;
			key = id || new Date().getTime();
		}
		if (this.state.processing) {
			return <Button key={key} readonly={true}
			               className="btn btn-primary hor-center flex-center padding-0 padding-t-3 w-40 h-30">
				<CircularProgress size={20} color="white"/>
			</Button>;
		}
		return <Button key={key} readonly={readonly} className={`btn btn-${group ? 'default' : 'primary'} hor-center w-40`}
		               onClick={this.onChange}>
			{this.isChecked ? <i className="fa fa-check"/> : <i className="fa fa-times"/>}
		</Button>;
	}
}

// </editor-fold>

export {EmployeePPEItemIssueTable};
