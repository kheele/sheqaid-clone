// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import {OffAndLightDutyPeriodTable} from './ClaimForms';

import style from "./ProfileWCL6Dialog.lazy.css";
import findByIdWCL6 from "mutations/all/COIDA/WCL6/findByIdWCL6";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileWCL6Dialog extends AProfileDialog {
    pageKey = "ProfileWCL6Dialog";
    findById = findByIdWCL6;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "W.CI.6";
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

    @computed get item() {
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
                    // employee,

                    //1. General Details
                    claim_number,
                    accident_date,

                    //2. Employer Details
                    company_name,
                    company_str_addr,
                    company_str_addr_code,

                    //3. Employee Details
//            employee,
                    id_num,
                    employee_str_addr,
                    employee_str_addr_code,

                    //4. Accident Details
                    periods_employee_off_duty,
                    periods_employee_light_duty,
                    employee_light_duty_available_and_offered,
                    employee_perform_recommended_light_duty,
                    employee_perform_recommended_light_duty_not_performed_reason,
                    employee_perform_recommended_light_duty_performed_percentage,
                    employee_still_in_your_employment,
                    employee_left_my_service_date,
                    employee_present_address,
                    employee_receive_free_food_range,
                    employee_receive_free_quarters_range,
                    period_detained_in_hospital_range,

                    //5. Employer's Declaration
                    employer_signature,
                    employer_signature_name,
                    employer_signature_date
                }
            }
        } = this;

        const employee = this.props.dialog.extraProp('employee');

        const {isContractor, isConsultant} = storage.is;
        return <FormControls>
                <Row 
                    rendered  
                    active
                    idx={1}
                    title="1. General Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="claim_number" title="Claim Number" value={claim_number} className="col-lg-12"/>
                    <ProfileField name="accident_date" type="date" title="Date of Accident" value={accident_date} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered  
                    idx={2}
                    title="2. Employer Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="company_name" title="Name of employer" value={company_name} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ProfileField name="company_str_addr" title="Street Address" value={company_str_addr} className="col-lg-8"/>
                    <ProfileField name="company_str_addr_code" title="Postal Code" footerDesc="For Street Address" value={company_str_addr_code} className="col-lg-4"/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Employee Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="employee" title="Employee" value={employee} renderer={v => v.full_name} className="col-lg-12"/>
                    <ProfileField name="id_num" title="Identity Number" value={id_num} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ProfileField name="employee_str_addr" title="Street Address" value={employee_str_addr} className="col-lg-8"/>
                    <ProfileField name="employee_str_addr_code" title="Postal Code" footerDesc="For Street Address" value={employee_str_addr_code} className="col-lg-4"/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="4. Accident Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <label className="col-lg-12 margin-0 margin-t-0 padding-5 bg-f5f5f5 font-size-13">
                        State the period(s) the employee was off duty or performing light duty
                    </label>
                    <OffAndLightDutyPeriodTable name="periods_employee_off_duty" desc="PERIOD(S) OFF DUTY" defaultValue={periods_employee_off_duty || []} readonly className="col-lg-12"/>
                    <OffAndLightDutyPeriodTable name="periods_employee_light_duty" desc="PERIOD(S) PERFORMING LIGHT DUTY" defaultValue={periods_employee_light_duty || []} readonly className="col-lg-12"/>
                    
                    <hr className="margin-v-5"/>
                    <ProfileField name="employee_light_duty_available_and_offered" type="radio" title="Was light duty available and offered to the employee?" value={employee_light_duty_available_and_offered} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-0 padding-5 bg-f5f5f5 font-size-13">
                        Did the employee perform recommended light duty? If not, give reason.
                    </label>
                    <ProfileField name="employee_perform_recommended_light_duty" type="radio" title="Did the employee perform recommended light duty?" value={employee_perform_recommended_light_duty} className="col-lg-12"/>
                    <ProfileField name="employee_perform_recommended_light_duty_not_performed_reason" title="If recommended light duty not performed, give reason" value={employee_perform_recommended_light_duty_not_performed_reason} className="col-lg-12"/>
                    <ProfileField name="employee_perform_recommended_light_duty_performed_percentage" title="If yes, what percentage of normal was the light duty performed worth to the company e.g. 20%, 40%, etc. or indicate the rate of earnings paid whilst performing light duty." value={employee_perform_recommended_light_duty_performed_percentage} className="col-lg-12"/>
                    <hr />
                    <ProfileField name="employee_still_in_your_employment" type="radio" title="Is the employee still in your employment?" value={employee_still_in_your_employment} className="col-lg-12"/>
                    
                    <hr className="margin-v-5"/>
                    <ProfileField name="employee_left_my_service_date" type="date" title="Date employee left my service" value={employee_left_my_service_date} className="col-lg-12"/>
                    <ProfileField name="employee_present_address" title="Employee's present address" value={employee_present_address} className="col-lg-12"/>
                
                    <label className="col-lg-12 margin-0 margin-t-0 padding-5 bg-f5f5f5 font-size-13">
                        Did the employee receive free food and/or quarters from you during the period(s) mentioned in paragraph 1 above? If so, state the period(s) hereunder at paragraphs (a) and/or (b).
                    </label>
                    <ProfileField name="employee_receive_free_food_range" type="date" title="Food" value={employee_receive_free_food_range} className="col-lg-6"/>
                    <ProfileField name="employee_receive_free_quarters_range" type="date" title="Quarters" value={employee_receive_free_quarters_range} className="col-lg-6"/>
                    
                    <hr className="margin-v-5"/>
                    
                    <ProfileField name="period_detained_in_hospital_range" type="date" title="Period detained in hospital" value={period_detained_in_hospital_range} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="5. Employer's Declaration" 
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
                <Row 
                    rendered 
                    activeAlways
                    title="Contacts" 
                >
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Call Centre No.: 086 010 5350</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Fax No.: (012) 323-8627 / (012) 323-6986</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">E-Mail: cf-info@labour.gov.za</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 -margin-b-5 font-size-13">Website: www.labour.gov.za</p>
                </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default ProfileWCL6Dialog;
