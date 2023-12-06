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
	titleSingular = 'Contract';
	titlePlural = 'Contracts';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/contracts/";//Used for exporting only

	selfState = {
		lists: {
			contract_type: ['Fixed Term', 'Permanent'].map(label => {
				return {label, value: label};
			}),
			payment_types: [{label: 'Salary (Fixed Payment)', value: 'Salary'}, {label: 'Hourly Wage', value: 'Wage'}],
			salary_intervals: [
				{label: 'Weekly', value: 'Weekly'},
				{label: 'Bi-Weekly', value: 'Bi-Weekly'},
				{label: 'Monthly', value: 'Monthly'}
			],
		},
	};

	filterDataExtra = {
		contract_type: null,
		payment_type: null,
		salary_interval: null,
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
			contract_type,
			payment_type,
			salary_interval,
		} = filterData || {};
		return {
			path: 'employees/docs/contracts',
			contract_type,
			payment_type,
			salary_interval,
		};
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Employee</div>
			<div className="td fixed-flex min-w-140">Contract Type</div>
			<div className="td fixed-flex min-w-120">Payment Type</div>
			<div className="td fixed-flex min-w-140">Salary Interval</div>
			<div className="td fixed-flex min-w-150">Time Range</div>
			<div className="td fixed-flex min-w-140">Working Hours</div>
			<div className="td fixed-flex min-w-105">Start Date</div>
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
				salary_info = [],
				contract_details = [],
				doc,
				job_profile_doc,
				employee: {lname, fname},
			}
		} = item;

		const {
			contract_type,
			daily_working_hours,
			start_date,
			end_of_trial_period,
			expiry_date,
			start_time,
			end_time,
			notes,
		} = contract_details[0] || {};

		let {
			deductible_list, // [{id, created_at, text, value,}]
			payment_type,
			salary,
			salary_interval,
			wage,
		} = salary_info[0] || [];

		if (isNumber(salary)) {
			salary = salary.toCurrency('R');
		}

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td fixed-flex min-w-140">{contract_type || 'N/A'}</div>
			<div className="td fixed-flex min-w-120">{payment_type || 'N/A'}</div>
			<div className="td fixed-flex min-w-140">{salary_interval || 'N/A'}</div>
			<div className="td fixed-flex min-w-150">{start_time || 'N/A'} - {end_time || 'N/A'}</div>
			<div className="td fixed-flex min-w-140">{daily_working_hours || "N/A"}</div>
			<div className="td fixed-flex min-w-105">{Dates.formatDate(start_date) || 'N/A'}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<ClearableInput ref="contract_type" name="contract_type" type="select" placeholder="Contract Type..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.contract_type} returnValue/>
			<ClearableInput ref="payment_type" name="payment_type" type="select" placeholder="Payment Type..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.payment_types} returnValue/>
			<ClearableInput ref="salary_interval" name="salary_interval" type="select" placeholder="Salary Interval..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.salary_intervals} returnValue/>
			<hr className="pull-left no-border bg-ddd h-2"/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
