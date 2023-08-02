// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import {ClaimDocument, createTimesSVG} from 'components/documents/ClaimDocument';

// </editor-fold>

@observer
class PDFAnnexure1Form extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onCreateTextField = this.onCreateTextField.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="download">
    async download(evt) {
        const {claimDocument} = this.refs;
        claimDocument.download(evt);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="print">
    async print(evt) {
        const {claimDocument} = this.refs;
        claimDocument.print(evt);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCreateTextField">
    onCreateTextField() {
        const {item} = this.props;

        const onCreateTextFieldPage1 = () => {
            const {
                data: {
                    annexture_1: {
                        //A. Recording Of Incident
                        part_of_body_affected = [],
                        effect_on_person = [],
                        expected_period_of_disablement,
                        incident_reported_compensation_commissioner_and_provincial_director,
                        incident_reported_police
                    }
                }
            } = item;

            return [
                //part_of_body_affected
                //Part of body affected (1)
                async (page, form) => part_of_body_affected.contains('Head or Neck') && createTimesSVG(page, 217.96, 476.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Eye') && createTimesSVG(page, 270.4, 476.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Trunk') && createTimesSVG(page, 353.9, 476.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Finger') && createTimesSVG(page, 419.1, 476.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Hand') && createTimesSVG(page, 484.1, 476.1, 20, 0.06),
                //Part of body affected (2)
                async (page, form) => part_of_body_affected.contains('Arm') && createTimesSVG(page, 217.96, 463.88, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Foot') && createTimesSVG(page, 270.4, 463.88, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Leg') && createTimesSVG(page, 353.9, 463.88, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Internal') && createTimesSVG(page, 419.1, 463.88, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Multiple') && createTimesSVG(page, 484.1, 463.88, 20, 0.06),

                //effect_on_person
                //Effect on person (1)
                async (page, form) => part_of_body_affected.contains('Sprains or strains') && createTimesSVG(page, 217.96, 427.9, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Contusion or wounds') && createTimesSVG(page, 270.4, 427.9, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Fractures') && createTimesSVG(page, 350.4, 427.9, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Burns') && createTimesSVG(page, 416.6, 427.9, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Amputation') && createTimesSVG(page, 482.8, 427.9, 20, 0.06),
                //Effect on person (2)
                async (page, form) => part_of_body_affected.contains('Electric shock') && createTimesSVG(page, 217.96, 404.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Asphyxiation') && createTimesSVG(page, 270.4, 404.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Unconsciousness') && createTimesSVG(page, 350.4, 404.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Poisoning') && createTimesSVG(page, 416.6, 404.1, 20, 0.06),
                async (page, form) => part_of_body_affected.contains('Occupational Disease') && createTimesSVG(page, 482.8, 404.1, 20, 0.06),

                //expected_period_of_disablement
                //Expected period of disablement
                async (page, form) => expected_period_of_disablement === '0-13 days' && createTimesSVG(page, 217.96, 353.5, 20, 0.06),
                async (page, form) => expected_period_of_disablement === '2-4 weeks' && createTimesSVG(page, 273.2, 353.5, 20, 0.06),
                async (page, form) => expected_period_of_disablement === '>4-16 weeks' && createTimesSVG(page, 315.4, 353.5, 20, 0.06),
                async (page, form) => expected_period_of_disablement === '>16-52 weeks' && createTimesSVG(page, 360.4, 353.5, 20, 0.06),
                async (page, form) => expected_period_of_disablement === '>52 weeks or permanent disablement' && createTimesSVG(page, 414.4, 353.5, 20, 0.06),
                async (page, form) => expected_period_of_disablement === 'Killed' && createTimesSVG(page, 494, 353.5, 20, 0.06),

                //incident_reported_compensation_commissioner_and_provincial_director
                //Was the incident reported to the Compensation Commissioner and Provincial Director?
                async (page, form) => incident_reported_compensation_commissioner_and_provincial_director === 'Yes' && createTimesSVG(page, 324.2, 260.49, 20, 0.06),
                async (page, form) => incident_reported_compensation_commissioner_and_provincial_director === 'No' && createTimesSVG(page, 355.7, 260.49, 20, 0.06),

                //incident_reported_police
                //Was the incident reported to the police?*
                async (page, form) => incident_reported_police === 'Yes' && createTimesSVG(page, 324.2, 213.4, 20, 0.06),
                async (page, form) => incident_reported_police === 'No' && createTimesSVG(page, 352.21, 213.4, 20, 0.06),
            ].map(onDraw => {
                return {pageNum: 1, onDraw};
            });
        };

        return [
            ...onCreateTextFieldPage1()
        ];
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="get data">
    get data() {
        const {item} = this.props;
        if (!item) {
            return null;
        }
        const {
            data: {
                accident_date,
                employee,
                annexture_1: {
                    //A. Recording Of Incident
                    company_name,
//                    affected_person,
                    id_num,
//                    accident_date,
                    accident_time,
                    part_of_body_affected,
                    effect_on_person,
                    expected_period_of_disablement,
                    disease_desc,
                    process,
                    incident_reported_compensation_commissioner_and_provincial_director,
                    incident_reported_police,
                    saps_office,
                    saps_reference,
                    substance_exposed_to,

                    //B. Incident Investigation
                    investigator,
                    investigation_date,
                    investigator_designation,
                    incident_desc,
                    incident_cause,
                    steps_to_prevent_recurrence,
                    investigator_signature,
                    investigator_signature_date,

                    //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
                    employer_preventative_action_for_recurrence_of_similar_incident,
                    employer_signature,
                    employer_signature_date,

                    //D. Remarks By Health & Safety Committee
                    health_and_safety_committee_remarks,
                    chairperson_of_health_and_safety_committee_signature,
                    chairperson_of_health_and_safety_committee_signature_date
                }
            }
        } = item;

        const createEmployeeName = (v) => {
            if (!v)
                return null;
            const {lname, fname, data} = v;
            return `${fname || data.fname} ${lname || data.lname}`;
        };

        return {
            //A. Recording Of Incident
            '1 Name of employer': company_name,
            '2 Name of affected person': createEmployeeName(employee),
            '3 Identity number of affected person': id_num,
            '4 Date of incident': Dates.formatDate(accident_date),
            '5 Time of incident': accident_time,

            '9 Description of occupational disease': disease_desc,
            '10 Machineprocess involvedtype of work performedexposure': process,

            '13 SAPS office and reference': `${saps_office} ${saps_reference}`,

            'in case of a hazardous chemical substance indicate substance exposed to 1': substance_exposed_to,

            //B. Incident Investigation
            '1 Name of investigator': createEmployeeName(investigator),
            '2 Date of investigation': Dates.formatDate(investigation_date),
            '3 Designation of investigator': investigator_designation,

            //incident_desc
            '4 Short description of incident 1': 'Company',
            '4 Short description of incident 2': 'Company',
            '4 Short description of incident 3': 'Company',
            '4 Short description of incident 4': 'Company',

            //incident_cause
            '5 Suspected cause of incident 1': 'Company',
            '5 Suspected cause of incident 2': 'Company',
            '5 Suspected cause of incident 3': 'Company',
            '5 Suspected cause of incident 4': 'Company',

            //steps_to_prevent_recurrence
            '6 Recommended steps to prevent a recurrence 1': 'Company',
            '6 Recommended steps to prevent a recurrence 2': 'Company',
            '6 Recommended steps to prevent a recurrence 3': 'Company',
            '6 Recommended steps to prevent a recurrence 4': 'Company',

            'Signature of Investigator': investigator_signature,
            'Date': Dates.formatDate(investigator_signature_date),

            //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
            //employer_preventative_action_for_recurrence_of_similar_incident
            'INCIDENT 1': 'Company',
            'INCIDENT 2': 'Company',
            'INCIDENT 3': 'Company',
            'INCIDENT 4': 'Company',

            'Signature of employer': employer_signature,
            'Date_2': Dates.formatDate(employer_signature_date),

            //D. Remarks By Health & Safety Committee
            //health_and_safety_committee_remarks
            'Remarks 1': 'Company',
            'Remarks 2': 'Company',
            'Remarks 3': 'Company',
            'Remarks 4': 'Company',

            'Signature of Chairperson of Health and Safety Committee': chairperson_of_health_and_safety_committee_signature,
            'Date_3': Dates.formatDate(chairperson_of_health_and_safety_committee_signature_date)
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {data, onCreateTextField} = this;
        return <ClaimDocument 
            ref="claimDocument"
            fileName='Annexure-1.pdf' 
            data={data}
            onCreateTextField={onCreateTextField}
            />;
    }
    // </editor-fold>
}

export default PDFAnnexure1Form;