// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
// </editor-fold>

//<editor-fold desc="SelectedSourceItemAuditFinding">
@observer
class SelectedSourceItemAuditFinding extends React.Component {
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const { selected_source_item } = this.props;
		console.log('selected_source_item', selected_source_item)
		let {
			responsible_person,
			audit_findings, audit_summary,
			possible_score, achieved_score, compliance,
			comments
		} = selected_source_item;

		return <div className="row margin-0">
			<hr className="margin-t-10 margin-r-10 margin-b-0" />
			<label className="bg-f8f8f8 block margin-0 margin-r-10 padding-5 text-center">Selected Audit Findings</label>
			<hr className="margin-t-0 margin-r-10 margin-b-5" />
			<div className="row margin-0">
				<div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Audit
					Findings</label><br />{audit_findings || 'N/A'}</div>
				<div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Responsible
					Person</label><br />{responsible_person ? responsible_person.full_name : 'N/A'}</div>
				<div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Audit
					Summary</label><br />{audit_summary || 'N/A'}</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Possible
					Score</label><br />{possible_score}</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Achieved
					Score</label><br />{achieved_score}</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Compliance</label><br />{compliance}%
				</div>
				<div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Comments</label><br />{comments || 'N/A'}</div>
			</div>
		</div>;
	}

	// </editor-fold>
}
//</editor-fold>

//<editor-fold desc="SelectedSourceItemInspectionQuestion">
@observer
class SelectedSourceItemInspectionQuestion extends React.Component {
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const { selected_source_item } = this.props;
		console.log('selected_source_item', selected_source_item)
		let {
			questionText,
			///
			answer,
			responseAttachment,
			hasResponseAttachment,
			//
			responseAttachmentRequired,
			hasExpiry,
			expiry,
			isMultiAnswer,
			options,
			questionType,
		} = selected_source_item;

		return <div className="row margin-0">
			<hr className="margin-t-10 margin-r-10 margin-b-0" />
			<label className="bg-f8f8f8 block margin-0 margin-r-10 padding-5 text-center">Selected Inspection Question</label>
			<hr className="margin-t-0 margin-r-10 margin-b-5" />
			<div className="row margin-0">
				<div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Inspection Question</label>
					<br />{questionText}
				</div>
				<div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Responsible Person</label>
					<br />{responsible_person ? responsible_person.full_name : 'N/A'}
				</div>
				<div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Audit Summary</label>
					<br />{audit_summary || 'N/A'}
				</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Possible Score</label>
					<br />{possible_score}
				</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Achieved Score</label>
					<br />{achieved_score}
				</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Compliance</label>
					<br />{compliance}%
				</div>
				<div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Comments</label>
					<br />{comments || 'N/A'}
				</div>
			</div>
		</div>;
	}

	// </editor-fold>
}
//</editor-fold>

//<editor-fold desc="SelectedSourceItemIncidentCause">
@observer
class SelectedSourceItemIncidentCause extends React.Component {
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const { selected_source_item } = this.props;
		console.log('selected_source_item', selected_source_item)
		let {
			questionText,
			///
			answer,
			responseAttachment,
			hasResponseAttachment,
			//
			responseAttachmentRequired,
			hasExpiry,
			expiry,
			isMultiAnswer,
			options,
			questionType,
		} = selected_source_item;

		return <div className="row margin-0">
			<hr className="margin-t-10 margin-r-10 margin-b-0" />
			<label className="bg-f8f8f8 block margin-0 margin-r-10 padding-5 text-center">Selected Inspection Question</label>
			<hr className="margin-t-0 margin-r-10 margin-b-5" />
			<div className="row margin-0">
				<div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Inspection Question</label>
					<br />{questionText}
				</div>
				<div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Responsible Person</label>
					<br />{responsible_person ? responsible_person.full_name : 'N/A'}
				</div>
				<div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Audit Summary</label>
					<br />{audit_summary || 'N/A'}
				</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Possible Score</label>
					<br />{possible_score}
				</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Achieved Score</label>
					<br />{achieved_score}
				</div>
				<div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Compliance</label>
					<br />{compliance}%
				</div>
				<div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
					<label>Comments</label>
					<br />{comments || 'N/A'}
				</div>
			</div>
		</div>;
	}

	// </editor-fold>
}
//</editor-fold>

export { SelectedSourceItemAuditFinding, SelectedSourceItemInspectionQuestion, SelectedSourceItemIncidentCause };
