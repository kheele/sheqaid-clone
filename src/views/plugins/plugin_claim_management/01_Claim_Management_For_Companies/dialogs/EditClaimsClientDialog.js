// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen, ShouldUpdate} from '../../../../../utils/Utils';

import {
    ChatButton,
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import NewWCL2Dialog from './NewWCL2Dialog.js';
import NewWCL4Dialog from './NewWCL4Dialog.js';
import NewWCL5Dialog from './NewWCL5Dialog.js';
import NewWCL6Dialog from './NewWCL6Dialog.js';
import NewAnnexture1Dialog from './NewAnnexture1Dialog.js';

import PrintWCL2Dialog from '../../dialogs/PrintWCL2Dialog.js';
import PrintWCL4Dialog from '../../dialogs/PrintWCL4Dialog.js';
import PrintWCL5Dialog from '../../dialogs/PrintWCL5Dialog.js';
import PrintWCL6Dialog from '../../dialogs/PrintWCL6Dialog.js';
import PrintAnnexture1Dialog from '../../dialogs/PrintAnnexture1Dialog.js';

import ButtonWCl from '../../dialogs/ButtonWCl';

import NewClaimsEmployerDetailsDialog from './NewClaimsEmployerDetailsDialog';

import WCl5Table from "../../dialogs/WCl5Table";

import style from "./EditClaimsClientDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditClaimsClientDialog extends AEditDialog {
    pageKey = "EditClaimsClientDialog";

    constructor(props) {
        super(props, style);
    }
    
    title() {
        return "Edit Claim";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/COIDA_Management/claims/client/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
        },
        wcl_2: null,
        wcl_4: null,
        wcl_5_list: [],
        wcl_6: null,
        annexture_1: null,
        employer_details: null,
        doctor_email_change_1: false,
        doctor_email_change_2: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.onClickChat = this.onClickChat.bind(this);
        
        this.onNewDialog = this.onNewDialog.bind(this);
        this.onPrintDialog = this.onPrintDialog.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("doctor_email_1", this.onChangeDoctorEmail1.bind(this));
        this.form.addChangeOne("doctor_email_2", this.onChangeDoctorEmail2.bind(this));
        this.form.addChangeOne("client", this.onChangeClient.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {execWhen} = this.props;
        execWhen(() => this.item).then(item => {
            const {wcl_2 = null, wcl_4 = null, wcl_5_list = [], wcl_6 = null, annexture_1 = null} = item.data;
            this.state.wcl_2 = wcl_2; 
            this.state.wcl_4 = wcl_4; 
            this.state.wcl_5_list = wcl_5_list; 
            this.state.wcl_6 = wcl_6;  
            this.state.annexture_1 = annexture_1;
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeDoctorEmail1(el, val) {
        const {doctor_email_change_2} = this.state;
        if(doctor_email_change_2) {
            this.state.doctor_email_change_2 = false;
            return;
        }
        execWhen(() => this.refs.doctor_email_2).then(ref => {
            this.state.doctor_email_change_2 = true;
            if(val) {
                ref.onChange(val);
            } else {
                ref.reset();
            }
        });
    }
    
    onChangeDoctorEmail2(el, val) {
        const {doctor_email_change_1} = this.state;
        if(doctor_email_change_1) {
            this.state.doctor_email_change_1 = false;
            return;
        }
        execWhen(() => this.refs.doctor_email_1).then(ref => {
            this.state.doctor_email_change_1 = true;
            if(val) {
                ref.onChange(val);
            } else {
                ref.reset();
            }
        });
    }
    
    onChangeClient(el, val) {
        if(val) {
            progressDialog.open();
            neonBinding.events.emit(`${this.path}employer-details/find_by_client_id`, val.id).then(res => {
                setTimeout(() => progressDialog.close(), 1000);
                if(!res) {
                    infoDialog.open('No Employer Details found');
                    this.refs.newClaimsEmployerDetailsDialog.open().then(res => {
                        this.state.employer_details = res;
                    });
                } else {
                    this.state.employer_details = res;
                }
            }).catch(err => {
                progressDialog.close();
                this.state.employer_details = null;
                console.error(err);
                infoDialog.open('An error occurred. Please try again');
            });
        } else {
            this.state.employer_details = null;
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="buttons funs">
    onNewDialog(evt, btn) {
        let {idx, name, dialogName, value, onComplete} = btn.props;
        const dialog = this.refs[dialogName];
        if(!dialog) return;
        
        const {
            form, form: {
                data: {
                    client = null, employee = null, claim_number = null, accident_date = null
                }
            }, 
            state, state: {employer_details}, refs
        } = this;
        
        if(!value) {
            value = state[name];
        }
        
        if(!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        
        if(!form.isValid('accident_date') && (
                name === 'annexture_1' || 
                name === 'wcl_2' || 
                name === 'wcl_4' || 
//                name === 'wcl_5' || 
                name === 'wcl_6')) {
            infoDialog.open('Date of Accident is required');
            return;
        }
        
        dialog && dialog.
                extraProp('employer_details', employer_details).
                extraProp('employee', employee).
                extraProp('claim_number', claim_number).
                extraProp('accident_date', accident_date).
                open(value).then(value => {
            if(onComplete) {
                onComplete(value, btn);
            } else {
                state[name] = value;
            }
        });
    }
    
    onPrintDialog(evt, btn) {
        let {name, title, dialogName, value} = btn.props;
        const dialog = this.refs[dialogName];
        if(!dialog) return;
        
        if(!value) {
            value = this.item.data[name];
        }
        
        if(!value) {
            infoDialog.open(`${title} is not available`);
            return;
        }
        dialog && dialog.open(this.item);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onClickChat">
    onClickChat(btn) {
        const {onChange} = this.props;
        chatBoxClaims.setActiveItem(this.item, btn, newMsg => {
            const {id, data: {message_list_provider}} = this.item;
            neonBinding.events.emit(this.path + "chat", id, message_list_provider).then(res => {
                console.log("claim chat res", res)
            });
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        const {isContractor, isConsultant} = storage.is;
        if(idx === 0) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('accident_date')) {
                infoDialog.open('Date of Accident is required');
                return;
            }
        }
        if(idx === 4) {
            if (form.isValid('doctor_email_1') && !form.get('doctor_email_1').isEmailAddress()) {
                infoDialog.open('Medical Practioner/Chiropractor Email Address is not valid email address');
                return;
            }
        }
        if(idx === 5) {
            if (form.isValid('doctor_email_2') && !form.get('doctor_email_2').isEmailAddress()) {
                infoDialog.open('Medical Practioner/Chiropractor Email Address is not valid email address');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
          
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('accident_date')) {
            infoDialog.open('Date of Accident is required');
            return;
        }
        if (form.isValid('doctor_email_1') && !form.get('doctor_email_1').isEmailAddress()) {
            infoDialog.open('Medical Practioner/Chiropractor Email Address is not valid email address');
            return;
        }
        
        const {
            client, project, site, 
            employee, 
            claim_number, 
            provincial_office,
            accident_date,
            doctor_email_1,
            wcl_4_external_doc,
            wcl_5_list
        } = form.data;
        const {
            wcl_2, wcl_4, wcl_6, 
            annexture_1
        } = this.state;
        const data = {};
        
        ShouldUpdate.checkClient(data, old_data, client, 'client');
        ShouldUpdate.checkProject(data, old_data, project, 'project');
        ShouldUpdate.checkSite(data, old_data, site, 'site');
        
        ShouldUpdate.check(data, old_data, employee.id, 'employee_id');
        ShouldUpdate.check(data, old_data, claim_number, 'claim_number');
        ShouldUpdate.check(data, old_data, provincial_office, 'provincial_office');
        ShouldUpdate.checkDate(data, old_data, accident_date, 'accident_date');
        
        ShouldUpdate.check(data, old_data, doctor_email_1, 'doctor_email');
        
        if(wcl_2) {
            const {
                totalFieldCount, totalFieldMax,
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
                employee,
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
                accident_date,
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
            } = wcl_2;
            
            const new_wcl_2 = {};
            
            //1. Employer Details
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_name, 'company_name');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_reg_num, 'company_reg_num');
            ShouldUpdate.checkEmployee(new_wcl_2, old_data.wcl_2, company_contact_person, 'company_contact_person');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_str_addr, 'company_str_addr');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_str_addr_code, 'company_str_addr_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_postal_addr, 'company_postal_addr');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_postal_addr_code, 'company_postal_addr_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_tel_code, 'company_tel_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_tel_num, 'company_tel_num');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_fax_code, 'company_fax_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_fax_num, 'company_fax_num');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_email, 'company_email');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_location, 'company_location');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_nature, 'company_nature');
            
            //2. Employee Details
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, company_employee_association, 'company_employee_association');
//            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee, 'employee');
            ShouldUpdate.checkFile(new_wcl_2, old_data.wcl_2, doc_certified_id, 'doc_certified_id');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, id_num, 'id_num');
            ShouldUpdate.checkDate(new_wcl_2, old_data.wcl_2, dob, 'dob');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, gender, 'gender');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, marital_status, 'marital_status');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, citizen_of, 'citizen_of');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, personnel_num, 'personnel_num');
            ShouldUpdate.checkJobPosition(new_wcl_2, old_data.wcl_2, occupation, 'occupation');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_str_addr, 'employee_str_addr');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_str_addr_code, 'employee_str_addr_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_postal_addr, 'employee_postal_addr');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_postal_addr_code, 'employee_postal_addr_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_tel_code, 'employee_tel_code');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_tel_num, 'employee_tel_num');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, period_employ_years, 'period_employ_years');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, period_employ_months, 'period_employ_months');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, expected_disablement_period, 'expected_disablement_period');
            
            //3. Accident Details
    //            incident_source,
    //            incident,
            ShouldUpdate.checkDate(new_wcl_2, old_data.wcl_2, accident_date, 'accident_date');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_time, 'accident_time');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, incident_place, 'incident_place');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, incident_place_province, 'incident_place_province');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, incident_place_district, 'incident_place_district');
            ShouldUpdate.checkDate(new_wcl_2, old_data.wcl_2, accident_date_reported, 'accident_date_reported');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_time_reported, 'accident_time_reported');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, task_employee_performing_during_accident, 'task_employee_performing_during_accident');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, period_experience_task_performed_years, 'period_experience_task_performed_years');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, period_experience_task_performed_months, 'period_experience_task_performed_months');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_action_connected_business, 'employee_action_connected_business');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_desc, 'accident_desc');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, traffic_accident_on_public_road, 'traffic_accident_on_public_road');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, nature_of_injury_list, 'nature_of_injury_list');
            ShouldUpdate.checkBox(new_wcl_2, old_data.wcl_2, nature_of_injury_options, 'nature_of_injury_options');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_injured_explanation_satisfactory, 'employee_injured_explanation_satisfactory');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employee_injured_explanation_satisfactory_nope_desc, 'employee_injured_explanation_satisfactory_nope_desc');
            
            //4. Further Particulars Of Employee
            ShouldUpdate.checkFile(new_wcl_2, old_data.wcl_2, doc_salary_slip, 'doc_salary_slip');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, earning_list, 'earning_list');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, prepared_further_payments_after_3_months_4rm_accident_date, 'prepared_further_payments_after_3_months_4rm_accident_date');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, total_amount_already_paid, 'total_amount_already_paid');
            if(period_payments_made_range) {
                const {start, end} = period_payments_made_range;
                const new_period_payments_made_range = {};
                const {period_payments_made_range: old_period_payments_made_range} = old_data.wcl_2 || {};
                ShouldUpdate.checkDate(new_period_payments_made_range, old_period_payments_made_range, start, 'date_from');
                ShouldUpdate.checkDate(new_period_payments_made_range, old_period_payments_made_range, end, 'date_to');
                if(!Object.keys(new_period_payments_made_range).isEmpty()){
                    new_wcl_2.period_payments_made_range = new_period_payments_made_range;
                }  
            }
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, num_of_week_days_worked_by_employee, 'num_of_week_days_worked_by_employee');
            ShouldUpdate.checkDate(new_wcl_2, old_data.wcl_2, date_ceased_work, 'date_ceased_work');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, time_ceased_work, 'time_ceased_work');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, did_employee_complete_shift_on_date_work_ceased, 'did_employee_complete_shift_on_date_work_ceased');
            ShouldUpdate.checkDate(new_wcl_2, old_data.wcl_2, date_resumed_work, 'date_resumed_work');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, time_resumed_work, 'time_resumed_work');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, dependant_name, 'dependant_name');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, dependant_address, 'dependant_address');
            
            //5. Further Particulars
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, previously_received_compensation_full_names, 'previously_received_compensation_full_names');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, was_1st_aid_given, 'was_1st_aid_given');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, medical_practitioner_or_chiropractor_who_treated_employee, 'medical_practitioner_or_chiropractor_who_treated_employee');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, hospital_which_treated_employee, 'hospital_which_treated_employee');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, was_accidnt_caused_by_employee_options_1, 'was_accidnt_caused_by_employee_options_1');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, was_accidnt_caused_by_employee_options_2, 'was_accidnt_caused_by_employee_options_2');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, was_accidnt_caused_by_employee_options_3, 'was_accidnt_caused_by_employee_options_3');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_witness, 'accident_witness');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_aware_person, 'accident_aware_person');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, num_of_employees_involved_in_accident, 'num_of_employees_involved_in_accident');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_police_station, 'accident_police_station');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, accident_docket_num, 'accident_docket_num');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, involved_vehicle_reg_numbers, 'involved_vehicle_reg_numbers');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, contributing_factor_list_A, 'contributing_factor_list_A');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, contributing_factor_list_B, 'contributing_factor_list_B');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, other_machinery_list, 'other_machinery_list');
            ShouldUpdate.checkListToJS(new_wcl_2, old_data.wcl_2, other_contributing_factor_list, 'other_contributing_factor_list');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, additional_details_or_comments, 'additional_details_or_comments');
            
            //6. Employer's Declaration
            ShouldUpdate.checkSignature(new_wcl_2, old_data.wcl_2, employer_signature, 'employer_signature');
            ShouldUpdate.check(new_wcl_2, old_data.wcl_2, employer_signature_name, 'employer_signature_name');
            ShouldUpdate.checkDate(new_wcl_2, old_data.wcl_2, employer_signature_date, 'employer_signature_date');
            
            if(!Object.keys(new_wcl_2).isEmpty()){
                data.wcl_2 = new_wcl_2;
            }  
            
            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'wcl_2_field_count');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'wcl_2_field_max');
        }
        if(wcl_4) {
            const {
                totalFieldCount, totalFieldMax,
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
            } = wcl_4;
            
            const new_wcl_4 = {};
            
            //1. General Details
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, claim_number, 'claim_number');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, accident_date, 'accident_date');

            //2. Employer Details
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, company_name, 'company_name');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, company_str_addr, 'company_str_addr');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, company_str_addr_code, 'company_str_addr_code');

            //3. Employee Details
            //employee,
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, id_num, 'id_num');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, employee_str_addr, 'employee_str_addr');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, employee_str_addr_code, 'employee_str_addr_code');
                
            //4. Medical Practioner/Chiropractor Consultation Details
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, first_consultation_date, 'first_consultation_date');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, how_accident_happen, 'how_accident_happen');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, injury_clinical_desc, 'injury_clinical_desc');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, pre_existing_defect_disease, 'pre_existing_defect_disease');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, x_rays_date, 'x_rays_date');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, x_rays_conducting_person, 'x_rays_conducting_person');
            ShouldUpdate.checkFile(new_wcl_4, old_data.wcl_4, x_rays_report, 'x_rays_report');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, surgical_procedure_date, 'surgical_procedure_date');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, surgical_procedure_conducting_person, 'surgical_procedure_conducting_person');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, surgical_procedure_desc, 'surgical_procedure_desc');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, anaesthetics_general_or_local, 'anaesthetics_general_or_local');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, anaesthetics_dur, 'anaesthetics_dur');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, consultation_yes_or_no, 'consultation_yes_or_no');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, consultation_date, 'consultation_date');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, consultation_conducting_person, 'consultation_conducting_person');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, physiotherapy_employee_referred_yes_or_no, 'physiotherapy_employee_referred_yes_or_no');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, physiotherapy_conducting_person, 'physiotherapy_conducting_person');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, employee_fitness_yes_or_no, 'employee_fitness_yes_or_no');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, employee_fitness_light_duty_date, 'employee_fitness_light_duty_date');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, employee_fitness_normal_duty_date, 'employee_fitness_normal_duty_date');

            //5. Medical Practioner/Chiropractor Declaration
            ShouldUpdate.checkSignature(new_wcl_4, old_data.wcl_4, practioner_signature, 'practioner_signature');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, practioner_signature_name, 'practioner_signature_name');
            ShouldUpdate.checkDate(new_wcl_4, old_data.wcl_4, practioner_signature_date, 'practioner_signature_date');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, practioner_addr, 'practioner_addr');
            ShouldUpdate.check(new_wcl_4, old_data.wcl_4, practioner_practice_num, 'practioner_practice_num');
            
            //external file
            ShouldUpdate.checkFile(new_wcl_4, old_data.wcl_4, wcl_4_external_doc, 'external_doc');
            
            if(!Object.keys(new_wcl_4).isEmpty()){
                data.wcl_4 = new_wcl_4;
            }  
            
            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'wcl_4_field_count');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'wcl_4_field_max');
        } else if(wcl_4_external_doc) {
            const new_wcl_4 = {};
            ShouldUpdate.checkFile(new_wcl_4, old_data.wcl_4, wcl_4_external_doc, 'external_doc');
            if(!Object.keys(new_wcl_4).isEmpty()){
                data.wcl_4 = new_wcl_4;
            } 
        }
        if(wcl_5_list) {
//            const {
//                //1. General Details
//                claim_number, 
//                accident_date,
//
//                //2. Employer Details
//                company_name,
//                company_str_addr,
//                company_str_addr_code,
//
//                //3. Employee Details
//    //            employee,
//                id_num,
//                employee_str_addr,
//                employee_str_addr_code,
//
//                //4. Medical Practioner/Chiropractor Consultation Details
//                operation_procedure_test_carried_out_and_dates,
//                prognosis_and_further_treatment,
//                employee_been_fit_normal_work_date,
//                employee_likely_to_be_fit_normal_work_date,
//                employee_condition_became_stabilised_yes_or_no,
//                present_permanent_anatomical_defect_or_impairment,
//
//                //5. Medical Practioner/Chiropractor Declaration
//                practioner_signature,
//                practioner_signature_name,
//                practioner_signature_date,
//                practioner_addr,
//                practioner_practice_num
//            } = wcl_5;
//            
//            const new_wcl_5 = {};
//            
//            //1. General Details
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, claim_number, 'claim_number');
//            ShouldUpdate.checkDate(new_wcl_5, old_data.wcl_5, accident_date, 'accident_date');
//            
//            //2. Employer Details
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, company_name, 'company_name');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, company_str_addr, 'company_str_addr');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, company_str_addr_code, 'company_str_addr_code');
//            
//            //3. Employee Details
//            //employee,
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, id_num, 'id_num');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, employee_str_addr, 'employee_str_addr');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, employee_str_addr_code, 'employee_str_addr_code');
//            
//            //4. Medical Practioner/Chiropractor Consultation Details
//            ShouldUpdate.checkListToJS(new_wcl_5, old_data.wcl_5, operation_procedure_test_carried_out_and_dates, 'operation_procedure_test_carried_out_and_dates');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, prognosis_and_further_treatment, 'prognosis_and_further_treatment');
//            ShouldUpdate.checkDate(new_wcl_5, old_data.wcl_5, employee_been_fit_normal_work_date, 'employee_been_fit_normal_work_date');
//            ShouldUpdate.checkDate(new_wcl_5, old_data.wcl_5, employee_likely_to_be_fit_normal_work_date, 'employee_likely_to_be_fit_normal_work_date');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, employee_condition_became_stabilised_yes_or_no, 'employee_condition_became_stabilised_yes_or_no');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, present_permanent_anatomical_defect_or_impairment, 'present_permanent_anatomical_defect_or_impairment');
//                
//            //5. Medical Practioner/Chiropractor Declaration
//            ShouldUpdate.checkSignature(new_wcl_5, old_data.wcl_5, practioner_signature, 'practioner_signature');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, practioner_signature_name, 'practioner_signature_name');
//            ShouldUpdate.checkDate(new_wcl_5, old_data.wcl_5, practioner_signature_date, 'practioner_signature_date');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, practioner_addr, 'practioner_addr');
//            ShouldUpdate.check(new_wcl_5, old_data.wcl_5, practioner_practice_num, 'practioner_practice_num');
//            
//            //external file
//            ShouldUpdate.checkFile(new_wcl_5, old_data.wcl_5, wcl_5_external_doc, 'external_doc');
//            
//            if(!Object.keys(new_wcl_5).isEmpty()){
//                data.wcl_5 = new_wcl_5;
//            }  
        }
        if(wcl_6) {
            const {
                totalFieldCount, totalFieldMax,
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
            } = wcl_6;
            
            const new_wcl_6 = {};
            
            //1. General Details
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, claim_number, 'claim_number');
            ShouldUpdate.checkDate(new_wcl_6, old_data.wcl_6, accident_date, 'accident_date');
            
            //2. Employer Details
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, company_name, 'company_name');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, company_str_addr, 'company_str_addr');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, company_str_addr_code, 'company_str_addr_code');
            
            //3. Employee Details
            //employee,
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, id_num, 'id_num');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_str_addr, 'employee_str_addr');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_str_addr_code, 'employee_str_addr_code');
            
            //4. Accident Details
            ShouldUpdate.checkListToJS(new_wcl_6, old_data.wcl_6, periods_employee_off_duty, 'periods_employee_off_duty');
            ShouldUpdate.checkListToJS(new_wcl_6, old_data.wcl_6, periods_employee_light_duty, 'periods_employee_light_duty');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_light_duty_available_and_offered, 'employee_light_duty_available_and_offered');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_perform_recommended_light_duty, 'employee_perform_recommended_light_duty');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_perform_recommended_light_duty_not_performed_reason, 'employee_perform_recommended_light_duty_not_performed_reason');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_perform_recommended_light_duty_performed_percentage, 'employee_perform_recommended_light_duty_performed_percentage');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_still_in_your_employment, 'employee_still_in_your_employment');
            ShouldUpdate.checkDate(new_wcl_6, old_data.wcl_6, employee_left_my_service_date, 'employee_left_my_service_date');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employee_present_address, 'employee_present_address');
            if(employee_receive_free_food_range) {
                const {start, end} = employee_receive_free_food_range;
                const new_employee_receive_free_food_range = {};
                const {employee_receive_free_food_range: old_employee_receive_free_food_range} = old_data.wcl_6 || {};
                ShouldUpdate.checkDate(new_employee_receive_free_food_range, old_employee_receive_free_food_range, start, 'date_from');
                ShouldUpdate.checkDate(new_employee_receive_free_food_range, old_employee_receive_free_food_range, end, 'date_to');
                if(!Object.keys(new_employee_receive_free_food_range).isEmpty()){
                    new_wcl_6.employee_receive_free_food_range = new_employee_receive_free_food_range;
                }  
            }
            if(employee_receive_free_quarters_range) {
                const {start, end} = employee_receive_free_quarters_range;
                const new_employee_receive_free_quarters_range = {};
                const {employee_receive_free_quarters_range: old_employee_receive_free_quarters_range} = old_data.wcl_6 || {};
                ShouldUpdate.checkDate(new_employee_receive_free_quarters_range, old_employee_receive_free_quarters_range, start, 'date_from');
                ShouldUpdate.checkDate(new_employee_receive_free_quarters_range, old_employee_receive_free_quarters_range, end, 'date_to');
                if(!Object.keys(new_employee_receive_free_quarters_range).isEmpty()){
                    new_wcl_6.employee_receive_free_quarters_range = new_employee_receive_free_quarters_range;
                }  
            }
            if(period_detained_in_hospital_range) {
                const {start, end} = period_detained_in_hospital_range;
                const new_period_detained_in_hospital_range = {};
                const {period_detained_in_hospital_range: old_period_detained_in_hospital_range} = old_data.wcl_6 || {};
                ShouldUpdate.checkDate(new_period_detained_in_hospital_range, old_period_detained_in_hospital_range, start, 'date_from');
                ShouldUpdate.checkDate(new_period_detained_in_hospital_range, old_period_detained_in_hospital_range, end, 'date_to');
                if(!Object.keys(new_period_detained_in_hospital_range).isEmpty()){
                    new_wcl_6.period_detained_in_hospital_range = new_period_detained_in_hospital_range;
                }  
            }
                
            //5. Employer's Declaration
            ShouldUpdate.checkSignature(new_wcl_6, old_data.wcl_6, employer_signature, 'employer_signature');
            ShouldUpdate.check(new_wcl_6, old_data.wcl_6, employer_signature_name, 'employer_signature_name');
            ShouldUpdate.checkDate(new_wcl_6, old_data.wcl_6, employer_signature_date, 'employer_signature_date');
            
            if(!Object.keys(new_wcl_6).isEmpty()){
                data.wcl_6 = new_wcl_6;
            }  
            
            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'wcl_6_field_count');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'wcl_6_field_max');
        }
        if(annexture_1) {
            const {
                totalFieldCount, totalFieldMax,
                //A. Recording Of Incident
                company_name,
    //            affected_person,
                id_num,
                accident_date,
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
            } = annexture_1;
            
            const new_annexture_1 = {};
            
            //A. Recording Of Incident
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, company_name, 'company_name');
//            ShouldUpdate.checkEmployee(new_annexture_1, old_data.annexture_1, affected_person, 'affected_person');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, id_num, 'id_num');
            ShouldUpdate.checkDate(new_annexture_1, old_data.annexture_1, accident_date, 'accident_date');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, accident_time, 'accident_time');
            ShouldUpdate.checkBox(new_annexture_1, old_data.annexture_1, part_of_body_affected, 'part_of_body_affected');
            ShouldUpdate.checkBox(new_annexture_1, old_data.annexture_1, effect_on_person, 'effect_on_person'); 
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, expected_period_of_disablement, 'expected_period_of_disablement'); 
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, disease_desc, 'disease_desc'); 
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, process, 'process');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, incident_reported_compensation_commissioner_and_provincial_director, 'incident_reported_compensation_commissioner_and_provincial_director');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, incident_reported_police, 'incident_reported_police');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, saps_office, 'saps_office');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, saps_reference, 'saps_reference');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, substance_exposed_to, 'substance_exposed_to');
                
            //B. Incident Investigation
            ShouldUpdate.checkEmployee(new_annexture_1, old_data.annexture_1, investigator, 'investigator');
            ShouldUpdate.checkDate(new_annexture_1, old_data.annexture_1, investigation_date, 'investigation_date');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, investigator_designation, 'investigator_designation');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, incident_desc, 'incident_desc');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, incident_cause, 'incident_cause');
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, steps_to_prevent_recurrence, 'steps_to_prevent_recurrence');
            ShouldUpdate.checkSignature(new_annexture_1, old_data.annexture_1, investigator_signature, 'investigator_signature');
            ShouldUpdate.checkDate(new_annexture_1, old_data.annexture_1, investigator_signature_date, 'investigator_signature_date');
                
            //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, employer_preventative_action_for_recurrence_of_similar_incident, 'employer_preventative_action_for_recurrence_of_similar_incident');
            ShouldUpdate.checkSignature(new_annexture_1, old_data.annexture_1, employer_signature, 'employer_signature');
            ShouldUpdate.checkDate(new_annexture_1, old_data.annexture_1, employer_signature_date, 'employer_signature_date');
                
            //D. Remarks By Health & Safety Committee
            ShouldUpdate.check(new_annexture_1, old_data.annexture_1, health_and_safety_committee_remarks, 'health_and_safety_committee_remarks');
            ShouldUpdate.checkSignature(new_annexture_1, old_data.annexture_1, chairperson_of_health_and_safety_committee_signature, 'chairperson_of_health_and_safety_committee_signature');
            ShouldUpdate.checkDate(new_annexture_1, old_data.annexture_1, chairperson_of_health_and_safety_committee_signature_date, 'chairperson_of_health_and_safety_committee_signature_date');
            
            if(!Object.keys(new_annexture_1).isEmpty()){
                data.annexture_1 = new_annexture_1;
            }  
            
            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'annexture_1_field_count');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'annexture_1_field_max');
        }
        
        console.log(data)
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
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
            state,
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    client, project, site, 
                    employee, 
                    claim_number, 
                    provincial_office,
                    accident_date,
                    wcl_2, wcl_4, wcl_5_list, wcl_6, 
                    annexture_1,
                    wcl_4_external_doc,
                    doctor_email
                }
            }
        } = this;
        
        const {isContractor, isConsultant} = storage.is;
        return <FormControls onChange={this.form.onChange}>
                <Row 
                    rendered  
                    active
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="Employee Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="Claim Number / Provincial Office / Date of Accident" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ClearableInput ref="claim_number" name="claim_number" type="text" defaultValue={claim_number} placeholder="Claim Number" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="provincial_office" name="provincial_office" type="text" defaultValue={provincial_office} placeholder="Provincial Office" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="accident_date" name="accident_date" type="date" defaultValue={accident_date} placeholder="Date of Accident..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="W.CI.2 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ButtonWCl state={state} name="wcl_2" dialogName="newWCL2Dialog" text="W.CI.2" onClick={this.onNewDialog}/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="W.CI.4 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ButtonWCl state={state} name="wcl_4" dialogName="newWCL4Dialog" text="W.CI.4" onClick={this.onNewDialog}/>
                    <h3 className="text-center col-lg-12 margin-t-10 margin-b-0">OR</h3>
                    <UploadButton 
                        ref="wcl_4_external_doc" 
                        name="wcl_4_external_doc" 
                        defaultValue={wcl_4_external_doc || (wcl_4 && wcl_4.external_doc)}
                        buttonTitle="Upload W.CI.4" 
                        type={['PDF', 'Word', 'Photo']}
                        showOnlyIcon 
                        className="col-lg-12 col-xs-12 margin-t-10"
                    />
                    <label className="col-lg-12 text-center margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        Medical Practioner/Chiropractor Email Address
                    </label>
                    <ClearableInput ref="doctor_email_1" name="doctor_email_1" type="text" placeholder="Email Address" defaultValue={doctor_email} footerDesc="For Filling W.CI.4 Online" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="W.CI.5 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <WCl5Table ref="wcl_5_list" name="wcl_5_list" defaultValue={[...(wcl_5_list || []), null]} onNewDialog={this.onNewDialog} onPrintDialog={this.onPrintDialog}/>
                </Row>
                <Row 
                    rendered 
                    idx={6}
                    title="W.CI.6 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ButtonWCl state={state} name="wcl_6" dialogName="newWCL6Dialog" text="W.CI.6" onClick={this.onNewDialog}/>
                </Row>
                <Row 
                    rendered 
                    idx={7}
                    title="Annexture 1 Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <ButtonWCl state={state} name="annexture_1" dialogName="newAnnexture1Dialog" text="Annexture 1" onClick={this.onNewDialog}/>
                </Row>
                
            <NewWCL2Dialog ref="newWCL2Dialog"/>
            <NewWCL4Dialog ref="newWCL4Dialog"/>
            <NewWCL5Dialog ref="newWCL5Dialog"/>
            <NewWCL6Dialog ref="newWCL6Dialog"/>
            <NewAnnexture1Dialog ref="newAnnexture1Dialog"/>
            
            <PrintWCL2Dialog ref="printWCL2Dialog"/>
            <PrintWCL4Dialog ref="printWCL4Dialog"/>
            <PrintWCL5Dialog ref="printWCL5Dialog"/>
            <PrintWCL6Dialog ref="printWCL6Dialog"/>
            <PrintAnnexture1Dialog ref="printAnnexture1Dialog"/>
            
            <NewClaimsEmployerDetailsDialog ref="newClaimsEmployerDetailsDialog"/>
            
            <ChatBtn item={item} onClick={this.onClickChat}/>
        </FormControls>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="ChatBtn">
@observer
class ChatBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        const {onClick} = this.props;
        onClick(this.refs.btn);
    }
    
    render() {
        const {item: {data: {message_list_provider = []}}} = this.props;
        return <button 
            onClick={this.onClick}
            type="button" 
            className="rcw-launcher fixed-center Claim-chat-btn" 
            aria-controls="rcw-chat-container">
                {!message_list_provider.isEmpty() && <span className="counter">{message_list_provider.length}</span>}
                <ChatButton ref="btn"/>
        </button>;
    }
}
// </editor-fold>

export default EditClaimsClientDialog;
//352