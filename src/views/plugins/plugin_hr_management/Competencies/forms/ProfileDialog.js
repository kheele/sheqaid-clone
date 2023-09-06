import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../AEmployeeDocControls";
import employeeStore from "mutations/all/Employee";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import updateEmployeeCompetency from "mutations/all/EmployeeCompetency/updateEmployeeCompetency";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileCompetencyCertificateDialog";
	className = "AProfileEmployeeDocDialog";
	findById = findByIdEmployee;

	constructor(props) {
		super(props, style);
	}

	title() {
		return "Competency Certificates";
	}

	onSaveAsPDF(e, btn) {
		this.refs.controls.onSaveAsPDF(e, btn);
	}

	get topButtonsHiddenDelete() {
		return true;
	}

	get controls() {
		return Controls;
	}
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

	listName = "competency_list";
	onUpdate = updateEmployeeCompetency;
	NewDialog = NewDialog;
	EditDialog = EditDialog;
	ProfilePDFReader = ProfilePDFReader;

	constructor(props) {
		super(props);
	}

	//<editor-fold desc="loadDashboardTopStats">
	async loadDashboardTopStats(id) {
		return employeeStore.findByIdHRCompetenciesDashboardStats(id);
	}

	//</editor-fold>

	//<editor-fold desc="loadDashboardBottomStats">
	async loadDashboardBottomStats(id) {
		return employeeStore.findByIdHRCompetenciesDateRangeDashboardStats(id);
	}

	//</editor-fold>

	renderItem(item, n, onClick) {
		const {
			created_at,
			title,
			training,
			trainer,
			type,
			competency_type,
			issued_date,
			expiry_date,
			accreditation_num,
			doc
		} = item.data || item;

		return <div className="row item-wrapper padding-t-10 h-full">
			<div className="row margin-l-10 margin-r-10 row-details">
				<ProfileField title="Certificate Type" name="type" className="col-lg-4" value={type}/>
				<ProfileField title="Competency Type" name="competency_type" className="col-lg-4"
				              value={competency_type}/>
				<ProfileField title="Accreditation Number" name="accreditation_num" className="col-lg-4"
				              value={accreditation_num}/>
				<ProfileField title="Date Of Issue" name="issued_date" type="date" className="col-lg-6"
				              value={issued_date}/>
				<ProfileField title="Expiry Date" name="expiry_date" type="date" className="col-lg-6"
				              value={expiry_date}/>
			</div>
			<div className="row margin-l-10 margin-r-10 row-details">
				<ProfileField title="Training" name="training" className="col-lg-6"
				              value={training && training.course}
				              renderer={v => v.name}/>
				<ProfileField title="Trainer" className="col-lg-6" value={trainer}
				              renderer={v => v.lname + " " + v.fname}/>
			</div>
			<hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
			<div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
				<UploadButton
					name="doc"
					defaultValue={doc}
					buttonTitle="Competency Certificate Attachment"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					readonly
					className="w-280 hor-center"
				/>
			</div>
		</div>;
	}
}

export {Controls as CompetencyControls};
export default ProfileDialog;
