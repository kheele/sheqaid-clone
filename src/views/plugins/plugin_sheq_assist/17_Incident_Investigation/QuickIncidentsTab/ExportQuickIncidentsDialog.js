// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";

import {Dates} from 'utils/Utils';
import {
	ClearableInput, DateRangeInput,
	SelectEmployeeInput,
	SelectIncidentCategoryList,
} from 'components/inputs';
import {THead} from 'components/tables';

import style from "./ExportQuickIncidentsDialog.lazy.css";
import {AControls, AExportDialog} from "components/exports/AExportDialog";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportQuickIncidentsDialog extends AExportDialog {
	pageKey = "ExportQuickIncidentsDialog";
	titleSingular = 'Quick Incident';
	titlePlural = 'Quick Incidents';
	
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
	exportFn = sockets.of('incidents-quick').fn('export-excel');
	
	//<editor-fold desc="state">
	@observable
	state = {
		lists: {
			is_vehicle_incident: ['Yes', 'No'].map(value => ({label: value, value: value === "Yes", checked: false})),
			severity: ['Medical Examination', 'Working / At Work'].map(value => ({
				label: value,
				value,
				checked: false
			})),
			time_shift: ['Day', 'Night'].map(value => ({label: value, value, checked: false})),
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
		category_list: null,
		time_shift: null,
		person_reporting_id: null,
		person_reporting_other_id: null,//
		person_injured_id: null,
		person_injured_other_id: null,//
		driver_id: null,
		driver_other_id: null,//
		severity: null,
		exact_location: null,
		is_vehicle_incident: null,
		vehicle_make: null,
		vehicle_reg_num: null,
		//
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
			id,
			category_list,
			time_shift,
			person_reporting_id,
			person_reporting_other_id,
			person_injured_id,
			person_injured_other_id,
			driver_id,
			driver_other_id,
			severity,
			exact_location,
			is_vehicle_incident,
			vehicle_make,
			vehicle_reg_num,
			//
			incident_date_range,
			date_reported_range,
		} = filterData || {};
		
		const listByLogged = sockets.of('incidents-quick').fn('listByLogged');
		
		return listByLogged({
			id,
			category_list,
			time_shift,
			person_reporting_id,
			person_reporting_other_id,
			person_injured_id,
			person_injured_other_id,
			driver_id,
			driver_other_id,
			severity,
			exact_location,
			is_vehicle_incident,
			vehicle_make,
			vehicle_reg_num,
			//
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
			<div className="td fixed-flex min-w-180">Date & Time</div>
			<div className="td fixed-flex min-w-140">Severity</div>
			<div className="td">Category</div>
			<div className="td">Reported By</div>
			<div className="td">Person Injured</div>
			<div className="td fixed-flex min-w-160">Asset</div>
			<div className="td">Driver</div>
			<div className="td">Description</div>
			<div className="td">Exact Location</div>
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
				//
				company,
				client,
				project,
				site,
				//
				logged_user,
				logged_employee,
				//Step 2 (Incident Details)
				latitude,
				longitude,
				exact_location,
				short_desc,
				//Step 3 (Date & Time)
				incident_date,
				incident_time,
				date_reported,
				time_reported,
				time_shift,
				//Step 4 (Incident Category)
				category_list,
				//Step 5 (Injury Report)
				person_reporting,
				//Step 6 (Injury Details)
				person_injured,
				nature_of_injury_list,
				bodily_injury_location_list,
				injury_mechanism_list,
				//6.2 Motor Vehicle
				is_vehicle_incident,
				driver,
				driver_email,
				driver_phone,
				vehicle_make,
				vehicle_reg_num,
				//6.3 Incident Severity
				severity,
				//Step 7 (Media Details)
				image_list,
				video_list,
			}
		} = item;
		
		return <React.Fragment key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td fixed-flex min-w-180">
				{(incident_date || incident_time) ? <Chip
					label={<>{Dates.formatDate(incident_date)}<br/>{incident_time}</>} size="medium"
				/> : 'N/A'}
			</div>
			<div className="td fixed-flex min-w-140">
				{severity || 'N/A'}
			</div>
			<div className="td">
				{category_list ? <Grid container spacing={1} columns={4}>{
					category_list.map(({category: {name}}) => <Grid item><Chip label={name} size="small"/></Grid>)}
				</Grid> : 'N/A'}
			</div>
			<div className="td">
				{person_reporting && person_reporting.full_name || 'N/A'}
			</div>
			<div className="td">
				{person_injured && person_injured.full_name || 'N/A'}
			</div>
			<div className="td">
				{is_vehicle_incident ? `${vehicle_make ? `${vehicle_make}${vehicle_reg_num ? `(${vehicle_reg_num})` : ''}` : vehicle_reg_num || 'N/A'}` : 'N/A'}
			</div>
			<div className="td">
				{driver && driver.full_name || 'N/A'}
			</div>
			<div className="td">{short_desc || 'N/A'}</div>
			<div className="td">
				{(latitude && longitude) || exact_location ? <Grid container spacing={1} columns={4}>
					{latitude && longitude && <Grid item>
						<Chip label={latitude + ', ' + longitude} size="small"/>
					</Grid>}
					{exact_location && <Grid item>
						<Chip label={exact_location} size="small"/>
					</Grid>}
				</Grid> : 'N/A'}
			</div>
		</React.Fragment>;
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFields">
	get renderFields() {
		const {onChange} = this.form;
		
		return <>
			<SelectEmployeeInput
				ref="person_reporting"
				name="person_reporting"
				placeholder="Reported By..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				ref="person_injured"
				name="person_injured"
				placeholder="Person Injured..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<SelectEmployeeInput
				ref="driver"
				name="driver"
				placeholder="Driver..."
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<SelectIncidentCategoryList
				ref="category_list"
				name="category_list"
				type="select_multi"
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			<ClearableInput
				ref="severity"
				name="severity"
				type="radio"
				placeholder="Severity"
				className="form-control col-lg-12"
				onChange={onChange}
				values={this.state.lists.severity}
				returnValue
			/>
			<ClearableInput
				ref="exact_location"
				name="exact_location"
				type="text"
				placeholder="Exact Location"
				className="form-control col-lg-12"
				onChange={onChange}
			/>
			
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput
				ref="is_vehicle_incident"
				name="is_vehicle_incident"
				type="radio"
				placeholder="Vehicle Incident"
				className="form-control col-lg-12"
				onChange={onChange}
				values={this.state.lists.is_vehicle_incident.map(({text: label, value}) => ({
					label,
					value: value === "Yes"
				}))}
				returnValue
			/>
			<ClearableInput ref="vehicle_make" name="vehicle_make" type="text" placeholder="Vehicle Make"
			                className="form-control col-lg-12" onChange={onChange}/>
			<ClearableInput ref="vehicle_reg_num" name="vehicle_reg_num" type="text" placeholder="Reg/Serial No."
			                className="form-control col-lg-12" onChange={onChange}/>
			
			<ClearableInput ref="time_shift" name="time_shift" type="radio" placeholder="Time Shift"
			                className="form-control col-lg-12" onChange={onChange}
			                values={this.state.lists.time_shift} returnValue/>
			
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

export default ExportQuickIncidentsDialog;
