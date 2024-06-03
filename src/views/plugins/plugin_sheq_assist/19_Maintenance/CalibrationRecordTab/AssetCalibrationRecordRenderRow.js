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
	listName = 'calibration_record_list';

	constructor() {
		super();
	}

	@computed get isAsset() {
		return this.props.view === "Asset";
	}

	@computed get isUpcoming() {
		return this.props.view === "Upcoming Calibrations";
	}

	@computed get isPast() {
		return this.props.view === "Past Calibrations";
	}

	@computed get isHistory() {
		return this.props.view === "Calibration History";
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
				// calibration_record_list: list,
				upcoming_calibration_list,
				last_calibration_list,

				calibration_last_completed_date,

				past_calibration_list_aggregate,
				past_completed_before_calibration_list_aggregate,
				past_completed_after_calibration_list_aggregate,
			},
		} = item;

		const [upcoming_calibration] = upcoming_calibration_list || [];
		const [last_calibration] = last_calibration_list || [];

		return <TRow key={id} className="w-full tr-header">
			<div className="td fixed-flex min-w-50">
				<h6 className="xs-shown font-size-13">ID</h6>
				{id}
			</div>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-140">{Dates.formatDate(calibration_last_completed_date)}</div>
			<div className="td fixed-flex min-w-160">{last_calibration && Dates.formatDate(last_calibration.next_calibration_date)}</div>
            <div className="td fixed-flex min-w-140">{upcoming_calibration && renderExpiryDateSpan(upcoming_calibration.next_calibration_date)}</div>

			{/* <div className="td fixed-flex min-w-105">{last_calibration && renderExpiryDateSpan(last_calibration.next_calibration_date)}</div> */}
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
				next_calibration_date,
				next_calibration_interval,

				asset: assetData,
			},
		} = item;

		const content = <React.Fragment key={id}>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-160">
				<h6 className="xs-shown font-size-13">Calibration Interval</h6>
				{next_calibration_interval}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Next Calibration</h6>
				{renderExpiryDateSpan(next_calibration_date)}
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
				next_calibration_date,
				next_calibration_interval,

				is_completed,
				is_completed_before,
				is_completed_after,
				completed_date,
				completed_day_count,

				asset: assetData,
			},
		} = item;

		const content = <React.Fragment key={id}>
			{frag(idx, assetData, onView)}
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Date Scheduled</h6>
				{Dates.formatDate(next_calibration_date)}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Completed On</h6>
				{Dates.formatDate(completed_date)}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Days Completed</h6>
				{completed_day_count || 'N/A'}
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
				calibrating_company,
				reference_standard,
				certificate_num,
				calibration_date,

				scheduled_date,
				is_completed_after,
				is_completed_before,
				completed_day_count,

				calibration_record: {
					next_calibration_date,
					next_calibration_interval,
					asset: assetData
				},
			},
		} = item;

		const content = <React.Fragment key={id}>
			{frag(idx, assetData, onView)}
			<div className="td">
				<h6 className="xs-shown font-size-13">Calibrating Company</h6>
				{calibrating_company || 'N/A'}
			</div>
			<div className="td fixed-flex min-w-160">
				<h6 className="xs-shown font-size-13">Reference Standard</h6>
				{reference_standard || 'N/A'}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Certificate No.</h6>
				{certificate_num || 'N/A'}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Calibration Date</h6>
				{Dates.formatDate(calibration_date)}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Date Scheduled</h6>
				{Dates.formatDate(scheduled_date)}
			</div>
			<div className="td fixed-flex min-w-140">
				<h6 className="xs-shown font-size-13">Days Completed</h6>
				{completed_day_count}
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