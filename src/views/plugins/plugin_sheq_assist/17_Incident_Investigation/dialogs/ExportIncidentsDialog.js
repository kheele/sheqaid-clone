// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";

import {Dates} from 'utils/Utils';
import {
	ClearableInput, DateRangeInput,
	SelectEmployeeInput, SelectIncidentCategoryList,
} from 'components/inputs';
import {THead} from 'components/tables';

import {IncidentStatus} from './IncidentComponentRows';
import style from "./ExportIncidentsDialog.lazy.css";
import {AControls, AExportDialog} from "components/exports/AExportDialog";
import StateLists from "./IncidentForms/StateLists";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportIncidentsDialog extends AExportDialog {
	pageKey = "ExportIncidentsDialog";
	titleSingular = 'Incident';
	titlePlural = 'Incidents';
	
	componentWillMount() {
		super.componentWillMount();
		style.use();
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		style.unuse();
	}
	
	get excludePDF() {
		return true;
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	path = 'plugin_sheq_assist/17_Incident_Investigation/';
	
	//<editor-fold desc="state">
	@observable
	state = {
		lists: {
			...StateLists,
			incident_status: [
				{label: 'Awaiting Approval', value: 'AwaitingApproval', checked: false},
				{label: 'Approved Incident', value: 'ApprovedIncident', checked: false},
				{label: 'Assigned Investigator', value: 'AssignedInvestigator', checked: false},
				{label: 'Investigating', value: 'Investigating', checked: false},
				{label: 'Closed Incident', value: 'ClosedIncident', checked: false}
			],
			investigation_status: [
				{label: 'Awaiting Investigation Approval', value: 'AwaitingInvestigationApproval', checked: false},
				{label: 'Approved Investigation', value: 'ApprovedInvestigation', checked: false},
				{label: 'Closed Investigation', value: 'ClosedInvestigation', checked: false},
			],
		},
		searchList: [],
	};
	//</editor-fold>
	
	//<editor-fold desc="filterData">
	@observable
	filterData = {
		//
		client_id: null,
		project_id: null,
		site_id: null,
		//
		person_reporting_id: null,
		person_reported_to_id: null,
		person_involved_id: null,
		person_injured_id: null,
		witness_id: null,
		person_distributed_to_id: null,
		driver_id: null,
		//
		category_list: null,
		sub_category_list: null,
		activity_list: null,
		//
		exact_location: null,
		is_vehicle_incident: null,
		vehicle_make: null,
		vehicle_reg_num: null,
		incident_status: null,
		investigation_status: null,
		//
		group: null,
		consequence: null,
		likelihood: null,
		risk_rating: null,
		//
		day_group: null,
		time_shift: null,
		incident_date_range: null,
		date_reported_range: null,
	};
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
	}
	
	// </editor-fold>
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			person_reporting_id,
			person_reported_to_id,
			person_involved_id,
			person_injured_id,
			witness_id,
			person_distributed_to_id,
			driver_id,
			//
			category_list,
			sub_category_list,
			activity_list,
			//
			exact_location,
			is_vehicle_incident,
			vehicle_make,
			vehicle_reg_num,
			incident_status,
			investigation_status,
			//
			group,
			consequence,
			likelihood,
			risk_rating,
			//
			day_group,
			time_shift,
			incident_date_range,
			date_reported_range,
		} = filterData || {};
		
		const listByLogged = sockets.of('incidents').fn('listByLogged');
		
		return listByLogged({
			person_reporting_id,
			person_reported_to_id,
			person_involved_id,
			person_injured_id,
			witness_id,
			person_distributed_to_id,
			driver_id,
			//
			category_list,
			sub_category_list,
			activity_list,
			//
			exact_location,
			is_vehicle_incident,
			vehicle_make,
			vehicle_reg_num,
			incident_status,
			investigation_status,
			//
			group,
			consequence,
			likelihood,
			risk_rating,
			//
			day_group,
			time_shift,
			incident_date_range,
			date_reported_range,
			//
			exact_orgs: true,
			data_export: true,
			//
			limit: 0,
			offset: 0,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td fixed-flex min-w-120">Incident Date</div>
			<div className="td fixed-flex min-w-120">Risk Rating</div>
			<div className="td">Category</div>
			<div className="td">Sub-Category</div>
			<div className="td">Short Description</div>
			<div className="td">Exact Location</div>
			<div className="td fixed-flex min-w-140">Status</div>
			<div className="td fixed-flex no-padding min-w-70"></div>
		</THead>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderItemFrom">
	renderItemFrom(item, n) {
		const {
			id,
			data: {
				created_at,
				client, project, site,
				investigation,
				//
				severity,//{consequence, likelihood}
				incident_date,
				short_desc,
				location,
				exact_location,
				//
				category_list,
				sub_category_list,
				sector_list,
				activity_list,
				//
			}
		} = item;
		
		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td fixed-flex min-w-120">
				{Dates.formatDate(incident_date) || 'N/A'}
			</div>
			<div className="td fixed-flex min-w-120">
				{severity ? severity.risk_rating : 'N/A'}
			</div>
			<div className="td">
				{category_list ? <Grid container spacing={1} columns={4}>{
					category_list.map(({category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
				</Grid> : 'N/A'}
			</div>
			<div className="td">
				{sub_category_list ? <Grid container spacing={1} columns={4}>{
					sub_category_list.map(({sub_category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
				</Grid> : 'N/A'}
			</div>
			<div className="td">{short_desc || 'N/A'}</div>
			<div className="td">{exact_location || 'N/A'}</div>
			<IncidentStatus key={new Date().getTime()} item={item}/>
		</React.Fragment>;
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFields">
	get renderFields() {
		const {onChange} = this.form;
		
		return <>
			<SelectEmployeeInput
				name="person_reported_to"
				placeholder="Reported To..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				name="person_involved"
				placeholder="Person Involved..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				name="person_injured"
				placeholder="Person Injured..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				name="witness"
				placeholder="Witness..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				name="person_distributed_to"
				placeholder="Person Distributed To..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				name="driver"
				placeholder="Driver..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<SelectIncidentCategoryList
				name="category_id"
				type="select"
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<ClearableInput name="day_group" type="radio" placeholder="Morning / Afternoon"
			                className="form-control col-lg-12" onChange={onChange}
			                values={this.state.lists.day_group} returnValue/>
			<ClearableInput name="time_shift" type="radio" placeholder="Time Shift"
			                className="form-control col-lg-12" onChange={onChange}
			                values={this.state.lists.time_shift} returnValue/>
			<ClearableInput
				name="exact_location"
				type="text"
				placeholder="Exact Location"
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput
				name="is_vehicle_incident"
				type="select"
				placeholder="Vehicle Incident?"
				className="form-control col-lg-12"
				onChange={onChange}
				values={this.state.lists.is_vehicle_incident.map(({text: label, value}) => ({
					label,
					value: value === "Yes"
				}))}
				returnValue
			/>
			<ClearableInput name="vehicle_make" type="text" placeholder="Vehicle Make"
			                className="form-control col-lg-12" onChange={onChange}/>
			<ClearableInput name="vehicle_reg_num" type="text" placeholder="Reg/Serial No."
			                className="form-control col-lg-12" onChange={onChange}/>
			<ClearableInput name="incident_status" type="select" placeholder="Incident Status..."
			                className="form-control col-lg-12" onChange={onChange}
			                values={this.state.lists.incident_status} returnValue/>
			<ClearableInput name="investigation_status" type="select" placeholder="Investigation Status..."
			                className="form-control col-lg-12" onChange={onChange}
			                values={this.state.lists.investigation_status} returnValue/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput
				name="group"
				type="select"
				placeholder="Incident Group"
				className="form-control col-lg-12"
				onChange={onChange}
				values={this.state.lists.group.map(({text: label, value}) => ({label, value}))}
				returnValue
			/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput
				name="consequence"
				type="select"
				placeholder="Consequence / Severity"
				className="form-control col-lg-12"
				onChange={onChange}
				values={this.state.lists.consequence.map(({text: label, value}) => ({label, value}))}
				returnValue
			/>
			<ClearableInput
				name="likelihood"
				type="select"
				placeholder="Likelihood / Probability"
				className="form-control col-lg-12"
				onChange={onChange}
				values={this.state.lists.likelihood.map(({text: label, value}) => ({label, value}))}
				returnValue
			/>
			<ClearableInput
				name="risk_rating"
				type="select"
				placeholder="Risk Rating"
				className="form-control col-lg-12"
				onChange={onChange}
				values={[...this.state.lists.risk_rating.map(({text: label, value}) => ({label, value})), {
					label: 'N/A',
					value: 'N/A'
				}]}
				returnValue
			/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<DateRangeInput ref="incident_date_range" name="incident_date_range" vertical
			                className="col-lg-12 h-75 margin-0 form-control" placeholder="Incident Date Range"
			                onChange={onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
			<DateRangeInput ref="date_reported_range" name="date_reported_range" vertical
			                className="col-lg-12 h-75 margin-0 form-control" placeholder="Reported Date Range"
			                onChange={onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
		</>;
	}
	
	// </editor-fold>
}

export default ExportIncidentsDialog;
