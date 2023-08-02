// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {TextAlignment} from 'pdf-lib';

import {ClaimDocument, createTextField, createTimesSVG} from 'components/documents/ClaimDocument';

// </editor-fold>

@observer
class PDFWCl4Form extends React.Component {

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
            return [
                //General Details
                async (page, form) => createTextField(page, form, 'claim_num', 504, 68, 91),
                async (page, form) => createTextField(page, form, 'provincial_office', 486, 89.7, 129),
                async (page, form) => createTextField(page, form, 'date', 494.3, 104.7, 109),
                async (page, form) => createTextField(page, form, 'declaring_person_signature_date_d', 133, 160.8, 56).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'declaring_person_signature_date_m', 225, 160.8, 70).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'declaring_person_signature_date_y', 300, 160.8, 30).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'declaring_person_signature', 481.3, 160.8, 121.6),
                //1. Employer Details
                async (page, form) => createTextField(page, form, 'company_name', 406, 199.8, 271),
                async (page, form) => createTextField(page, form, 'company_reg_num', 461, 233.6, 154),
                async (page, form) => createTextField(page, form, 'company_contact_person', 241.4, 233.6, 228.9),
                async (page, form) => createTextField(page, form, 'company_str_addr', 240.4, 250.92, 231),
                async (page, form) => createTextField(page, form, 'company_str_addr_code', 492.48, 250.92, 95),
                async (page, form) => createTextField(page, form, 'company_postal_addr', 191, 268.2, 130.5),
                async (page, form) => createTextField(page, form, 'company_postal_addr_code', 349.2, 268.2, 45.4),
                async (page, form) => createTextField(page, form, 'company_tel_code', 445.5, 268.2, 24).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'company_tel_num', 502.2, 268.2, 77),
                async (page, form) => createTextField(page, form, 'company_fax_code', 113.2, 284.28, 20).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'company_fax_num', 193.2, 284.28, 128.2),
                async (page, form) => createTextField(page, form, 'company_email', 333.8, 301.8, 415),
                async (page, form) => createTextField(page, form, 'company_location', 459.6, 284.28, 166.4),
                async (page, form) => createTextField(page, form, 'company_nature', 372.7, 318.84, 341.2),
                //2. Employee Details
                async (page, form) => createTimesSVG(page, 191, 336, 20, 0.06),
                async (page, form) => createTimesSVG(page, 281, 336, 20, 0.06),
                async (page, form) => createTimesSVG(page, 354, 336, 20, 0.06),
                async (page, form) => createTimesSVG(page, 424, 336, 20, 0.06),
                async (page, form) => createTimesSVG(page, 505, 336, 20, 0.06),
                async (page, form) => createTextField(page, form, 'employee_lname', 168, 373.3, 126),
                async (page, form) => createTextField(page, form, 'employee_fname', 422, 373.3, 237),
                async (page, form) => createTextField(page, form, 'id_num', 163, 390.3, 137),
                async (page, form) => createTextField(page, form, 'dob_d', 314, 390.3, 16).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'dob_m', 337, 390.3, 15).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'dob_y', 361, 390.3, 19).setAlignment(TextAlignment.Center),
                async (page, form) => createTimesSVG(page, 453, 370, 20, 0.06),
                async (page, form) => createTimesSVG(page, 510, 370, 20, 0.06),
                async (page, form) => createTimesSVG(page, 141, 387.5, 20, 0.06),
                async (page, form) => createTimesSVG(page, 197, 387.5, 20, 0.06),
                async (page, form) => createTextField(page, form, 'citizen_of', 418, 407, 245),
                async (page, form) => createTextField(page, form, 'personnel_num', 176, 424.3, 107),
                async (page, form) => createTextField(page, form, 'occupation', 422, 424.3, 238),
                async (page, form) => createTextField(page, form, 'employee_str_addr', 246.4, 441.3, 244),
                async (page, form) => createTextField(page, form, 'employee_str_addr_code', 492.48, 441.3, 99),
                async (page, form) => createTextField(page, form, 'employee_postal_addr', 247.7, 458, 243.9),
                async (page, form) => createTextField(page, form, 'employee_postal_addr_code', 492.48, 458, 99),
                async (page, form) => createTextField(page, form, 'employee_tel_code', 116, 475, 24).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'employee_tel_num', 251.7, 475, 235),
                async (page, form) => createTextField(page, form, 'period_employ_years', 217, 492, 22).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'period_employ_months', 244.7, 492, 22).setAlignment(TextAlignment.Center),
                async (page, form) => createTimesSVG(page, 453, 472, 20, 0.06),
                async (page, form) => createTimesSVG(page, 510, 472, 20, 0.06),
                //3. Accident Details
                async (page, form) => createTextField(page, form, 'accident_date_d', 139, 529, 16).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'accident_date_m', 158, 529, 13).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'accident_date_y', 179, 529, 19).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'accident_time', 476.5, 529, 128),
                async (page, form) => createTextField(page, form, 'incident_place', 249, 546.5, 231),
                async (page, form) => createTextField(page, form, 'incident_place_district', 480.6, 546.5, 123.8),
                async (page, form) => createTextField(page, form, 'incident_place_province', 233.4, 564, 259.5),
                async (page, form) => createTextField(page, form, 'accident_date_reported_d', 197.6, 580, 13.7).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'accident_date_reported_m', 218, 580, 15).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'accident_date_reported_y', 241.5, 580, 18).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'accident_time_reported', 478, 580, 130),
                async (page, form) => createTextField(page, form, 'task_employee_performing', 428, 597.5, 228),
                async (page, form) => createTextField(page, form, 'period_experience_task_performed_years', 291, 615, 24).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'period_experience_task_performed_months', 322, 615, 22).setAlignment(TextAlignment.Center),
                async (page, form) => createTimesSVG(page, 453, 611.5, 20, 0.06),
                async (page, form) => createTimesSVG(page, 507, 611.5, 20, 0.06),
                async (page, form) => createTextField(page, form, 'accident_desc_1', 342.5, 672, 395),
                async (page, form) => createTextField(page, form, 'accident_desc_2', 305, 687, 470.6),
//        async (page, form) => createTextField(page, form, 'accident_desc_2', 304, 687, 470),
                async (page, form) => createTimesSVG(page, 453, 689, 20, 0.06),
                async (page, form) => createTimesSVG(page, 507, 689, 20, 0.06),
                async (page, form) => createTextField(page, form, 'nature_of_injury_list', 424, 724, 237),
                async (page, form) => createTimesSVG(page, 331, 722.6, 20, 0.06),
                async (page, form) => createTimesSVG(page, 415, 722.6, 20, 0.06),
                async (page, form) => createTimesSVG(page, 495, 722.6, 20, 0.06),
                async (page, form) => createTimesSVG(page, 376, 739.5, 20, 0.06),
                async (page, form) => createTimesSVG(page, 417, 739.5, 20, 0.06),
                async (page, form) => createTextField(page, form, 'employee_injured_explanation_satisfactory_nope_desc', 305.5, 779, 470.6),
            ].map(onDraw => {
                return {pageNum: 1, onDraw};
            });
        };

        const onCreateTextFieldPage2 = () => {
            return [
                async (page, form) => createTextField(page, form, 'page_2_header_company_name', 218.5, 74.2, 252),
                async (page, form) => createTextField(page, form, 'page_2_header_incident_date', 478.6, 74.2, 123.5),
                async (page, form) => createTextField(page, form, 'page_2_header_employee_name', 191, 96.2, 194.1),
                async (page, form) => createTextField(page, form, 'page_2_header_employee_id_num', 452, 96.2, 177.4),
                //4. Further Particulars Of Employee
                async (page, form) => createTimesSVG(page, 489, 314, 20, 0.06),
                async (page, form) => createTimesSVG(page, 520, 314, 20, 0.06),
                async (page, form) => createTextField(page, form, 'total_amount_already_paid', 452, 351.5, 177.4),
                async (page, form) => createTextField(page, form, 'num_of_week_days_worked_by_employee', 310.5, 384, 115),
                async (page, form) => createTextField(page, form, 'date_ceased_work_d', 303.7, 401, 44.5).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_ceased_work_m', 353, 401, 40.6).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_ceased_work_y', 400, 401, 42).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'time_ceased_work', 512.5, 401, 58),
                async (page, form) => createTimesSVG(page, 453, 394, 20, 0.07),
                async (page, form) => createTimesSVG(page, 501, 394, 20, 0.07),

                async (page, form) => createTextField(page, form, 'date_resumed_work_d', 301, 433.6, 42.2).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_resumed_work_m', 350.4, 433.6, 44.6).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_resumed_work_y', 400, 433.6, 41).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'time_resumed_work', 512.5, 433.6, 58),
                async (page, form) => createTextField(page, form, 'dependant_name_and_address_1', 481, 467, 123),
                async (page, form) => createTextField(page, form, 'dependant_name_and_address_2', 305, 483, 470.6),
                //5. Further Particulars
                async (page, form) => createTextField(page, form, 'previously_received_compensation_full_names', 433, 537, 214),
                async (page, form) => createTimesSVG(page, 451, 528, 20, 0.08),
                async (page, form) => createTimesSVG(page, 495, 528, 20, 0.08),
                async (page, form) => createTextField(page, form, 'medical_practitioner_or_chiropractor_who_treated_employee', 451.5, 570.7, 179.5),
                async (page, form) => createTextField(page, form, 'hospital_which_treated_employee', 434, 587, 214),
                async (page, form) => createTimesSVG(page, 451, 577, 20, 0.08),
                async (page, form) => createTimesSVG(page, 495, 577, 20, 0.08),
                async (page, form) => createTimesSVG(page, 451, 610, 20, 0.08),
                async (page, form) => createTimesSVG(page, 495, 610, 20, 0.08),
                async (page, form) => createTimesSVG(page, 451, 629, 20, 0.08),
                async (page, form) => createTimesSVG(page, 495, 629, 20, 0.08),
                async (page, form) => createTextField(page, form, 'accident_witness', 418, 699, 246),
                async (page, form) => createTextField(page, form, 'accident_aware_person', 387, 714.9, 308),
                async (page, form) => createTextField(page, form, 'num_of_employees_involved_in_accident', 420, 732, 243),
                async (page, form) => createTextField(page, form, 'accident_police_station_and_docket_num_1', 499, 748, 84),
                async (page, form) => createTextField(page, form, 'accident_police_station_and_docket_num_2', 305, 764, 470.6),
                async (page, form) => createTextField(page, form, 'involved_vehicle_reg_numbers', 415, 782, 250.8),
            ].map(onDraw => {
                return {pageNum: 2, onDraw};
            });
        };

        const onCreateTextFieldPage3 = () => {
            return [
                async (page, form) => createTextField(page, form, 'page_3_header_company_name', 218.5, 74.2, 252),
                async (page, form) => createTextField(page, form, 'page_3_header_incident_date', 478.6, 74.2, 123.5),
                async (page, form) => createTextField(page, form, 'page_3_header_employee_name', 191, 96.2, 194.1),
                async (page, form) => createTextField(page, form, 'page_3_header_employee_id_num', 452, 96.2, 177.4),
                //5. Further Particulars
                async (page, form) => createTimesSVG(page, 201, 137.9, 20),
                async (page, form) => createTimesSVG(page, 201, 155.7, 20),
                async (page, form) => createTimesSVG(page, 201, 173.7, 20),
                async (page, form) => createTimesSVG(page, 201, 191.5, 20),
                async (page, form) => createTimesSVG(page, 201, 209.7, 20),
                async (page, form) => createTimesSVG(page, 201, 227.4, 20),

                async (page, form) => createTimesSVG(page, 373, 137.9, 20),
                async (page, form) => createTimesSVG(page, 373, 155.7, 20),
                async (page, form) => createTimesSVG(page, 373, 173.7, 20),
                async (page, form) => createTimesSVG(page, 373, 191.5, 20),
                async (page, form) => createTimesSVG(page, 373, 209.7, 20),
                async (page, form) => createTimesSVG(page, 373, 227.4, 20),

                async (page, form) => createTimesSVG(page, 512, 137.9, 20),
                async (page, form) => createTimesSVG(page, 512, 155.7, 20),
                async (page, form) => createTimesSVG(page, 512, 173.7, 20),
                async (page, form) => createTimesSVG(page, 512, 191.5, 20),
                async (page, form) => createTimesSVG(page, 512, 209.7, 20),
                async (page, form) => createTimesSVG(page, 512, 227.4, 20),

                async (page, form) => createTextField(page, form, 'other_machinery_list', 354, 295, 373),
                async (page, form) => createTextField(page, form, 'other_contributing_factor_list', 416, 311.9, 248),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_1', 300, 375.2, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_2', 300, 391, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_3', 300, 405.8, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_4', 300, 421.6, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_5', 300, 437.3, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_6', 300, 453.1, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_7', 300, 468.7, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_8', 300, 484.3, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_9', 300, 499.9, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_10', 300, 515.5, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_11', 300, 531.1, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_12', 300, 546.7, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_13', 300, 561.9, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_14', 300, 578, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_15', 300, 594, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_16', 300, 609.0, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_17', 300, 624.7, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_18', 300, 640.0, 499),
                async (page, form) => createTextField(page, form, 'additional_details_or_comments_19', 300, 655.8, 499),
            ].map(onDraw => {
                return {pageNum: 3, onDraw};
            });
        };

        return [...onCreateTextFieldPage1(), ...onCreateTextFieldPage2(), ...onCreateTextFieldPage3()];
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
                claim_number,
                provincial_office,
                accident_date,
                employee,
                wcl_4: {
                    //2. Employer Details
                    company_name,
                    company_str_addr,
                    company_str_addr_code,

                    //3. Employee Details
//                    employee,
                    id_num,
                    employee_str_addr,
                    employee_str_addr_code,

                    //4. Medical Practioner/Chiropractor Consultation Details
                    first_consultation_date,
                    how_accident_happen,
                    injury_clinical_desc,
                    pre_existing_defect_disease,
                    x_rays_date,
                    x_rays_conducting_person,
                    x_rays_report,
                    surgical_procedure_date,
                    surgical_procedure_conducting_person,
                    surgical_procedure_desc,
                    anaesthetics_general_or_local,
                    anaesthetics_dur,
                    consultation_yes_or_no,
                    consultation_date,
                    consultation_conducting_person,
                    physiotherapy_employee_referred_yes_or_no,
                    physiotherapy_conducting_person,
                    employee_fitness_yes_or_no,
                    employee_fitness_light_duty_date,
                    employee_fitness_normal_duty_date,

                    //5. Medical Practioner/Chiropractor Declaration
                    practioner_signature,
                    practioner_signature_name,
                    practioner_signature_date,
                    practioner_addr,
                    practioner_practice_num
                }
            }
        } = item;
        
        const createEmployeeName = (v) => {
            if (!v) return null;
            const {lname, fname, data} = v;
            return `${fname || data.fname} ${lname || data.lname}`;
        };
        
        return {
            company_name,
            'company_reg_num': 'Company',
            'company_contact_person': 'Company',
            'company_str_addr': 'Company',
            'company_str_addr_code': 'Company',
            'company_postal_addr': 'Company',
            'company_postal_addr_code': 'Company',

            'company_tel_code': '011',
            'company_tel_num': 'Company',
            'company_fax_code': '011',
            'company_fax_num': 'Company',
            'company_email': 'Company',
            'company_location': 'Company',
            'company_nature': 'Company',
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {data, onCreateTextField} = this;
        return <ClaimDocument 
            ref="claimDocument"
            fileName='W.Cl.4.pdf' 
            data={data}
            onCreateTextField={onCreateTextField}
            />;
    }
    // </editor-fold>
}

export default PDFWCl4Form;