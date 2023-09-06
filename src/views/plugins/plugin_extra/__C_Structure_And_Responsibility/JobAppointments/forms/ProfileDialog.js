import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "views/plugins/plugin_hr_management/AEmployeeDocControls";
import employeeStore from "mutations/all/Employee";
import updateEmployeeJobAppointment
	from "mutations/all/EmployeeJobAppointment/updateEmployeeJobAppointment";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileJobAppointmentDialog";
	className = "AProfileEmployeeDocDialog";

	constructor(props) {
		super(props, style);
	}

	title() {
		return "Job Appointments";
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

	listName = "job_appointment_list";
	onUpdate = updateEmployeeJobAppointment;
	NewDialog = NewDialog;
	EditDialog = EditDialog;
	ProfilePDFReader = ProfilePDFReader;

	constructor(props) {
		super(props);
	}

	//<editor-fold desc="loadDashboardTopStats">
	async loadDashboardTopStats(id) {
		return employeeStore.findByIdHRJobAppointmentsDashboardStats(id);
	}

	//</editor-fold>

	//<editor-fold desc="loadDashboardBottomStats">
	async loadDashboardBottomStats(id) {
		return employeeStore.findByIdHRJobAppointmentsDateRangeDashboardStats(id);
	}

	//</editor-fold>

	renderItem(item, n, onClick) {
		const {
			props: {
				onFormNext, onFormBack, onFormOpen
			}
		} = this;
		const {created_at, doc, employee, date, expiry_date, notes} = item.data || item;

		return <div className="row item-wrapper padding-t-10 h-full">
			<label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">JobAppointment Details</label>
			<div className="row margin-l-10 margin-r-10 row-details">
				<ProfileField title="Start Date" name="date" type="date" value={date} className="col-lg-6"/>
				<ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
				<ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
				<UploadButton
					name="doc"
					defaultValue={doc}
					buttonTitle="Document"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					readonly
					className="col-lg-6 pull-left-3"
				/>
			</div>
		</div>;
	}

}

export {Controls as JobAppointmentControls};
export default ProfileDialog;
