// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {
	ClearableInput,
} from 'components/inputs';
import {THead} from 'components/tables';

import {AExportDialog} from 'components/exports/AExportDialog';
import AControls from '../AEmployeeDocDialog/AEmployeeDocExportControls';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'Leave';
	titlePlural = 'Leaves';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/leaves/";//Used for exporting only

	selfState = {
		lists: {
			types: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'],
			due_to: [{label: 'Occurred Incident', value: 'Occurred Incident'}, {label: 'Other', value: 'Other'}],
		},
	};

	filterDataExtra = {
		type: null,
		due_to: null,
		//
		date: null,
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
	}

	// </editor-fold>

	//<editor-fold desc="onBuildQuery">
	onBuildQuery(params) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			type,
			due_to,
			//
			date,
		} = filterData || {};
		return {
			path: 'employees/docs/leaves',
			type,
			due_to,
			//
			date,
		};
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-40">ID</div>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Employee</div>
			<div className="td fixed-flex min-w-180">Leave Type</div>
			<div className="td fixed-flex min-w-180">Leave Due To</div>
			<div className="td fixed-flex min-w-180">Reason Of Leave</div>
			<div className="td fixed-flex min-w-160">Start Date</div>
			<div className="td fixed-flex min-w-190">Days Booked</div>
			<div className="td fixed-flex min-w-105">Expiry Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemFrom">
	renderItemFrom(item, n) {
		let {
			id, data: {
				created_at,
				due_to,
				days_booked,
				reason,
				employee_comments,
				notes,
				type,
				doc,
				date,
				expiry_date,
				expiry_updated,
				employee: {lname, fname},
			}
		} = item;

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td fixed-flex min-w-180">{type}</div>
			<div className="td fixed-flex min-w-180">{due_to}</div>
			<div className="td fixed-flex min-w-180">{reason}</div>
			<div className="td fixed-flex min-w-160">{Dates.formatDate(date)}</div>
			<div className="td fixed-flex min-w-190">{days_booked}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<ClearableInput ref="type" name="type" type="select" placeholder="Leave Type..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.types} returnValue/>
			<ClearableInput ref="due_to" name="due_to" type="select" placeholder="Leave Due To..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.due_to} returnValue/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="date" name="date" type="date" placeholder="Start Date..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
