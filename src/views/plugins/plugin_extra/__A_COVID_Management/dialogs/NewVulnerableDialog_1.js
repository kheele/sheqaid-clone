// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen, SAIdUtils} from 'utils/Utils';
import {getGeocode} from 'utils/Maps';
import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import AControls from "./ANewCOVIDControls";

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

        this.form = new Form();
        this.onChangeEmployee = this.onChangeEmployee.bind(this);
        this.onChangeVulnerabilityStatus = this.onChangeVulnerabilityStatus.bind(this);
        this.form.addChangeOne("employee", this.onChangeEmployee);
        this.form.addChangeOne("vulnerability_status", this.onChangeVulnerabilityStatus);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        this.item && this.onChangeEmployee(null, this.item);
    }
    
    componentDidMount() {
        getGeocode().then(res => {
            const {city, district, region, country} = res;
            execWhen(() => this.refs.province).then(province_ref => {
                province_ref.onChange({label: region, value: region});
            });
            if(district) {
                execWhen(() => this.refs.district).then(district_ref => {
                    district_ref.onChange({label: district, value: district});
                });
            }
        }).catch(err => {
            console.error(err)
        });
        execWhen(() => !!this.refs.employee && !!this.refs.employee_id).then(() => {
            if(this.item) {
                const {employee: employee_ref} = this.refs;
                const {data: {fname, lname}} = this.item;
                employee_ref.onChange({label: fname + ' ' + lname, value: this.item});
            }
        });
        execWhen(() => this.refs.business_id).then(business_id_ref => {
            const {selectedClientCovidBusinessId: businessId} = storage.selected;
            if(!businessId) {
                if(storage.is.isConsultant) {
                    infoDialog.open(<React.Fragment>
                        <p>The selected company does not have <b>Business ID</b></p>
                        <p>Please add Business ID</p>
                    </React.Fragment>);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>The company does not have <b>Business ID</b></p>
                        <p>Please add Business ID</p>
                    </React.Fragment>);
                }
                return;
            }
            business_id_ref.onChange(businessId);
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeEmployee(el, val) {
        this.state.employee = val;
        execWhen(() => !!this.refs.employee_id).then(() => {
            const {
                employee_id: employee_id_ref, 
                sex: sex_ref, age: age_ref, 
                job_category: job_category_ref
            } = this.refs;
            if(val) {
                let {id_num, passport_num, sex, age, dob, optional_info} = val.data;
                employee_id_ref.onChange(id_num || passport_num);
                if(id_num) {
                    sex = sex || SAIdUtils.getGender(id_num);
                    age = SAIdUtils.getAge(id_num);
                }
                if(!age && dob) {
                    age = SAIdUtils.getAgeFromDate(dob);
                }
                sex && sex_ref.onChange({label: sex, value: sex});
                age && age_ref.onChange(age);
                if(optional_info) {
                    const {job_position} = optional_info;
                    job_position && job_category_ref.onChange({label: job_position.name, value: job_position});
                }
            } else {
                employee_id_ref.reset();
                sex_ref.reset();
                age_ref.reset();
            }
        });
    }

    onChangeVulnerabilityStatus(el, val) {
        this.state.vulnerability_status = val;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, refs:{newQuestionsTable}} = this;
        const {isConsultant} = storage.is;

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
        const {isConsultant} = storage.is;
        return (<div className="controls-wrapper">
            <div className="controls SelectSiteConfirmInputs" style={{height: "auto"}}>
                <label>Location</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                        <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
            <div className="controls -margin-t-10 padding-t-0">
                <label>Vulnerability Case Details</label>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="employee_id" name="employee_id" type="text" placeholder="Employee ID" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput name="date" type="date" placeholder="Date..." defaultValue={new Date()} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="business_id" name="business_id" type="text" placeholder="Business ID" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput ref="sex" name="sex" type="select" placeholder="Gender" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.genders} returnValue/>
                        <ClearableInput ref="age" name="age" type="number" placeholder="Age (Years)" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput ref="province" name="province" type="select" placeholder="Province..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                        <ClearableInput ref="district" name="district" type="select" placeholder="District..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>
                        <ClearableInput name="industry" type="select" placeholder="Industry..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.industries} returnValue/>
                    </div>
               </div>
                <div className="row">
                    <div className="row sec-group padding-l-10 padding-r-10">
                        <ClearableInput ref="job_category" name="job_category" type="select" placeholder="Job Category..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.job_categories} add returnValue/>
                        <ClearableInput name="vulnerability_status" type="radio" placeholder="Vulnerability Status" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.vulnerability_status}/>
                    </div>
               </div>
                <NewQuestionsTable ref="newQuestionsTable" name="list" state={this.state}/>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="NewQuestionsTable">
@observer
class NewQuestionsTable extends ATableSavable {
    @observable
    selfState = {
        lists: {},
    };
	
    constructor(props) {
        super(props);
        
        this.state.list = [
            {text: "Asthma", status: "Unknown"},
            {text: "Chronic Lung Disease", status: "Unknown"},
            {text: "Diabetes", status: "Unknown"},
            {text: "Hypertension", status: "Unknown"},
            {text: "Serious Heart Conditions", status: "Unknown"},
            {text: "Chronic Kidney Disease", status: "Unknown"},
            {text: "Chronic Liver Disease", status: "Unknown"},
            {text: "Immunocompromised", status: "Unknown"},
            {text: "Previous Tuberculosis", status: "Unknown"},
            {text: "Current Tuberculosis", status: "Unknown"},
            {text: "HIV", status: "Unknown"},
            //Risk Factors
            {text: "Age => 60 years", status: "Unknown"},
            {text: "Smoking current", status: "Unknown"},
            {text: "Pregnancy => 28 weeks", status: "Unknown"},
            {text: "Obesity", status: "Unknown"},
            
            {text: "Received Flu Vaccine", status: "Unknown"}
	];
        
        this.onChange = this.onChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
	
    onChange(val, name, el) {
        const idx = el.props.idx;
        const item = this.state.list[idx];
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item.status = val;
        } else if (isNullable(val)) {
            item.status = "Unknown";
        }
        
    }
	
    renderItem(n, onClick) {
        const item = this.state.list[n];
	const name = "item_" + n;
        this.selfState.lists[n] = [
            {value: "Yes", text: "Yes", checked: false}, 
            {value: "No", text: "No", checked: false},
            {text: "Unknown", value: "Unknown", checked: false}
        ];
        const options = this.selfState.lists[n];
	return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td td-question">
                <h6 className="no-margin pull-left">{item.text}</h6>
            </div>
            <div className="td fixed-flex padding-l-0 min-w-240">
		<ClearableInput ref={this.onSetRef} name={name} type="radio" isClearable={false} className="form-control" idx={n} onChange={this.onChange} values={options}/>
            </div>
	</TRow>;
    }

    render() {
        const {vulnerability_status} = this.props.state;
        if(vulnerability_status !== "Yes") return null;
        return <div className="row">
            <label className="text-center">Comordibidity Details</label>
            <Table>
                <THead className="align-left">
                    <div className="td"></div>
                    <div className="td fixed-flex min-w-240 no-padding"></div>
                </THead>
                <TBody ref="body" title="Question" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            </Table>
        </div>;
    }
}
// </editor-fold>

export default NewDialog;
