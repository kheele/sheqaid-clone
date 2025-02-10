// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';
import {computed, extendObservable, observable, toJS} from 'mobx';
import {ShouldUpdate} from 'utils/Utils';

import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import AControls from "./ANewCOVIDControls";
import {EmployeeDetailsPanel, NewHighRiskContactsTable} from './ComponentsScreening';

import style from "./EditPositiveDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPositiveDialog";

    constructor(props) {
        super(props, style);
    }
    
    title() {
        return "Positive Case";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/COVID_Management/positive/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            test_types: ["PCR", "Antigen", "Antibody", "Unknown"],
            symptoms_positive: ["Yes", "No"],
            test_result_actions: ['Sick Leave', 'Self-Isolation at home', 'Isolation at quarantine site', 'Hospitalisation'],
            vulnerability_status: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
            exposure_info: ['Work contacts', 'Community contacts', 'Family contacts', 'Large events contacts', 'Travel history from a designated hotspot', 'Public transport', 'Unknown'],
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
        employee: null,
        high_risk_contacts_num: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form.addChangeOne("high_risk_contacts_num", this.onChangeHighRiskContactsNum.bind(this));
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
    onChangeHighRiskContactsNum(el, val) {
        this.state.high_risk_contacts_num = val;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}, refs: {newQuestionsTable}} = this;
        const {isConsultant, hasProjects} = storage.is;

        
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
        if (!form.isValid('vulnerability_status')) {
            infoDialog.open('Vulnerability Present is required');
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
        
        const {
            client, project, site,
            employee, 
            employee_id, business_id, date, sex, age, province, district, industry, job_category, 
            test_type, test_date, symptom_positive, 
            high_risk_contacts_num, high_risk_contacts_list,
            vulnerability_status, positive_test_result_action, exposure_info
        } = form.data;
        const data = {};
        
        if(hasProjects){
            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);
        }
        
        ShouldUpdate.checkEmployee_deprecated(data, old_data, employee, 'employee');
        ShouldUpdate.check(data, old_data, employee_id, 'employee_id');
        ShouldUpdate.check(data, old_data, business_id, 'business_id');
        ShouldUpdate.checkDate_deprecated(data, old_data, date, 'date');
        ShouldUpdate.check(data, old_data, sex, 'sex');
        ShouldUpdate.check(data, old_data, age, 'age');
        ShouldUpdate.check(data, old_data, province, 'province');
        ShouldUpdate.check(data, old_data, district, 'district');
        ShouldUpdate.check(data, old_data, industry, 'industry');
        ShouldUpdate.check(data, old_data, job_category, 'job_category');
        ShouldUpdate.check(data, old_data, test_type, 'test_type');
        ShouldUpdate.checkDate_deprecated(data, old_data, test_date, 'test_date');
        ShouldUpdate.check(data, old_data, symptom_positive, 'symptom_positive');
        ShouldUpdate.check(data, old_data, high_risk_contacts_num, 'high_risk_contacts_num');
        
        if(high_risk_contacts_list) {
            const __high_risk_contacts_list = toJS(high_risk_contacts_list.map(({fname, lname, number, date}) => {
                return {
                    fname, lname, number, date: isNumber(date) ? date : date.getTime()
                };
            }));
            ShouldUpdate.checkListToJS(data, old_data, __high_risk_contacts_list, 'high_risk_contacts_list');
        }
        ShouldUpdate.check(data, old_data, vulnerability_status, 'vulnerability_status');
        ShouldUpdate.check(data, old_data, positive_test_result_action, 'positive_test_result_action');
        ShouldUpdate.check(data, old_data, exposure_info, 'exposure_info');
                
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
                    business_id, employee_id, sex, age, date, province, district, industry, job_category,
                    test_type, test_date, symptom_positive, high_risk_contacts_num, high_risk_contacts_list = [],
                    vulnerability_status, positive_test_result_action, exposure_info,
                    reporting_action_del, reporting_action_coid, reporting_action_dmre,
                    client, project, site
                }
            }
        } = this;
        
        const {isConsultant, hasProjects} = storage.is;
        
        let idx = 0;
        return <FormControls>
            {hasProjects && !showOnlyTable && <Row
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
                <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." defaultValue={this.employee} className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                title={idx + ". Location, Job Category & Industry"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput ref="province" name="province" type="select" placeholder="Province..." defaultValue={province} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                <ClearableInput ref="district" name="district" type="select" placeholder="District..." defaultValue={district} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>
                <ClearableInput ref="job_category" name="job_category" type="select" placeholder="Job Category..." defaultValue={job_category} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
                <ClearableInput name="industry" type="select" placeholder="Industry..." defaultValue={industry} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.industries} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Positive Case Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                {!showOnlyTable && <React.Fragment>
                    <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={date} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="business_id" name="business_id" type="text" placeholder="Business ID" defaultValue={business_id} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <hr className="margin-0"/>
                </React.Fragment>}
                <ClearableInput name="test_type" type="select" placeholder="Test Type..." defaultValue={test_type} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.test_types} returnValue/>
                <ClearableInput name="test_date" type="date" placeholder="Date Of Test..." defaultValue={test_date} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="symptom_positive" type="select" placeholder="Symptom Positive..." defaultValue={symptom_positive} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.symptoms_positive} returnValue/>
                <ClearableInput name="vulnerability_status" type="radio" placeholder="Vulnerability Present" defaultValue={vulnerability_status} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.vulnerability_status}/>
                <ClearableInput name="positive_test_result_action" type="select" placeholder="Positive Test Result Action..." defaultValue={positive_test_result_action} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.test_result_actions} returnValue/>
                <ClearableInput name="exposure_info" type="select" placeholder="Exposure Information..." defaultValue={exposure_info} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.exposure_info} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". High Risk Contacts Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <ClearableInput name="high_risk_contacts_num" type="number" placeholder="Number of High Risk Contacts" defaultValue={high_risk_contacts_num || 0} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <hr className="margin-0"/>
                <NewHighRiskContactsTable name="high_risk_contacts_list" state={this.state} defaultValue={[...high_risk_contacts_list, null]} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
