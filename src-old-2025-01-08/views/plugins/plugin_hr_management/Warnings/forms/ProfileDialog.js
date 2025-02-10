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
import {findByIdEmployee} from "mutations/findById";
import {updateEmployeeWarning} from "mutations/update";
import DocSignButton from "components/FormComponents/DocSignButton";
import {findByIdHRWarningsDateRangeDashboardStats} from "mutations/employeeHRDateRangeDashboard";
import {findByIdHRWarningsDashboardStats} from "mutations/employeeHRDashboard";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileWarningDialog";
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
        return "Warnings";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    listName = "warning_list";
    onUpdate = updateEmployeeWarning;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return findByIdHRWarningsDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return findByIdHRWarningsDateRangeDashboardStats(id);
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
            issued_by,
            type,
            category_of_misconduct,
            date,
            expiry_date,
            details,
            employee_comments,
            notes,
            witness_list,
            doc,
            signable_doc_template_list,
        } = item.data || item;

        const [signable_doc_template] = signable_doc_template_list || [];

        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Warning Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Warning Type" name="type" value={type} type="select" className="col-lg-12"/>
                <ProfileField title="Category of Misconduct" name="category_of_misconduct"
                              value={category_of_misconduct} type="select" className="col-lg-12"/>
                <ProfileField title="Warning Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Warning Expiry Date" name="expiry_date" type="date" value={expiry_date}
                              className="col-lg-6"/>
                <ProfileField title="Warning Issued By" name="issued_by" value={issued_by}
                              renderer={v => v.lname + ' ' + v.fname} type="select" className="col-lg-6"/>
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Warning Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-6"
                />
                <ProfileField title="Details Of Misconduct" name="details" value={details} type="textarea"
                              className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments}
                              type="textarea"
                              className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                <NewEmployeeListTable name="witness_list" defaultValue={witness_list || []} readonly/>
                <div className="row margin-l-0 margin-r-0 row-doc sec-group padding-b-10">
                    {signable_doc_template && <img
                        src={signable_doc_template.preview_image_url}
                    />}
                    {signable_doc_template && <DocSignButton
                        doc={signable_doc_template}
                    />}
                    {!signable_doc_template && "N/A"}
                </div>
            </div>
        </div>;
    }

}

export {Controls as WarningControls};
export default ProfileDialog;
