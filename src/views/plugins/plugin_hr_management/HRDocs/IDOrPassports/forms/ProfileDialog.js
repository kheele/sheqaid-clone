import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';

// import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../../AEmployeeDocControls";
import employeeStore from "mutations/all/Employee";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import updateEmployeeDocDocument from "mutations/all/EmployeeDocument/EmployeeDocDocument/updateEmployeeDocDocument";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileIDOrPassportDialog";
    className = "AProfileEmployeeDocDialog";
    findById = findByIdEmployee;
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "ID/Passports";
    }
    
    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    type = 'ID/Passport';
    listName = "document_list";
    // listName = "id_or_passport_list";
    onUpdate = updateEmployeeDocDocument;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    // ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="list">
    @computed get list() {
        if(!this.item) return this.state.list;

        const {item: {data: {[this.listName]: list = []}}} = this;
        return (list || []).filter(v => !v || v.type === "ID/Passport");
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return employeeStore.findByIdHRIDOrPassportDashboardStats(id);
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return employeeStore.findByIdHRIDOrPassportDateRangeDashboardStats(id);
    }
    //</editor-fold>

    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {created_at, type, expiry_date, doc} = item.data || item;
        
        return <div className="row item-wrapper margin-l-20 margin-r-20 padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">ID/Passport Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Type" name="type" value={type} className="col-lg-6"/>
                <ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-0 text-center">Document</label>
            <div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="ID/Passport Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="w-280 hor-center"
                />
            </div>
        </div>;
    }

}

export {Controls as IDOrPassportControls};
export default ProfileDialog;
