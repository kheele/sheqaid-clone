import {observer} from "mobx-react";
import React from "react";
import {ProfileField} from "components/inputs";
import NewDependantDialog from "./profile_forms/NewDependantDialog";
import EditDependantDialog from "./profile_forms/EditDependantDialog";
import ASectionSection from "./ASectionSection";

@observer
class DependantSection extends ASectionSection {

	listName = 'dependent_list';
	NewDialog = NewDependantDialog;
	EditDialog = EditDependantDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	get itemRenderer() {
		return [
			<ProfileField
				name="fname"
				title="First Name"
				defaultValueKey="fname"
				className="col-lg-6"
			/>,
			<ProfileField
				name="lname"
				title="Last Name"
				defaultValueKey="lname"
				className="col-lg-6"
			/>,
			<ProfileField
				name="gender"
				title="Gender"
				defaultValueKey="gender"
				className="col-lg-6"
			/>,
			<ProfileField
				name="dob"
				title="Date of Birth"
				defaultValueKey="dob"
				className="col-lg-6"
			/>
		];
	}

}

export default DependantSection;