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
import {EmployeeDetailsPanel, NewVulnerableQuestionsTable} from './ComponentsScreening';

import style from "./NewVulnerableDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewVulnerableDialog";
    title = "Vulnerable Case";

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
    path = "plugin_sheq_assist/COVID_Management/vulnerable/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            consent: [{text: "I declare all the answers given herewith are true, correct and complete. I have not withheld any information.", value: "Yes", checked: false}],
            vulnerability_status: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
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
        vulnerability_status: null,
        employee: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form.addChangeOne("vulnerability_status", this.onChangeVulnerabilityStatus.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeVulnerabilityStatus(el, val) {
        this.state.vulnerability_status = val;
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
        if (!form.isValid('industry')) {
            infoDialog.open('Industry is required');
            return;
        }
        if (!form.isValid('job_category')) {
            infoDialog.open('Job Category is required');
            return;
        }
        if (!form.isValid('vulnerability_status')) {
            infoDialog.open('Vulnerability Status is required');
            return;
        }
        
        let checklist;
        if(form.get('vulnerability_status') === "Yes") {
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

            checklist = question_list;
        }
        
        const {
            client, project, site,
            employee: {id, data: {fname, lname}}, 
            employee_id, business_id, date, sex, age, province, district, industry, job_category, vulnerability_status
        } = form.data;
        const data = {
            employee: {id, fname, lname}, employee_id, date: date.getTime(), sex, age, province, district, industry, job_category, vulnerability_status
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
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            confirmDialog.open(<React.Fragment>
                <p>Record successfully saved.</p>
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

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {showOnlyTable} = this;
    
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
                title={idx + ". Location, Job Category & Industry"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >        
                <ClearableInput ref="province" name="province" type="select" placeholder="Province..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                <ClearableInput ref="district" name="district" type="select" placeholder="District..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>
                <ClearableInput ref="job_category" name="job_category" type="select" placeholder="Job Category..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
                <ClearableInput name="industry" type="select" placeholder="Industry..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.industries} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Vulnerability Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                {!showOnlyTable && <React.Fragment>
                    <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={new Date()} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="business_id" name="business_id" type="text" placeholder="Business ID" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <hr className="margin-0 margin-b-5 pull-left"/>
                </React.Fragment>}
                <ClearableInput name="vulnerability_status" type="radio" placeholder="Vulnerability Status" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.vulnerability_status}/>
                <hr className="margin-0"/>
                <NewVulnerableQuestionsTable ref="newQuestionsTable" name="list" state={this.state}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
