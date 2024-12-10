import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField, UploadButton} from 'components/inputs';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../AEmployeeDocControls";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import updateEmployeeLeave from "mutations/all/EmployeeLeave/updateEmployeeLeave";
import ProfileUserDialog from "../../../../default/Users/ProfileDialog";
import EditUserDialog from "../../../../default/Users/EditDialog";
import NewEmployeeDialog from "../../Employees/forms/NewDialog";
import {findByIdHRLeavesDashboardStats} from "mutations/employeeHRDashboard";
import {findByIdHRLeavesDateRangeDashboardStats} from "mutations/employeeHRDateRangeDashboard";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileLeaveDialog";
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
        return "Time-Off(s)";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    listName = "leave_list";
    onUpdate = updateEmployeeLeave;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);

        this.onRequestTimeOff = this.onRequestTimeOff.bind(this);
    }

    @computed get renderBarActions() {
        const {item} = this.props;
        if (!item) return null;

        const {is: {isEmployee}, loggedUser: {user, user: {data: {linked_employee_id}}}} = storage;

        const isLoggedUser = (isEmployee, employee_id, linked_employee_id, user_id) => {
            if (isEmployee) return employee_id === user_id;
            return employee_id === linked_employee_id;
        };

        if (!isLoggedUser(isEmployee, item.id, linked_employee_id, user.id)) {
            return null;
        }

        return <>
            <Button
                className="btn btn-primary pull-right btn-remove border-radius-20 padding-v-5 padding-h-15 margin-r-15"
                onClick={this.onRequestTimeOff}
            >
                Request Time-off
            </Button>
            <NewDialog ref="newDialog" isSelfRequest/>
            <ProfileUserDialog ref="profileUserDialog" EditDialog={EditUserDialog}
                               NewEmployeeDialog={NewEmployeeDialog}/>
        </>;
    }

    onRequestTimeOff(evt, btn) {
        const {isEmployee} = storage.is;
        const {item} = this.props;
        if (isEmployee) {
            this.refs.newDialog.open(item);
        } else {
            const {loggedUser: {user, user: {data: {linked_employee_id}}}} = storage;
            if (!linked_employee_id) {
                return infoDialog.action("Register As Employee", () => {
                    infoDialog.close();
                    this.refs.profileUserDialog.extraProp('linked_employee', true).open(user).then(() => {
                    });
                }).open(<p>
                    Your Account is not linked to any Employee Profile.<br/>
                    Please link your account with your Employee Profile.
                </p>);
            }
            this.refs.newDialog.open(item);
        }
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return findByIdHRLeavesDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return findByIdHRLeavesDateRangeDashboardStats(id);
    }

    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {
            created_at,
            doc,
            doc_fitness_certificate,
            employee,
            type,
            due_to,
            date,
            expiry_date,
            days_booked,
            reason,
            employee_comments,
            notes
        } = item.data || item;

        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Leave Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Leave Type" name="type" value={type} type="select" className="col-lg-6"/>
                <ProfileField title="Leave Due To" name="due_to" value={due_to} className="col-lg-6"/>
                <ProfileField title="Leave Start Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Leave Expiry Date" name="expiry_date" type="date" value={expiry_date}
                              className="col-lg-6"/>
                <ProfileField title="No. Of Days Booked" name="days_booked" value={days_booked} className="col-lg-12"/>
                <ProfileField title="Reason Of Leave" name="reason" value={reason} type="textarea"
                              className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments}
                              type="textarea"
                              className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Proof Of Sick Note"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-6"
                />
                <UploadButton
                    name="doc_fitness_certificate"
                    defaultValue={doc_fitness_certificate}
                    buttonTitle="Certificate Of Fitness"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-6"
                />
            </div>
        </div>;
    }

}

export {Controls as LeaveControls};
export default ProfileDialog;
