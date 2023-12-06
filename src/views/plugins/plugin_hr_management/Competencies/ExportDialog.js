// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {
	ClearableInput,
	SelectTrainingCourseInput
} from 'components/inputs';
import {THead} from 'components/tables';

import {AExportDialog} from 'components/exports/AExportDialog';
import AControls from '../AEmployeeDocDialog/AEmployeeDocExportControls';
import {Dates} from "utils/Dates";
import {renderExpiryDateSpan} from "utils/ComponentUtils";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'Competency';
	titlePlural = 'Competencies';
	excludePDF = true;//TODO: Include later

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	// <editor-fold defaultstate="collapsed" desc="fields">
	path = "plugin_sheq_assist/employees/competencies/";//Used for exporting only

	selfState = {
		lists: {
			type: [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}],
			competency_type: [{label: 'Behavioural', value: 'Behavioural'}, {
				label: 'Technical / Functional',
				value: 'Technical / Functional'
			}, {label: 'Leadership', value: 'Leadership'}],
		},
	};

	filterDataExtra = {
		type: null,
		competency_type: null,
		course_id: null,
		//
		issued_date: null,
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
			competency_type,
			course_id,
			//
			issued_date,
		} = filterData || {};
		return {
			path: 'employees/docs/competencies',
			type,
			competency_type,
			course_id,
			//
			issued_date,
		};
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Employee</div>
			<div className="td">Accreditation No.</div>
			<div className="td">Certificate Type</div>
			<div className="td">Competency Type</div>
			<div className="td">Course</div>
			<div className="td">Issued Date</div>
			<div className="td fixed-flex min-w-105">Expiry Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemFrom">
	renderItemFrom(item, n, onClick, renderActionsCol) {
		let {
			id,
			data: {
				created_at,
				accreditation_num,
				competency_type,
				type,
				doc,
				issued_date,
				expiry_date,
				expiry_updated,
				employee: {lname, fname},
				training = {},
			},
		} = item;

		const {course} = training || {};

		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{lname + ' ' + fname}</div>
			<div className="td">{accreditation_num}</div>
			<div className="td">{type}</div>
			<div className="td">{competency_type}</div>
			<div className="td">{course && course.name}</div>
			<div className="td">{Dates.formatDate(issued_date)}</div>
			<div className="td fixed-flex min-w-105">{renderExpiryDateSpan(expiry_date)}</div>
		</React.Fragment>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFieldsExtra">
	get renderFieldsExtra() {
		return <>
			<ClearableInput ref="type" name="type" type="radio" placeholder="Type" vertical
			                className="col-lg-12 h-110 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.type} returnValue/>
			<ClearableInput ref="competency_type" name="competency_type" type="select" placeholder="Competency Type..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.competency_type} returnValue/>
			<SelectTrainingCourseInput ref="course_id" name="course" placeholder="Course..."
			                           className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} add={false}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="issued_date" name="issued_date" type="date" placeholder="Date Of Issue..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
		</>;
	}

	// </editor-fold>
}

export default ExportDialog;