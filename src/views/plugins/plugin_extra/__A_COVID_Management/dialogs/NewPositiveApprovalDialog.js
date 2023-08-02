// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';
import {
    Button,
    ClearableInput,
    PDFUploadButton,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {ATableSavable, SelectTable, Table, TBody, THead, TRow} from 'components/tables';
import AEditDialog from 'components/dialogs/AEditDialog';

import AControls from "./ANewCOVIDControls";

import style from "./NewPositiveApprovalDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends AEditDialog {
    pageKey = "NewPositiveApprovalDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Approve Positive Case";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "plugin_sheq_assist/COVID_Management/positive/";

    @observable
    state = {
        lists: {
            test_types: ["PCR", "Antigen", "Antibody", "Unknown"],
            symptoms_positive: ["Yes", "No"],
            test_result_actions: ['Sick Leave', 'Self-Isolation at home', 'Isolation at quarantine site', 'Hospitalisation'],
            vulnerability_status: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            exposure_info: ['Work contacts', 'Community contacts', 'Family contacts', 'Large events contacts', 'Travel history from a designated hotspot', 'Public transport', 'Unknown'],
            
            reporting_action_del: ["Yes", "No", "Not Applicable"],
            reporting_action_coid: ["Yes", "No", "Not Applicable"],
            reporting_action_dmre: ["Yes", "No", "Not Applicable"],
            
            hospitalised: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}, {text: "Unknown", value: "Unknown", checked: false}],
            hospital_types: ["Public", "Private", "Unknown"],
            outcome: [{text: "Discharge", value: "Discharge", checked: false}, {text: "Death", value: "Death", checked: false}],
            compensation_claim: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            return_to_work_fitness: [
                'Fit for Job Description', 'Fit with Accommodation', 'Fit with restrictions', 
                'Temporarily unfit for Job Description', 'Unfit for review', 'Permanently Unfit'
            ],
            illness_type: ['Mild', 'Moderate', 'Severe'],
            
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
            industries: [
                'Industry',
                'Agriculture',
                'Forrestry',
                'Fishing',
                'Coal mining',
                'Extraction of petroleum and natural gas',
                'Gold and uranium mining',
                'Metal ore mining',
                'other mining and quarrying',
                'Manufacture of food and beverages',
                'Manufacture of textiles including clothes and leather',
                'Manufacture of wood and wood products',
                'Manufacture of paper and paper products',
                'Manufacture of petroleum products',
                'Manufacture of chemical and chemical products',
                'Manufacture of rubber and plastic products',
                'Manufacture of other non metallic products',
                'Manufacture of electronic equipment',
                'Manufacture of transport equioment',
                'Manufacture of furniture',
                'Manufacture of basic iron and steel',
                'Manufacture of glass and glass products',
                'Electricity, gas, steam and hot water supply',
                'Collection, purification and distribution of water',
                'Construction',
                'Wholesale and commission trade except of vehicles',
                'Retail except vehicles',
                'Repair of personal and household goods',
                'Sale and repair of motor vehicles and motor cycles',
                'Retail trade in automative fuel',
                'Hotels and restaurants',
                'Publishing and printing',
                'Land transport; transport via pipelines',
                'Water transport',
                'Air transport',
                'Activities of travel agencies',
                'Banking industry',
                'Insurance and pension funding',
                'Real estate activities',
                'Renting of machinery and equioment',
                'Computer and related activities',
                'Research and development',
                'Other business activities',
                'Public administration and defence activities',
                'Education',
                'Human health activities',
                'Veterinary activities',
                'Social work activities',
                'Other community, social and personal service activities',
                'Activities of membership organisations n.e.c.',
                'Recreational and cultural and sporting activities',
                'Other service activities',
                'Private households with employed persons',
                'Representatives of foreign governments',
                'Central government activities',
                'Regional services council activities',
                'Local authority activities',
                'News agency activities',
                'Entertainment',
                'Undetermined',
                'Other activities not adequately defined'
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
        },
        workmans_compensation_forms: [],
        high_risk_contacts_num: null,
        seletedItem: null
    };
    index = 0;
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onAddWorkmansCompensationForms = this.onAddWorkmansCompensationForms.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onChange = this.onChange.bind(this);
        
        this.form = new Form();
        this.onChangeHospitalised = this.onChangeHospitalised.bind(this);
        this.onChangeHighRiskContactsNum = this.onChangeHighRiskContactsNum.bind(this);
        this.form.addChangeOne("hospitalised", this.onChangeHospitalised);
        this.form.addChangeOne("high_risk_contacts_num", this.onChangeHighRiskContactsNum);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange funs">
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
    
    onAddWorkmansCompensationForms() {
        this.state.workmans_compensation_forms.push({});
    }

    onChangeHighRiskContactsNum(el, val) {
        setTimeout(() => {
            this.state.high_risk_contacts_num = val;
        }, 0);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, refs:{newQuestionsTable}} = this;

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
            if (!form.isValid('test_type')) {
                infoDialog.open('Test Type is required');
                return;
            }
            if (!form.isValid('test_date')) {
                infoDialog.open('Date Of Test is required');
                return;
            }
            if (!form.isValid('symptom_positive')) {
                infoDialog.open('Symptom Positive is required');
                return;
            }
            if (!form.isValid('vulnerability_status')) {
                infoDialog.open('Vulnerability Status is required');
                return;
            }
            if (!form.isValid('positive_test_result_action')) {
                infoDialog.open('Positive Test Result Action is required');
                return;
            }
            if (!form.isValid('exposure_info')) {
                infoDialog.open('Exposure Information is required');
                return;
            }
            
            if (!form.isValid('high_risk_contacts_num')) {
                infoDialog.open('Number of High Risk Contacts is required');
                return;
            } else {
                const high_risk_contacts_num = form.get('high_risk_contacts_num');
                if (high_risk_contacts_num > 0) {
                    if (!form.isValid('high_risk_contacts_list')) {
                        infoDialog.open('High Risk Contacts are required');
                        return;
                    } else {
                        const high_risk_contacts_num = form.get('high_risk_contacts_num');
                        const high_risk_contacts_list = form.get('high_risk_contacts_list');
                        const len = high_risk_contacts_list.filter(v => !!v).length;
                        const diff = high_risk_contacts_num - len;
                        if(diff > 0) {
                            if(diff === 1) {
                                infoDialog.open(diff + ' form of High Risk Contacts is required');
                            } else {
                                infoDialog.open(diff + ' forms of High Risk Contacts are required');
                            }
                            return;
                        }
                    }
                }
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
                employee_id, business_id, date, sex, age, province, district, job_category, 
                test_type, test_date, symptom_positive, 
                high_risk_contacts_num, high_risk_contacts_list, 
                vulnerability_status, positive_test_result_action, exposure_info,
                reporting_action_del, reporting_action_coid, reporting_action_dmre,
            
                hospitalised, hospital_type, admission_date, outcome, outcome_date, return_to_work_date, return_to_work_fitness, compensation_claim, percentage_disablement, claim_ref_num,
                illness_start_date, illness_type, illness_end_date
            } = form.data;
            const data = {
                employee: toJS(this.item.data.employee), employee_id, business_id, date: date.getTime(), sex, age, province, district, job_category: toJS(job_category), 
                test_type, test_date: test_date.getTime(), symptom_positive, 
                high_risk_contacts_num, 
                vulnerability_status, positive_test_result_action, exposure_info,
                
                hospitalised, outcome, outcome_date: outcome_date.getTime(), return_to_work_date: return_to_work_date.getTime(), return_to_work_fitness
            };

            if(high_risk_contacts_list) {
                data.high_risk_contacts_list = high_risk_contacts_list.map((item, n) => {
                    const lname = item.lname || item['lname-' + n];
                    const fname = item.fname || item['fname-' + n];
                    const sex = item.sex || item['sex-' + n] || null;
                    const age = item.age || item['age-' + n] || null;
                    const relation_to_case = item.relation_to_case || item['relation_to_case-' + n] || null;
                    const date = item.date || item['date-' + n] || null;
                    const place = item.place || item['place-' + n] || null;
                    const address = item.address || item['address-' + n] || null;
                    const number = item.number || item['number-' + n] || null;
                    const alternate_contact_person = item.alternate_contact_person || item['alternate_contact_person-' + n] || null;
                    const hcw = item.hcw || item['hcw-' + n] || null;

                    return {
                        lname, fname, sex, age, relation_to_case, date: isDate(date) ? date.getTime() : date, place, address, number, alternate_contact_person, hcw
                    };
                });
            }

            if(reporting_action_del) {
                data.reporting_action_del = reporting_action_del;
            }
            if(reporting_action_coid) {
                data.reporting_action_coid = reporting_action_coid;
            }
            if(reporting_action_dmre) {
                data.reporting_action_dmre = reporting_action_dmre;
            }

            if(hospital_type) {
                data.hospital_type = hospital_type;
            }
            if(admission_date) {
                data.admission_date = admission_date.getTime();
            }
            if(illness_start_date){
                data.illness_start_date = illness_start_date.getTime();
            }
            if(illness_type){
                data.illness_type = illness_type;
            }
            if(illness_end_date){
                data.illness_end_date = illness_end_date.getTime();
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
            neonBinding.events.emit(this.path + "approve", this.item.id, data).then(res => {
                this.item.data.approved = true;
                onSaved && onSaved(this.item);
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            }).finally(() => {
                btn.text("Save").enabled();
            });
    }
    // </editor-fold>

    onLoadList() {
        return Promise.resolve(this.itemEmployee.list);
    }
    
    @computed
    get item() {
        return this.state.seletedItem;
    }

    get itemEmployee() {
        return this.props.state.item;
    }
    
    onChange(list, name, el) {
        this.state.seletedItem = list[0];
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Date Of Test</div>
            <div className="td fixed-flex min-w-100">Test Type</div>
            <div className="td fixed-flex min-w-120">Symptoms Positive</div>
            <div className="td fixed-flex min-w-140">No. of High Risk Contacts</div>
            <div className="td fixed-flex min-w-110">Vulnerability Status</div>
            <div className="td">Positive Test Result Action</div>
            <div className="td">Exposure Information</div>
            <div className="td fixed-flex padding-l-20 min-w-40"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(item, n){
        const {id, data: {
            created_at, employee, employee_id, business_id, date, sex, age, province, district, job_category,
            test_type, test_date, symptom_positive, 
            high_risk_contacts_num, high_risk_contacts_list,
            vulnerability_status, positive_test_result_action, exposure_info
        }} = item;
        return <React.Fragment key={id} className="tr-readonly">
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(test_date)}</div>
            <div className="td fixed-flex min-w-100">{test_type}</div>
            <div className="td fixed-flex min-w-120">{symptom_positive}</div>
            <div className="td fixed-flex min-w-140">{high_risk_contacts_num}</div>
            <div className="td fixed-flex min-w-110">{vulnerability_status}</div>
            <div className="td">{positive_test_result_action}</div>
            <div className="td">{exposure_info}</div>
        </React.Fragment>;
    }
    // </editor-fold>
    
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
        
        if(!this.item) {
            return <div className="controls-wrapper">
                <div className="controls">
                    <SelectTable ref="selectTable" replaceCols name="seletedItem" desc="Positive Cases" title="Select Positive Case" className="col-lg-12 no-padding SelectAssetTable" renderTHead={this.renderTHead} renderItem={this.renderItem} list={list} onLoadList={this.onLoadList} onChange={this.onChange}/>
                </div>
            </div>;
        }
        const {
            item, item: {
                id, data: {
                    created_at, 
                    client, project, site,
                    employee, employee_id, business_id, date, sex, age, province, district, industry, job_category,
                    test_type, test_date, symptom_positive, 
                    high_risk_contacts_num, high_risk_contacts_list,
                    vulnerability_status, positive_test_result_action, exposure_info,
                    
                    reporting_action_del, reporting_action_coid, reporting_action_dmre,
                    hospitalised, hospital_type, admission_date, outcome, outcome_date, return_to_work_date, return_to_work_fitness, compensation_claim, percentage_disablement, claim_ref_num,
                    illness_start_date, illness_type, illness_end_date
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
        
        const reporting_action_delDefault = reporting_action_del && {label: reporting_action_del, value: reporting_action_del};
        const reporting_action_coidDefault = reporting_action_coid && {label: reporting_action_coid, value: reporting_action_coid};
        const reporting_action_dmreDefault = {label: reporting_action_dmre, value: reporting_action_dmre};
        
        const {isConsultant, isHasProjects} = storage.is;
        
        const SelectSiteConfirmInputsStyle = {height: "auto"};
        return (<div className="controls-wrapper">
            {isHasProjects && <div className="controls SelectSiteConfirmInputs" style={SelectSiteConfirmInputsStyle}>
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
                <label>Positive Case Details</label>
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
                        <ClearableInput name="industry" type="select" defaultValue={industry} placeholder="Industry..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.industries} returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="job_category" type="select" defaultValue={job_categoryDefault} placeholder="Job Category..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="test_type" type="select" defaultValue={test_typeDefault} placeholder="Test Type..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.test_types} returnValue/>
                        <ClearableInput name="test_date" type="date" defaultValue={test_date && new Date(test_date)} placeholder="Date Of Test..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="symptom_positive" type="select" defaultValue={symptom_positiveDefault} placeholder="Symptoms Positive" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.symptoms_positive} returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="vulnerability_status" type="radio" defaultValue={vulnerability_status} placeholder="Vulnerability Status" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.vulnerability_status}/>
                        <ClearableInput name="positive_test_result_action" defaultValue={positive_test_result_actionDefault} type="select" placeholder="Positive Test Result Action..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.test_result_actions} returnValue/>
                        <ClearableInput name="exposure_info" type="select" defaultValue={exposure_infoDefault} placeholder="Exposure Information..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.exposure_info} returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="reporting_action_del" type="select" defaultValue={reporting_action_delDefault} placeholder="Reporting Action (DEL)..." desc="DEL = Department of Employment and Labour" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.reporting_action_del} returnValue/>
                        <ClearableInput name="reporting_action_coid" type="select" defaultValue={reporting_action_coidDefault} placeholder="Reporting Action (COID)..." desc="COID = Compensation for Occupational Injuries and Diseases" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.reporting_action_coid} returnValue/>
                        <ClearableInput name="reporting_action_dmre" type="select" defaultValue={reporting_action_dmreDefault} placeholder="Reporting Action (DMRE)..." desc="DMRE = Department of Mineral Resources and Energy" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.reporting_action_dmre} returnValue/>
                    </div>
               </div>
            </div>
            <div className="controls">
                <label>Contact Tracing</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="surname" type="text" placeholder="Surname" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="name" type="text" placeholder="Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="nicd_identifier" type="text" placeholder="NICD Identifier" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="symptom_date" type="date" placeholder="Date of Sysmptom..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="office_or_work_area" type="text" placeholder="Office / Area of Work" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="worker_major_routines" type="text" placeholder="Worker Major Routines" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="num_of_office_occupants" type="number" placeholder="Number of Office Occupants " required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="high_risk_contacts_num" type="number" defaultValue={high_risk_contacts_num} placeholder="Number of High Risk Contacts" required className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NewHighRiskContactsTable name="high_risk_contacts_list" state={this.state} list={high_risk_contacts_list} onChange={this.form.onChange}/>
               </div>
            </div>
            <div className="controls">
                <label>Forms</label>
                <div className="row">
                    <label className="hor-center">Attach Form(s)</label>
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <Button className="btn btn-primary hor-center margin-t-10" text="Add COID Form(s)" onClick={this.onAddWorkmansCompensationForms}/>
                        <hr />
                        <COIDForms state={this.state}/>
                    </div>
               </div>
            </div>
            <div className="controls">
                <label>Return To Work</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="hospitalised" type="radio" placeholder="Hospitalised" defaultValue={hospitalised} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.hospitalised}/>
                        <ClearableInput ref="hospital_type" name="hospital_type" type="select" defaultValue={hospital_type} placeholder="Hospital Type..." footerDesc='Fill this field only when "Hospitalised" is "Yes"' required isEditable={false} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.hospital_types} add returnValue/>
                        <ClearableInput ref="admission_date" name="admission_date" type="date" defaultValue={admission_date} placeholder="Date Of Admission..." footerDesc='Fill this field only when "Hospitalised" is "Yes"' required isEditable={false} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="outcome" type="radio" defaultValue={outcome} placeholder="Outcome" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.outcome}/>
                        <ClearableInput name="outcome_date" type="date" defaultValue={outcome_date} placeholder="Date Of Outcome..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="return_to_work_date" type="date" defaultValue={return_to_work_date} placeholder="Return To Work Date..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="return_to_work_fitness" type="select" defaultValue={return_to_work_fitness} placeholder="Return To Work Fitness..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.return_to_work_fitness} add returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="illness_start_date" type="date" defaultValue={illness_start_date} placeholder="Illness Start Date..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="illness_end_date" type="date" defaultValue={illness_end_date} placeholder="Illness End Date..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="illness_type" type="select" defaultValue={illness_type} placeholder="Illness Type..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.illness_type} add returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="compensation_claim" type="radio" defaultValue={compensation_claim} placeholder="Compensation Claim" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.compensation_claim}/>
                        <ClearableInput name="percentage_disablement" type="number" defaultValue={percentage_disablement} placeholder="% Disablement" desc="If it's 30%, type 30" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="claim_ref_num" type="text" defaultValue={claim_ref_num} placeholder="Claim Reference No." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="NewHighRiskContactsTable">
@observer
class NewHighRiskContactsTable extends ATableSavable {
    @observable
    selfState = {
        lists: {
        }
    };
    constructor(props) {
        super(props);
        
        this.state.list = this.props.list || [];//{fname, lname, number, date}
        
        const {onChange, name, insertAt} = props;
        onChange && onChange(toJS(this.list), name, this);
    }
    
    componentWillUpdate() {
        const {high_risk_contacts_num: num, high_risk_contacts_list} = this.props.state;
        if(num !== null && num > 0) {
            if(num !== this.state.list.length) {
                this.state.list.clear();
                for(let n = 0; n < num; n++) {
                    this.state.list.push(null);
                }
            }
        } else {
            this.state.list.clear();
        }
    }
    

    onClick(e, el) {
        const {onChange, name, insertAt} = this.props;
        const {list} = this.state;
        const {action, } = el.props;
        const idx = el.props.idx;
        if (action === "save") {
            //const data = window.toNoneNullObject(this.form);
            const elems = Object.keys(this.ctrl_refs).filter(key => {
                return key.startsWith(idx + '-') || key.endsWith('-' + idx);
            }).map(k => this.ctrl_refs[k]);
            const errors = elems.filter(node => !node.hasValue && node.props.required);
            if (!errors.isEmpty()) {
                errors.forEach(node => {
                    node.setError && node.setError();
                });
                alert("Fields highlighted red are required")
            } else {
                list[idx] = this.form;
                this.form = {};
            }
        } else if (action === "delete") {
//            list.removeAt(idx);
            list[idx] = null;
        }

        onChange && onChange(toJS(this.list), name, this);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
	if(item) {
            const lname = item.lname || item['lname-' + n];
            const fname = item.fname || item['fname-' + n];
            const sex = item.sex || item['sex-' + n];
            const age = item.age || item['age-' + n];
            const relation_to_case = item.relation_to_case || item['relation_to_case-' + n];
            const date = item.date || item['date-' + n];
            const place = item.place || item['place-' + n];
            const address = item.address || item['address-' + n];
            const number = item.number || item['number-' + n];
            const alternate_contact_person = item.alternate_contact_person || item['alternate_contact_person-' + n];
            const hcw = item.hcw || item['hcw-' + n];
            return <TRow key={"item-" + n} className="tr-readonly">
		<div className="td fixed-flex min-w-180"><span>{lname}</span></div>
		<div className="td fixed-flex min-w-180"><span>{fname}</span></div>
		<div className="td fixed-flex min-w-80"><span>{sex}</span></div>
		<div className="td fixed-flex min-w-80"><span>{age}</span></div>
		<div className="td fixed-flex min-w-200"><span>{relation_to_case}</span></div>
		<div className="td fixed-flex min-w-210"><span>{Dates.formatDate(date)}</span></div>
		<div className="td fixed-flex min-w-220"><span>{place}</span></div>
		<div className="td fixed-flex min-w-250"><span>{address}</span></div>
		<div className="td fixed-flex min-w-280"><span>{number}</span></div>
		<div className="td fixed-flex min-w-280"><span>{alternate_contact_person}</span></div>
		<div className="td fixed-flex min-w-230"><span>{hcw}</span></div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>
            </TRow>;
	} else {
            return <TRow key="item-new">
		<div className="td fixed-flex min-w-180">
                    <ClearableInput ref={this.onSetRef} name={"lname-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-180">
                    <ClearableInput ref={this.onSetRef} name={"fname-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-80">
                    <ClearableInput ref={this.onSetRef} name={"sex-" + n} type="text" placeholder="" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-80">
                    <ClearableInput ref={this.onSetRef} name={"age-" + n} type="text" placeholder="" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-200">
                    <ClearableInput ref={this.onSetRef} name={"relation_to_case-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-210">
                    <ClearableInput ref={this.onSetRef} name={"date-" + n} type="date" placeholder="Date..." required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-220">
                    <ClearableInput ref={this.onSetRef} name={"place-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-250">
                    <ClearableInput ref={this.onSetRef} name={"address-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-280">
                    <ClearableInput ref={this.onSetRef} name={"number-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-280">
                    <ClearableInput ref={this.onSetRef} name={"alternate_contact_person-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-230">
                    <ClearableInput ref={this.onSetRef} name={"hcw-" + n} type="text" placeholder="Type here" required isClearable={false} className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-60">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
		</div>
            </TRow>;
	}
    }

    render() {
        const {high_risk_contacts_num} = this.props.state;
        return (high_risk_contacts_num !== null && high_risk_contacts_num > 0) && <div className="NewHighRiskContactsTable row sec-group margin-t-10 padding-l-10 padding-r-10">
            <Table>
                <THead className="align-left">
                    <div className="td fixed-flex min-w-180">Surname</div>
                    <div className="td fixed-flex min-w-180">First Name</div>
                    <div className="td fixed-flex min-w-80">Sex</div>
                    <div className="td fixed-flex min-w-80">Age</div>
                    <div className="td fixed-flex min-w-200">Relation To Case</div>
                    <div className="td fixed-flex min-w-210">Date Of Last Contact With Case</div>
                    <div className="td fixed-flex min-w-220">Place Of Last Contact With Case (Provide Name and Address)</div>
                    <div className="td fixed-flex min-w-250">Residential Address (For Next Month)</div>
                    <div className="td fixed-flex min-w-280">Phone Numbers(s), separate by semicolon</div>
                    <div className="td fixed-flex min-w-280">Alternate Contact Person and Phone detail</div>
                    <div className="td fixed-flex min-w-230">HCW**? (Y/N) If Yes, Facility Name</div>
                    <div className="td fixed-flex padding-0 min-w-70"></div>
                </THead>
                <TBody ref="body" title="High Risk Contacts" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
                <p className="hor-center margin-t-10">Please confirm each <b>person</b> by clicking on <b><i className="fa fa-check btn btn-primary padding-5"/> button</b></p>
            </Table>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="COIDForms">
@observer
class COIDForms extends React.Component {

    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
    }
    
    onChange(val, name, el) {
        const {item} = el.props;
        if(val) {
            extendObservable(item, toJS(val));
        }
    }
    
    render() {
        const {workmans_compensation_forms: list} = this.props.state;
        return <React.Fragment>
            {list.isEmpty() && <p className="text-center">No forms to upload</p>}
            {list.map((item, n) => <PDFUploadButton item={item} name="doc" buttonTitle="Upload Form (PDF)" className="col-lg-6 margin-b-10 margin-r-10 min-h-400" onChange={this.onChange}/>)}
        </React.Fragment>;
    }
}
// </editor-fold>

export default NewDialog;
