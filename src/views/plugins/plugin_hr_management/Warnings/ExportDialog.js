// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {
	ClearableInput,
	SelectEmployeeInput,
} from 'components/inputs';
import {THead} from 'components/tables';

import {AExportDialog} from 'components/exports/AExportDialog';
import AControls from '../AEmployeeDocDialog/AEmployeeDocExportControls';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'Warning';
	titlePlural = 'Warnings';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/warnings/";//Used for exporting only

	selfState = {
		lists: {
			warning_types: ['Verbal', 'Written', 'Final'],
		},
	};

	filterDataExtra = {
		issued_by_id: null,
		witness_id: null,
		type: null,
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
			issued_by_id,
			witness_id,
			type,
			//
			date,
		} = filterData || {};
		return {
			path: 'employees/docs/warnings',
			issued_by_id,
			witness_id,
			type,
			//
			date,
		};
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Employee</div>
			<div className="td">Issued By</div>
			<div className="td fixed-flex min-w-105">Witnesses</div>
			<div className="td fixed-flex min-w-140">Warning Type</div>
			<div className="td">Details</div>
			<div className="td fixed-flex min-w-140">Warning Date</div>
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
				issued_by,
				type,
				details,
				employee_comments,
				witness_list,

				date,
				expiry_date,
				expiry_updated,
				notes,
				doc,
				employee: {lname, fname},
			}
		} = item;

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td">{issued_by ? issued_by.full_name : 'N/A'}</div>
			<div className="td fixed-flex min-w-105">{witness_list ? witness_list.length || 'N/A' : 'N/A'}</div>
			<div className="td fixed-flex min-w-140">{type || 'N/A'}</div>
			<div className="td">{details || 'N/A'}</div>
			<div className="td fixed-flex min-w-140">{Dates.formatDate(date) || 'N/A'}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<SelectEmployeeInput ref="issued_by_id" name="issued_by" placeholder="Issued By..."
			                     className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<SelectEmployeeInput ref="witness_id" name="witness" placeholder="Witness..."
			                     className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<ClearableInput ref="type" name="type" type="select" placeholder="Warning Type..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.warning_types} returnValue/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="date" name="date" type="date" placeholder="Warning Date..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
