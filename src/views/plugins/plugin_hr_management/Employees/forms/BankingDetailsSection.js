import {observer} from "mobx-react";
import React from "react";
import {ProfileField, UploadButton} from "components/inputs";
import NewDocBankingDetailsDialog from "./profile_forms/NewDocBankingDetailsDialog";
import EditDocBankingDetailsDialog from "./profile_forms/EditDocBankingDetailsDialog";
import ASectionSection from "./ASectionSection";
import updateEmployeeDocBankingDetail
	from "mutations/all/EmployeeDocument/EmployeeDocBankingDetail/updateEmployeeDocBankingDetail";

@observer
class BankingDetailsSection extends ASectionSection {

	listName = 'banking_detail_list';
	onUpdate = updateEmployeeDocBankingDetail;
	NewDialog = NewDocBankingDetailsDialog;
	EditDialog = EditDocBankingDetailsDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	get itemRenderer() {
		return [
			<ProfileField name="name" placeholder="Bank Name" valKey="name" className="col-lg-6"/>,
			<ProfileField name="branch" placeholder="Branch" valKey="branch" className="col-lg-6"/>,
			<ProfileField name="code" placeholder="Branch Code" valKey="code" className="col-lg-6"/>,
			<ProfileField name="account_num" type="number" placeholder="Account No." valKey="account_num"
			              className="col-lg-6"/>,
			<UploadButton
				name="doc"
				defaultValueKey="doc"
				buttonTitle="Proof of Banking Details"
				type={['PDF', 'Word', 'Image']}
				showOnlyIcon
				readonly
				className="ProfileField col-lg-6"
			/>
		];
	}

}

export default BankingDetailsSection;