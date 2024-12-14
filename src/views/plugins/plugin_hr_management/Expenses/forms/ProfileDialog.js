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
import {updateEmployeeExpense} from "mutations/update";
import {findByIdHRExpensesDashboardStats} from "mutations/employeeHRDashboard";
import {findByIdHRExpensesDateRangeDashboardStats} from "mutations/employeeHRDateRangeDashboard";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileExpenseDialog";
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
        return "Expenses";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    listName = "expense_list";
    onUpdate = updateEmployeeExpense;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return findByIdHRExpensesDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return findByIdHRExpensesDateRangeDashboardStats(id);
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
            doc, //
            employee,//
            category,
            currency_country,
            paid_with,
            date,
            amount,
            status,
            comments,
            date_submitted,
            date_approved,
            date_compensated,
        } = item.data || item;

        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Expense Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Status" name="status" value={status} className="col-lg-6"/>
                <ProfileField title="Category" name="category" value={category} className="col-lg-6"/>
                <ProfileField
                    title="Currency"
                    name="currency_country"
                    value={currency_country}
                    renderer={({currency_name, iso2, name}) => <>
                        <span className="flex flex-left font-size-16">({currency_name})</span>
                        <img src={getFlag(iso2)} className="fixed-flex min-w-30 margin-r-10"/>
                        <span className="flex flex-left font-size-16">{name}</span>
                    </>}
                    className="col-lg-6"
                />
                <ProfileField title="Paid With" name="paid_with" value={paid_with} className="col-lg-6"/>
                <ProfileField title="Amount" name="amount" value={amount} className="col-lg-6"/>
                <ProfileField title="Date" name="date" type="date" value={date} className="col-lg-3"/>
                <ProfileField title="Date Submitted" name="date_submitted" type="date" value={date_submitted}
                              className="col-lg-3"/>
                <ProfileField title="Date Approved" name="date_approved" type="date" value={date_approved}
                              className="col-lg-3"/>
                <ProfileField title="Date Compensated" name="date_compensated" type="date" value={date_compensated}
                              className="col-lg-3"/>
                <ProfileField title="Comments" name="comments" value={comments} type="textarea"
                              className="col-lg-12"/>
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Attachment"
                    type={['PDF', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-6 pull-left-3"
                />
            </div>
        </div>;
    }

}

export {Controls as ExpenseControls};
export default ProfileDialog;
