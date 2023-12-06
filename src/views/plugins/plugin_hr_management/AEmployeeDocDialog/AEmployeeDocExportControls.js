// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, extendObservable} from 'mobx';
import {
	ClearableInput,
	DateRangeInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput,
} from 'components/inputs';

import {AControls} from 'components/exports/AExportDialog';
// </editor-fold>

@observer
class Controls extends AControls {

	// <editor-fold defaultstate="collapsed" desc="fields">
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
		// ...attrs,
		//
		expiry_date: null,
		date_range: null
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
//"https://storage.googleapis.com/sheqsolve.appspot.com/employees%2F9851%2Fdocs%2Fwork-permits%2F15%2FWork-Permit-doc-04-Dec-2023%2015%3A53%3A59.PNG?alt=media&token=b941a7c5-4697-454e-8748-4933a4a7b1cc"
		this.onBuildQuery = this.onBuildQuery.bind(this);

		if(this.selfState && this.selfState.lists) {
			this.state.lists = {...this.state.lists, ...this.selfState.lists};
		}
		if(this.filterDataExtra) {
			extendObservable(this.filterData, this.filterDataExtra);
		}
	}

	// </editor-fold>

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {onBuildQuery} = this;

		const {page, lastItem, filterData, filtered, isNew} = params;

		const attrs = onBuildQuery ? onBuildQuery(params) : {};

		const {
			client_id,
			project_id,
			site_id,
			//
			department_id,
			job_position_id,
			employee_id,
			team_id,
			supervisor_id,
			name,
			//
			expiry_date,
			date_range,
		} = filterData || {};

		const listByLogged = sockets.of(attrs.path).fn('listByLogged');
		delete attrs.path;

		return listByLogged({
			view: 'EACH',
			client_id,
			project_id,
			site_id,
			//
			expiry_date,
			date_range,
			//
			department_id,
			job_position_id,
			employee_id,
			team_id,
			supervisor_id,
			name,
			//
			...attrs,
			//
			exact_orgs: true,
			//
			limit: 0,
			offset: 0,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	//</editor-fold>

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
			{this.renderFieldsExtra}

			<ClearableInput ref="expiry_date" name="expiry_date" type="select" placeholder="Expiry..."
			                className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}
			                values={this.state.lists.expiry_date} returnValue/>
			<DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
			                placeholder="Expiry Date Range" onChange={this.form.onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
		</>;
	}

	// </editor-fold>
}

export default Controls;