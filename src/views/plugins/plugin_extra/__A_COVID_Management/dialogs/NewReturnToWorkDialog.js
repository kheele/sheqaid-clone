// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen} from 'utils/Utils';
import {ClearableInput, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import AEditDialog from 'components/dialogs/AEditDialog';

import AControls from "./ANewCOVIDControls";

import style from "./NewReturnToWorkDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends AEditDialog {
    pageKey = "NewReturnToWorkDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Return To Work Case";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/COVID_Management/return-to-work/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            hospitalised: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}, {text: "Unknown", value: "Unknown", checked: false}],
            hospital_types: ["Public", "Private", "Unknown"],
            outcome: [{text: "Discharge", value: "Discharge", checked: false}, {text: "Death", value: "Death", checked: false}],
            compensation_claim: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            return_to_work_fitness: [
                'Fit for Job Description', 'Fit with Accommodation', 'Fit with restrictions', 
                'Temporarily unfit for Job Description', 'Unfit for review', 'Permanently Unfit'
            ],
            genders: ["Male", "Female", "Other"],
            provinces: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'],
            districts: [
                "Alfred Nzo", "Amajuba", "Amathole", "Bojanala", "Buffalo City", "Cape Winelands", "Capricon", "Central Karoo", "Chris Hani", 
                "City of Cape Town", "City of Johannesburg", "City of Tshwane", "Dr Kenneth Kaunda", "Dr Ruth Segomotsi Mompati", "Ehlazeni", "Ekurhuleni",
                "eThekwini", "Fezile Dabi", "Frances Baard", "Garden Route", "Gert Sibande", "Harry Gwala", "iLembe", "Joe Gqabi", "John Taolo Gaetsewe", 
                "King Centshwayo", "Lejweleputswa", "Mangaung", "Mopani", "Namakwa", "Nelson Mandela Bay", "Ngaka Modiri Molema", "Nkangala", "OR Tambo", 
                "Overberg", "Pixley ka Seme", "Sarah Baartman", "Sedibeng", "Sekhukhune", "Thabo Mofutsanyane", "Ugu", "Umgungundlovu", "Umkhanyakude", 
                "Umzinyathi", "Uthukela", "Vhembe", "Waterberg", "West Coast", "West rand", "Xhariep", "ZF Mgcawu", "Zululand"
            ],
            job_categories: [
                'Managers', 
                'Professionals', 
                'Technicians and Associate Professionals', 
                'Clerical Support Workers', 
                'Services and Sales Workers', 
                'Skilled Agricultural, Forestry, Fishery, Craft and Related Trades Workers',
                'Plant and Machine Operators and Assemblers',
                'Elementary Occupations'
            ]
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form = new Form();
        this.onChangeEmployee = this.onChangeEmployee.bind(this);
        this.onChangeHospitalised = this.onChangeHospitalised.bind(this);
        this.form.addChangeOne("employee", this.onChangeEmployee);
        this.form.addChangeOne("hospitalised", this.onChangeHospitalised);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        this.item && this.onChangeEmployee(null, this.item);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeEmployee(el, val) {
        const {employee_id} = this.refs;
        execWhen(() => !!this.refs.employee_id).then(() => {
            if(val) {
                const {id_num, passport_num} = val.data;
                employee_id.onChange(id_num || passport_num);
            } else {
                employee_id.reset();
            }
        });
    }
    
    onChangeHospitalised(el, val){
        const {hospital_type, admission_date} = this.refs;
        const isHos = val === "Yes";
        hospital_type.setEditable(isHos);
        admission_date.setEditable(isHos);
        if(!isHos) {
            hospital_type.setEditable(true);
            admission_date.setEditable(true);
            hospital_type.reset();
            admission_date.reset();
            hospital_type.setEditable(false);
            admission_date.setEditable(false);
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, refs:{newQuestionsTable}} = this;
        const {isConsultant, isHasProjects} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('employee_id')) {
            infoDialog.open('Employee ID is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
        if (!form.isValid('business_id')) {
            infoDialog.open('Business ID is required');
            return;
        }
        if (!form.isValid('sex')) {
            infoDialog.open('Gender is required');
            return;
        }
        if (!form.isValid('age')) {
            infoDialog.open('Age is required');
            return;
        }
        if (!form.isValid('province')) {
            infoDialog.open('Province is required');
            return;
        }
        if (!form.isValid('district')) {
            infoDialog.open('District is required');
            return;
        }
        if (!form.isValid('job_category')) {
            infoDialog.open('Job Category is required');
            return;
        }
        if (!form.isValid('hospitalised')) {
            infoDialog.open('Hospitalised is required');
            return;
        } else if(form.get('hospitalised') === "Yes"){
            if (!form.isValid('hospital_type')) {
                infoDialog.open('Hospital Type is required');
                return;
            }
            if (!form.isValid('admission_date')) {
                infoDialog.open('Date Of Admission is required');
                return;
            }
        }
        if (!form.isValid('outcome')) {
            infoDialog.open('Outcome is required');
            return;
        }
        if (!form.isValid('outcome_date')) {
            infoDialog.open('Date Of Outcome is required');
            return;
        }
        if (!form.isValid('return_to_work_date')) {
            infoDialog.open('Return To Work Date is required');
            return;
        }
        if (!form.isValid('return_to_work_fitness')) {
            infoDialog.open('Return To Work Fitness is required');
            return;
        }
        
        const {
            client, project, site,
            employee: {id, data: {fname, lname}}, employee_id, business_id, date, sex, age, province, district, job_category,
            hospitalised, hospital_type, admission_date, outcome, outcome_date, return_to_work_date, return_to_work_fitness, compensation_claim, percentage_disablement, claim_ref_num
        } = form.data;
        const data = {
            employee: {id, fname, lname}, employee_id, business_id, date: date.getTime(), sex, age, province, district, job_category,
            hospitalised, outcome, outcome_date: outcome_date.getTime(), return_to_work_date: return_to_work_date.getTime(), return_to_work_fitness
        };
        
        if(client) {
            if(client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
                data.client_id = id;
            } else {
                data.client = client;
            }
        }
        if(project) {
            if(project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
                data.project_id = id;
            } else {
                data.project = project;
            }
        }
        if(site) {
            if(site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
                data.site_id = id;
            } else {
                data.site = site;
            }
        }
        
        if(hospital_type) {
            data.hospital_type = hospital_type;
        }
        if(admission_date) {
            data.admission_date = admission_date.getTime();
        }
        if(compensation_claim) {
            data.compensation_claim = compensation_claim;
        }
        if(percentage_disablement) {
            data.percentage_disablement = percentage_disablement;
        }
        if(claim_ref_num) {
            data.claim_ref_num = claim_ref_num;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>

    @computed
    get item() {
        return this.state.seletedItem;
    }

    get itemEmployee() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.itemEmployee)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            itemEmployee, itemEmployee: {
                _group: group, list
            }
        } = this;
        const {
            item, itemEmployee: {
                id, data: {
                    created_at, 
                    client, project, site,
                    employee, employee_id, business_id, date, sex, age, province, district, job_category,
                    test_type, test_date, symptom_positive, 
                    high_risk_contacts_num, high_risk_contacts_list,
                    vulnerability_status, positive_test_result_action, exposure_info
                }
            }
        } = this;
        
        const employeeDefault = employee.fname + ' ' + employee.lname;
        const job_categoryDefault = {label: job_category.name, value: job_category};
        
        const sexDefault = {label: sex, value: sex};
        const provinceDefault = {label: province, value: province};
        const districtDefault = {label: district, value: district};
        const test_typeDefault = {label: test_type, value: test_type};
        const symptom_positiveDefault = {label: symptom_positive, value: symptom_positive};
        const positive_test_result_actionDefault = {label: positive_test_result_action, value: positive_test_result_action};
        const exposure_infoDefault = {label: exposure_info, value: exposure_info};
        
//        const date = new Date();
        const {isConsultant, isHasProjects} = storage.is;
        
        return (<div className="controls-wrapper">
            {isHasProjects && <div className="controls SelectSiteConfirmInputs" style={{height: "auto"}}>
                <label>Location</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                        <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>}
            <div className="controls -margin-t-10 padding-t-0">
                <label>Return To Work Case Details</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput ref="employee" name="employee" type="text" defaultValue={employeeDefault} isEditable={false} placeholder="Employee..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="employee_id" name="employee_id" type="text" defaultValue={employee_id} placeholder="Employee ID" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={date && new Date(date)} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="business_id" type="text" defaultValue={business_id} placeholder="Business ID" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="sex" type="select" placeholder="Gender" defaultValue={sexDefault} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.genders} returnValue/>
                        <ClearableInput name="age" type="number" defaultValue={age} placeholder="Age (Years)" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="province" type="select" defaultValue={provinceDefault} placeholder="Province..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                        <ClearableInput name="district" type="select" defaultValue={districtDefault} placeholder="District..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="job_category" type="select" defaultValue={job_categoryDefault} placeholder="Job Category..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
                    </div>
               </div>
            </div>
            <div className="controls">
                <label>Return To Work</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="hospitalised" type="radio" placeholder="Hospitalised" required className="col-lg-5 form-control" onChange={this.form.onChange} values={this.state.lists.hospitalised}/>
                        <ClearableInput ref="hospital_type" name="hospital_type" type="select" placeholder="Hospital Type..." footerDesc='Fill this field only when "Hospitalised" is "Yes"' required isEditable={false} className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.hospital_types} add returnValue/>
                        <ClearableInput ref="admission_date" name="admission_date" type="date" placeholder="Date Of Admission..." footerDesc='Fill this field only when "Hospitalised" is "Yes"' required isEditable={false} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="outcome" type="radio" placeholder="Outcome" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.outcome}/>
                        <ClearableInput name="outcome_date" type="date" placeholder="Date Of Outcome..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="return_to_work_date" type="date" placeholder="Return To Work Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="return_to_work_fitness" type="select" placeholder="Return To Work Fitness..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.return_to_work_fitness} add returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="compensation_claim" type="radio" placeholder="Compensation Claim" required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.compensation_claim}/>
                        <ClearableInput name="percentage_disablement" type="number" placeholder="% Disablement" desc="If it's 30%, type 30" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="claim_ref_num" type="text" placeholder="Claim Reference No." className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
            </div>     
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
