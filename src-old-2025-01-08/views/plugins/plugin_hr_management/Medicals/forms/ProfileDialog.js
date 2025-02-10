import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../AEmployeeDocControls";
import {findByIdEmployee} from "mutations/findById";
import {updateEmployeeMedical} from "mutations/update";
import {findByIdHRMedicalsDateRangeDashboardStats} from "mutations/employeeHRDateRangeDashboard";
import {findByIdHRMedicalsDashboardStats} from "mutations/employeeHRDashboard";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileMedicalFitnessCertificateDialog";
    className = "AProfileEmployeeDocDialog";
    findById = findByIdEmployee;

    constructor(props) {
        super(props, style);
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return Controls;
    }

    title() {
        return "Medical Fitness Certificates";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    listName = "medical_list";
    onUpdate = updateEmployeeMedical;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return findByIdHRMedicalsDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return findByIdHRMedicalsDateRangeDashboardStats(id);
    }

    //</editor-fold>

    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {created_at, annexture_3, restrictions, expiry_date, doc} = item.data || item;


        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Medical Fitness Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date}
                              className="col-lg-6"/>
                <ProfileField title="Annexture 3?" name="annexture_3" value={annexture_3} className="col-lg-6"/>
                <ProfileField title="Restrictions" name="restrictions" value={restrictions} className="col-lg-12"/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-0 text-center">Document</label>
            <div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Medical Fitness Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="w-280 hor-center"
                />
            </div>
        </div>;
    }

}

export {Controls as MedicalControls};
export default ProfileDialog;
