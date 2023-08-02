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
    pageKey = "ProfileLeaveDialog";
    className = "AProfileEmployeeDocDialog";
    findById = findByIdEmployee;
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Leaves";
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

    listName = "leave_list";
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return employeeStore.findByIdHRLeavesDashboardStats(id);
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return employeeStore.findByIdHRLeavesDateRangeDashboardStats(id);
    }
    //</editor-fold>

    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes} = item.data || item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Leave Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Leave Type" name="type" value={type} type="select" className="col-lg-6"/>
                <ProfileField title="Leave Due To" name="due_to" value={due_to} className="col-lg-6"/>
                <ProfileField title="Leave Start Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Leave Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="No. Of Days Booked" name="days_booked" value={days_booked} className="col-lg-12"/>
                <ProfileField title="Reason Of Leave" name="reason" value={reason} type="textarea" className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments} type="textarea" className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Proof Of Sick Note" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="col-lg-6 pull-left-3"
                />
            </div>
        </div>;
    }

}

export {Controls as LeaveControls};
export default ProfileDialog;
