// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {TextAlignment} from 'pdf-lib';

import {Dates} from 'utils/Utils';
import {ClaimDocument, createTextField, createTimesSVG} from 'components/documents/ClaimDocument';

// </editor-fold>

@observer
class PDFWCl2Form extends React.Component {

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
                async (page, form) => createTextField(page, form, 'page_1_claim_num', 483, 210, 91),
                async (page, form) => createTextField(page, form, 'page_1_provincial_office', 464.5, 231, 129),
                async (page, form) => createTextField(page, form, 'page_1_accident_date', 473, 246.5, 109),
            ].map(onDraw => {
                return {pageNum: 1, onDraw};
            });
        };

        const onCreateTextFieldPage2 = (pageNum = 2) => {
            // <editor-fold defaultstate="collapsed" desc="item">
            let {
                data: {
                    wcl_2: {
                        //2. Employee Details
                        company_employee_association,
                        gender,
                        marital_status,
                        expected_disablement_period,
                        //3. Accident Details
                        employee_action_connected_business,
                        traffic_accident_on_public_road,
                        nature_of_injury_options,
                        employee_injured_explanation_satisfactory,
                    }
                }
            } = item;
            // </editor-fold>
            
            if(company_employee_association) {
                company_employee_association = company_employee_association.toLowerCase();
            }
            
            nature_of_injury_options = nature_of_injury_options || [];
            
            // <editor-fold defaultstate="collapsed" desc="return">
            return [
                //General Details
                async (page, form) => createTextField(page, form, `${pageNum}_page_2_claim_num`, 504, 68, 91),
                async (page, form) => createTextField(page, form, `${pageNum}_page_2_provincial_office`, 486, 89.7, 129),
                async (page, form) => createTextField(page, form, `${pageNum}_page_2_accident_date`, 494.3, 104.7, 109),

                async (page, form) => createTextField(page, form, `${pageNum}_declaring_person_signature_date_d`, 133, 160.8, 56).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_declaring_person_signature_date_m`, 225, 160.8, 70).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_declaring_person_signature_date_y`, 300, 160.8, 30).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_declaring_person_signature`, 481.3, 160.8, 121.6),
                //1. Employer Details
                async (page, form) => createTextField(page, form, `${pageNum}_company_name`, 406, 199.8, 271),
                async (page, form) => createTextField(page, form, `${pageNum}_company_reg_num`, 461, 233.6, 154),
                async (page, form) => createTextField(page, form, `${pageNum}_company_contact_person`, 241.4, 233.6, 228.9),
                async (page, form) => createTextField(page, form, `${pageNum}_company_str_addr`, 240.4, 250.92, 231),
                async (page, form) => createTextField(page, form, `${pageNum}_company_str_addr_code`, 492.48, 250.92, 95),
                async (page, form) => createTextField(page, form, `${pageNum}_company_postal_addr`, 191, 268.2, 130.5),
                async (page, form) => createTextField(page, form, `${pageNum}_company_postal_addr_code`, 349.2, 268.2, 45.4),
                async (page, form) => createTextField(page, form, `${pageNum}_company_tel_code`, 445.5, 268.2, 24).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_company_tel_num`, 502.2, 268.2, 77),
                async (page, form) => createTextField(page, form, `${pageNum}_company_fax_code`, 113.2, 284.28, 20).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_company_fax_num`, 193.2, 284.28, 128.2),
                async (page, form) => createTextField(page, form, `${pageNum}_company_email`, 333.8, 301.8, 415),
                async (page, form) => createTextField(page, form, `${pageNum}_company_location`, 459.6, 284.28, 166.4),
                async (page, form) => createTextField(page, form, `${pageNum}_company_nature`, 372.7, 318.84, 341.2),
                //2. Employee Details
                //company_employee_association
                async (page, form) => company_employee_association === 'working director' && createTimesSVG(page, 191, 336, 20, 0.06),
                async (page, form) => company_employee_association === 'working member of a cc' && createTimesSVG(page, 281, 336, 20, 0.06),
                async (page, form) => company_employee_association === 'owner of' && createTimesSVG(page, 354, 336, 20, 0.06),
                async (page, form) => company_employee_association === 'partner in the business' && createTimesSVG(page, 424, 336, 20, 0.06),
                async (page, form) => company_employee_association === 'not applicable' && createTimesSVG(page, 505, 336, 20, 0.06),
                
                async (page, form) => createTextField(page, form, `${pageNum}_employee_lname`, 168, 373.3, 126),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_fname`, 422, 373.3, 237),
                async (page, form) => createTextField(page, form, `${pageNum}_id_num`, 163, 390.3, 137),
                async (page, form) => createTextField(page, form, `${pageNum}_dob_d`, 314, 390.3, 16).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_dob_m`, 337, 390.3, 15).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_dob_y`, 361, 390.3, 19).setAlignment(TextAlignment.Center),
                //gender
                async (page, form) => gender === 'Male' && createTimesSVG(page, 453, 370, 20, 0.06),
                async (page, form) => gender === 'Female' && createTimesSVG(page, 510, 370, 20, 0.06),
                //marital_status
                async (page, form) => marital_status === 'Married' && createTimesSVG(page, 141, 387.5, 20, 0.06),
                async (page, form) => marital_status === 'Single' && createTimesSVG(page, 197, 387.5, 20, 0.06),
                
                async (page, form) => createTextField(page, form, `${pageNum}_citizen_of`, 418, 407, 245),
                async (page, form) => createTextField(page, form, `${pageNum}_personnel_num`, 176, 424.3, 107),
                async (page, form) => createTextField(page, form, `${pageNum}_occupation`, 422, 424.3, 238),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_str_addr`, 246.4, 441.3, 244),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_str_addr_code`, 492.48, 441.3, 99),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_postal_addr`, 247.7, 458, 243.9),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_postal_addr_code`, 492.48, 458, 99),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_tel_code`, 116, 475, 24).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_employee_tel_num`, 251.7, 475, 235),
                async (page, form) => createTextField(page, form, `${pageNum}_period_employ_years`, 217, 492, 22).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_period_employ_months`, 244.7, 492, 22).setAlignment(TextAlignment.Center),
                //expected_disablement_period
                async (page, form) => expected_disablement_period === '0-13 days' && createTimesSVG(page, 453, 472, 20, 0.06),
                async (page, form) => expected_disablement_period === '14 & more' && createTimesSVG(page, 510, 472, 20, 0.06),
                
                //3. Accident Details
                async (page, form) => createTextField(page, form, `${pageNum}_accident_date_d`, 139, 529, 16).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_date_m`, 158, 529, 13).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_date_y`, 179, 529, 19).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_time`, 476.5, 529, 128),
                async (page, form) => createTextField(page, form, `${pageNum}_incident_place`, 249, 546.5, 231),
                async (page, form) => createTextField(page, form, `${pageNum}_incident_place_district`, 480.6, 546.5, 123.8),
                async (page, form) => createTextField(page, form, `${pageNum}_incident_place_province`, 233.4, 564, 259.5),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_date_reported_d`, 197.6, 580, 13.7).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_date_reported_m`, 218, 580, 15).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_date_reported_y`, 241.5, 580, 18).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_time_reported`, 478, 580, 130),
                async (page, form) => createTextField(page, form, `${pageNum}_task_employee_performing_during_accident`, 428, 597.5, 228),
                async (page, form) => createTextField(page, form, `${pageNum}_period_experience_task_performed_years`, 291, 615, 24).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, `${pageNum}_period_experience_task_performed_months`, 322, 615, 22).setAlignment(TextAlignment.Center),
                //employee_action_connected_business
                async (page, form) => employee_action_connected_business === "Yes" && createTimesSVG(page, 453, 611.5, 20, 0.06),
                async (page, form) => employee_action_connected_business === "No" && createTimesSVG(page, 507, 611.5, 20, 0.06),
                
                async (page, form) => createTextField(page, form, `${pageNum}_accident_desc_1`, 342.5, 672, 395),
                async (page, form) => createTextField(page, form, `${pageNum}_accident_desc_2`, 305, 687, 470.6),
//        async (page, form) => createTextField(page, form, `${pageNum}_accident_desc_2`, 304, 687, 470),
                //traffic_accident_on_public_road
                async (page, form) => traffic_accident_on_public_road === "Yes" && createTimesSVG(page, 453, 689, 20, 0.06),
                async (page, form) => traffic_accident_on_public_road === "No" && createTimesSVG(page, 507, 689, 20, 0.06),
                
                async (page, form) => createTextField(page, form, `${pageNum}_nature_of_injury_list`, 424, 724, 237),
                //nature_of_injury_options
                async (page, form) => nature_of_injury_options.contains("Killed") && createTimesSVG(page, 331, 722.6, 20, 0.06),
                async (page, form) => nature_of_injury_options.contains("Amputation") && createTimesSVG(page, 415, 722.6, 20, 0.06),
                async (page, form) => nature_of_injury_options.contains("Unconsciousness") && createTimesSVG(page, 495, 722.6, 20, 0.06),
                //employee_injured_explanation_satisfactory
                async (page, form) => employee_injured_explanation_satisfactory === "Yes" && createTimesSVG(page, 376, 739.5, 20, 0.06),
                async (page, form) => employee_injured_explanation_satisfactory === "No" && createTimesSVG(page, 417, 739.5, 20, 0.06),
                
                async (page, form) => createTextField(page, form, `${pageNum}_employee_injured_explanation_satisfactory_nope_desc`, 305.5, 779, 470.6),
            ].map(onDraw => {
                return {pageNum, onDraw};
            });
            // </editor-fold>
        };

        const onCreateTextFieldPage3 = () => {
            // <editor-fold defaultstate="collapsed" desc="item">
            let {
                data: {
                    wcl_2: {
                        //4. Further Particulars Of Employee
                        doc_salary_slip,
                        earning_list,
                        prepared_further_payments_after_3_months_4rm_accident_date,
                        total_amount_already_paid,
                        period_payments_made_range,
                        num_of_week_days_worked_by_employee,
                        date_ceased_work,
                        time_ceased_work,
                        did_employee_complete_shift_on_date_work_ceased,
                        date_resumed_work,
                        time_resumed_work,
                        dependant_name,
                        dependant_address,
                        
                        //5. Further Particulars
                        previously_received_compensation_full_names,
                        was_1st_aid_given,
                        medical_practitioner_or_chiropractor_who_treated_employee,
                        hospital_which_treated_employee,
                        was_accidnt_caused_by_employee_options_1,
                        was_accidnt_caused_by_employee_options_2,
                        was_accidnt_caused_by_employee_options_3,
                        accident_witness,
                        accident_aware_person,
                        num_of_employees_involved_in_accident,
                        accident_police_station,
                        accident_docket_num,
                        involved_vehicle_reg_numbers,
                        contributing_factor_list_A,
                        contributing_factor_list_B,
                        other_machinery_list,
                        other_contributing_factor_list,
                        additional_details_or_comments,
                    }
                }
            } = item;
            // </editor-fold>
            
            // <editor-fold defaultstate="collapsed" desc="return">
            return [
                async (page, form) => createTextField(page, form, 'page_3_header_company_name', 218.5, 74.2, 252),
                async (page, form) => createTextField(page, form, 'page_3_header_incident_date', 478.6, 74.2, 123.5),
                async (page, form) => createTextField(page, form, 'page_3_header_employee_name', 191, 96.2, 194.1),
                async (page, form) => createTextField(page, form, 'page_3_header_employee_id_num', 452, 96.2, 177.4),
                //4. Further Particulars Of Employee
                async (page, form) => prepared_further_payments_after_3_months_4rm_accident_date === 'Yes' && createTimesSVG(page, 489, 314, 20, 0.06),
                async (page, form) => prepared_further_payments_after_3_months_4rm_accident_date === 'No' && createTimesSVG(page, 520, 314, 20, 0.06),
                async (page, form) => createTextField(page, form, 'total_amount_already_paid', 452, 351.5, 177.4),
                async (page, form) => createTextField(page, form, 'num_of_week_days_worked_by_employee', 310.5, 384, 115),
                async (page, form) => createTextField(page, form, 'date_ceased_work_d', 303.7, 401, 44.5).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_ceased_work_m', 353, 401, 40.6).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_ceased_work_y', 400, 401, 42).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'time_ceased_work', 512.5, 401, 58),
                async (page, form) => did_employee_complete_shift_on_date_work_ceased === 'Yes' && createTimesSVG(page, 453, 394, 20, 0.07),
                async (page, form) => did_employee_complete_shift_on_date_work_ceased === 'No' && createTimesSVG(page, 501, 394, 20, 0.07),

                async (page, form) => createTextField(page, form, 'date_resumed_work_d', 301, 433.6, 42.2).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_resumed_work_m', 350.4, 433.6, 44.6).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'date_resumed_work_y', 400, 433.6, 41).setAlignment(TextAlignment.Center),
                async (page, form) => createTextField(page, form, 'time_resumed_work', 512.5, 433.6, 58),
                async (page, form) => createTextField(page, form, 'dependant_name_and_address_1', 481, 467, 123),
                async (page, form) => createTextField(page, form, 'dependant_name_and_address_2', 305, 483, 470.6),
                //5. Further Particulars
                async (page, form) => createTextField(page, form, 'previously_received_compensation_full_names', 433, 537, 214),
                async (page, form) => was_1st_aid_given === 'Yes' && createTimesSVG(page, 451, 528, 20, 0.08),
                async (page, form) => was_1st_aid_given === 'No' && createTimesSVG(page, 495, 528, 20, 0.08),
                async (page, form) => createTextField(page, form, 'medical_practitioner_or_chiropractor_who_treated_employee', 451.5, 570.7, 179.5),
                async (page, form) => createTextField(page, form, 'hospital_which_treated_employee', 434, 587, 214),
                async (page, form) => was_accidnt_caused_by_employee_options_1 === 'Yes' && createTimesSVG(page, 451, 577, 20, 0.08),
                async (page, form) => was_accidnt_caused_by_employee_options_1 === 'No' && createTimesSVG(page, 495, 577, 20, 0.08),
                async (page, form) => was_accidnt_caused_by_employee_options_2 === 'Yes' && createTimesSVG(page, 451, 610, 20, 0.08),
                async (page, form) => was_accidnt_caused_by_employee_options_2 === 'No' && createTimesSVG(page, 495, 610, 20, 0.08),
                async (page, form) => was_accidnt_caused_by_employee_options_3 === 'Yes' && createTimesSVG(page, 451, 629, 20, 0.08),
                async (page, form) => was_accidnt_caused_by_employee_options_3 === 'No' && createTimesSVG(page, 495, 629, 20, 0.08),
                async (page, form) => createTextField(page, form, 'accident_witness', 418, 699, 246),
                async (page, form) => createTextField(page, form, 'accident_aware_person', 387, 714.9, 308),
                async (page, form) => createTextField(page, form, 'num_of_employees_involved_in_accident', 420, 732, 243),
                async (page, form) => createTextField(page, form, 'accident_police_station_and_docket_num_1', 499, 748, 84),
                async (page, form) => createTextField(page, form, 'accident_police_station_and_docket_num_2', 305, 764, 470.6),
                async (page, form) => createTextField(page, form, 'involved_vehicle_reg_numbers', 415, 782, 250.8),
            ].map(onDraw => {
                return {pageNum: 3, onDraw};
            });
            // </editor-fold>
        };

        const onCreateTextFieldPage4 = () => {
            // <editor-fold defaultstate="collapsed" desc="item">
            let {
                data: {
                    wcl_2: {
                        //5. Further Particulars
                        previously_received_compensation_full_names,
                        was_1st_aid_given,
                        medical_practitioner_or_chiropractor_who_treated_employee,
                        hospital_which_treated_employee,
                        accident_witness,
                        accident_aware_person,
                        num_of_employees_involved_in_accident,
                        accident_police_station,
                        accident_docket_num,
                        involved_vehicle_reg_numbers,
                        contributing_factor_list_A,
                        contributing_factor_list_B,
                        other_machinery_list,
                        other_contributing_factor_list,
                        additional_details_or_comments,
                    }
                }
            } = item;
            // </editor-fold>
            
            contributing_factor_list_A = (contributing_factor_list_A || []).filter(v => !!v);
            contributing_factor_list_B = (contributing_factor_list_B || []).filter(v => !!v);
            
            // <editor-fold defaultstate="collapsed" desc="return">
            return [
                async (page, form) => createTextField(page, form, 'page_4_header_company_name', 218.5, 74.2, 252),
                async (page, form) => createTextField(page, form, 'page_4_header_incident_date', 478.6, 74.2, 123.5),
                async (page, form) => createTextField(page, form, 'page_4_header_employee_name', 191, 96.2, 194.1),
                async (page, form) => createTextField(page, form, 'page_4_header_employee_id_num', 452, 96.2, 177.4),
                //5. Further Particulars
                async (page, form) => contributing_factor_list_A.contains('Defective plant') && createTimesSVG(page, 201, 137.9, 20),
                async (page, form) => contributing_factor_list_A.contains('Defective machinery') && createTimesSVG(page, 201, 155.7, 20),
                async (page, form) => contributing_factor_list_A.contains('Unfavourable conditions of work') && createTimesSVG(page, 201, 173.7, 20),
                async (page, form) => contributing_factor_list_A.contains('Fault of employer') && createTimesSVG(page, 201, 191.5, 20),
                async (page, form) => contributing_factor_list_A.contains('Fault of injured employee') && createTimesSVG(page, 201, 209.7, 20),
                async (page, form) => contributing_factor_list_A.contains('Fault of supervisor') && createTimesSVG(page, 201, 227.4, 20),

                async (page, form) => contributing_factor_list_B.contains('Railway') && createTimesSVG(page, 373, 137.9, 20),
                async (page, form) => contributing_factor_list_B.contains('Building work') && createTimesSVG(page, 373, 155.7, 20),
                async (page, form) => contributing_factor_list_B.contains('Electricity') && createTimesSVG(page, 373, 173.7, 20),
                async (page, form) => contributing_factor_list_B.contains('Chemicals') && createTimesSVG(page, 373, 191.5, 20),
                async (page, form) => contributing_factor_list_B.contains('Poisoning') && createTimesSVG(page, 373, 209.7, 20),
                async (page, form) => contributing_factor_list_B.contains('Burns') && createTimesSVG(page, 373, 227.4, 20),

                async (page, form) => contributing_factor_list_B.contains('Explosions') && createTimesSVG(page, 512, 137.9, 20),
                async (page, form) => contributing_factor_list_B.contains('Rotating machine') && createTimesSVG(page, 512, 155.7, 20),
                async (page, form) => contributing_factor_list_B.contains('Press/Rollers') && createTimesSVG(page, 512, 173.7, 20),
                async (page, form) => contributing_factor_list_B.contains('Woodworking machine') && createTimesSVG(page, 512, 191.5, 20),
                async (page, form) => contributing_factor_list_B.contains('Lifting machine') && createTimesSVG(page, 512, 209.7, 20),
                async (page, form) => contributing_factor_list_B.contains('Hand tools') && createTimesSVG(page, 512, 227.4, 20),

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
                return {pageNum: 4, onDraw};
            });
            // </editor-fold>
        };

        return [
            ...onCreateTextFieldPage1(), ...onCreateTextFieldPage2(), ...onCreateTextFieldPage3(), ...onCreateTextFieldPage4(),
            ...onCreateTextFieldPage2(5)
        ];
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="get data">
    get data() {
        const {item} = this.props;
        if (!item) {
            return null;
        }
        // <editor-fold defaultstate="collapsed" desc="item">
        let {
            data: {
                claim_number,
                provincial_office,
                accident_date,
                employee,
                wcl_2: {
                    //1. Employer Details
                    company_name,
                    company_reg_num,
                    company_contact_person,
                    company_str_addr,
                    company_str_addr_code,
                    company_postal_addr,
                    company_postal_addr_code,
                    company_tel_code,
                    company_tel_num,
                    company_fax_code,
                    company_fax_num,
                    company_email,
                    company_location,
                    company_nature,

                    //2. Employee Details
                    company_employee_association,
                    doc_certified_id,
                    id_num,
                    dob,
                    gender,
                    marital_status,
                    citizen_of,
                    personnel_num,
                    occupation,
                    employee_str_addr,
                    employee_str_addr_code,
                    employee_postal_addr,
                    employee_postal_addr_code,
                    employee_tel_code,
                    employee_tel_num,
                    period_employ_years,
                    period_employ_months,
                    expected_disablement_period,

                    //3. Accident Details
                    accident_time,
                    incident_place,
                    incident_place_province,
                    incident_place_district,
                    accident_date_reported,
                    accident_time_reported,
                    task_employee_performing_during_accident,
                    period_experience_task_performed_years,
                    period_experience_task_performed_months,
                    employee_action_connected_business,
                    accident_desc,
                    traffic_accident_on_public_road,
                    nature_of_injury_list = [],
                    nature_of_injury_options = [],
                    employee_injured_explanation_satisfactory,
                    employee_injured_explanation_satisfactory_nope_desc,
                    
                    //4. Further Particulars Of Employee
                    doc_salary_slip,
                    earning_list,
                    prepared_further_payments_after_3_months_4rm_accident_date,
                    total_amount_already_paid,
                    period_payments_made_range,
                    num_of_week_days_worked_by_employee,
                    date_ceased_work,
                    time_ceased_work,
                    did_employee_complete_shift_on_date_work_ceased,
                    date_resumed_work,
                    time_resumed_work,
                    dependant_name,
                    dependant_address,

                    //5. Further Particulars
                    previously_received_compensation_full_names,
                    was_1st_aid_given,
                    medical_practitioner_or_chiropractor_who_treated_employee,
                    hospital_which_treated_employee,
                    accident_witness,
                    accident_aware_person,
                    num_of_employees_involved_in_accident,
                    accident_police_station,
                    accident_docket_num,
                    involved_vehicle_reg_numbers,
                    contributing_factor_list_A,
                    contributing_factor_list_B,
                    other_machinery_list,
                    other_contributing_factor_list,
                    additional_details_or_comments,

                    //6. Employer's Declaration
                    employer_signature,
                    employer_signature_name,
                    employer_signature_date
                }
            }
        } = item;
        // </editor-fold>
        
        console.log('item', item)
        
        if(occupation) {
            const {name, data: _data} = occupation;
            occupation = name || _data.name;
        }
        
        nature_of_injury_list = (nature_of_injury_list || []).filter(v => !!v);
        nature_of_injury_options = (nature_of_injury_options || []).filter(v => !!v);

        const createEmployeeFName = (v) => {
            if (!v) return null;
            const {lname, fname, data} = v;
            return `${fname || data.fname}`;
        };
        const createEmployeeLName = (v) => {
            if (!v) return null;
            const {lname, fname, data} = v;
            return `${lname || data.lname}`;
        };
        const createEmployeeName = (v) => {
            if (!v) return null;
            return `${createEmployeeFName(v)} ${createEmployeeLName(v)}`;
        };

        let accident_date_d, accident_date_m, accident_date_y;
        if (accident_date) {
            const __accident_date = Dates.parse(accident_date);
            if (__accident_date) {
                accident_date_d = `${__accident_date.getDate()}`;
                accident_date_m = `${__accident_date.getMonth()}`;
                accident_date_y = `${__accident_date.getFullYear()}`;
            }
        }
        
        let accident_date_reported_d, accident_date_reported_m, accident_date_reported_y;
        if (accident_date_reported) {
            const __accident_date_reported = Dates.parse(accident_date_reported);
            if (__accident_date_reported) {
                accident_date_reported_d = `${__accident_date_reported.getDate()}`;
                accident_date_reported_m = `${__accident_date_reported.getMonth()}`;
                accident_date_reported_y = `${__accident_date_reported.getFullYear()}`;
            }
        }
        
        let declaring_person_signature_date_d, declaring_person_signature_date_m, declaring_person_signature_date_y;
        if (employer_signature_date) {
            const __employer_signature_date = Dates.parse(employer_signature_date);
            if (__employer_signature_date) {
                declaring_person_signature_date_d = `${__employer_signature_date.getDate()}`;
                declaring_person_signature_date_m = `${__employer_signature_date.getMonth()}`;
                declaring_person_signature_date_y = `${__employer_signature_date.getFullYear()}`;
            }
        }
        
        let dob_d, dob_m, dob_y;
        if (dob) {
            const __dob = Dates.parse(dob);
            if (__dob) {
                dob_d = `${__dob.getDate()}`;
                dob_m = `${__dob.getMonth()}`;
                dob_y = `${__dob.getFullYear()}`;
            }
        }
        
        const onCreatePage1 = () => {
            //onCreateTextFieldPage1
            return {
                page_1_claim_num: claim_number,
                page_1_provincial_office: provincial_office,
                page_1_accident_date: Dates.formatDate(accident_date)
            };
        };
        
        const onCreatePage2 = (pageNum = 2) => {
            //onCreateTextFieldPage2
            // <editor-fold defaultstate="collapsed" desc="return">
            return {
                //General Details
                [`${pageNum}_page_2_claim_num`]: claim_number,
                [`${pageNum}_page_2_provincial_office`]: provincial_office,
                [`${pageNum}_page_2_accident_date`]: Dates.formatDate(accident_date),
                
                //6. Employer's Declaration            
                [`${pageNum}_declaring_person_signature_date_d`]: declaring_person_signature_date_d,
                [`${pageNum}_declaring_person_signature_date_m`]: declaring_person_signature_date_m,
                [`${pageNum}_declaring_person_signature_date_y`]: declaring_person_signature_date_y,
//                [`${pageNum}_declaring_person_signature`]: employer_signature,
                
                //1. Employer Details
                [`${pageNum}_company_name`]: company_name,
                [`${pageNum}_company_reg_num`]: company_reg_num,
                [`${pageNum}_company_contact_person`]: createEmployeeName(company_contact_person),
                [`${pageNum}_company_str_addr`]: company_str_addr,
                [`${pageNum}_company_str_addr_code`]: company_str_addr_code,
                [`${pageNum}_company_postal_addr`]: company_postal_addr,
                [`${pageNum}_company_postal_addr_code`]: company_postal_addr_code,
                [`${pageNum}_company_tel_code`]: company_tel_code,
                [`${pageNum}_company_tel_num`]: company_tel_num,
                [`${pageNum}_company_fax_code`]: company_fax_code,
                [`${pageNum}_company_fax_num`]: company_fax_num,
                [`${pageNum}_company_email`]: company_email,
                [`${pageNum}_company_location`]: company_location,
                [`${pageNum}_company_nature`]: company_nature,
                                
                //2. Employee Details
                [`${pageNum}_employee_lname`]: createEmployeeLName(employee),
                [`${pageNum}_employee_fname`]: createEmployeeFName(employee),
//                doc_certified_id: doc_certified_id,
                [`${pageNum}_id_num`]: id_num,
                [`${pageNum}_dob_d`]: dob_d,
                [`${pageNum}_dob_m`]: dob_m,
                [`${pageNum}_dob_y`]: dob_y,
                [`${pageNum}_citizen_of`]: citizen_of,
                [`${pageNum}_personnel_num`]: personnel_num,
                [`${pageNum}_occupation`]: occupation,
                [`${pageNum}_employee_str_addr`]: employee_str_addr,
                [`${pageNum}_employee_str_addr_code`]: employee_str_addr_code,
                [`${pageNum}_employee_postal_addr`]: employee_postal_addr,
                [`${pageNum}_employee_postal_addr_code`]: employee_postal_addr_code,
                [`${pageNum}_employee_tel_code`]: employee_tel_code,
                [`${pageNum}_employee_tel_num`]: employee_tel_num,
                [`${pageNum}_period_employ_years`]: isNumber(period_employ_years) && `${period_employ_years}`,
                [`${pageNum}_period_employ_months`]: isNumber(period_employ_months) && `${period_employ_months}`,
                
                //3. Accident Details
                [`${pageNum}_accident_date_d`]: accident_date_d,
                [`${pageNum}_accident_date_m`]: accident_date_m,
                [`${pageNum}_accident_date_y`]: accident_date_y,
                [`${pageNum}_accident_time`]: accident_time,
                [`${pageNum}_incident_place`]: incident_place,
                [`${pageNum}_incident_place_province`]: incident_place_province,
                [`${pageNum}_incident_place_district`]: incident_place_district,
                [`${pageNum}_accident_date_reported_d`]: accident_date_reported_d,
                [`${pageNum}_accident_date_reported_m`]: accident_date_reported_m,
                [`${pageNum}_accident_date_reported_y`]: accident_date_reported_y,
                [`${pageNum}_accident_time_reported`]: accident_time_reported,
                [`${pageNum}_task_employee_performing_during_accident`]: task_employee_performing_during_accident,
                [`${pageNum}_period_experience_task_performed_years`]: isNumber(period_experience_task_performed_years) && `${period_experience_task_performed_years}`,
                [`${pageNum}_period_experience_task_performed_months`]: isNumber(period_experience_task_performed_months) && `${period_experience_task_performed_months}`,                
                [`${pageNum}_accident_desc_1`]: accident_desc,
                [`${pageNum}_accident_desc_2`]: accident_desc,
                [`${pageNum}_nature_of_injury_list`]: nature_of_injury_list && nature_of_injury_list.filter(v => !!v).join(', '),
                [`${pageNum}_employee_injured_explanation_satisfactory_nope_desc`]: employee_injured_explanation_satisfactory_nope_desc
            };
            // </editor-fold>
        };
        
        const onCreatePage3 = () => {
            let date_ceased_work_d, date_ceased_work_m, date_ceased_work_y;
            if (date_ceased_work) {
                const __date_ceased_work = Dates.parse(date_ceased_work);
                if (__date_ceased_work) {
                    date_ceased_work_d = `${__date_ceased_work.getDate()}`;
                    date_ceased_work_m = `${__date_ceased_work.getMonth()}`;
                    date_ceased_work_y = `${__date_ceased_work.getFullYear()}`;
                }
            }
            
            let date_resumed_work_d, date_resumed_work_m, date_resumed_work_y;
            if (date_resumed_work) {
                const __date_resumed_work = Dates.parse(date_resumed_work);
                if (__date_resumed_work) {
                    date_resumed_work_d = `${__date_resumed_work.getDate()}`;
                    date_resumed_work_m = `${__date_resumed_work.getMonth()}`;
                    date_resumed_work_y = `${__date_resumed_work.getFullYear()}`;
                }
            }

            //onCreateTextFieldPage3
            // <editor-fold defaultstate="collapsed" desc="return">
            return {
                page_3_header_company_name: company_name,
                page_3_header_incident_date: Dates.formatDate(accident_date),
                page_3_header_employee_name: createEmployeeName(employee),
                page_3_header_employee_id_num: id_num,
                
                //4. Further Particulars Of Employee
                total_amount_already_paid: isNumber(total_amount_already_paid) && `${total_amount_already_paid}`,
                num_of_week_days_worked_by_employee: isNumber(num_of_week_days_worked_by_employee) && `${num_of_week_days_worked_by_employee}`,
                date_ceased_work_d: date_ceased_work_d,
                date_ceased_work_m: date_ceased_work_m,
                date_ceased_work_y: date_ceased_work_y,
                time_ceased_work,
                date_resumed_work_d: date_resumed_work_d,
                date_resumed_work_m: date_resumed_work_m,
                date_resumed_work_y: date_resumed_work_y,
                time_resumed_work,
                dependant_name_and_address_1: dependant_name,
                dependant_name_and_address_2: dependant_address,
            
                //5. Further Particulars
                previously_received_compensation_full_names,
                medical_practitioner_or_chiropractor_who_treated_employee,
                hospital_which_treated_employee,
                accident_witness,
                accident_aware_person,
                num_of_employees_involved_in_accident: isNumber(num_of_employees_involved_in_accident) && `${num_of_employees_involved_in_accident}`,
                accident_police_station_and_docket_num_1: accident_police_station,
                accident_police_station_and_docket_num_2: accident_docket_num,
                involved_vehicle_reg_numbers: involved_vehicle_reg_numbers && involved_vehicle_reg_numbers.filter(v => !!v).join(', ')
            };
            // </editor-fold>
        };
        
        const onCreatePage4 = () => {
            //onCreateTextFieldPage4
            
            const get_additional_details_or_comments = (v) => {
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_1', 300, 375.2, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_2', 300, 391, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_3', 300, 405.8, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_4', 300, 421.6, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_5', 300, 437.3, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_6', 300, 453.1, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_7', 300, 468.7, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_8', 300, 484.3, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_9', 300, 499.9, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_10', 300, 515.5, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_11', 300, 531.1, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_12', 300, 546.7, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_13', 300, 561.9, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_14', 300, 578, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_15', 300, 594, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_16', 300, 609.0, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_17', 300, 624.7, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_18', 300, 640.0, 499),
//                async (page, form) => createTextField(page, form, 'additional_details_or_comments_19', 300, 655.8, 499),
                const res = {};
                
                return res;
            };
            
            // <editor-fold defaultstate="collapsed" desc="return">
            return {
                page_4_header_company_name: company_name,
                page_4_header_incident_date: Dates.formatDate(accident_date),
                page_4_header_employee_name: createEmployeeName(employee),
                page_4_header_employee_id_num: id_num,
                
                //5. Further Particulars: continued                
                other_machinery_list: other_machinery_list && other_machinery_list.filter(v => !!v).join(', '),
                other_contributing_factor_list: other_contributing_factor_list && other_contributing_factor_list.filter(v => !!v).join(', '),
                ...get_additional_details_or_comments(additional_details_or_comments)
            };
            // </editor-fold>
        };
        
        return {
            ...onCreatePage1(),
            ...onCreatePage2(),
            ...onCreatePage3(),
            ...onCreatePage4(),
            ...onCreatePage2(5)       
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {data, onCreateTextField} = this;
        return <ClaimDocument 
            ref="claimDocument"
            fileName='W.Cl.2.pdf' 
            data={data}
            onCreateTextField={onCreateTextField}
            />;
    }
    // </editor-fold>
}

export default PDFWCl2Form;