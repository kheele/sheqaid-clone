// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import {OperationOrProcedureOrTestCarriedOutAndDatesTable} from './ClaimForms';

import style from "./ProfileWCL5Dialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileWCL5Dialog extends AProfileDialog {
    pageKey = "ProfileWCL5Dialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "W.CI.5";
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
                    wcl_2, wcl_4, wcl_5, wcl_6, 
                    annexture_1
                }
            }
        } = this;
        
        const {
            //1. General Details
//            claim_number, 
//            accident_date,

            //2. Employer Details
            company_name,
            company_str_addr,
            company_str_addr_code,

            //3. Employee Details
    //            employee,
            id_num,
            employee_str_addr,
            employee_str_addr_code,

            //4. Medical Practitioner/Chiropractor Consultation Details
            operation_procedure_test_carried_out_and_dates,
            prognosis_and_further_treatment,
            employee_been_fit_normal_work_date,
            employee_likely_to_be_fit_normal_work_date,
            employee_condition_became_stabilised_yes_or_no,
            present_permanent_anatomical_defect_or_impairment,

            //5. Medical Practitioner/Chiropractor Declaration
            practioner_signature,
            practioner_signature_name,
            practioner_signature_date,
            practioner_addr,
            practioner_practice_num
        } = wcl_5 || {};
        
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
                    <ProfileField name="employee" title="Employee" value={employee} renderer={v => `${v.fname || v.data.fname} ${v.lname || v.data.lname}`} className="col-lg-12"/>
                    <ProfileField name="id_num" title="Identity Number" value={id_num} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ProfileField name="employee_str_addr" title="Street Address" value={employee_str_addr} className="col-lg-8"/>
                    <ProfileField name="employee_str_addr_code" title="Postal Code" footerDesc="For Street Address" value={employee_str_addr_code} className="col-lg-4"/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="4. Medical Practitioner/Chiropractor Consultation Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Describe any operation(s)/procedure(s)/test(s) carried out and date(s)</label>
                    <OperationOrProcedureOrTestCarriedOutAndDatesTable name="operation_procedure_test_carried_out_and_dates" defaultValue={operation_procedure_test_carried_out_and_dates || []} readonly className="col-lg-12"/>
                    
                    <ProfileField name="prognosis_and_further_treatment" title="Prognosis and further treatment" value={prognosis_and_further_treatment} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">From what date has the employee been fit for his/her normal work?</label>
                    <ProfileField name="employee_been_fit_normal_work_date" type="date" title="Date" value={employee_been_fit_normal_work_date} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">On what date is he/she likely to be fit for his/her normal work?</label>
                    <ProfileField name="employee_likely_to_be_fit_normal_work_date" type="date" title="Date" value={employee_likely_to_be_fit_normal_work_date} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Employee's condition stabilization</label>
                    <ProfileField name="employee_condition_became_stabilised_yes_or_no" type="radio" title="Has the employee's condition become stabilised?" value={employee_condition_became_stabilised_yes_or_no} className="col-lg-12"/>
                    <ProfileField name="present_permanent_anatomical_defect_or_impairment" title="If so, describe in detail any present permanent anatomical defect and/or impairment of function as a result of the accident" footerDesc="(Loss of movement, if any, must be indicated in degrees at each specific joint)." value={present_permanent_anatomical_defect_or_impairment} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="5. Medical Practitioner/Chiropractor Declaration" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        I certify that I have by examination, satisfied myself that the injury(ies) of the employee is the result of the accident.
                    </label>
                    
                    <ProfileField name="practioner_signature" type="signature" title="Medical Practitioner/Chiropractor Signature" value={practioner_signature} className="col-lg-12"/>
                    <ProfileField name="practioner_signature_name" title="Name of Person Signing" value={practioner_signature_name} className="col-lg-12"/>
                    <ProfileField name="practioner_signature_date" type="date" title="Signature Date" value={practioner_signature_date} className="col-lg-12"/>
                
                    <hr className="margin-v-5"/>
                    
                    <ProfileField name="practioner_addr" title="Address" value={practioner_addr} className="col-lg-12"/>
                    <ProfileField name="practioner_practice_num" title="Practice Number" value={practioner_practice_num} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    activeAlways
                    title="Contacts" 
                >
                    <p className="notice col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">N.B.: Progress reports must be submitted on a monthly basis to the employer until the employee's condition has become stabilised when a final medical report should be submitted</p>
                    
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Call Centre No.: 086 010 5350</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Fax No.: (012) 323-8627 / (012) 323-6986</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">E-Mail: cf-info@labour.gov.za</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 -margin-b-5 font-size-13">Website: www.labour.gov.za</p>
                </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default ProfileWCL5Dialog;
