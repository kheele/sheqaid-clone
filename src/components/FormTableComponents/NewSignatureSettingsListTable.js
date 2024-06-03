// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput, SelectEmployeeInput, SelectJobPositionInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewSignatureSettingsListTable.lazy.css";
import {Dates} from "../../utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
	className = "NewSignatureSettingsListTable";
	title = "Names";
	style = style;
	
	constructor(props) {
		super(props);
	}
	
	renderItem(n, onClick) {
		const {readonly} = this.props;
		const item = this.state.list[n];
//        console.log('item', item)
		if (item || (item && item.id)) {
			let {job_position, employee} = item || item.data;
			let {fname, lname, data} = employee || {};
			fname = fname || data && data.fname;
			lname = lname || data && data.lname;
			job_position = job_position || data && data.job_position;
			
			const tr = <React.Fragment>
				<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
				<div className="td">{job_position && job_position.name}</div>
				<div className="td">
					{fname} {lname}
				</div>
				{!readonly && <div className="td fixed-flex min-w-40">
					<Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
			</React.Fragment>;
			
			return <TRow
				key={n}
				className="tr-readonly w-full padding-l-5 margin-r-0"
			>
				{tr}
			</TRow>;
		} else {
			return <TRow key="item-new" className="padding-10 w-full">
				<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
				<div className="td padding-r-5">
					<SelectJobPositionInput
						ref={this.onSetRef}
						name="job_position"
						placeholder="Add Job Position..."
						className="form-control"
						onChange={this.onChange}
					/>
				</div>
				<div className="td padding-r-5">
					<SelectEmployeeInput
						ref={this.onSetRef}
						name="employee"
						placeholder="Select Employee..."
						className="form-control"
						onChange={this.onChange}
					/>
				</div>
				<div className="td fixed-flex padding-0 margin-0">
					<Button idx={n} action="save"
					        className="btn btn-primary fixed-flex w-40 margin-0" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}
	
	renderTHead() {
		const {readonly} = this.props;
		return <THead className="align-left">
			<div className="td fixed-flex min-w-30">#</div>
			<div className="td">Job Position</div>
			<div className="td">Employee</div>
			{!readonly && <div className="td fixed-flex min-w-50 padding-0"/>}
			{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
		</THead>;
	}
	
}

// </editor-fold>

export default ListTable;
