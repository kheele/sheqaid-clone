import {observer} from "mobx-react";
import React from "react";
import {ProfileField, UploadButton} from "components/inputs";
import NewDocBankingDetailsDialog from "./profile_forms/NewDocBankingDetailsDialog";
import EditDocBankingDetailsDialog from "./profile_forms/EditDocBankingDetailsDialog";
import ASectionSection from "./ASectionSection";
import NewDocumentDialog from "./profile_forms/NewDocumentDialog";
import EditDocumentDialog from "./profile_forms/EditDocumentDialog";
import {computed} from "mobx";

@observer
class IDOrPassportSection extends ASectionSection {

	type = 'ID/Passport';
	listName = 'document_list';
	NewDialog = NewDocumentDialog;
	EditDialog = EditDocumentDialog;

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
	}

	//</editor-fold>

	//<editor-fold desc="list">
	@computed get list() {
		const {isNew} = this.props;
		if(isNew) {
			return [null];
		}

		const {itemData} = this;
		const {listName} = this;
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
				valueKey="expiry_date"
				className="col-lg-6 pull-left-3"
			/>
		];
	}

}

export default IDOrPassportSection;