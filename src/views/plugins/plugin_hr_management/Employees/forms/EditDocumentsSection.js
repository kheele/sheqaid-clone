import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {FormControls, Row} from 'components/FormComponents';
import {CompetencyControls} from "../../Competencies/forms/ProfileDialog";
import {ContractControls} from "../../Contracts/forms/ProfileDialog";
import {
    JobAppointmentControls
} from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/JobAppointments/forms/ProfileDialog";

import {MedicalControls} from "../../Medicals/forms/ProfileDialog";

import {LicenseControls} from "../../HRDocs/Licenses/forms/ProfileDialog";
import {WorkPermitControls} from "../../HRDocs/WorkPermits/forms/ProfileDialog";
import PrDPSection from "./PrDPSection";
import IDOrPassportSection from "./IDOrPassportSection";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class EditDocumentsSection extends AEmployeeSection {
    static isValid = EmployeeProfileSettings.isValidEmployeeAllDocumentsViewers;
    pageKey = "NewDocumentsTab";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    //</editor-fold>

    //<editor-fold desc="formData">
    get formData() {
        return this.form.data;
        // const {form, form: {data}} = this;
        // let {
        //     'document_list__ID/Passport': document_list__id_or_passport,
        //     'document_list__PrDP': document_list__prdp,
        //
        //     competency_list,
        //     contract_list,
        //     counselling_list,
        //     license_list,
        //     medical_list,
        //     warning_list,
        //     work_permit_list,
        //     job_appointment_list,
        // } = data;
        // //
        //
        // return new Promise(async (resolve, reject) => {
        //     resolve({
        //         document_list: {
        //             data: await Promise.all([
        //                 ...(document_list__id_or_passport || []),
        //                 ...(document_list__prdp || []),
        //             ].map(async (
        //                 {
        //                     type,
        //                     expiry_date,
        //                     doc,
        //                 }
        //             ) => ({
        //                 is_default: true,
        //                 //1
        //                 type,
        //                 expiry_date: Dates.formatDateSQL(expiry_date),
        //                 //2
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //             }))),
        //         },
        //         competency_list: {
        //             data: await Promise.all((competency_list || []).map(async (
        //                 {
        //                     issued_date,
        //                     expiry_date,
        //                     type,
        //                     competency_type,
        //                     accreditation_num,
        //                     training,
        //                     doc
        //                 }
        //             ) => ({
        //                 issued_date: Dates.formatDateSQL(issued_date),
        //                 expiry_date: Dates.formatDateSQL(expiry_date),
        //                 type,
        //                 competency_type,
        //                 accreditation_num,
        //                 training_id: training && training.id,
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //             })))
        //         },
        //         contract_list: {
        //             data: await Promise.all((contract_list || []).map(async (
        //                 {
        //                     contractDetailsTab,
        //                     salaryInfoTab,
        //                     doc,
        //                     job_profile_doc,
        //                 }
        //             ) => {
        //                 const contract_details = toNoneNullObject(contractDetailsTab.form.data);
        //                 const salary_info = toNoneNullObject(salaryInfoTab.form.data);
        //
        //                 const v = {
        //                     doc: doc && {path: await toDataURI(doc.path)},
        //                     job_profile_doc: job_profile_doc && {path: await toDataURI(job_profile_doc.path)},
        //                 };
        //
        //                 if (contract_details) {
        //                     const {
        //                         contract_type,
        //                         start_date,
        //                         expiry_date,
        //                         end_of_trial_period,
        //                         start_time,
        //                         end_time,
        //                         daily_working_hours,
        //                         notes,
        //                     } = contractDetailsTab.form.data;
        //                     v.contract_details_list = {
        //                         data: [{
        //                             contract_type,
        //                             start_date: Dates.formatTimestampSQL(start_date),
        //                             expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                             end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
        //                             start_time,
        //                             end_time,
        //                             daily_working_hours,
        //                             notes,
        //                         }],
        //                     };
        //                 }
        //
        //                 if (salary_info) {
        //                     const {
        //                         payment_type,
        //                         salary_interval,
        //                         salary,
        //                         wage,
        //                         deductible,//[{text, value}]
        //                     } = salaryInfoTab.form.data;
        //
        //                     const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];
        //                     v.salary_info_list = {
        //                         data: [{
        //                             payment_type,
        //                             salary_interval,
        //                             salary,
        //                             wage,
        //                             deductible_list: {data: deductible_list},//[{text, value}]
        //                         }],
        //                     };
        //                 }
        //
        //                 return v;
        //             }))
        //         },
        //         counselling_list: {
        //             data: await Promise.all((counselling_list || []).map(async (
        //                 {
        //                     doc,
        //                     responsible_person,
        //                     corrective_actions,
        //                     counselling_hrs_to_complete,
        //                     expiry_date,
        //                     incident_desc,
        //                     reasons,
        //                     types,
        //                     witness_list,
        //                 }
        //             ) => ({
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //                 responsible_person_id: responsible_person && responsible_person.id,
        //                 corrective_actions,
        //                 counselling_hrs_to_complete,
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 incident_desc,
        //                 reasons,
        //                 types,
        //                 witness_list: {
        //                     data: witness_list ? witness_list.map(v => {
        //                         if (v.id) {
        //                             return {witness_id: v.id};
        //                         }
        //                         const {job_position} = v;
        //                         if (job_position) {
        //                             delete v.job_position;
        //                             v.job_position_id = job_position.id;
        //                         }
        //                         return {witness_external: {data: v}};
        //                     }) : []
        //                 },
        //             })))
        //         },
        //         license_list: {
        //             data: await Promise.all((license_list || []).map(async (
        //                 {
        //                     doc,
        //                     date,
        //                     expiry_date,
        //                     notes,
        //                 }
        //             ) => ({
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //                 date: Dates.formatTimestampSQL(date),
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 notes,
        //             })))
        //         },
        //         medical_list: {
        //             data: await Promise.all((medical_list || []).map(async (
        //                 {
        //                     doc,
        //                     expiry_date,
        //                     restrictions,
        //                     annexture_3,
        //                 }
        //             ) => ({
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 restrictions,
        //                 annexture_3,
        //             })))
        //         },
        //         warning_list: {
        //             data: await Promise.all((warning_list || []).map(async (
        //                 {
        //                     doc,
        //                     date,
        //                     details,
        //                     employee_comments,
        //                     expiry_date,
        //                     issued_by,
        //                     notes,
        //                     type,
        //                     witness_list,
        //                 }
        //             ) => ({
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //                 date: Dates.formatTimestampSQL(date),
        //                 details,
        //                 employee_comments,
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 issued_by_id: issued_by && issued_by.id,
        //                 notes,
        //                 type,
        //                 witness_list: {
        //                     data: witness_list ? witness_list.map(v => {
        //                         if (v.id) {
        //                             return {witness_id: v.id};
        //                         }
        //                         const {job_position} = v;
        //                         if (job_position) {
        //                             delete v.job_position;
        //                             v.job_position_id = job_position.id;
        //                         }
        //                         return {witness_external: {data: v}};
        //                     }) : []
        //                 },
        //             })))
        //         },
        //         work_permit_list: {
        //             data: await Promise.all((work_permit_list || []).map(async (
        //                 {
        //                     doc,
        //                     date,
        //                     expiry_date,
        //                     notes,
        //                 }
        //             ) => ({
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //
        //                 date: Dates.formatDateSQL(date),
        //                 expiry_date: Dates.formatDateSQL(expiry_date),
        //                 notes,
        //             })))
        //         },
        //         job_appointment_list: {
        //             data: await Promise.all((job_appointment_list || []).map(async (
        //                 {doc, date, expiry_date, notes,}
        //             ) => ({
        //                 doc: doc && {path: await toDataURI(doc.path)},
        //                 date: Dates.formatTimestampSQL(date),
        //                 expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                 notes,
        //             })))
        //         },
        //     });
        // });
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormSave, onRefs, item, idx} = this.props;

        let {
            id,
            // document_list,
            //
            // competency_list,
            // contract_list,
            // counselling_list,
            // license_list,
            // medical_list,
            // warning_list,
            // work_permit_list,
            // job_appointment_list,

            // ppe_type_list,
            // trainer_training_list,
        } = (item && item.data) || {};

        const {form, form: {data}} = this;
        const {
            'document_list__ID/Passport': document_list__id_or_passport,
            'document_list__PrDP': document_list__prdp,

            competency_list,
            contract_list,
            license_list,
            medical_list,
            work_permit_list,
            job_appointment_list,

            signable_doc_submitter_list,
        } = data;

        const isNewEmployee = !id;

        const props = {
            item,
            formData: data,
            isNewEmployee,
            onRefs: onRefs,
            isEmbedded: true,
            onChange: this.form.onChange,
        };

        let __idx = 0;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <FormControls lazyLoad>
                {/*{!isNewEmployee && EmployeeProfileSettings.isValidEmployeeSignableDocumentsViewers(item) && <Row*/}
                {/*    rendered*/}
                {/*    idx={idx + `.${__idx++}`}*/}
                {/*    title={idx + `.${__idx} Signable Documents`}*/}
                {/*    sectionClassName="h-500 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"*/}
                {/*    onFormOpen={onFormOpen}*/}
                {/*    onFormNext={onFormNext}*/}
                {/*>*/}
                {/*    <SignableDocumentsSection {...props} defaultValue={signable_doc_submitter_list} tabsHeight="530px"/>*/}
                {/*</Row>}*/}
                {EmployeeProfileSettings.isValidEmployeePersonalDocumentsViewers(item) && <Row
                    ref="personalDocuments"
                    rendered
                    idx={parseFloat(idx + `.${__idx++}`).toFixed(1)}
                    title={idx + `.${__idx} Personal Documents`}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <FormControls lazyLoad>
                        <Row
                            ref="document_id_passport"
                            rendered
                            idx={idx + `.${__idx}.1`}
                            title={idx + `.${__idx}.1 ID / Passport`}
                            sectionClassName="IDOrPassportSection-section h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                            onFormSave={onFormSave}
                        >
                            <IDOrPassportSection {...props} defaultValue={document_list__id_or_passport}/>
                        </Row>
                        <Row
                            ref="work_permit"
                            rendered
                            idx={idx + `.${__idx}.2`}
                            title={idx + `.${__idx}.2 Work Permit (Foreigners)`}
                            sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                            onFormBack={onFormBack}
                        >
                            <WorkPermitControls {...props} defaultValue={work_permit_list} tabsHeight="530px"/>
                        </Row>
                        <Row
                            ref="license"
                            rendered
                            idx={idx + `.${__idx}.3`}
                            title={idx + `.${__idx}.3 Licenses`}
                            sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                            onFormBack={onFormBack}
                        >
                            <LicenseControls {...props} defaultValue={license_list} tabsHeight="530px"/>
                        </Row>
                        <Row
                            ref="document_prdp"
                            rendered
                            idx={idx + `.${__idx}.4`}
                            title={idx + `.${__idx}.4 PrDP`}
                            sectionClassName="PrDPSection-section h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                        >
                            <PrDPSection {...props} defaultValue={document_list__prdp}/>
                        </Row>
                    </FormControls>
                </Row>}
                {EmployeeProfileSettings.isEmployeeCompetencyViewers(item) && <Row
                    ref="competency"
                    rendered
                    idx={parseFloat(idx + `.${__idx++}`).toFixed(1)}
                    title={idx + `.${__idx} Competencies`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <CompetencyControls {...props} defaultValue={competency_list} tabsHeight="530px"/>
                </Row>}
                {EmployeeProfileSettings.isEmployeeContractsViewers(item) && <Row
                    ref="contract"
                    rendered
                    idx={parseFloat(idx + `.${__idx++}`).toFixed(1)}
                    title={idx + `.${__idx} Contracts`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <ContractControls {...props} defaultValue={contract_list} tabsHeight="530px"/>
                </Row>}
                {EmployeeProfileSettings.isEmployeeJobAppointmentsViewers(item) && <Row
                    ref="job_appointment"
                    rendered
                    idx={parseFloat(idx + `.${__idx++}`).toFixed(1)}
                    title={idx + `.${__idx} Job Appointments`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <JobAppointmentControls {...props} defaultValue={job_appointment_list} tabsHeight="530px"/>
                </Row>}
                {EmployeeProfileSettings.isEmployeeMedicalFitnessViewers(item) && <Row
                    ref="medical"
                    rendered
                    idx={parseFloat(idx + `.${__idx++}`).toFixed(1)}
                    title={idx + `.${__idx} Medical Fitness`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <MedicalControls {...props} defaultValue={medical_list}
                                     tabsHeight="530px"/>
                </Row>}
            </FormControls>
        </div>
    }

    //</editor-fold>
}

export default EditDocumentsSection;
