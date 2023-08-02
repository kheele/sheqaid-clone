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

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileLicenseDialog";
    className = "AProfileEmployeeDocDialog";
    findById = findByIdEmployee;
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Licenses";
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

    listName = "license_list";
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return employeeStore.findByIdHRLicensesDashboardStats(id);
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return employeeStore.findByIdHRLicensesDateRangeDashboardStats(id);
    }
    //</editor-fold>

    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {created_at, date, expiry_date, notes, doc} = item.data || item;
        
        return <div className="row item-wrapper margin-l-20 margin-r-20 padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">License Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="Notes" name="notes" value={notes} className="col-lg-12"/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-0 text-center">Document</label>
            <div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="License Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="w-280 hor-center"
                />
            </div>
        </div>;
    }

}

export {Controls as LicenseControls};
export default ProfileDialog;
