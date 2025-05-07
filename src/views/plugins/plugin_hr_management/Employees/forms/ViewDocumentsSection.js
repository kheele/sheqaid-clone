import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {FormControls, Row} from 'components/FormComponents';

import {MedicalControls} from "../../Medicals/forms/ProfileDialog";
import {
    JobAppointmentControls
} from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/JobAppointments/forms/ProfileDialog";
import {ContractControls} from "../../Contracts/forms/ProfileDialog";
import {CompetencyControls} from "../../Competencies/forms/ProfileDialog";

import {LicenseControls} from "../../HRDocs/Licenses/forms/ProfileDialog";
import {WorkPermitControls} from "../../HRDocs/WorkPermits/forms/ProfileDialog";

import IDOrPassportSection from "./IDOrPassportSection";
import PrDPSection from "./PrDPSection";
import EmployeeProfileSettings from "utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class ViewDocumentsSection extends AEmployeeSection {
    static isValid = EmployeeProfileSettings.isValidEmployeeAllDocumentsViewers;
    pageKey = "ViewDocumentsSection";
    @observable
    state = {};

    // innerRefs = {
    //     //
    //     personalDocuments: createRef(),
    //     document_id_passport: createRef(),
    //     work_permit: createRef(),
    //     license: createRef(),
    //     document_prdp: createRef(),
    //     //
    //     competency: createRef(),
    //     //
    //     contract: createRef(),
    //     //
    //     job_appointment: createRef(),
    //     //
    //     medical: createRef(),
    // };

    constructor(props) {
        super(props);
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;

        let {
            id,
            data: {
                document_list,

                competency_list,
                contract_list,
                counselling_list,
                leave_list,
                license_list,
                medical_list,
                warning_list,
                work_permit_list,
                job_appointment_list,

                ppe_type_list,
                trainer_training_list,
            }
        } = item;

        let __idx = 0;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={`${className} -margin-l-10 -margin-t-5 -margin-b-10`}>
            <FormControls ref="formControls" lazyLoad>
                {/*{EmployeeProfileSettings.isValidEmployeeSignableDocumentsViewers(item) && <Row*/}
                {/*    rendered*/}
                {/*    idx={idx + `.${__idx++}`}*/}
                {/*    title={idx + `.${__idx} Signable Documents`}*/}
                {/*    sectionClassName="h-500 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"*/}
                {/*    onFormOpen={onFormOpen}*/}
                {/*    onFormNext={onFormNext}*/}
                {/*>*/}
                {/*    <SignableDocumentsSection item={item} tabsHeight="530px"/>*/}
                {/*</Row>}*/}
                {EmployeeProfileSettings.isValidEmployeePersonalDocumentsViewers(item) && <Row
                    ref="personalDocuments"
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Personal Documents`}
                    sectionClassName="-margin-t-5 -margin-b-10"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <FormControls ref="personalDocumentsFormControls" lazyLoad>
                        <Row
                            ref="document_id_passport"
                            rendered
                            idx={idx + `.${__idx}.1`}
                            title={idx + `.${__idx}.1 ID / Passport`}
                            sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                        >
                            <IDOrPassportSection item={item} isEmbedded/>
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
                            <WorkPermitControls item={item} isEmbedded tabsHeight="530px"/>
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
                            <LicenseControls item={item} isEmbedded tabsHeight="530px"/>
                        </Row>
                        <Row
                            ref="document_prdp"
                            rendered
                            idx={idx + `.${__idx}.4`}
                            title={idx + `.${__idx}.4 PrDP`}
                            sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                        >
                            <PrDPSection item={item} isEmbedded/>
                        </Row>
                    </FormControls>
                </Row>}
                {EmployeeProfileSettings.isEmployeeCompetencyViewers(item) && <Row
                    ref="competency"
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Competencies`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <CompetencyControls item={item} isEmbedded tabsHeight="530px"/>
                </Row>}
                {EmployeeProfileSettings.isEmployeeContractsViewers(item) && <Row
                    ref="contract"
                    lazyLoad={false}
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Contracts`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <ContractControls item={item} isEmbedded tabsHeight="530px"/>
                </Row>}
                {EmployeeProfileSettings.isEmployeeJobAppointmentsViewers(item) && <Row
                    ref="job_appointment"
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Job Appointments`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <JobAppointmentControls item={item} isEmbedded tabsHeight="530px"/>
                </Row>}
                {EmployeeProfileSettings.isEmployeeMedicalFitnessViewers(item) && <Row
                    ref="medical"
                    rendered
                    idx={idx + `.${__idx++}`}
                    title={idx + `.${__idx} Medical Fitness`}
                    sectionClassName="-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                >
                    <MedicalControls item={item} isEmbedded tabsHeight="530px"/>
                </Row>}
            </FormControls>
        </div>
    }
}

export default ViewDocumentsSection;
