// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';
import {computed, extendObservable, isObservableArray, observable} from 'mobx';
import {ShouldUpdate} from '../../../../../utils/Utils';

import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import AControls from "./ANewCOVIDControls";
import {EmployeeDetailsPanel, NewScreeningQuestionsTable, ScreeningOutcome} from './ComponentsScreening';

import style from "./EditScreeningDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditScreeningDialog";

    constructor(props) {
        super(props, style);
    }
    
    title() {
        return "COVID Screening";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/COVID_Management/screening/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            consent: [{text: "I declare all the answers given herewith are true, correct and complete. I have not withheld any information.", value: "Yes", checked: false}],
            outcome: ["No Action Required", "Referred For Self-Isolation", "Referred For Testing", "Referred To The Doctor"],
            symptoms_status: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
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
        },
        symptoms_status: null,
        totalScore: null,
        employee: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form.addChangeOne("symptoms_status", this.onChangeSymptomsStatus.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="mounts">
    async componentWillMount() {
        if(this.item) {
            const {employee: {id}} = this.item.data;
            this.state.employee = await window.neonBinding.events.emit('plugin_sheq_assist/employees/find_by_id', id);
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeSymptomsStatus(el, val) {
        this.state.symptoms_status = val;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}, refs: {newQuestionsTable}} = this;
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
            infoDialog.open('Screening Date is required');
            return;
        }
//        if (!form.isValid('business_id')) {
//            infoDialog.open('Business ID is required');
//            return;
//        }
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
        
        const question_list = newQuestionsTable.list.filter(item => !!item.status);
        if (question_list.isEmpty()) {
            infoDialog.open('Answer all the questions');
            return;
        } 
        const question_list2 = newQuestionsTable.list.filter(item => !item.status);
        for(var n = 0; n < question_list2.length; n++){
            const item = question_list2[n];
            infoDialog.open('Provide answer for: ' + item.text);
            return;
        }
        for(var n = 0; n < question_list.length; n++){
                const item = question_list[n];
                if(item.key === 'temperature') {
                        if(isString(item.status) && item.status.isNumeric()) {
                            try{
                                item.status = parseFloat(item.status);
                            } catch(e) {
                                infoDialog.open('Temperature must be a number');
                                return;
                            }
                        } else if(!isNumber(item.status)) {
                            infoDialog.open('Temperature must be a number');
                            return;
                        }
                }
            }
            
        const checklist = question_list;
        
        if (!form.isValid('symptoms_status')) {
            infoDialog.open('Symptoms Present is required');
            return;
        }
        
        if (!form.isValid('outcome')) {
            infoDialog.open('Screening Outcome is required');
            return;
        }
        
        const {
            client, project, site,
            employee, 
            employee_id, consent, signature, business_id, date, sex, age, province, district, job_category, outcome, symptoms_status
        } = form.data;
        const data = {};
        
        if(isHasProjects){
            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);
        }
        
        ShouldUpdate.checkEmployee(data, old_data, employee, 'employee');
        ShouldUpdate.check(data, old_data, employee_id, 'employee_id');
        if(isObservableArray(consent)) {
            ShouldUpdate.check(data, old_data, consent[0].value, 'consent');
        }
        ShouldUpdate.checkSignature(data, old_data, signature, 'signature');
        ShouldUpdate.check(data, old_data, business_id, 'business_id');
        ShouldUpdate.checkDate(data, old_data, date, 'date');
        ShouldUpdate.check(data, old_data, sex, 'sex');
        ShouldUpdate.check(data, old_data, age, 'age');
        ShouldUpdate.check(data, old_data, province, 'province');
        ShouldUpdate.check(data, old_data, district, 'district');
        ShouldUpdate.check(data, old_data, job_category, 'job_category');
        ShouldUpdate.check(data, old_data, outcome, 'outcome');
        ShouldUpdate.check(data, old_data, symptoms_status, 'symptoms_status');
        ShouldUpdate.check(data, old_data, newQuestionsTable.totalScore, 'checklist_total_score');
        ShouldUpdate.checkListToJS(data, old_data, checklist, 'checklist');
        
//        if(checklist) {
//            data.checklist = checklist;
//            data.checklist_total_score = newQuestionsTable.totalScore;
//        }
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            extendObservable(old_data, data);
            onSaved && onSaved(res);
            confirmDialog.open(<React.Fragment>
                <p>Record successfully updated.</p>
                <p><b>Close Current Form?</b></p>
            </React.Fragment>).then(res => {
                if(res === 1) {
                    this.props.close();
                }
            });
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>

    @computed get employee() {
        return this.state.employee;
    }
    
    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item || !this.employee)
            return <div className="fixed-center">
            <CircularProgress/><br />Loading...
        </div>;
    
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {showOnlyTable} = this;
        
        const {
            item, item: {
                id, data: {
                    created_at,
                    employee, 
                    employee_id, date, sex, age, province, district, job_category, outcome, symptoms_status,
                    checklist,
                    consent, signature, business_id,
                    client, project, site
                }
            }
        } = this;
        
        const {isConsultant, isEmployee, isHasProjects} = storage.is;
        
        let idx = 0;
        return <FormControls>
            {isHasProjects && !showOnlyTable && <Row 
                rendered  
                active
                idx={idx}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            {!showOnlyTable && <Row 
                rendered 
                idx={idx++}
                title={idx + ". Employee Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." defaultValue={this.employee} isEditable={!isEmployee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="employee_id" name="employee_id" type="text" placeholder="Employee ID" defaultValue={employee_id} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="sex" name="sex" type="select" placeholder="Gender" defaultValue={sex} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.genders} returnValue/>
                <ClearableInput ref="age" name="age" type="number" placeholder="Age (Years)" defaultValue={age} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>}
            {showOnlyTable && <Row 
                rendered  
                active
                idx={idx++}
                title={idx + ". Employee Details"}
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <EmployeeDetailsPanel item={this.item}/>
            </Row>}
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Location & Job Category"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput ref="province" name="province" type="select" placeholder="Province..." defaultValue={province} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                <ClearableInput ref="district" name="district" type="select" placeholder="District..." defaultValue={district} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>
                <ClearableInput ref="job_category" name="job_category" type="select" placeholder="Job Category..." defaultValue={job_category} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Screening Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                {!showOnlyTable && <React.Fragment>
                    <ClearableInput name="date" type="date" placeholder="Screening Date..." defaultValue={date} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="business_id" name="business_id" type="text" placeholder="Business ID" defaultValue={business_id} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <hr className="margin-0"/>
                </React.Fragment>}
                <NewScreeningQuestionsTable ref="newQuestionsTable" name="list" state={this.state} defaultValue={checklist} controls={this}/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Confirmation Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <ClearableInput name="symptoms_status" type="radio" placeholder="Symptoms Present" defaultValue={symptoms_status} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.symptoms_status}/>
                <ScreeningOutcome state={this.state} defaultValue={outcome} onChange={this.form.onChange}/>
                <ClearableInput name="consent" type="checkbox" defaultValue={consent} required className="col-lg-12 form-control" isClearable={false} onChange={this.form.onChange} values={this.state.lists.consent} returnValue/>
                <ClearableInput name="signature" type="signature" defaultValue={signature} placeholder="Signature" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
//602