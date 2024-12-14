import {observer} from "mobx-react";
import React from "react";
import {ProfileField, UploadButton} from "components/inputs";
import {ASectionSection} from "components/FormComponents";
import NewDocumentDialog from "./profile_forms/NewDocumentDialog";
import EditDocumentDialog from "./profile_forms/EditDocumentDialog";
import {computed} from "mobx";
import {updateEmployeeDocDocumentIDOrPassport} from "mutations/update";

@observer
class IDOrPassportSection extends ASectionSection {

    type = 'ID/Passport';
    listName = 'document_list';
    onUpdate = updateEmployeeDocDocumentIDOrPassport;
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