import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {NewEmployeeListTable} from 'components/FormTableComponents';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../AEmployeeDocControls";
import Divider from "@mui/material/Divider";
import {findByIdEmployee} from "mutations/findById";
import {updateEmployeeCounselling} from "mutations/update";
import {findByIdHRCounselingsDashboardStats} from "mutations/employeeHRDashboard";
import {findByIdHRCounselingsDateRangeDashboardStats} from "mutations/employeeHRDateRangeDashboard";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileCounselingDialog";
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
        return "Counselings";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    listName = "counselling_list";
    onUpdate = updateEmployeeCounselling;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return findByIdHRCounselingsDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return findByIdHRCounselingsDateRangeDashboardStats(id);
    }

    //</editor-fold>

    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {
            created_at,
            employee,
            responsible_person,
            //2
            types,
            reasons,
            incident_desc,
            corrective_actions,
            counselling_hrs_to_complete,
            expiry_date,
            witness_list,
            //3
            doc
        } = item.data || item;

        return <div className="row item-wrapper padding-t-10 h-full">
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Responsible Person" name="responsible_person" value={responsible_person}
                              renderer={v => v.lname + ' ' + v.fname}
                              className="col-lg-12"/>
                <ProfileField title="Counseling Types" name="types" value={types}
                              renderer={v => v.map(v => v).join(', ')} className="col-lg-12"/>
                <ProfileField title="Reasons For Counseling" name="reasons" value={reasons}
                              renderer={v => v.map(v => v).join(', ')} className="col-lg-12"/>
                <ProfileField title="Description Of Incident" name="incident_desc" value={incident_desc} type="textarea"
                              className="col-lg-12"/>
                <ProfileField title="Corrective Actions" name="corrective_actions" value={corrective_actions}
                              type="textarea" className="col-lg-12"/>
                <ProfileField title="Counseling Hours To Complete" name="counselling_hrs_to_complete"
                              value={counselling_hrs_to_complete} className="col-lg-6"/>
                <ProfileField title="Completion Date" name="expiry_date" type="date" value={expiry_date}
                              className="col-lg-6"/>
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Counseling Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-12 margin-b-15 h-80 padding-b-10 padding-h-5"
                />
                <Divider sx={{opacity: '1'}} className="wfull margin-b-10"/>
                <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Witness List</label>
                <NewEmployeeListTable name="witness_list" defaultValue={witness_list || []} readonly/>
            </div>
        </div>;
    }

}

export {Controls as CounselingControls};
export default ProfileDialog;
