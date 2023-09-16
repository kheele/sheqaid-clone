import {observer} from "mobx-react";
import React from "react";
import {ProfileField, UploadButton} from "components/inputs";
import ASectionSection from "./ASectionSection";
import NewDocumentDialog from "./profile_forms/NewDocumentDialog";
import EditDocumentDialog from "./profile_forms/EditDocumentDialog";
import {computed} from "mobx";
import updateEmployeeDocDocument
	from "mutations/all/EmployeeDocument/EmployeeDocDocument/updateEmployeeDocDocument";

@observer
class IDOrPassportSection extends ASectionSection {

	type = 'ID/Passport';
	listName = 'document_list';
	onUpdate = updateEmployeeDocDocument;
	NewDialog = NewDocumentDialog;
	EditDialog = EditDocumentDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	//<editor-fold desc="list">
	@computed get list() {
		if (this.isNewEmployee) {
			return this.state.newList;
		}

		const {itemData, listName} = this;
		const {[listName]: list} = itemData || {};
		return (list || []).filter(v => !v || v.type === "ID/Passport");
	}
	//</editor-fold>

	get itemRenderer() {
		return [
			<UploadButton
				name="doc"
				type={['PDF', 'Image']}
				defaultValueKey="doc"
				showOnlyIcon
				readonly
				buttonTitle="Upload Copy (PDF/Image)"
				className="col-lg-6 pull-left-3"
			/>,
			<ProfileField
				name="expiry_date"
				type="date"
				placeholder="Expiry Date"
				valKey="expiry_date"
				className="col-lg-6 pull-left-3"
			/>
		];
	}

}

export default IDOrPassportSection;