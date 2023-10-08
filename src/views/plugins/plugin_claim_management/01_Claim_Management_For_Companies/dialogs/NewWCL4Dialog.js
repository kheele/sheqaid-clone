// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, setDefaultVal} from 'utils/Utils';

import {ClearableInput, PDFUploadButton, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewWCL4Dialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewWCL4Dialog extends ANewDialog {
    pageKey = "NewWCL4Dialog";
    title = "Create/Edit W.CI.4";

    constructor(props) {
        super(props, style);
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
        lists: {
            anaesthetics_general_or_local: ['General', 'Local'].map(text => {
                return {value: text, text, checked: false};
            }),
            consultation_yes_or_no: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            physiotherapy_employee_referred_yes_or_no: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            employee_fitness_yes_or_no: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            })
        },
        countFields: {}
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.onCountFields = this.onCountFields.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        const setDefaultValue = setDefaultVal.bind(this);
        
        const {dialog} = this.props;
        dialog.setTitle(this.item ? 'Edit W.CI.4' : 'Create W.CI.4');
        
        const employer_details = dialog.extraProp('employer_details');
        const employee = dialog.extraProp('employee');
        const claim_number = dialog.extraProp('claim_number');
        const accident_date = dialog.extraProp('accident_date');
        
        //1. General Details
        setDefaultValue('claim_number', () => claim_number);
        setDefaultValue('accident_date', () => accident_date);
        
        //2. Employer Details
        if(employer_details) {
            const {data: {company_name}} = employer_details;
            setDefaultValue('company_name', (v) => v || company_name);
        } else {
            setDefaultValue('company_name');
        }
        
        //3. Employee Details
        setDefaultValue('employee', () => {
            if(!employee) return false;
            const {lname, fname, data} = employee;
            return {label: `${lname || data.lname} ${fname || data.fname}`, value: employee};
        });
        setDefaultValue('id_num', (id_num) => id_num || (employee && employee.data && employee.data.id_num));
        
        const setEmployerDetails = employer_details => {
            const {
                data: {
                    company_str_addr,
                    company_str_addr_code
                }
            } = employer_details;
            
            setDefaultValue('company_str_addr', (v) => v || company_str_addr);
            setDefaultValue('company_str_addr_code', (v) => v || company_str_addr_code);
        };
        
        if(this.item) {
            //2. Employer Details
            if(employer_details) {
                setEmployerDetails(employer_details);
            } else {
                setDefaultValue('company_str_addr');
                setDefaultValue('company_str_addr_code');
            }

            //3. Employee Details
            setDefaultValue('employee', () => employee);
            setDefaultValue('id_num', () => employee && employee.data && employee.data.id_num);
            setDefaultValue('employee_str_addr');
            setDefaultValue('employee_str_addr_code');

            //4. Medical Practitioner/Chiropractor Consultation Details
            setDefaultValue('first_consultation_date');
            setDefaultValue('how_accident_happen');
            setDefaultValue('injury_clinical_desc');
            setDefaultValue('pre_existing_defect_disease');
            setDefaultValue('x_rays_date');
            setDefaultValue('x_rays_conducting_person');
            setDefaultValue('x_rays_report');
            setDefaultValue('surgical_procedure_date');
            setDefaultValue('surgical_procedure_conducting_person');
            setDefaultValue('surgical_procedure_desc');
            setDefaultValue('anaesthetics_general_or_local');
            setDefaultValue('anaesthetics_dur');
            setDefaultValue('consultation_yes_or_no');
            setDefaultValue('consultation_date');
            setDefaultValue('consultation_conducting_person');
            setDefaultValue('physiotherapy_employee_referred_yes_or_no');
            setDefaultValue('physiotherapy_conducting_person');
            setDefaultValue('employee_fitness_yes_or_no');
            setDefaultValue('employee_fitness_light_duty_date');
            setDefaultValue('employee_fitness_normal_duty_date');

            //5. Medical Practitioner/Chiropractor Declaration
            setDefaultValue('practioner_signature');
            setDefaultValue('practioner_signature_name');
            setDefaultValue('practioner_signature_date');
            setDefaultValue('practioner_addr');
            setDefaultValue('practioner_practice_num');
        } else {
            if(employer_details){
                setEmployerDetails(employer_details);
            }
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onCountFields({count, max}, idx) {
        const {state: {countFields}} = this;
        countFields[idx] = {count, max};
    }
    
    onChangeEmployee(el, val) {
        execWhen(() => this.refs.id_num).then(id_num_ref => {
            if(val) { 
                let {id_num} = val.data;
                id_num && id_num_ref.onChange(id_num);
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('accident_date')) {
                infoDialog.open('Date of Accident is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('company_name')) {
                infoDialog.open('Name of employer is required');
                return;
            }    
            if (!form.isValid('company_str_addr')) {
                infoDialog.open('Employer Street Address is required');
                return;
            }    
            if (!form.isValid('company_str_addr_code')) {
                infoDialog.open('Employer Postal Code is required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }    
            if (!form.isValid('id_num')) {
                infoDialog.open('Employee Identity Number is required');
                return;
            }    
            if (!form.isValid('employee_str_addr')) {
                infoDialog.open('Employee Street Address is required');
                return;
            }    
            if (!form.isValid('employee_str_addr_code')) {
                infoDialog.open('Employee Postal Code is required');
                return;
            }    
        }
        if(idx === 4) {
        }
        if(idx === 5) {
        }
        
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, totalFieldCount, totalFieldMax} = this;
          
        const {
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
            
            //4. Medical Practitioner/Chiropractor Consultation Details
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
            
            //5. Medical Practitioner/Chiropractor Declaration
            practioner_signature,
            practioner_signature_name,
            practioner_signature_date,
            practioner_addr,
            practioner_practice_num
        } = form.data;
        
        const data = {
            totalFieldCount,
            totalFieldMax,
            //1. General Details
            claim_number,
            accident_date: Dates.formatDateSQL(accident_date),
            
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
            first_consultation_date: Dates.formatDateSQL(first_consultation_date),
            how_accident_happen,
            injury_clinical_desc,
            pre_existing_defect_disease,
            x_rays_date: Dates.formatDateSQL(x_rays_date),
            x_rays_conducting_person,
            x_rays_report,
            surgical_procedure_date: Dates.formatDateSQL(surgical_procedure_date),
            surgical_procedure_conducting_person,
            surgical_procedure_desc,
            anaesthetics_general_or_local,
            anaesthetics_dur,
            consultation_yes_or_no,
            consultation_date: Dates.formatDateSQL(consultation_date),
            consultation_conducting_person,
            physiotherapy_employee_referred_yes_or_no,
            physiotherapy_conducting_person,
            employee_fitness_yes_or_no,
            employee_fitness_light_duty_date: Dates.formatDateSQL(employee_fitness_light_duty_date),
            employee_fitness_normal_duty_date: Dates.formatDateSQL(employee_fitness_normal_duty_date),
            
            //5. Medical Practitioner/Chiropractor Declaration
            practioner_signature: practioner_signature && toJS(practioner_signature),
            practioner_signature_name,
            practioner_signature_date: Dates.formatDateSQL(practioner_signature_date),
            practioner_addr,
            practioner_practice_num,
        };
        
        console.log("res", data)
        onSaved(data);
        this.props.close();
    }
    // </editor-fold>

    get totalFieldCount() {
        const {state: {countFields}} = this;
        const totalCount = Object.values(countFields).map(({count, max}) => count).reduce((n1, n2) => n1 + n2, 0);
        return totalCount;
    }
    
    get totalFieldMax() {
        const {state: {countFields}} = this;
        const totalMax = Object.values(countFields).map(({count, max}) => max).reduce((n1, n2) => n1 + n2, 0);
        return totalMax;
    }
    
    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        const {isContractor, isConsultant} = storage.is;
        return <FormControls onChange={this.form.onChange} onCountFields={this.onCountFields}>
                <Row 
                    rendered  
                    countFields
                    active
                    idx={1}
                    title="1. General Details" 
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <ClearableInput ref="claim_number" name="claim_number" type="text" placeholder="Claim Number" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="accident_date" name="accident_date" type="date" placeholder="Date of Accident..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered  
                    countFields
                    idx={2}
                    title="2. Employer Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ClearableInput ref="company_name" name="company_name" type="text" placeholder="Name of employer" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ClearableInput ref="company_str_addr" name="company_str_addr" type="textarea" placeholder="Street Address" className="col-lg-8 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="company_str_addr_code" name="company_str_addr_code" type="text" placeholder="Postal Code" footerDesc="For Street Address" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    countFields
                    idx={3}
                    title="3. Employee Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="id_num" name="id_num" type="text" placeholder="Identity Number" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                    <ClearableInput ref="employee_str_addr" name="employee_str_addr" type="textarea" placeholder="Street Address" className="col-lg-8 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="employee_str_addr_code" name="employee_str_addr_code" type="text" placeholder="Postal Code" footerDesc="For Street Address" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    countFields
                    idx={4}
                    title="4. Medical Practitioner/Chiropractor Consultation Details"
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ClearableInput ref="first_consultation_date" name="first_consultation_date" type="date" placeholder="First Consultation Date..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="how_accident_happen" name="how_accident_happen" type="textarea" placeholder="How did the alleged accident happen?" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="injury_clinical_desc" name="injury_clinical_desc" type="textarea" placeholder="Full clinical description of injury(ies)" footerDesc="(not symptoms, signs or syndromes)" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="pre_existing_defect_disease" name="pre_existing_defect_disease" type="textarea" placeholder="Describe briefly any pre-existing defect disease" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">X-Rays Details</label>
                    <ClearableInput ref="x_rays_date" name="x_rays_date" type="date" placeholder="X-Rays Date..." className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="x_rays_conducting_person" name="x_rays_conducting_person" type="text" placeholder="Person Who Conducted X-Rays" className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                    <PDFUploadButton ref="x_rays_report" name="x_rays_report" buttonTitle="X-Rays Report" showOnlyIcon className="col-lg-12 col-xs-12 margin-t-10" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Surgical Procedures Details</label>
                    <ClearableInput ref="surgical_procedure_date" name="surgical_procedure_date" type="date" placeholder="Surgical Procedures Date..." className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="surgical_procedure_conducting_person" name="surgical_procedure_conducting_person" type="text" placeholder="Person Who Conducted Surgical Procedures" className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="surgical_procedure_desc" name="surgical_procedure_desc" type="textarea" placeholder="Surgical Procedures Brief Description" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Anaesthetics Details</label>
                    <ClearableInput ref="anaesthetics_general_or_local" name="anaesthetics_general_or_local" type="radio" placeholder="General / Local?" className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange} values={this.state.lists.anaesthetics_general_or_local} returnValue/>
                    <ClearableInput ref="anaesthetics_dur" name="anaesthetics_dur" type="text" placeholder="Anaesthetics Duration" className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Consultation Details</label>
                    <ClearableInput ref="consultation_yes_or_no" name="consultation_yes_or_no" type="radio" placeholder="Consultation Conducted?" className="col-lg-8 col-xs-12 form-control" onChange={this.form.onChange} values={this.state.lists.consultation_yes_or_no} returnValue/>
                    <ClearableInput ref="consultation_date" name="consultation_date" type="date" placeholder="Consultation Date..." className="col-lg-4 col-xs-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="consultation_conducting_person" name="consultation_conducting_person" type="text" placeholder="Person Who Conducted Consultation" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Physiotherapy Details</label>
                    <ClearableInput ref="physiotherapy_employee_referred_yes_or_no" name="physiotherapy_employee_referred_yes_or_no" type="radio" placeholder="Employee referred for physiotherapy?" className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.physiotherapy_employee_referred_yes_or_no} returnValue/>
                    <ClearableInput ref="physiotherapy_conducting_person" name="physiotherapy_conducting_person" type="text" placeholder="Physiotherapist Names" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Employee Fitness Details</label>
                    <ClearableInput ref="employee_fitness_yes_or_no" name="employee_fitness_yes_or_no" type="radio" placeholder="Employee unfit for work?" className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.employee_fitness_yes_or_no} returnValue/>
                    <ClearableInput ref="employee_fitness_light_duty_date" name="employee_fitness_light_duty_date" type="date" placeholder="Possible date for Light duty..." className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="employee_fitness_normal_duty_date" name="employee_fitness_normal_duty_date" type="date" placeholder="Possible date for Normal duty..." className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    countFields
                    idx={5}
                    title="5. Medical Practitioner/Chiropractor Declaration"
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        I certify that I have by examination, satisfied myself that the injury(ies) of the employee is the result of the accident as described above.
                    </label>
                    
                    <ClearableInput ref="practioner_signature" name="practioner_signature" type="signature" placeholder="Medical Practitioner/Chiropractor Signature" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="practioner_signature_name" name="practioner_signature_name" type="text" placeholder="Name of Person Signing" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="practioner_signature_date" name="practioner_signature_date" type="date" placeholder="Signature Date..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                
                    <hr />
                    
                    <ClearableInput ref="practioner_addr" name="practioner_addr" type="textarea" placeholder="Address" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="practioner_practice_num" name="practioner_practice_num" type="text" placeholder="Practice Number" className="col-lg-12 form-control" onChange={this.form.onChange}/>
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

export default NewWCL4Dialog;
