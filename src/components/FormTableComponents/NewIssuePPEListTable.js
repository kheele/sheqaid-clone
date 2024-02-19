// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import ANewListTable from './ANewListTable';
import {Button,} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewIssuePPEListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
	className = "NewIssuePPEListTable";
	title = "PPE Items";
	style = style;
	
	renderItem(n, onClick) {
		const {readonly, renderTable, disableOneChange} = this.props;
		const item = this.state.list[n];
		if (item) {
			console.log('renderItem', item)
			const {id, is_issued, ppe_type: {name, profile_pic, ppe_item_list}} = item;
			
			// const {lname, fname} = supervisor || {};
			
			const tr = <>
				<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
				<div className="td">{name}</div>
				<div className="td">{name}</div>
				{!readonly && <div className="td fixed-flex min-w-50">
					<ButtonWrapper
						item={item}
						readonly={readonly}
						disableOneChange={disableOneChange}
						action="create"
						onChange={this.onChangeInternal}
					/>
					{/*<Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>*/}
					{/*    <i className="fa fa-times-circle"/>*/}
					{/*</Button>*/}
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
			</>;
			
			return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
				{renderTable ? <TRow>{tr}</TRow> : tr}
				{renderTable && renderTable(item, n)}
			</TRow>;
		} else {
			return null;
		}
	}
	
	renderTHead() {
		const {readonly} = this.props;
		return <THead className="align-left">
			<div className="td fixed-flex min-w-30">#</div>
			<div className="td">PPE Type</div>
			<div className="td">Team Name</div>
			{!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
			{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
		</THead>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWrapper">
@observer
class ButtonWrapper extends React.Component {
	
	@observable state = {
		processing: false,
	};
	
	constructor(props) {
		super(props);
		
		this.onChange = this.onChange.bind(this);
	}
	
	onChange(e, btn) {
		let {item: {id, ppe_type: {name, profile_pic, ppe_item_list}}, onChange, disableOneChange} = this.props;
		if (this.isChecked) {
			// if (disableOneChange) {
			// 	this.state.groupChecked = !this.state.groupChecked;
			// 	onChange(action, this.state.groupChecked);
			// } else {
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
			// }
		} else {
			// let {item, item: {actions}} = this.props;
			// const oldVal = actions[action];
			// const newVal = !oldVal;
			//
			// if (disableOneChange) {
			// 	actions[action] = newVal;
			// 	onChange();
			// } else {
			// 	this.processing = true;
			// 	setTimeout(() => {
			// 		extendObservable(actions, {[action]: newVal});
			// 		onChange({
			// 			item: toJS(item),
			// 			action,
			// 			oldVal,
			// 			newVal,
			// 			onComplete: savedItem => {
			// 				// console.log('res', savedItem)
			// 				if (savedItem && savedItem.data) {
			// 					extendObservable(item, savedItem.data);
			// 				}
			// 				this.processing = false;
			// 			},
			// 		});
			// 	});
			// }
		}
	}
	
	@computed
	get isChecked() {
		let {item: {is_issued}} = this.props;
		return is_issued;
	}
	
	render() {
		const {item: {id, ppe_type: {name, profile_pic, ppe_item_list}}, readonly} = this.props;
		const key = id;// || new Date().getTime();
		
		if (this.state.processing) {
			return <Button
				key={key}
				readonly={true}
				className="btn btn-default w-auto margin-r-5 border-radius-10 no-border padding-3 padding-h-10"
			>
				<CircularProgress size={20} color="white"/>
				{name}
			</Button>;
		}
		
		if (this.isChecked) {
			return <Button
				key={key}
				readonly={readonly}
				className="btn btn-primary w-auto margin-r-5 border-radius-10 no-border padding-3 padding-h-10"
				onClick={this.onChange}
			>
				<i className="fa fa-check margin-r-5"/>
				{name}
			</Button>;
		}
		
		if (ppe_item_list.isEmpty()) {
			return <Button
				key={key}
				readonly={readonly}
				className="btn btn-default w-auto margin-r-5 border-radius-10 no-border padding-3 padding-h-10"
				onClick={this.onChange}
			>
				<i className="fa fa-times margin-r-5"/>
				{name}
			</Button>;
		}
		
		return <Button
			key={key}
			readonly={readonly}
			className="btn btn-default w-auto margin-r-5 border-radius-10 no-border padding-3 padding-h-10"
			onClick={this.onChange}
		>
			<i className="fa fa-square margin-r-5"/>
			{name} ({ppe_item_list.length})
		</Button>;
	}
}

// </editor-fold>

export default ListTable;
