import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {FormControls, Row} from 'components/FormComponents';
import {CompetencyControls} from "../../Competencies/forms/ProfileDialog";
import {ContractControls} from "../../Contracts/forms/ProfileDialog";
import {CounselingControls} from "../../Counselings/forms/ProfileDialog";
import {
    JobAppointmentControls
} from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/JobAppointments/forms/ProfileDialog";
import {LeaveControls} from "../../Leaves/forms/ProfileDialog";
import {LicenseControls} from "../../Licenses/forms/ProfileDialog";
import {MedicalControls} from "../../Medicals/forms/ProfileDialog";
import {WarningControls} from "../../Warnings/forms/ProfileDialog";
import {WorkPermitControls} from "../../WorkPermits/forms/ProfileDialog";
import {Dates} from "utils/Dates";
import PrDPSection from "./PrDPSection";
import IDOrPassportSection from "./IDOrPassportSection";

@observer
class EditDocumentsSection extends React.Component {
    pageKey = "NewDocumentsTab";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    //</editor-fold>

    //<editor-fold desc="formData">
    get formData() {
        const {data} = this.form;
        let {
            doc_id_or_passport_expiry,
            doc_id_or_passport,
            doc_pdrp_expiry,
            doc_pdrp,
        } = data;

        doc_id_or_passport_expiry = Dates.formatDateSQL(doc_id_or_passport_expiry);
        doc_id_or_passport = doc_id_or_passport && doc_id_or_passport.path;
        doc_pdrp_expiry = Dates.formatDateSQL(doc_pdrp_expiry);
        doc_pdrp = doc_pdrp && doc_pdrp.path;

        const document_list = [];
        if (doc_id_or_passport) {
            document_list.push({type: "ID/Passport", doc: doc_id_or_passport, expiry_date: doc_id_or_passport_expiry});
        }
        if (doc_id_or_passport) {
            document_list.push({type: "PrDP", doc: doc_pdrp, expiry_date: doc_pdrp_expiry});
        }

        return {
            document_list: {data: document_list},

        }
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormSave, item, idx} = this.props;

        let {
            id,
            document_list,

            competency_list,
            contract_list,
            counselling_list,
            leave_list,
            license_list,
            medical_list,
            warning_list,
            work_permit_list,

            ppe_list,
            trainer_training_list,
        } = (item && item.data) || {};

        const isNew = !id;

        let __idx = 0;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <FormControls lazyLoad>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} ID / Passport`}
                    sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormSave={onFormSave}
                >
                    <IDOrPassportSection item={item} isNew={isNew} onChange={this.form.onChange}/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Competencies`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <CompetencyControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Contracts`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <ContractControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Job Appointments`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <JobAppointmentControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Counselling`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <CounselingControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Leaves`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <LeaveControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Licenses & PrDP`}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <FormControls>
                        <Row
                            rendered
                            idx={idx + `.${__idx}.1`}
                            title={idx + `.${__idx}.1 Licenses`}
                            sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                        >
                            <LicenseControls item={item} tabsHeight="530px"/>
                        </Row>
                        <Row
                            rendered
                            idx={idx + `.${__idx}.2`}
                            title={idx + `.${__idx}.2 PrDP`}
                            sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                        >
                            <PrDPSection item={item} isNew={isNew} onChange={this.form.onChange}/>
                        </Row>
                    </FormControls>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Medical Fitness`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <MedicalControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Warnings`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <WarningControls item={item} tabsHeight="530px"/>
                </Row>
                <Row
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Work Permit`}
                    sectionClassName="-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <WorkPermitControls item={item} tabsHeight="530px"/>
                </Row>
            </FormControls>
        </div>
    }

    //</editor-fold>
}

export default EditDocumentsSection;