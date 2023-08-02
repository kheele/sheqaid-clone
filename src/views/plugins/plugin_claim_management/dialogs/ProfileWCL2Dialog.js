// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {PDFUploadButton, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import {EarningsTable} from './ClaimForms';

import style from "./ProfileWCL2Dialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileWCL2Dialog extends AProfileDialog {
    pageKey = "ProfileWCL2Dialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "W.CI.2";
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    client, project, site, 
                    employee, 
                    claim_number, 
                    provincial_office,
                    accident_date,
                    wcl_2, wcl_4, wcl_5_list, wcl_6, 
                    annexture_1
                }
            }
        } = this;
        
        const {
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
//            employee,
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
    //            incident_source,
    //            incident,
//            accident_date,
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
            nature_of_injury_list,
            nature_of_injury_options,
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

            //6. Employer's Declaration
            employer_signature,
            employer_signature_name,
            employer_signature_date
        } = wcl_2 || {};
        
        const {isContractor, isConsultant} = storage.is;
        return <FormControls>
                <Row 
                    rendered  
                    active
                    idx={1}
                    title="1. Employer Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="company_name" title="Compensation Commissioner Registered Name" value={company_name} className="col-lg-12"/>
                    <ProfileField name="company_reg_num" title="Compensation Commissioner Registration Number" value={company_reg_num} className="col-lg-12"/>
                    <ProfileField name="company_contact_person" title="Contact Person" value={company_contact_person} renderer={v => `${v.fname || v.data.fname} ${v.lname || v.data.lname}`} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ProfileField name="company_str_addr_code" title="Postal Code" footerDesc="For Street Address" value={company_str_addr_code} className="col-lg-4"/>
                    <ProfileField name="company_str_addr" title="Street Address" value={company_str_addr} className="col-lg-8"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address & Postal Code</label>
                    <ProfileField name="company_postal_addr_code" title="Postal Code" footerDesc="For Postal Address" value={company_postal_addr_code} className="col-lg-4"/>
                    <ProfileField name="company_postal_addr" title="Postal Address" value={company_postal_addr} className="col-lg-8"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="company_tel_code" title="Tel Code" value={company_tel_code} className="col-lg-4"/>
                    <ProfileField name="company_tel_num" title="Tel Number" value={company_tel_num} className="col-lg-8"/>
                    <ProfileField name="company_fax_code" title="Fax Code" value={company_fax_code} className="col-lg-4"/>
                    <ProfileField name="company_fax_num" title="Fax Number" value={company_fax_num} className="col-lg-8"/>
                    <ProfileField name="company_email" type="email" title="Email Address" value={company_email} className="col-lg-12"/>
                    <ProfileField name="company_location" title="Situation of Business/Farm" value={company_location} className="col-lg-12"/>
                    <ProfileField name="company_nature" title="Nature of Business, Trade or Industry" value={company_nature} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Employee Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="company_employee_association" title="Is The Injured Person A" value={company_employee_association} className="col-lg-12"/>
                    <ProfileField name="employee" title="Employee" value={employee} renderer={v => `${v.fname || v.data.fname} ${v.lname || v.data.lname}`} className="col-lg-12"/>
                    
                    <hr />
                    
                    <PDFUploadButton name="doc_certified_id" buttonTitle="Certified ID Copy" defaultValue={doc_certified_id} showOnlyIcon readonly className="ProfileField w-280 margin-t-10"/>
                
                    <hr />
                    
                    <ProfileField name="id_num" title="ID No." value={id_num} className="col-lg-4 col-xs-12"/>
                    <ProfileField name="dob" type="date" title="Date Of Birth" value={dob} className="col-lg-4 col-xs-12"/>
                    <ProfileField name="gender" title="Sex" value={gender} className="col-lg-4 col-xs-12"/>
                    <ProfileField name="marital_status" title="Marital Status" value={marital_status} className="col-lg-4 col-xs-12"/>
                    <ProfileField name="citizen_of" title="Citizen Of" value={citizen_of} className="col-lg-8 col-xs-12"/>
                    <ProfileField name="personnel_num" title="Personnel No." value={personnel_num} className="col-lg-4 col-xs-12"/>
                    <ProfileField name="occupation" title="Occupation" value={occupation} renderer={v => `${v.name || v.data.name}`} className="col-lg-8 col-xs-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ProfileField name="employee_str_addr_code" title="Postal Code" footerDesc="For Street Address" value={employee_str_addr_code} className="col-lg-4"/>
                    <ProfileField name="employee_str_addr" title="Street Address" value={employee_str_addr} className="col-lg-8"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address & Postal Code</label>
                    <ProfileField name="employee_postal_addr_code" title="Postal Code" footerDesc="For Postal Address" value={employee_postal_addr_code} className="col-lg-4"/>
                    <ProfileField name="employee_postal_addr" title="Postal Address" value={employee_postal_addr} className="col-lg-8"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="employee_tel_code" title="Tel Code" value={employee_tel_code} className="col-lg-4"/>
                    <ProfileField name="employee_tel_num" title="Tel Number" value={employee_tel_num} className="col-lg-8"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Period in your employ (years/months)</label>
                    <ProfileField name="period_employ_years" title="Years" value={period_employ_years} className="col-lg-6"/>
                    <ProfileField name="period_employ_months" title="Months" value={period_employ_months} className="col-lg-6"/>
                    
                    <hr className="margin-v-5"/>
                    <ProfileField name="expected_disablement_period" title="Expected Period Of Disablement (Days)" value={expected_disablement_period} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Accident Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Accident Date & Time</label>
                    <ProfileField name="accident_date" type="date" title="Accident Date" value={accident_date} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="accident_time" type="time" title="Accident Time" value={accident_time} className="col-lg-6 col-xs-12"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="incident_place" title="Incident Place" value={incident_place} className="col-lg-12"/>
                    <ProfileField name="incident_place_province" title="Incident Province" value={incident_place_province} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="incident_place_district" title="Incident District" value={incident_place_district} className="col-lg-6 col-xs-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Accident Date & Time Reported</label>
                    <ProfileField name="accident_date_reported" type="date" title="Accident Date Reported" value={accident_date_reported} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="accident_time_reported" type="time" title="Accident Time Reported" value={accident_time_reported} className="col-lg-6 col-xs-12"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="task_employee_performing_during_accident" title="Task Employee Performing During The Accident" value={task_employee_performing_during_accident} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Period of experience in the task performed (years/months)
                    </label>
                    <ProfileField name="period_experience_task_performed_years" title="Years" value={period_experience_task_performed_years} className="col-lg-6 col-xs-6"/>
                    <ProfileField name="period_experience_task_performed_months" title="Months" value={period_experience_task_performed_months} className="col-lg-6 col-xs-6"/>
                    
                    <ProfileField name="employee_action_connected_business" title="Was the employee's action at the time of the accident in connection with your trade or business?" footerDesc='(If "no" state reasons on section 5 Part A)' value={employee_action_connected_business} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Short description of how the accident occurred. ( mark the applicable items on the reverse side of Part A Page 3 and use same for a full description)
                    </label>
                    <ProfileField name="accident_desc" title="Short Description Of How The Accident Occurred" footerDesc='(Refer the machine/process involved, whether the injured person fell or was struck and all the factors contributing to the accident).' value={accident_desc} className="col-lg-12"/>
                    <ProfileField name="traffic_accident_on_public_road" title="Traffic Accident On Public Road?" value={traffic_accident_on_public_road} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Nature Of Injury Sustained
                    </label>
                    <ProfileField name="nature_of_injury_list" title="Nature Of Injury Sustained" footerDesc="E.g. Index Finger, Right Hand Crushed" value={nature_of_injury_list} renderer={v => v.join(',')} className="col-lg-12"/>
                    <ProfileField name="nature_of_injury_options" title="Nature Of Injury Sustained" value={nature_of_injury_options} renderer={v => v.join(',')} className="col-lg-12"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="employee_injured_explanation_satisfactory" title="Are you satisfied that the employee was injured in the manner alleged by him/her?" footerDesc='(If "no" state reasons on section 5 Part A)' value={employee_injured_explanation_satisfactory} className="col-lg-12"/>
                    <ProfileField name="employee_injured_explanation_satisfactory_nope_desc" title="If not, give reasons" footerDesc='If the answer is "No" from the previous answer, give reasons' value={employee_injured_explanation_satisfactory_nope_desc} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="4. Further Particulars Of Employee" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Earnings Of Employee At The Time Of Accident
                    </label>
                    <PDFUploadButton name="doc_salary_slip" buttonTitle="Salary Slip" defaultValue={doc_salary_slip} showOnlyIcon readonly className="ProfileField col-lg-12 col-xs-12 margin-t-10"/>
                    
                    <hr className="margin-v-5"/>
                    
                    <EarningsTable ref="earning_list" name="earning_list" defaultValue={earning_list || []} readonly />
                    
                    <p className="col-lg-12 pull-left margin-0 margin-t-10 margin-b-0 padding-5 bg-f5f5f5 color_red">
                        In terms of section 47 of the Act an employer is obliged to pay an employee full compensation for the first three months of absence.
                    </p>
                    
                    <ProfileField name="prepared_further_payments_after_3_months_4rm_accident_date" title="Are You Prepared To Make Further Compensation Payments After The First Three Months From The Date Of The Accident?" value={prepared_further_payments_after_3_months_4rm_accident_date} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        If You Have Already Paid Cash(Earnings) To The Employee, State The Total Amount (R)
                    </label>
                    <ProfileField name="total_amount_already_paid" title="Total Amount (R)" value={total_amount_already_paid} className="col-lg-12"/>
                    
                    <ProfileField name="period_payments_made_range" type="date" title="For what period were such payments made?" value={period_payments_made_range} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        No. Of Days Per Week Worked By The Employee
                    </label>
                    <ProfileField name="num_of_week_days_worked_by_employee" title="No. Of Days Per Week" value={num_of_week_days_worked_by_employee} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Date & Time Employee Ceased Work Due To Accident
                    </label>
                    <ProfileField name="date_ceased_work" type="date" title="Date Ceased Work" value={date_ceased_work} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="time_ceased_work" type="time" title="Time Ceased Work" value={time_ceased_work} className="col-lg-6 col-xs-12"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="did_employee_complete_shift_on_date_work_ceased" title="Did The Employee Complete His Shift On The Day He Ceased Work?" value={did_employee_complete_shift_on_date_work_ceased} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Date & Time Employee Resumed Work
                    </label>
                    <ProfileField name="date_resumed_work" type="date" title="Date Resumed Work" value={date_resumed_work} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="time_resumed_work" type="time" title="Time Resumed Work" value={time_resumed_work} className="col-lg-6 col-xs-12"/>
                    
                    <p className="col-lg-12 pull-left margin-0 margin-t-10 margin-b-10 padding-5 bg-f5f5f5 color_red">
                        (If the employee will be off duty for an extended period, an enterim Resumption Report (W.Cl.6) must be submitted monthly).
                    </p>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        If The Employee Was Killed In The Accident, State Name And Address Of Dependant Of The Employee
                    </label>
                    <ProfileField name="dependant_name" title="Name Of Dependant" value={dependant_name} className="col-lg-12"/>
                    <ProfileField name="dependant_address" title="Address Of Dependant" value={dependant_address} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="5. Further Particulars" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack}  
                    onFormNext={onFormNext}
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Should the employee have any physical defect, have suffered from any serious disease prior to the accident or has previously received compensation for permanent disablement, give full particulars.</label>
                    <ProfileField name="previously_received_compensation_full_names" title="Full Particulars" value={previously_received_compensation_full_names} className="col-lg-12"/>
                    <ProfileField name="was_1st_aid_given" title="Was first aid given in this case?" value={was_1st_aid_given} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">State the name of the medical practitioner/chiropractor who treated the employee</label>
                    <ProfileField name="medical_practitioner_or_chiropractor_who_treated_employee" title="Medical Practitioner/Chiropractor Name" value={medical_practitioner_or_chiropractor_who_treated_employee} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If the employee received treatment at a hospital, state name of hospital</label>
                    <ProfileField name="hospital_which_treated_employee" title="Hospital Name" value={hospital_which_treated_employee} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Was accidnt caused by employee's:</label>
                    <ProfileField name="was_accidnt_caused_by_employee_options_1" title="a) Deliberate non-compliance with directions?" value={was_accidnt_caused_by_employee_options_1} className="col-lg-12"/>
                    <ProfileField name="was_accidnt_caused_by_employee_options_2" title="b) Reckless discharge of the terms of any law or statutory regulation designed to ensure the safety of or health of employees or the prevention of accidents?" value={was_accidnt_caused_by_employee_options_2} className="col-lg-12"/>
                    <ProfileField name="was_accidnt_caused_by_employee_options_3" title="c) Action while under the influence of liquor or drugs?" value={was_accidnt_caused_by_employee_options_3} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Name and address of anybody:</label>
                    <ProfileField name="accident_witness" title="a) Who witnessed the accident" value={accident_witness} className="col-lg-12"/>
                    <ProfileField name="accident_aware_person" title="b) Who was aware of the accident at the time" value={accident_aware_person} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">No. Of Employees Involved In The Same Accident</label>
                    <ProfileField name="num_of_employees_involved_in_accident" title="No. Of Employees" value={num_of_employees_involved_in_accident} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If the accident was investigated by the SA Police, state name of Police Station and docket number applicable</label>
                    <ProfileField name="accident_police_station" title="Police Station" value={accident_police_station} className="col-lg-12"/>
                    <ProfileField name="accident_docket_num" title="Docket Number" value={accident_docket_num} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If vehicles were involved, furnish registration number(s)</label>
                    <ProfileField name="involved_vehicle_reg_numbers" title="Registration number(s)" value={involved_vehicle_reg_numbers} renderer={v => v.join(',')} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Contributing Factors/Causes Applicable</label>
                    <ProfileField name="contributing_factor_list_A" title="Part A" value={contributing_factor_list_A} renderer={v => v.join(',')} className="col-lg-12"/>
                    <ProfileField name="contributing_factor_list_B" title="Part B" value={contributing_factor_list_B} renderer={v => v.join(',')} className="col-lg-12"/>
                    
                    <hr className="margin-v-5"/>
                    <ProfileField name="other_machinery_list" title="Other Machinery (Specify)" value={other_machinery_list} renderer={v => v.join(',')} className="col-lg-12"/>
                    <ProfileField name="other_contributing_factor_list" title="Any Other Contributing Factors (Specify)" footerDesc="Not Mentioned Above" value={other_contributing_factor_list} renderer={v => v.join(',')} className="col-lg-12"/>
                
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">The rest of this page may be used for any additional details or comments regarding the accident</label>
                    <ProfileField name="additional_details_or_comments" title="Additional Details / Comments" value={additional_details_or_comments} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={6}
                    title="6. Employer's Declaration" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        I hereby declare that the particulars furnished in the foregoing report are true and correct.
                    </label>
                    
                    <ProfileField name="employer_signature" type="signature" title="Employer's Signature" value={employer_signature} className="col-lg-12"/>
                    <ProfileField name="employer_signature_name" title="Name of Person Signing" value={employer_signature_name} className="col-lg-12"/>
                    <ProfileField name="employer_signature_date" type="date" title="Signature Date" value={employer_signature_date} className="col-lg-12"/>
                </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default ProfileWCL2Dialog;
