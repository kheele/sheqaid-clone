// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

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
	titleSingular = 'Medical Certificate';
	titlePlural = 'Medical Certificates';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/medicals/";//Used for exporting only

	selfState = {
		lists: {
			annexture_3: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
		},
	};

	filterDataExtra = {
		annexture_3: null,
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
			annexture_3,
		} = filterData || {};
		return {
			path: 'employees/docs/medicals',
			annexture_3,
		};
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Employee</div>
			<div className="td">Restrictions</div>
			<div className="td">Annexture 3?</div>
			<div className="td fixed-flex min-w-105">Expiry Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemFrom">
	renderItemFrom(item, n) {//
		let {
			id, data: {
				created_at,
				date,
				annexture_3,
				restrictions,
				expiry_date,
				expiry_updated,
				doc,
				employee: {lname, fname},
			}
		} = item;

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td">{restrictions}</div>
			<div className="td">{annexture_3}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<ClearableInput ref="annexture_3" name="annexture_3" type="radio" placeholder="Annexture 3?" vertical
			                className="col-lg-12 h-110 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.annexture_3} returnValue/>
			<hr className="pull-left no-border bg-ddd h-2"/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
