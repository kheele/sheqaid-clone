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
	titleSingular = 'Counselling';
	titlePlural = 'Counsellings';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/counselling/";//Used for exporting only

	selfState = {
		lists: {
			types: [
				'Directive Counseling',
				'Nondirective Counseling',
				'Cooperative Counseling',
				'Participative Counseling',
				'Desensitization',
				'Catharsis',
				'Insight',
				'Developing the new patterns'
			].map(label => {
				return {label, value: label};
			}),
			reasons: [
				'Attendance',
				'Behaviour / Teamwork',
				'Inappropriate Conduct',
				'Inappropriate Dress',
				'Safety Violation',
				'Sleeping On The Job',
				'Substandard Work',
				'Violence'
			].map(label => {
				return {label, value: label};
			}),
		},
	};

	filterDataExtra = {
		responsible_person_id: null,
		types: null,
		reasons: null,
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
			responsible_person_id,
			types,
			reasons,
		} = filterData || {};
		return {
			path: 'employees/docs/counsellings',
			responsible_person_id,
			types,
			reasons,
		};
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Employee</div>
			<div className="td">Responsible Person</div>
			<div className="td">Types</div>
			<div className="td">Reasons</div>
			<div className="td">Incident Description</div>
			<div className="td">Corrective Actions</div>
			<div className="td">Hrs To Complete</div>
			<div className="td fixed-flex min-w-125">Date Created</div>
			<div className="td fixed-flex min-w-125">Completion Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemFrom">
	renderItemFrom(item, n) {
		let {
			id, data: {
				created_at,
				employee: {lname, fname},
				responsible_person,
				//2
				types,
				reasons,
				incident_desc,
				corrective_actions,
				counselling_hrs_to_complete,
				expiry_date,
				witness_list,
				//3
				doc
			}
		} = item;

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td">{responsible_person && responsible_person.full_name || 'N/A'}</div>
			<div className="td">{types ? types.map(v => <span>{v}</span>) : 'N/A'}</div>
			<div className="td">{reasons ? reasons.map(v => <span>{v}</span>) : 'N/A'}</div>
			<div className="td">{incident_desc || 'N/A'}</div>
			<div className="td">{corrective_actions || 'N/A'}</div>
			<div className="td">{counselling_hrs_to_complete || 'N/A'}</div>
			<div className="td fixed-flex min-w-125">{Dates.formatDate(created_at) || 'N/A'}</div>
			<div className="td fixed-flex min-w-125">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<SelectEmployeeInput ref="responsible_person_id" name="responsible_person" placeholder="Responsible Person..."
			                     className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<ClearableInput ref="types" name="types" type="select_multi" placeholder="Counseling Types..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.selfState.lists.types} returnValue add/>
			<ClearableInput ref="reasons" name="reasons" type="select_multi" placeholder="Reasons For Counseling..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.selfState.lists.reasons} returnValue/>
			<hr className="pull-left no-border bg-ddd h-2"/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;
