import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {FormControls, Row} from 'components/FormComponents';

import {WarningControls} from "../../Warnings/forms/ProfileDialog";
import {WorkPermitControls} from "../../WorkPermits/forms/ProfileDialog";
import {MedicalControls} from "../../Medicals/forms/ProfileDialog";
import {
    JobAppointmentControls
} from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/JobAppointments/forms/ProfileDialog";
import {LicenseControls} from "../../Licenses/forms/ProfileDialog";
import {LeaveControls} from "../../Leaves/forms/ProfileDialog";
import {CounselingControls} from "../../Counselings/forms/ProfileDialog";
import {ContractControls} from "../../Contracts/forms/ProfileDialog";
import {CompetencyControls} from "../../Competencies/forms/ProfileDialog";
import IDOrPassportSection from "./IDOrPassportSection";
import PrDPSection from "./PrDPSection";

@observer
class ViewDocumentsSection extends React.Component {
    pageKey = "ViewDocumentsSection";

    @observable
    state = {};

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

                ppe_list,
                trainer_training_list,
            }
        } = item;

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
                >
                    <IDOrPassportSection item={item}/>
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
                            <PrDPSection item={item}/>
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
}

export default ViewDocumentsSection;