// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import AControls from "./ANewCOVIDControls";
import {EmployeeDetailsPanel, NewScreeningQuestionsTable, ScreeningOutcome} from './ComponentsScreening';

import style from "./NewScreeningDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewScreeningDialog";
    title = "COVID Screening";

    constructor(props) {
        super(props, style);
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
    constructor(props) {
        super(props);
        
        this.form.addChangeOne("symptoms_status", this.onChangeSymptomsStatus.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeSymptomsStatus(el, val) {
        this.state.symptoms_status = val;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, showOnlyTable, refs:{newQuestionsTable}} = this;
        const {isConsultant, isHasProjects} = storage.is;

        if(!showOnlyTable) {
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
        
        const saveOnlyTable = () => {
            const employee = this.item;
            const {id, data: {
                    fname, lname, 
                    id_num, passport_num, sex, age, dob, optional_info,
                    client, project, site
                }
            } = employee;
            
            let business_id;
            if(optional_info) {
                const {employee_num, job_position} = optional_info;
                business_id = employee_num;
            }
            
            const {
                province, district, job_category,
                consent, signature, 
                outcome, symptoms_status
            } = form.data;
            const data = {
                employee: {id, fname, lname}, 
                employee_id: id_num || passport_num, 
                date: new Date().getTime(), 
                sex, age, 
                province, district, 
                job_category, 
                outcome, symptoms_status
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
            
            if(business_id) {
                data.business_id = business_id;
            }

            if(checklist) {
                data.checklist = checklist;
                data.checklist_total_score = newQuestionsTable.totalScore;
            }
            if(consent) {
                data.consent = consent;
            }
            if(signature) {
                console.log('signature', signature)
                data.signature = JSON.stringify(signature.slice());
            }
            
            return data;
        };
        
        const saveAll = () => {
            const {
                client, project, site,
                employee: {id, data: {fname, lname}}, 
                employee_id, consent, signature, business_id, date, sex, age, province, district, job_category, outcome, symptoms_status
            } = form.data;
            const data = {
                employee: {id, fname, lname}, employee_id, date: date.getTime(), sex, age, province, district, job_category, outcome, symptoms_status
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
            
            if(business_id) {
                data.business_id = business_id;
            }

            if(checklist) {
                data.checklist = checklist;
                data.checklist_total_score = newQuestionsTable.totalScore;
            }
            if(consent) {
                data.consent = consent;
            }
            if(signature) {
                console.log('signature', signature)
                data.signature = JSON.stringify(signature.slice());
            }
            
            return data;
        };
        
        const data = showOnlyTable ? saveOnlyTable() : saveAll();
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if(res) {
                onSaved && onSaved(res);
                if(showOnlyTable) {
                    infoDialog.open('Record successfully saved.');
                    this.props.close();
                } else {
                    confirmDialog.open(<React.Fragment>
                        <p>Record successfully saved.</p>
                        <p><b>Close Current Form?</b></p>
                    </React.Fragment>).then(res => {
                        if(res === 1) {
                            this.props.close();
                        }
                    });
                }
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {showOnlyTable} = this;
    
        const {isConsultant, isEmployee, isHasProjects} = storage.is;
        const date = new Date();
        
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            {!showOnlyTable && <Row 
                rendered 
                idx={idx++}
                title={idx + ". Employee Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." isEditable={!isEmployee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="employee_id" name="employee_id" type="text" placeholder="Employee ID" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="sex" name="sex" type="select" placeholder="Gender" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.genders} returnValue/>
                <ClearableInput ref="age" name="age" type="number" placeholder="Age (Years)" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
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
                <ClearableInput ref="province" name="province" type="select" placeholder="Province..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                <ClearableInput ref="district" name="district" type="select" placeholder="District..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>
                <ClearableInput ref="job_category" name="job_category" type="select" placeholder="Job Category..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
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
                    <ClearableInput name="date" type="date" placeholder="Screening Date..." defaultValue={new Date()} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="business_id" name="business_id" type="text" placeholder="Business ID" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <hr className="margin-0"/>
                </React.Fragment>}
                <NewScreeningQuestionsTable ref="newQuestionsTable" name="list" state={this.state} controls={this}/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Confirmation Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <ClearableInput name="symptoms_status" type="radio" placeholder="Symptoms Present" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.symptoms_status}/>
                <ScreeningOutcome state={this.state} onChange={this.form.onChange}/>
                <ClearableInput name="consent" type="checkbox" required className="col-lg-12 form-control" isClearable={false} onChange={this.form.onChange} values={this.state.lists.consent} returnValue/>
                <ClearableInput name="signature" type="signature" placeholder="Signature" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
//745