// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from 'utils/Utils';
import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {
	ClearableInput,
	DateRangeInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput
} from 'components/inputs';
import {THead} from 'components/tables';

import ListPDFReader from './printers/ListPDFReader';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
import byLogged from "./IDOrPassportDialog/Query/List/listAllIDOrPassportByLogged";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'ID/Passport';
	titlePlural = 'ID/Passports';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {

	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/id-or-passports/";//Used for exporting only

	@observable
	state = {
		lists: {
			expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {
				label: '1 month',
				value: 1
			}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
		},
		searchList: []
	};
	@observable filterData = {
		//
		client_id: null,
		project_id: null,
		site_id: null,
		//
		department_id: null,
		job_position_id: null,
		employee_id: null,
		//
		expiry_date: null,
		date_range: null
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
	}

	// </editor-fold>

	//<editor-fold desc="onLoadList">
	onLoadList({isNew, filterData}) {
		const {
			client_id,
			project_id,
			site_id,
			//
			department_id,
			job_position_id,
			employee_id,
			//
			expiry_date,
			date_range,
		} = filterData || {};

		const mon = Dates.formatDateSQL(new Date().addMonths(1));
		const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
		const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

		const limit = 50;

		const args = {
			view: 'EACH',
			client_id,
			project_id,
			site_id,
			//
			department_id,
			job_position_id,
			employee_id,
			//
			expiry_date,
			date_range,
			//
			// limit,
			//
			exact_orgs: true,
		};
		// const args = {
		// 	// removed,
		// 	// view, expiry_date,
		// 	mon, mon2, mon3,
		// 	//
		// 	department_id,
		// 	job_position_id,
		// 	team_id,
		// 	supervisor_id,
		// 	name,
		// 	//
		// 	limit,
		// 	//
		// 	exact_orgs: true,
		// };

		// if(!isNew) {
		// 	args.offset = this.refs.root.list.length;
		// } else {
		// 	args.offset = 0;
		// }

		return byLogged(args);
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Employee</div>
			<div className="td fixed-flex min-w-120">Type</div>
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
				expiry_date,
				type,
				doc,
				employee: {lname, fname},
			}
		} = item;

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td fixed-flex min-w-120">{type}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFields">
	get renderFields() {
		return <>
			<SelectDepartmentInput ref="department_id" name="department" placeholder="Department..."
			                       className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..."
			                        className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<SelectEmployeeInput ref="employee_id" name="employee" placeholder="Employee..."
			                     className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.expiry_date} returnValue/>
			<DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
			                placeholder="Expiry Date Range" onChange={this.form.onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
			<ListPDFReader ref="pdfReader"/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
