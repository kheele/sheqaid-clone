// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import { Dates } from 'utils/Utils';
import { ActionsButton, Clickable } from 'components/inputs';
import { TRow } from 'components/tables';
import { ExpiryButtons, renderExpiryDateSpan } from 'utils/ComponentUtils';
import assetProfilePic from "assets/images/vehicle-image-loading.png";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {
	listName = 'maintenance_record_list';

	constructor() {
		super();
	}

	@computed get isAsset() {
		return this.props.view === "Asset";
	}

	@computed get isUpcoming() {
		return this.props.view === "Upcoming Maintenances";
	}

	@computed get isPast() {
		return this.props.view === "Past Maintenances";
	}

	@computed get isHistory() {
		return this.props.view === "Maintenance History";
	}

	render() {
		const { item, idx, view, onClick, renderActionsCol, onView } = this.props;
		console.log('ARenderRow', view, item)
		if (this.isAsset) {
			return <RenderRowByAsset {...this.props} listName={this.listName} />;
		} else if (this.isUpcoming) {
			return <RenderRowByUpcoming {...this.props} listName={this.listName} />;
		} else if (this.isPast) {
			return <RenderRowByPast {...this.props} listName={this.listName} />;
		} else if (this.isHistory) {
			return <RenderRowByHistory {...this.props} listName={this.listName} />;
		} else {
			return null;
		}
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByAsset">
@observer
class RenderRowByAsset extends React.Component {

	render() {
		const { item, idx, view, onClick, renderActionsCol, listName, onView } = this.props;
		console.log('RenderRowByAsset', view, item);

		let {
			id,
			data: assetData, data: {
				// maintenance_plan_list: list,
				upcoming_maintenance_list,
				last_maintenance_list,
				
				//computed
				status,
				monitoring_measurement_type,
				monitoring_measurement_unit,
				maintenance_plan_cost,
				maintenance_last_completed_date,

				past_maintenance_list_aggregate,
				past_completed_before_maintenance_list_aggregate,
				past_completed_after_maintenance_list_aggregate,
			},
		} = item;

		const [upcoming_maintenance] = upcoming_maintenance_list || [];
		const [last_maintenance] = last_maintenance_list || [];

		return <TRow key={id} className="w-full tr-header">
			<div className="td fixed-flex min-w-50">
				<h6 className="xs-shown font-size-13">ID</h6>
				{id}
			</div>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-140">{Dates.formatDate(maintenance_last_completed_date)}</div>
			<div className="td fixed-flex min-w-160">{last_maintenance && Dates.formatDate(last_maintenance.next_maintenance_date)}</div>
            <div className="td fixed-flex min-w-140">{upcoming_maintenance && renderExpiryDateSpan(upcoming_maintenance.next_maintenance_date)}</div>

			{/* <div className="td fixed-flex min-w-105">{last_maintenance && renderExpiryDateSpan(last_maintenance.next_maintenance_date)}</div> */}
			<div className="td fixed-flex flex grid-gap-5 min-w-240">
				{/* <ExpiryButtons item={item} listName={listName} /> */}
			</div>
			{renderActionsCol && renderActionsCol(item, idx, onClick)}
			{!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} isEmployee className="btn btn-primary pull-right min-w-40"
					onClick={onClick} />
			</div>}
		</TRow>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByUpcoming">
@observer
class RenderRowByUpcoming extends React.Component {

	render() {
		const { item, idx, view, onClick, renderActionsCol, onView, isExport } = this.props;
		console.log('RenderRowByUpcoming', view, item);

		let {
			id,
			data: {
				next_service_hrs_or_km,

				asset: assetData,
			},
		} = item;

		const content = <React.Fragment key={id}>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-160">
				<h6 className="xs-shown font-size-13">Next Service</h6>
				{next_service_hrs_or_km}
			</div>
		</React.Fragment>;

		if (isExport) {
			return content;
		}

		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-50">
				<h6 className="xs-shown font-size-13">ID</h6>
				{id}
			</div>
			{content}
			{renderActionsCol && renderActionsCol(item, idx, onClick)}
			{!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick} />
			</div>}
		</TRow>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByPast">
@observer
class RenderRowByPast extends React.Component {

	render() {
		const { item, idx, view, onClick, renderActionsCol, onView, isExport } = this.props;
		console.log('RenderRowByPast', view, item);

		let {
			id,
			data: {
				next_service_hrs_or_km,
				max_next_schedule_service_hrs_or_km,
				prev_maintenance_plan,

				completed_date,
				completed_hrs_or_km,
				completed_hrs_or_km_count,

				curr_monitoring_hrs_or_km,

				is_completed,
				is_completed_before,
				is_completed_after,

				is_expired_service_hrs_or_km,
				left_service_hrs_or_km,

				maintenance_plan_cost,

				percentage_curr_service_hrs_or_km,
				percentage_left_service_hrs_or_km,
				taken_service_hrs_or_km,
				total_service_hrs_or_km,

				asset: assetData,
			},
		} = item;

		const {monitoring_measurement_type, monitoring_measurement_unit} = assetData;

		const content = <React.Fragment key={id}>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">{monitoring_measurement_type} Scheduled</h6>
				{Dates.formatDate(next_service_hrs_or_km)}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Completed On</h6>
				{Dates.formatDate(completed_date)}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">{monitoring_measurement_type} Completed</h6>
				{completed_hrs_or_km_count}{monitoring_measurement_unit}
			</div>
		</React.Fragment>;

		if (isExport) {
			return content;
		}

		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-50">
				<h6 className="xs-shown font-size-13">ID</h6>
				{id}
			</div>
			{content}
			{renderActionsCol && renderActionsCol(item, idx, onClick)}
			{!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick} />
			</div>}
		</TRow>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByHistory">
@observer
class RenderRowByHistory extends React.Component {

	render() {
		const { item, idx, view, onClick, renderActionsCol, onView, isExport } = this.props;
		console.log('RenderRowByHistory', view, item);

		let {
			id,
			data: {
				reason_for_service,
				service,
				service_hrs_or_km,
				service_date,
				cost,
				receipt,

				scheduled_hrs_or_km,
				// is_completed_after,
				// is_completed_before,
				// completed_hrs_or_km_count,

				maintenance_plan: {
					next_service_hrs_or_km,
					asset: assetData
				},
			},
		} = item;

		const {monitoring_measurement_type, monitoring_measurement_unit} = assetData;

		const content = <React.Fragment key={id}>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-160">
				<h6 className="xs-shown font-size-13">Reason For Servive</h6>
				{reason_for_service || 'N/A'}
			</div>
			<div className="td fixed-flex min-w-100">
				<h6 className="xs-shown font-size-13">Service</h6>
				{service || 'N/A'}
			</div>
			<div className="td fixed-flex min-w-170">
				<h6 className="xs-shown font-size-13">Service {monitoring_measurement_type}</h6>
				{service_hrs_or_km}{monitoring_measurement_unit}
			</div>
			<div className="td fixed-flex min-w-120">
				<h6 className="xs-shown font-size-13">Service Date</h6>
				{Dates.formatDate(service_date)}
			</div>
			{/* <div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Cost & Receipt</h6>
				{cost}{receipt}
			</div> */}
			<div className="td fixed-flex min-w-180">
				<h6 className="xs-shown font-size-13">{monitoring_measurement_type} Scheduled</h6>
				{scheduled_hrs_or_km}{monitoring_measurement_unit}
			</div>
			{/* <div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Days Completed</h6>
				{completed_hrs_or_km_count}
			</div> */}
		</React.Fragment>;

		if (isExport) {
			return content;
		}

		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-50">
				<h6 className="xs-shown font-size-13">ID</h6>
				{id}
			</div>
			{content}
			{renderActionsCol && renderActionsCol(item, idx, onClick)}
			{!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick} />
			</div>}
		</TRow>;
	}
}

// </editor-fold>

function frag(idx, assetData, onView) {
	let {
		client, project, site,
		status,
		written_off,
		profile_pic: profile_pic_list,
		photo_list,
		responsible_person,
		asset_detail: {
			owning_company,
			name,
			asset_type,
			desc,
			manufacturer,
			model,
			reg_num,
			serial_num,
			location,
			toolkit,
			condition,
			barcode,
			qr_code,
			notes,
		},
	} = assetData;

	let [profile_pic] = profile_pic_list || [];
	if (!profile_pic) {
		profile_pic = (photo_list || [])[0];
	}

	return <>
		<div className="td fixed-flex min-w-80">
			<Clickable idx={idx} viewByImage onClick={onView}>
				{RenderUtils.renderImage(profile_pic && profile_pic.doc, null, '100%', assetProfilePic)}
			</Clickable>
		</div>
		<div className="td fixed-flex min-w-140">
			<h6 className="xs-shown font-size-13">Asset Type</h6>
			{asset_type}
		</div>
		<div className="td">
			<h6 className="xs-shown font-size-13">Asset</h6>
			{name || "N/A"}
		</div>
		<div className="td">
			<h6 className="xs-shown font-size-13">Location</h6>
			{location || "N/A"}
		</div>
		<div className="td fixed-flex min-w-140">
			<h6 className="xs-shown font-size-13">Reg. No.</h6>
			{reg_num || 'N/A'}
		</div>
		<div className="td fixed-flex min-w-140">
			<h6 className="xs-shown font-size-13">Serial No.</h6>
			{serial_num || 'N/A'}
		</div>
	</>;
}

export default RenderRow;
//491