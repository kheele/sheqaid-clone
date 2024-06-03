// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
import { computed, } from 'mobx';

import { Dates } from 'utils/Utils';
import { Button } from 'components/inputs';

import {
	IncidentTableRow
} from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponentRows';
// </editor-fold>

//<editor-fold desc="SelectedSource">
@observer
class SelectedSource extends React.Component {
	renderPerson({ other_person, employee }) {
		const email = (employee || other_person).email;
		return <span>{(employee || other_person).full_name}{email ? `${email}` : ''}</span>;
	}

	renderIncidentCategory(v) {
		return <span>{v}</span>;
	}

	// <editor-fold defaultstate="collapsed" desc="renderSiteAudit">
	@computed get renderSiteAudit() {
		const { source, selected_source, onClick } = this.props;
		return null;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderAudit">
	@computed get renderAudit() {
		const { source, selected_source, onClick } = this.props;
		const {
			id,
			data: { created_at, client, scope, date, type, representative_list, auditor_list, definition_list, list }
		} = selected_source;
		return <div className="row margin-0">
			<div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
				<label>Company</label><br />
				{(client && (client.name || client.data.name)) || 'N/A'}
			</div>
			<div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
				<label>Type</label><br />
				{type}
			</div>
			<div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
				<label>Scope</label><br />
				{scope}
			</div>
			<div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
				<label>Date</label><br />
				{Dates.formatDate(date)}
			</div>
			<div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
				<label>Representative(s)</label><br />
				{!representative_list ? 'N/A' : representative_list.map(this.renderPerson)}
			</div>
			<div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
				<label>Auditor(s)</label><br />
				{!auditor_list ? 'N/A' : auditor_list.map(this.renderPerson)}
			</div>
			<Button
				text={"Select " + source.label + " Finding..."}
				className='btn btn-primary block min-w-300 hor-center margin-t-10 margin-b-5 border-radius-20'
				onClick={onClick}
			/>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderInspection">
	@computed get renderInspection() {
		const { source, selected_source, onClick } = this.props;
		const {
			id, data: {
				created_at,
				name,
				desc,
				status,
				status_answered_by_sender,
				is_template,
				type,
				visibility,
				scheduled,
				page_title_list,
				question_list,
				progress,
				total_questions,
				//
				interval,
				start_date,
				date_completed,
				time_completed,
				schedule_date,
				next_schedule_date,
				responsible_person,
				responsible_department,
				asset_type,
				asset,
				schedule_list = [],
				//
				template
			}
		} = selected_source;

		return <>
			<div className="row margin-0">
				<div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Name</label><br />
					{name}
				</div>
				<div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Asset</label><br />
					{asset ? `${asset.asset_detail.name} (${asset.asset_detail.reg_num || asset.asset_detail.serial_num})` : 'N/A'}
				</div>
				<div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Responsible Person</label><br />
					{responsible_person && responsible_person.full_name || 'N/A'}
				</div>
				<div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
					<label>Interval</label><br />
					{interval}
				</div>
				<div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
					<label>Date Scheduled</label><br />
					{Dates.formatDateTime(schedule_date)}
				</div>
				<div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
					<label>Conducted On</label><br />
					{Dates.formatDate(date_completed)} {time_completed}
				</div>
				<Button
					text={"Select " + source.label + " Question..."}
					className='btn btn-primary block min-w-300 hor-center margin-t-10 margin-b-5 border-radius-20'
					onClick={onClick}
				/>
			</div>
		</>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderIncidentInvestigation">
	@computed get renderIncidentInvestigation() {
		const { source, selected_source, onClick } = this.props;
		let {
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
		} = selected_source;
		return <>
			{/* <IncidentTableRow key={new Date().getTime()} item={selected_source} /> */}
			<Button
				text={"Select " + source.label + " Cause..."}
				className='btn btn-primary block min-w-300 hor-center margin-t-10 margin-b-5 border-radius-20'
				onClick={onClick}
			/>
		</>;
	}

	// </editor-fold>

	@computed get renderSource() {
		const { source } = this.props;
		switch (source.label) {
			case "Site Audit":
				return this.renderSiteAudit;
			case "Compliance Audit":
				return this.renderAudit;
			case "Inspection":
				return this.renderInspection;
			case "Incident Investigation":
				return this.renderIncidentInvestigation;
		}
		return null;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const { source, selected_source, onClick } = this.props;
		console.log('selected_source', selected_source)

		return <div className="row margin-0">
			<hr className="margin-t-10 margin-r-10 margin-b-0" />
			<label
				className="bg-f8f8f8 block margin-0 margin-r-10 padding-5 text-center">Selected {source.label} Details</label>
			<hr className="margin-t-0 margin-r-10 margin-b-5" />
			{this.renderSource}
		</div>;
	}

	// </editor-fold>
}
//</editor-fold>

export { SelectedSource };
