// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {
	ClearableInput,
	DateRangeInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput,
	SelectTrainingCourseInput
} from 'components/inputs';
import {THead} from 'components/tables';

import ListPDFReader from './printers/ListPDFReader';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
import {Dates} from "utils/Dates";
import byLogged from "./CompetenciesDialog/Query/List/listAllCompetencyByLogged";
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

	@observable
	state = {
		lists: {
			type: [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}],
			competency_type: [{label: 'Behavioural', value: 'Behavioural'}, {
				label: 'Technical / Functional',
				value: 'Technical / Functional'
			}, {label: 'Leadership', value: 'Leadership'}],
			expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {
				label: '1 month',
				value: 1
			}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
		},
		searchList: []
	};

	@observable
	filterData = {
		//
		client_id: null,
		project_id: null,
		site_id: null,
		//
		department_id: null,
		job_position_id: null,
		employee_id: null,
		//
		type: null,
		competency_type: null,
		course_or_module: null,
		//
		issued_date: null,
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
			type,
			competency_type,
			course_or_module,
			//
			issued_date,
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
			type,
			competency_type,
			course_or_module,
			//
			issued_date,
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

	// <editor-fold defaultstate="collapsed" desc="renderFields">
	get renderFields() {
		return <React.Fragment>
			<SelectDepartmentInput ref="department_id" name="department" placeholder="Department..."
			                       className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<SelectJobPositionInput ref="job_position_id" name="job_position" placeholder="Employee Job Position..."
			                        className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<SelectEmployeeInput ref="employee_id" name="employee" placeholder="Employee..."
			                     className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="type" name="type" type="radio" placeholder="Type" vertical
			                className="col-lg-12 h-110 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.type} returnValue/>
			<ClearableInput ref="competency_type" name="competency_type" type="select" placeholder="Competency Type..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.competency_type} returnValue/>
			<SelectTrainingCourseInput ref="course_or_module" name="course_or_module" placeholder="Course..."
			                           className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} add={false}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="issued_date" name="issued_date" type="date" placeholder="Date Of Issue..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
			<ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.expiry_date} returnValue/>
			<DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
			                placeholder="Expiry Date Range" onChange={this.form.onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
			<ListPDFReader ref="pdfReader"/>
		</React.Fragment>;
	}

	// </editor-fold>
}

export default ExportDialog;