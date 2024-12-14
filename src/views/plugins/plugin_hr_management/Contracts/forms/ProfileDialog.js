import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {UploadButton} from 'components/inputs';

import {ContractDetails, SalaryInfo} from '../ContractComponents';

import ProfilePDFReader from '../printers/ProfilePDFReader';

import NewDialog from "./NewDialog";
import EditDialog from "./EditDialog";

import style from "./ProfileDialog.lazy.css";
import AEmployeeDocControls from "../../AEmployeeDocControls";
import {findByIdEmployee} from "mutations/findById";
import {updateEmployeeContract} from "mutations/update";
import DocSignButton from "components/FormComponents/DocSignButton";
import {findByIdHRContractsDashboardStats} from "mutations/employeeHRDashboard";
import {findByIdHRContractsDateRangeDashboardStats} from "mutations/employeeHRDateRangeDashboard";

//<editor-fold desc="ProfileDialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileContractDialog";
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
        return "Contracts";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
}

//</editor-fold>

@observer
class Controls extends AEmployeeDocControls {

    listName = "contract_list";
    onUpdate = updateEmployeeContract;
    NewDialog = NewDialog;
    EditDialog = EditDialog;
    ProfilePDFReader = ProfilePDFReader;

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats(id) {
        return findByIdHRContractsDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats(id) {
        return findByIdHRContractsDateRangeDashboardStats(id);
    }

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(item, n, onClick) {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;

        let {
            created_at,
            salary_info, salaryInfoTab,
            contract_details, contractDetailsTab,
            doc,
            job_profile_doc,
            signable_doc_template_list,
        } = item.data || item;

        if (salaryInfoTab) {
            salary_info = salaryInfoTab.form.data;
        } else if (salary_info) {
            salary_info = salary_info[0];
        }

        if (contractDetailsTab) {
            contract_details = contractDetailsTab.form.data;
        } else if (contract_details) {
            contract_details = contract_details[0];
        }

        const [signable_doc_template] = signable_doc_template_list || [];

        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center font-size-20">Contract
                Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ContractDetails ref="contractDetailsTab" defaultValue={contract_details}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-15"/>
            <label className="w-full margin-l-10 margin-r-10 bg-white padding-10">Salary Information</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <SalaryInfo ref="salaryInfoTab" defaultValue={salary_info}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-l-10 margin-r-10 bg-white padding-10">Documents</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group padding-b-10">
                <UploadButton
                    name="doc"
                    defaultValue={doc}
                    buttonTitle="Contract Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-6"
                />
                <UploadButton
                    name="doc"
                    defaultValue={job_profile_doc}
                    buttonTitle="Job Profile Attachment"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    readonly
                    className="col-lg-6"
                />
            </div>
            <label className="w-full margin-l-10 margin-r-10 bg-white padding-10">Signable Document</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group padding-b-10">
                {signable_doc_template && <img
                    src={signable_doc_template.preview_image_url}
                />}
                {signable_doc_template && <DocSignButton
                    doc={signable_doc_template}
                />}
                {!signable_doc_template && "N/A"}
            </div>
        </div>;
    }

    //</editor-fold>
}

export {Controls as ContractControls};
export default ProfileDialog;
