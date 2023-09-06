import {observer} from "mobx-react";
import React from "react";
import {ProfileField, UploadButton} from "components/inputs";
import NewDocLivingAddressDialog from "./profile_forms/NewDocLivingAddressDialog";
import EditDocLivingAddressDialog from "./profile_forms/EditDocLivingAddressDialog";
import ASectionSection from "./ASectionSection";
import updateEmployeeDocLivingAddress
	from "mutations/all/EmployeeDocument/EmployeeDocLivingAddress/updateEmployeeDocLivingAddress";

@observer
class LivingAddressSection extends ASectionSection {

	listName = 'living_address_list';
	onUpdate = updateEmployeeDocLivingAddress;
	NewDialog = NewDocLivingAddressDialog;
	EditDialog = EditDocLivingAddressDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	get itemRenderer() {
		return [
			<ProfileField name="country" placeholder="Country" valKey="country" renderer={v => v.name}
			              className="col-lg-12"/>,
			<ProfileField name="zone" placeholder="Province" valKey="zone" renderer={v => v.name} className="col-lg-6"/>,
			<ProfileField name="city" placeholder="City" valKey="city" renderer={v => v.name} className="col-lg-6"/>,
			<ProfileField name="local_address" placeholder="Local Area" valKey="local_address" className="col-lg-6"/>,
			<ProfileField name="street_address" placeholder="Street Address" valKey="street_address" className="col-lg-6"/>,
			<UploadButton
				name="doc"
				defaultValueKey="doc"
				buttonTitle="Proof Of Address"
				type={['PDF', 'Word', 'Image']}
				showOnlyIcon
				readonly
				className="ProfileField col-lg-6"
			/>
		];
	}

}

export default LivingAddressSection;