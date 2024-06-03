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
import AControls from '../../AEmployeeDocDialog/AEmployeeDocExportControls';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'License';
	titlePlural = 'Licenses';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/licenses/";//Used for exporting only

	filterDataExtra = {
		notes: null,
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
			notes,
			//
			date,
		} = filterData || {};
		return {
			path: 'employees/docs/licenses',
			notes,
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
			<div className="td">Notes</div>
			<div className="td fixed-flex min-w-120">Date</div>
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
			<div className="td">{notes}</div>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(date) || 'N/A'}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<ClearableInput ref="notes" name="notes" type="text" placeholder="Notes"
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="date" name="date" type="date" placeholder="Date..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
