// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {PDFUploadButton, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfileWCL4Dialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileWCL4Dialog extends AProfileDialog {
    pageKey = "ProfileWCL4Dialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "W.CI.4";
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
        } = wcl_4 || {};
        
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
                    <ProfileField name="first_consultation_date" type="date" title="First Consultation Date" value={first_consultation_date} className="col-lg-12"/>
                    <ProfileField name="how_accident_happen" title="How did the alleged accident happen?" value={how_accident_happen} className="col-lg-12"/>
                    <ProfileField name="injury_clinical_desc" title="Full clinical description of injury(ies)" footerDesc="(not symptoms, signs or syndromes)" value={injury_clinical_desc} className="col-lg-12"/>
                    <ProfileField name="pre_existing_defect_disease" title="Describe briefly any pre-existing defect disease" value={pre_existing_defect_disease} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">X-Rays Details</label>
                    <ProfileField name="x_rays_date" type="date" title="X-Rays Date" value={x_rays_date} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="x_rays_conducting_person" title="Person Who Conducted X-Rays" value={x_rays_conducting_person} className="col-lg-6 col-xs-12"/>
                    <PDFUploadButton name="x_rays_report" buttonTitle="X-Rays Report" defaultValue={x_rays_report} readonly showOnlyIcon className="ProfileField col-lg-12 col-xs-12 margin-t-10"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Surgical Procedures Details</label>
                    <ProfileField name="surgical_procedure_date" type="date" title="Surgical Procedures Date" value={surgical_procedure_date} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="surgical_procedure_conducting_person" title="Person Who Conducted Surgical Procedures" value={surgical_procedure_conducting_person} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="surgical_procedure_desc" title="Surgical Procedures Brief Description" value={surgical_procedure_desc} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Anaesthetics Details</label>
                    <ProfileField name="anaesthetics_general_or_local" type="radio" title="General / Local?" value={anaesthetics_general_or_local} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="anaesthetics_dur" title="Anaesthetics Duration" value={anaesthetics_dur} className="col-lg-6 col-xs-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Consultation Details</label>
                    <ProfileField name="consultation_yes_or_no" type="radio" title="Consultation Conducted?" value={consultation_yes_or_no} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="consultation_date" type="date" title="Consultation Date" value={consultation_date} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="consultation_conducting_person" title="Person Who Conducted Consultation" value={consultation_conducting_person} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Physiotherapy Details</label>
                    <ProfileField name="physiotherapy_employee_referred_yes_or_no" type="radio" title="Employee referred for physiotherapy?" value={physiotherapy_employee_referred_yes_or_no} className="col-lg-12"/>
                    <ProfileField name="physiotherapy_conducting_person" title="Physiotherapist Names" value={physiotherapy_conducting_person} className="col-lg-12"/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Employee Fitness Details</label>
                    <ProfileField name="employee_fitness_yes_or_no" type="radio" title="Employee unfit for work?" value={employee_fitness_yes_or_no} className="col-lg-12"/>
                    <ProfileField name="employee_fitness_light_duty_date" type="date" title="Possible date for Light duty" value={employee_fitness_light_duty_date} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="employee_fitness_normal_duty_date" type="date" title="Possible date for Normal duty" value={employee_fitness_normal_duty_date} className="col-lg-6 col-xs-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="5. Medical Practitioner/Chiropractor Declaration" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        I certify that I have by examination, satisfied myself that the injury(ies) of the employee is the result of the accident as described above.
                    </label>
                    
                    <ProfileField name="practioner_signature" type="signature" title="Medical Practioner/Chiropractor Signature" value={practioner_signature} className="col-lg-12"/>
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
                    <p className="notice col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">N.B.: This report must be handed to the injured employee or sent to the employer within 14 days from date of first consultation</p>
                    
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Call Centre No.: 086 010 5350</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Fax No.: (012) 323-8627 / (012) 323-6986</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">E-Mail: cf-info@labour.gov.za</p>
                    <p className="contact col-lg-12 padding-5 bg-f5f5f5 -margin-b-5 font-size-13">Website: www.labour.gov.za</p>
                </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default ProfileWCL4Dialog;
