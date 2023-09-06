import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {UploadButton} from 'components/inputs';

import {ContractDetails, SalaryInfo} from '../ContractComponents';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../AEmployeeDocControls";
import employeeStore from "mutations/all/Employee";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import updateEmployeeContract from "mutations/all/EmployeeContract/updateEmployeeContract";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileContractDialog";
	className = "AProfileEmployeeDocDialog";
	findById = findByIdEmployee;

	constructor(props) {
		super(props, style);
	}

	title() {
		return "Contracts";
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

	listName = "contract_list";
	onUpdate = updateEmployeeContract;
	NewDialog = NewDialog;
	EditDialog = EditDialog;
	ProfilePDFReader = ProfilePDFReader;

	constructor(props) {
		super(props);
	}

	//<editor-fold desc="loadDashboardTopStats">
	async loadDashboardTopStats(id) {
		return employeeStore.findByIdHRContractsDashboardStats(id);
	}

	//</editor-fold>

	//<editor-fold desc="loadDashboardBottomStats">
	async loadDashboardBottomStats(id) {
		return employeeStore.findByIdHRContractsDateRangeDashboardStats(id);
	}

	//</editor-fold>

	renderItem(item, n, onClick) {
		const {
			props: {
				onFormNext, onFormBack, onFormOpen
			}
		} = this;
		const {created_at, salary_info, contract_details, doc, job_profile_doc} = item.data || item;

		return <div className="row item-wrapper padding-t-10 h-full">
			<label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center font-size-20">Contract Details</label>
			<div className="row margin-l-10 margin-r-10 row-details">
				<ContractDetails ref="contractDetailsTab" defaultValue={contract_details && contract_details[0]}/>
			</div>
			<hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-15"/>
			<label className="w-full margin-l-10 margin-r-10 text-center">Salary Information</label>
			<div className="row margin-l-10 margin-r-10 row-details">
				<SalaryInfo ref="salaryInfoTab" defaultValue={salary_info && salary_info[0]}/>
			</div>
			<hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-10"/>
			<div className="row margin-l-0 margin-r-0 row-doc sec-group padding-b-10">
				<UploadButton
					name="doc"
					defaultValue={doc}
					buttonTitle="Contract Attachment"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					readonly
					className="col-lg-6"
				/>
				<UploadButton
					name="doc"
					defaultValue={job_profile_doc}
					buttonTitle="Job Profile Attachment"
					type={['PDF', 'Word', 'Image']}
					showOnlyIcon
					readonly
					className="col-lg-6"
				/>
			</div>
		</div>;
	}
}

export {Controls as ContractControls};
export default ProfileDialog;
