// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, SAIdUtils, setDefaultVal, ShouldUpdate} from 'utils/Utils';
import {getGeocode} from 'utils/Maps';

import {
    ClearableInput,
    DateRangeInput,
    PDFUploadButton,
    SelectEmployeeInput,
    SelectJobPositionInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {EarningsTable} from '../../dialogs/ClaimForms';

import style from "./NewWCL2Dialog.lazy.css";
import updateClaimsClient from "../../../../../mutations/all/COIDA/ClaimsClient/updateClaimsClient";
import updateWCL2 from "../../../../../mutations/all/COIDA/WCL2/updateWCL2";
import insertAnnexture1 from "../../../../../mutations/all/COIDA/Annexture1/insertAnnexture1";
import insertWCL2 from "../../../../../mutations/all/COIDA/WCL2/insertWCL2";
import findByIdWCL5 from "../../../../../mutations/all/COIDA/WCL5/findByIdWCL5";
import findByIdWCL2 from "../../../../../mutations/all/COIDA/WCL2/findByIdWCL2";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewWCL2Dialog extends ANewDialog {
    pageKey = "NewWCL2Dialog";
    title = "Create/Edit W.CI.2";

    constructor(props) {
        super(props, style);
    }

    //<editor-fold desc="convert_data">
    convert_data(_formData) {
        const {
            //
            totalFieldCount,
            totalFieldMax,

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
//            employee,
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
        } = _formData;

        return {
            totalFieldCount,
            totalFieldMax,
            //1. Employer Details
            company_name,
            company_reg_num,
            company_contact_person_id: company_contact_person && company_contact_person.id ? company_contact_person.id : null,
            company_contact_person_other: company_contact_person && !company_contact_person.id ? {data: company_contact_person} : null,
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
//            employee,
            doc_certified_id: doc_certified_id && doc_certified_id.path,
            id_num,
            dob: Dates.formatDateSQL(dob),
            gender,
            marital_status,
            citizen_of,
            personnel_num,
            occupation_id: occupation && occupation.id,
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
            accident_date: Dates.formatDateSQL(accident_date),
            accident_time,
            incident_place,
            incident_place_province_id: incident_place_province && incident_place_province.id,
            incident_place_district,
            accident_date_reported: Dates.formatDateSQL(accident_date_reported),
            accident_time_reported,
            task_employee_performing_during_accident,
            period_experience_task_performed_years,
            period_experience_task_performed_months,
            employee_action_connected_business,
            accident_desc,
            traffic_accident_on_public_road,
            nature_of_injury_list: nature_of_injury_list && nature_of_injury_list.slice(),
            nature_of_injury_options: nature_of_injury_options && nature_of_injury_options.slice(),
            employee_injured_explanation_satisfactory,
            employee_injured_explanation_satisfactory_nope_desc,

            //4. Further Particulars Of Employee
            doc_salary_slip: doc_salary_slip && doc_salary_slip.path,
            earning_list: earning_list && earning_list.slice(),
            prepared_further_payments_after_3_months_4rm_accident_date,
            total_amount_already_paid,
            period_payments_made_range_date_from: period_payments_made_range && Dates.formatDateSQL(period_payments_made_range.start),
            period_payments_made_range_date_to: period_payments_made_range && Dates.formatDateSQL(period_payments_made_range.end),
            num_of_week_days_worked_by_employee,
            date_ceased_work: Dates.formatDateSQL(date_ceased_work),
            time_ceased_work,
            did_employee_complete_shift_on_date_work_ceased,
            date_resumed_work: Dates.formatDateSQL(date_resumed_work),
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
            involved_vehicle_reg_numbers: involved_vehicle_reg_numbers && involved_vehicle_reg_numbers.slice(),
            contributing_factor_list_A: contributing_factor_list_A && contributing_factor_list_A.slice(),
            contributing_factor_list_B: contributing_factor_list_B && contributing_factor_list_B.slice(),
            other_machinery_list: other_machinery_list && other_machinery_list.slice(),
            other_contributing_factor_list: other_contributing_factor_list && other_contributing_factor_list.slice(),
            additional_details_or_comments,

            //6. Employer's Declaration
            employer_signature: employer_signature && toJS(employer_signature),
            employer_signature_name,
            employer_signature_date: Dates.formatDateSQL(employer_signature_date)
        };
    }

    //</editor-fold>

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            company_employee_association: ["Working Director", "Working Member Of A CC", "Owner Of", "Partner In The Business", "Not Applicable"].map(text => {
                return {value: text, text, checked: false};
            }),
            genders: ["Male", "Female"],
            marital_status: ["Married", "Single"],
            expected_disablement_period: ["0-13 days", "14 & more"].map(text => {
                return {value: text, text, checked: false};
            }),

            incident_source: ['New', 'Existing'].map(text => {
                text += ' Incident';
                return {value: text, text, checked: false};
            }),
            employee_action_connected_business: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            traffic_accident_on_public_road: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            provinces: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'],
            districts: [
                "Alfred Nzo", "Amajuba", "Amathole", "Bojanala", "Buffalo City", "Cape Winelands", "Capricon", "Central Karoo", "Chris Hani",
                "City of Cape Town", "City of Johannesburg", "City of Tshwane", "Dr Kenneth Kaunda", "Dr Ruth Segomotsi Mompati", "Ehlazeni", "Ekurhuleni",
                "eThekwini", "Fezile Dabi", "Frances Baard", "Garden Route", "Gert Sibande", "Harry Gwala", "iLembe", "Joe Gqabi", "John Taolo Gaetsewe",
                "King Centshwayo", "Lejweleputswa", "Mangaung", "Mopani", "Namakwa", "Nelson Mandela Bay", "Ngaka Modiri Molema", "Nkangala", "OR Tambo",
                "Overberg", "Pixley ka Seme", "Sarah Baartman", "Sedibeng", "Sekhukhune", "Thabo Mofutsanyane", "Ugu", "Umgungundlovu", "Umkhanyakude",
                "Umzinyathi", "Uthukela", "Vhembe", "Waterberg", "West Coast", "West rand", "Xhariep", "ZF Mgcawu", "Zululand"
            ],
            injury_disease: ['Fatal', 'Injury'],
            injury_type: [],
            nature_of_injury_list: [
                "Abrasions", "Amputation", "Asphyxiation", "Burns (Chemical Burns)", "Burns (Hot Liquids)", "Burns (Hot Surfaces)",
                "Contusion (Bruises)", "Electrical Shock", "Foreign Object In Eye", "Fracture", "Incision (Knives / Glass Cuts)", "Lacerations (Ragged Etched Wounds)",
                "No Visible Injury", "Poisoning", "Puncture Wound", "Snake Spitting", "Snake Bite", "Sprains", "Strain", "Unconscious",
                "Other Injuries (Specify)"
            ],
            nature_of_injury_options: ['Killed', 'Amputation', 'Unconsciousness'].map(text => {
                return {value: text, text, checked: false};
            }),
            employee_injured_explanation_satisfactory: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            prepared_further_payments_after_3_months_4rm_accident_date: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            did_employee_complete_shift_on_date_work_ceased: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            was_1st_aid_given: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            was_accidnt_caused_by_employee_options_1: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            was_accidnt_caused_by_employee_options_2: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            was_accidnt_caused_by_employee_options_3: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            involved_vehicle_reg_numbers: [],
            contributing_factor_list_A: [
                'Defective plant',
                'Defective machinery',
                'Unfavourable conditions of work',
                'Fault of employer',
                'Fault of injured employee',
                'Fault of supervisor'
            ],
            contributing_factor_list_B: [
                'Railway', 'Building work', 'Electricity', 'Chemicals', 'Poisoning', 'Burns',
                'Explosions', 'Rotating machine', 'Press/Rollers', 'Woodworking machine', 'Lifting machine', 'Hand tools'
            ],
            other_machinery_list: [],
            other_contributing_factor_list: []
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
        dialog.setTitle(this.item ? 'Edit W.CI.2' : 'Create W.CI.2');

        const employer_details = dialog.extraProp('employer_details');
        const employee = dialog.extraProp('employee');
        const claim_number = dialog.extraProp('claim_number');
        const accident_date = dialog.extraProp('accident_date');

        //1. General Details
        setDefaultValue('claim_number', () => claim_number);
        setDefaultValue('accident_date', () => accident_date);

        //1. Employer Details
        if (employer_details) {
            const {data: {company_name}} = employer_details;
            setDefaultValue('company_name', (v) => v || company_name);
        } else {
            setDefaultValue('company_name');
        }

        //2. Employee Details
        setDefaultValue('employee', () => {
            if (!employee) return false;
            const {lname, fname, data} = employee;
            return {label: `${lname || data.lname} ${fname || data.fname}`, value: employee};
        });
        setDefaultValue('id_num', (id_num) => id_num || (employee && employee.data && employee.data.id_num));
        setDefaultValue('dob', (dob) => dob || (employee && employee.data && employee.data.dob));
        setDefaultValue('gender', (gender) => gender || (employee && employee.data && employee.data.gender));
        setDefaultValue('occupation', v => {
            v = v || (employee && employee.data && employee.data.job_position);
            if (!v) return false;
            return {label: `${v.name}`, value: v};
        });

        const setEmployerDetails = employer_details => {
            console.log('employer_details', employer_details)
            const {
                data: {
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
                    company_nature
                }
            } = employer_details;

            setDefaultValue('company_reg_num', (v) => v || company_reg_num);
            setDefaultValue('company_contact_person', (v) => {
                v = v || company_contact_person;
                if (!v) return false;
                const {lname, fname, data} = v;
                return {label: `${lname || data.lname} ${fname || data.fname}`, value: v};
            });
            setDefaultValue('company_str_addr', (v) => v || company_str_addr);
            setDefaultValue('company_str_addr_code', (v) => v || company_str_addr_code);
            setDefaultValue('company_postal_addr', (v) => v || company_postal_addr);
            setDefaultValue('company_postal_addr_code', (v) => v || company_postal_addr_code);
            setDefaultValue('company_tel_code', (v) => v || company_tel_code);
            setDefaultValue('company_tel_num', (v) => v || company_tel_num);
            setDefaultValue('company_fax_code', (v) => v || company_fax_code);
            setDefaultValue('company_fax_num', (v) => v || company_fax_num);
            setDefaultValue('company_email', (v) => v || company_email);
            setDefaultValue('company_location', (v) => v || company_location);
            setDefaultValue('company_nature', (v) => v || company_nature);
        };

        if (this.item) {
            this.item.earning_list = [{idx: 3, desc: "a) Bonuses (i.e. 13th cheque)", weekly: 4, monthly: 12}];
            //1. Employer Details
            if (employer_details) {
                setEmployerDetails(employer_details);
            } else {
                setDefaultValue('company_reg_num');
                setDefaultValue('company_contact_person', (v) => {
                    if (!v) return false;
                    const {lname, fname, data} = v;
                    return {label: `${lname || data.lname} ${fname || data.fname}`, value: v};
                });
                setDefaultValue('company_str_addr');
                setDefaultValue('company_str_addr_code');
                setDefaultValue('company_postal_addr');
                setDefaultValue('company_postal_addr_code');
                setDefaultValue('company_tel_code');
                setDefaultValue('company_tel_num');
                setDefaultValue('company_fax_code');
                setDefaultValue('company_fax_num');
                setDefaultValue('company_email');
                setDefaultValue('company_location');
                setDefaultValue('company_nature');
            }

            //2. Employee Details
            setDefaultValue('company_employee_association', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('doc_certified_id');
            setDefaultValue('marital_status');
            setDefaultValue('citizen_of');
            setDefaultValue('personnel_num');
            setDefaultValue('employee_str_addr');
            setDefaultValue('employee_str_addr_code');
            setDefaultValue('employee_postal_addr');
            setDefaultValue('employee_postal_addr_code');
            setDefaultValue('employee_tel_code');
            setDefaultValue('employee_tel_num');
            setDefaultValue('period_employ_years');
            setDefaultValue('period_employ_months');
            setDefaultValue('expected_disablement_period', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });

            //3. Accident Details
//            setDefaultValue('incident_source');
//            setDefaultValue('incident');
            setDefaultValue('accident_date');
            setDefaultValue('accident_time');
            setDefaultValue('incident_place');

            getGeocode().then(res => {
                const {city, district, region, country} = res;
                // setDefaultValue('incident_place_province', value => {
                //     value = value || region;
                //     return {label: value, value};
                // });
                if (district) {
                    setDefaultValue('incident_place_district', value => {
                        value = value || region;
                        return {label: value, value};
                    });
                }
            }).catch(err => {
                setDefaultValue('incident_place_province');
                setDefaultValue('incident_place_district');
                console.error(err)
            });

            setDefaultValue('accident_date_reported');
            setDefaultValue('accident_time_reported');
            setDefaultValue('task_employee_performing_during_accident');
            setDefaultValue('period_experience_task_performed_years');
            setDefaultValue('period_experience_task_performed_months');
            setDefaultValue('employee_action_connected_business', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('accident_desc');
            setDefaultValue('traffic_accident_on_public_road', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('nature_of_injury_list');
            setDefaultValue('nature_of_injury_options');
            setDefaultValue('employee_injured_explanation_satisfactory', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('employee_injured_explanation_satisfactory_nope_desc');

            //4. Further Particulars Of Employee
            setDefaultValue('doc_salary_slip');
            setDefaultValue('earning_list');
            setDefaultValue('prepared_further_payments_after_3_months_4rm_accident_date', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('total_amount_already_paid');
            setDefaultValue('period_payments_made_range');
            setDefaultValue('num_of_week_days_worked_by_employee');
            setDefaultValue('date_ceased_work');
            setDefaultValue('time_ceased_work');
            setDefaultValue('did_employee_complete_shift_on_date_work_ceased', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('date_resumed_work');
            setDefaultValue('time_resumed_work');
            setDefaultValue('dependant_name');
            setDefaultValue('dependant_address');

            //5. Further Particulars
            setDefaultValue('previously_received_compensation_full_names');
            setDefaultValue('was_1st_aid_given', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('medical_practitioner_or_chiropractor_who_treated_employee');
            setDefaultValue('hospital_which_treated_employee');
            setDefaultValue('was_accidnt_caused_by_employee_options_1', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('was_accidnt_caused_by_employee_options_2', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('was_accidnt_caused_by_employee_options_3', (val) => {
                if (!val) return false;
                return {text: val, value: val, checked: true};
            });
            setDefaultValue('accident_witness');
            setDefaultValue('accident_aware_person');
            setDefaultValue('num_of_employees_involved_in_accident');
            setDefaultValue('accident_police_station');
            setDefaultValue('accident_docket_num');
            setDefaultValue('involved_vehicle_reg_numbers');
            setDefaultValue('contributing_factor_list_A');
            setDefaultValue('contributing_factor_list_B');
            setDefaultValue('other_machinery_list');
            setDefaultValue('other_contributing_factor_list');
            setDefaultValue('additional_details_or_comments');

            //6. Employer's Declaration
            setDefaultValue('employer_signature');
            setDefaultValue('employer_signature_name');
            setDefaultValue('employer_signature_date');
        } else {
            if (employer_details) {
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
        execWhen(() => !!this.refs.gender && !!this.refs.occupation && !!this.refs.doc_certified_id).then(() => {
            const {
                gender: gender_ref,
                occupation: occupation_ref,
                doc_certified_id: doc_certified_id_ref
            } = this.refs;
            if (val) {
                let {id_num, sex, optional_info} = val.data;
                if (id_num) {
                    sex = sex || SAIdUtils.getGender(id_num);
                }
                sex && gender_ref.onChange({label: sex, value: sex});
                if (optional_info) {
                    const {job_position} = optional_info;
                    job_position && (occupation_ref.value = {label: job_position.name, value: job_position});
                }
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {

        }
        if (idx === 2) {

        }
        if (idx === 3) {

        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNew, claim, convert_data, totalFieldCount, totalFieldMax} = this;

        const {
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
//            employee,
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
        } = form.data;

        if (isNew) {
            const data = {...form.data, totalFieldCount, totalFieldMax};
            console.log("res", data)

            if (claim && claim.id) {
                btn.text("Saving...").disabled();
                progressDialog.open();
                insertWCL2(convert_data(data)).then(res => {
                    if(res) {
                        return updateClaimsClient({id: claim.id, wcl_2_id: res.id}).then(_ => res)
                    }
                }).
                then(res => res && findByIdWCL2(res.id)).
                then(res => {
                    console.log("res", res)
                    if(!res) {
                        return infoDialog.open("Record couldn't be updated. Please try again.");
                    }

                    onSaved && onSaved(res.data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    this.props.close();
                }).finally(() => {
                    btn.text("Save").enabled();
                    setTimeout(() => progressDialog.close())
                });
            } else {
                onSaved(data);
                this.props.close();
            }
        } else {
            const {data: old_data} = this.item;
            const data = {};

            //1. Employer Details
            ShouldUpdate.check(data, old_data, company_name, 'company_name');
            ShouldUpdate.check(data, old_data, company_reg_num, 'company_reg_num');
            ShouldUpdate.checkEmployee(data, old_data, company_contact_person, 'company_contact_person');
            ShouldUpdate.check(data, old_data, company_str_addr, 'company_str_addr');
            ShouldUpdate.check(data, old_data, company_str_addr_code, 'company_str_addr_code');
            ShouldUpdate.check(data, old_data, company_postal_addr, 'company_postal_addr');
            ShouldUpdate.check(data, old_data, company_postal_addr_code, 'company_postal_addr_code');
            ShouldUpdate.check(data, old_data, company_tel_code, 'company_tel_code');
            ShouldUpdate.check(data, old_data, company_tel_num, 'company_tel_num');
            ShouldUpdate.check(data, old_data, company_fax_code, 'company_fax_code');
            ShouldUpdate.check(data, old_data, company_fax_num, 'company_fax_num');
            ShouldUpdate.check(data, old_data, company_email, 'company_email');
            ShouldUpdate.check(data, old_data, company_location, 'company_location');
            ShouldUpdate.check(data, old_data, company_nature, 'company_nature');

            //2. Employee Details
            ShouldUpdate.check(data, old_data, company_employee_association, 'company_employee_association');
//            ShouldUpdate.check(data, old_data, employee, 'employee');
            ShouldUpdate.checkFile(data, old_data, doc_certified_id, 'doc_certified_id');
            ShouldUpdate.check(data, old_data, id_num, 'id_num');
            ShouldUpdate.checkDate(data, old_data, dob, 'dob');
            ShouldUpdate.check(data, old_data, gender, 'gender');
            ShouldUpdate.check(data, old_data, marital_status, 'marital_status');
            ShouldUpdate.check(data, old_data, citizen_of, 'citizen_of');
            ShouldUpdate.check(data, old_data, personnel_num, 'personnel_num');
            ShouldUpdate.checkJobPosition(data, old_data, occupation, 'occupation');
            ShouldUpdate.check(data, old_data, employee_str_addr, 'employee_str_addr');
            ShouldUpdate.check(data, old_data, employee_str_addr_code, 'employee_str_addr_code');
            ShouldUpdate.check(data, old_data, employee_postal_addr, 'employee_postal_addr');
            ShouldUpdate.check(data, old_data, employee_postal_addr_code, 'employee_postal_addr_code');
            ShouldUpdate.check(data, old_data, employee_tel_code, 'employee_tel_code');
            ShouldUpdate.check(data, old_data, employee_tel_num, 'employee_tel_num');
            ShouldUpdate.check(data, old_data, period_employ_years, 'period_employ_years');
            ShouldUpdate.check(data, old_data, period_employ_months, 'period_employ_months');
            ShouldUpdate.check(data, old_data, expected_disablement_period, 'expected_disablement_period');

            //3. Accident Details
            //            incident_source,
            //            incident,
            ShouldUpdate.checkDate(data, old_data, accident_date, 'accident_date');
            ShouldUpdate.check(data, old_data, accident_time, 'accident_time');
            ShouldUpdate.check(data, old_data, incident_place, 'incident_place');
            ShouldUpdate.checkZone(data, old_data, incident_place_province, 'incident_place_province_id');
            ShouldUpdate.check(data, old_data, incident_place_district, 'incident_place_district');
            ShouldUpdate.checkDate(data, old_data, accident_date_reported, 'accident_date_reported');
            ShouldUpdate.check(data, old_data, accident_time_reported, 'accident_time_reported');
            ShouldUpdate.check(data, old_data, task_employee_performing_during_accident, 'task_employee_performing_during_accident');
            ShouldUpdate.check(data, old_data, period_experience_task_performed_years, 'period_experience_task_performed_years');
            ShouldUpdate.check(data, old_data, period_experience_task_performed_months, 'period_experience_task_performed_months');
            ShouldUpdate.check(data, old_data, employee_action_connected_business, 'employee_action_connected_business');
            ShouldUpdate.check(data, old_data, accident_desc, 'accident_desc');
            ShouldUpdate.check(data, old_data, traffic_accident_on_public_road, 'traffic_accident_on_public_road');
            ShouldUpdate.checkListToJS(data, old_data, nature_of_injury_list, 'nature_of_injury_list');
            ShouldUpdate.checkBox(data, old_data, nature_of_injury_options, 'nature_of_injury_options');
            ShouldUpdate.check(data, old_data, employee_injured_explanation_satisfactory, 'employee_injured_explanation_satisfactory');
            ShouldUpdate.check(data, old_data, employee_injured_explanation_satisfactory_nope_desc, 'employee_injured_explanation_satisfactory_nope_desc');

            //4. Further Particulars Of Employee
            ShouldUpdate.checkFile(data, old_data, doc_salary_slip, 'doc_salary_slip');
            ShouldUpdate.checkListToJS(data, old_data, earning_list, 'earning_list');
            ShouldUpdate.check(data, old_data, prepared_further_payments_after_3_months_4rm_accident_date, 'prepared_further_payments_after_3_months_4rm_accident_date');
            ShouldUpdate.check(data, old_data, total_amount_already_paid, 'total_amount_already_paid');
            if (period_payments_made_range) {
                const {start, end} = period_payments_made_range;
                const new_period_payments_made_range = {};
                const {period_payments_made_range: old_period_payments_made_range} = old_data;
                ShouldUpdate.checkDate(new_period_payments_made_range, old_period_payments_made_range, start, 'date_from');
                ShouldUpdate.checkDate(new_period_payments_made_range, old_period_payments_made_range, end, 'date_to');
                if (!Object.keys(new_period_payments_made_range).isEmpty()) {
                    data.period_payments_made_range = new_period_payments_made_range;
                }
            }
            ShouldUpdate.check(data, old_data, num_of_week_days_worked_by_employee, 'num_of_week_days_worked_by_employee');
            ShouldUpdate.checkDate(data, old_data, date_ceased_work, 'date_ceased_work');
            ShouldUpdate.check(data, old_data, time_ceased_work, 'time_ceased_work');
            ShouldUpdate.check(data, old_data, did_employee_complete_shift_on_date_work_ceased, 'did_employee_complete_shift_on_date_work_ceased');
            ShouldUpdate.checkDate(data, old_data, date_resumed_work, 'date_resumed_work');
            ShouldUpdate.check(data, old_data, time_resumed_work, 'time_resumed_work');
            ShouldUpdate.check(data, old_data, dependant_name, 'dependant_name');
            ShouldUpdate.check(data, old_data, dependant_address, 'dependant_address');

            //5. Further Particulars
            ShouldUpdate.check(data, old_data, previously_received_compensation_full_names, 'previously_received_compensation_full_names');
            ShouldUpdate.check(data, old_data, was_1st_aid_given, 'was_1st_aid_given');
            ShouldUpdate.check(data, old_data, medical_practitioner_or_chiropractor_who_treated_employee, 'medical_practitioner_or_chiropractor_who_treated_employee');
            ShouldUpdate.check(data, old_data, hospital_which_treated_employee, 'hospital_which_treated_employee');
            ShouldUpdate.check(data, old_data, was_accidnt_caused_by_employee_options_1, 'was_accidnt_caused_by_employee_options_1');
            ShouldUpdate.check(data, old_data, was_accidnt_caused_by_employee_options_2, 'was_accidnt_caused_by_employee_options_2');
            ShouldUpdate.check(data, old_data, was_accidnt_caused_by_employee_options_3, 'was_accidnt_caused_by_employee_options_3');
            ShouldUpdate.check(data, old_data, accident_witness, 'accident_witness');
            ShouldUpdate.check(data, old_data, accident_aware_person, 'accident_aware_person');
            ShouldUpdate.check(data, old_data, num_of_employees_involved_in_accident, 'num_of_employees_involved_in_accident');
            ShouldUpdate.check(data, old_data, accident_police_station, 'accident_police_station');
            ShouldUpdate.check(data, old_data, accident_docket_num, 'accident_docket_num');
            ShouldUpdate.checkListToJS(data, old_data, involved_vehicle_reg_numbers, 'involved_vehicle_reg_numbers');
            ShouldUpdate.checkListToJS(data, old_data, contributing_factor_list_A, 'contributing_factor_list_A');
            ShouldUpdate.checkListToJS(data, old_data, contributing_factor_list_B, 'contributing_factor_list_B');
            ShouldUpdate.checkListToJS(data, old_data, other_machinery_list, 'other_machinery_list');
            ShouldUpdate.checkListToJS(data, old_data, other_contributing_factor_list, 'other_contributing_factor_list');
            ShouldUpdate.check(data, old_data, additional_details_or_comments, 'additional_details_or_comments');

            //6. Employer's Declaration
            ShouldUpdate.checkSignature(data, old_data, employer_signature, 'employer_signature');
            ShouldUpdate.check(data, old_data, employer_signature_name, 'employer_signature_name');
            ShouldUpdate.checkDate(data, old_data, employer_signature_date, 'employer_signature_date');

            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'totalFieldCount');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'totalFieldMax');

            console.log('update wcl2', data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateWCL2({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close())
            });
        }
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

    get convert_data() {
        const {dialog} = this.props;
        return dialog.convert_data;
    }

    get claim() {
        const {dialog} = this.props;
        return dialog.extraProp('item');
    }

    get isNew() {
        const {item} = this;
        if(!item) return true;
        return !item.id;
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        return <FormControls onChange={this.form.onChange} onCountFields={this.onCountFields}>
            <Row
                rendered
                countFields
                active
                idx={1}
                title="1. Employer Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="company_name" name="company_name" type="text"
                                placeholder="Compensation Commissioner Registered Name"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_reg_num" name="company_reg_num" type="text"
                                placeholder="Compensation Commissioner Registration Number"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectEmployeeInput ref="company_contact_person" name="company_contact_person"
                                     placeholder="Contact Person..." showOtherPerson className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address &
                    Postal Code</label>
                <ClearableInput ref="company_str_addr" name="company_str_addr" type="textarea"
                                placeholder="Street Address" className="col-lg-8 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="company_str_addr_code" name="company_str_addr_code" type="text"
                                placeholder="Postal Code" footerDesc="For Street Address"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address &
                    Postal Code</label>
                <ClearableInput ref="company_postal_addr" name="company_postal_addr" type="textarea"
                                placeholder="Postal Address" className="col-lg-8 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="company_postal_addr_code" name="company_postal_addr_code" type="text"
                                placeholder="Postal Code" footerDesc="For Postal Address"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="company_tel_code" name="company_tel_code" type="text" placeholder="Tel Code"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_tel_num" name="company_tel_num" type="text" placeholder="Tel Number"
                                className="col-lg-8 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_fax_code" name="company_fax_code" type="text" placeholder="Fax Code"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_fax_num" name="company_fax_num" type="text" placeholder="Fax Number"
                                className="col-lg-8 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_email" name="company_email" type="email" placeholder="Email Address"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_location" name="company_location" type="text"
                                placeholder="Situation of Business/Farm" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="company_nature" name="company_nature" type="text"
                                placeholder="Nature of Business, Trade or Industry" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={2}
                title="2. Employee Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="company_employee_association" name="company_employee_association" type="radio"
                                placeholder="Is The Injured Person A" vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.company_employee_association}
                                returnValue/>
                <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..."
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <hr/>

                <PDFUploadButton ref="doc_certified_id" name="doc_certified_id" buttonTitle="Certified ID/Passport Copy"
                                 showOnlyIcon className="w-320 margin-t-10" onChange={this.form.onChange}/>

                <hr/>

                <ClearableInput ref="id_num" name="id_num" type="text" placeholder="ID No."
                                className="col-lg-5 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="dob" name="dob" type="date" placeholder="Date Of Birth..."
                                className="col-lg-4 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="gender" name="gender" type="select" placeholder="Sex..."
                                className="col-lg-3 col-xs-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.genders} returnValue/>
                <ClearableInput ref="marital_status" name="marital_status" type="select" placeholder="Marital Status..."
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.marital_status} returnValue/>
                <ClearableInput ref="citizen_of" name="citizen_of" type="text" placeholder="Citizen Of"
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="personnel_num" name="personnel_num" type="text" placeholder="Personnel No."
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <SelectJobPositionInput ref="occupation" name="occupation" placeholder="Occupation..."
                                        className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address &
                    Postal Code</label>
                <ClearableInput ref="employee_str_addr" name="employee_str_addr" type="textarea"
                                placeholder="Street Address" className="col-lg-8 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employee_str_addr_code" name="employee_str_addr_code" type="text"
                                placeholder="Postal Code" footerDesc="For Street Address"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address &
                    Postal Code</label>
                <ClearableInput ref="employee_postal_addr" name="employee_postal_addr" type="textarea"
                                placeholder="Postal Address" className="col-lg-8 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employee_postal_addr_code" name="employee_postal_addr_code" type="text"
                                placeholder="Postal Code" footerDesc="For Postal Address"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="employee_tel_code" name="employee_tel_code" type="text" placeholder="Tel Code"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="employee_tel_num" name="employee_tel_num" type="text" placeholder="Tel Number"
                                className="col-lg-8 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Period in your employ
                    (years/months)</label>
                <ClearableInput ref="period_employ_years" name="period_employ_years" type="number" placeholder="Years"
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="period_employ_months" name="period_employ_months" type="number"
                                placeholder="Months" className="col-lg-6 form-control" onChange={this.form.onChange}/>

                <hr/>
                <ClearableInput ref="expected_disablement_period" name="expected_disablement_period" type="radio"
                                placeholder="Expected Period Of Disablement (Days)" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.expected_disablement_period} returnValue/>
            </Row>
            <Row
                rendered
                countFields
                idx={3}
                title="3. Accident Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Accident Date &
                    Time</label>
                <ClearableInput ref="accident_date" name="accident_date" type="date" placeholder="Accident Date..."
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="accident_time" name="accident_time" type="time" placeholder="Accident Time..."
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="incident_place" name="incident_place" type="text" placeholder="Incident Place"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="incident_place_province" name="incident_place_province" type="select"
                                placeholder="Incident Province..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                <ClearableInput ref="incident_place_district" name="incident_place_district" type="select"
                                placeholder="Incident District..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.districts} returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Accident Date & Time
                    Reported</label>
                <ClearableInput ref="accident_date_reported" name="accident_date_reported" type="date"
                                placeholder="Accident Date Reported..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="accident_time_reported" name="accident_time_reported" type="time"
                                placeholder="Accident Time Reported..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="task_employee_performing_during_accident"
                                name="task_employee_performing_during_accident" type="textarea"
                                placeholder="Task Employee Performing During The Accident"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Period of experience
                    in the task performed (years/months)</label>
                <ClearableInput ref="period_experience_task_performed_years"
                                name="period_experience_task_performed_years" type="number" placeholder="Years"
                                className="col-lg-6 col-xs-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="period_experience_task_performed_months"
                                name="period_experience_task_performed_months" type="number" placeholder="Months"
                                className="col-lg-6 col-xs-6 form-control" onChange={this.form.onChange}/>

                <ClearableInput ref="employee_action_connected_business" name="employee_action_connected_business"
                                type="radio"
                                placeholder="Was the employee's action at the time of the accident in connection with your trade or business?"
                                footerDesc='(If "no" state reasons on section 5 Part A)' vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.employee_action_connected_business} returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Short description of
                    how the accident occurred. ( mark the applicable items on the reverse side of Part A Page 3 and use
                    same for a full description)</label>
                <ClearableInput ref="accident_desc" name="accident_desc" type="textarea"
                                placeholder="Short Description Of How The Accident Occurred"
                                footerDesc='(Refer the machine/process involved, whether the injured person fell or was struck and all the factors contributing to the accident).'
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="traffic_accident_on_public_road" name="traffic_accident_on_public_road"
                                type="radio" placeholder="Traffic Accident On Public Road?" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.traffic_accident_on_public_road} returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Nature Of Injury
                    Sustained</label>
                <ClearableInput ref="nature_of_injury_list" name="nature_of_injury_list" type="select_multi"
                                placeholder="Nature Of Injury Sustained..."
                                footerDesc="E.g. Index Finger, Right Hand Crushed" className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.nature_of_injury_list} add
                                returnValue/>
                <ClearableInput ref="nature_of_injury_options" name="nature_of_injury_options" type="checkbox"
                                placeholder="Nature Of Injury Sustained..." vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.nature_of_injury_options}
                                returnValue/>
                <hr/>
                <ClearableInput ref="employee_injured_explanation_satisfactory"
                                name="employee_injured_explanation_satisfactory" type="radio"
                                placeholder="Are you satisfied that the employee was injured in the manner alleged by him/her?"
                                footerDesc='(If "no" state reasons on section 5 Part A)' vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.employee_injured_explanation_satisfactory} returnValue/>
                <ClearableInput ref="employee_injured_explanation_satisfactory_nope_desc"
                                name="employee_injured_explanation_satisfactory_nope_desc" type="textarea"
                                placeholder="If not, give reasons"
                                footerDesc='If the answer is "No" from the previous answer, give reasons'
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={4}
                title="4. Further Particulars Of Employee"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Earnings Of Employee
                    At The Time Of Accident</label>
                <PDFUploadButton ref="doc_salary_slip" name="doc_salary_slip" buttonTitle="Salary Slip" showOnlyIcon
                                 className="col-lg-12 col-xs-12 margin-t-10" onChange={this.form.onChange}/>

                <hr/>

                <EarningsTable ref="earning_list" name="earning_list" onChange={this.form.onChange}/>

                <p className="col-lg-12 pull-left margin-0 margin-t-10 margin-b-10 padding-5 bg-f5f5f5 color_red">In
                    terms of section 47 of the Act an employer is obliged to pay an employee full compensation for the
                    first three months of absence.</p>

                <ClearableInput ref="prepared_further_payments_after_3_months_4rm_accident_date"
                                name="prepared_further_payments_after_3_months_4rm_accident_date" type="radio"
                                placeholder="Are You Prepared To Make Further Compensation Payments After The First Three Months From The Date Of The Accident?"
                                vertical className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.prepared_further_payments_after_3_months_4rm_accident_date}
                                returnValue/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If You Have Already
                    Paid Cash(Earnings) To The Employee, State The Total Amount (R)</label>
                <ClearableInput ref="total_amount_already_paid" name="total_amount_already_paid" type="number"
                                placeholder="Total Amount (R)" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <DateRangeInput ref="period_payments_made_range" name="period_payments_made_range"
                                className="col-lg-12 form-control" vertical
                                placeholder="For what period were such payments made?" onChange={this.form.onChange}>
                    <label className="min-w-65">From</label>
                    <label className="min-w-50">To</label>
                </DateRangeInput>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">No. Of Days Per Week
                    Worked By The Employee</label>
                <ClearableInput ref="num_of_week_days_worked_by_employee" name="num_of_week_days_worked_by_employee"
                                type="number" placeholder="No. Of Days Per Week" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Time Employee
                    Ceased Work Due To Accident</label>
                <ClearableInput ref="date_ceased_work" name="date_ceased_work" type="date"
                                placeholder="Date Ceased Work..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="time_ceased_work" name="time_ceased_work" type="time"
                                placeholder="Time Ceased Work..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="did_employee_complete_shift_on_date_work_ceased"
                                name="did_employee_complete_shift_on_date_work_ceased" type="radio"
                                placeholder="Did The Employee Complete His Shift On The Day He Ceased Work?" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.did_employee_complete_shift_on_date_work_ceased} returnValue/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Time Employee
                    Resumed Work</label>
                <ClearableInput ref="date_resumed_work" name="date_resumed_work" type="date"
                                placeholder="Date Resumed Work..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="time_resumed_work" name="time_resumed_work" type="time"
                                placeholder="Time Resumed Work..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>

                <p className="col-lg-12 pull-left margin-0 margin-t-10 margin-b-10 padding-5 bg-f5f5f5 color_red">(If
                    the employee will be off duty for an extended period, an enterim Resumption Report (W.Cl.6) must be
                    submitted monthly).</p>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If The Employee Was
                    Killed In The Accident, State Name And Address Of Dependant Of The Employee</label>
                <ClearableInput ref="dependant_name" name="dependant_name" type="text" placeholder="Name Of Dependant"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="dependant_address" name="dependant_address" type="textarea"
                                placeholder="Address Of Dependant" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={5}
                title="5. Further Particulars"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Should the employee
                    have any physical defect, have suffered from any serious disease prior to the accident or has
                    previously received compensation for permanent disablement, give full particulars.</label>
                <ClearableInput ref="previously_received_compensation_full_names"
                                name="previously_received_compensation_full_names" type="text"
                                placeholder="Full Particulars" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="was_1st_aid_given" name="was_1st_aid_given" type="radio"
                                placeholder="Was first aid given in this case?" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.was_1st_aid_given} returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">State the name of the
                    medical practitioner/chiropractor who treated the employee</label>
                <ClearableInput ref="medical_practitioner_or_chiropractor_who_treated_employee"
                                name="medical_practitioner_or_chiropractor_who_treated_employee" type="text"
                                placeholder="Medical Practitioner/Chiropractor Name" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If the employee
                    received treatment at a hospital, state name of hospital</label>
                <ClearableInput ref="hospital_which_treated_employee" name="hospital_which_treated_employee" type="text"
                                placeholder="Hospital Name" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Was accidnt caused by
                    employee's:</label>
                <ClearableInput ref="was_accidnt_caused_by_employee_options_1"
                                name="was_accidnt_caused_by_employee_options_1" type="radio"
                                placeholder="a) Deliberate non-compliance with directions?" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.was_accidnt_caused_by_employee_options_1} returnValue/>
                <ClearableInput ref="was_accidnt_caused_by_employee_options_2"
                                name="was_accidnt_caused_by_employee_options_2" type="radio"
                                placeholder="b) Reckless discharge of the terms of any law or statutory regulation designed to ensure the safety of or health of employees or the prevention of accidents?"
                                vertical className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.was_accidnt_caused_by_employee_options_2} returnValue/>
                <ClearableInput ref="was_accidnt_caused_by_employee_options_3"
                                name="was_accidnt_caused_by_employee_options_3" type="radio"
                                placeholder="c) Action while under the influence of liquor or drugs?" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.was_accidnt_caused_by_employee_options_3} returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Name and address of
                    anybody:</label>
                <ClearableInput ref="accident_witness" name="accident_witness" type="text"
                                placeholder="a) Who witnessed the accident" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="accident_aware_person" name="accident_aware_person" type="text"
                                placeholder="b) Who was aware of the accident at the time"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">No. Of Employees
                    Involved In The Same Accident</label>
                <ClearableInput ref="num_of_employees_involved_in_accident" name="num_of_employees_involved_in_accident"
                                type="number" placeholder="No. Of Employees" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If the accident was
                    investigated by the SA Police, state name of Police Station and docket number applicable</label>
                <ClearableInput ref="accident_police_station" name="accident_police_station" type="text"
                                placeholder="Police Station" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="accident_docket_num" name="accident_docket_num" type="text"
                                placeholder="Docket Number" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">If vehicles were
                    involved, furnish registration number(s)</label>
                <ClearableInput ref="involved_vehicle_reg_numbers" name="involved_vehicle_reg_numbers"
                                type="select_multi" placeholder="Registration number(s)"
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.involved_vehicle_reg_numbers} add returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Contributing
                    Factors/Causes Applicable</label>
                <ClearableInput ref="contributing_factor_list_A" name="contributing_factor_list_A" type="select_multi"
                                placeholder="Part A" className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.contributing_factor_list_A} add returnValue/>
                <ClearableInput ref="contributing_factor_list_B" name="contributing_factor_list_B" type="select_multi"
                                placeholder="Part B" className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.contributing_factor_list_B} add returnValue/>

                <hr/>
                <ClearableInput ref="other_machinery_list" name="other_machinery_list" type="select_multi"
                                placeholder="Other Machinery (Specify)..." className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.other_machinery_list} add
                                returnValue/>
                <ClearableInput ref="other_contributing_factor_list" name="other_contributing_factor_list"
                                type="select_multi" placeholder="Any Other Contributing Factors (Specify)..."
                                footerDesc="Not Mentioned Above" className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.other_contributing_factor_list}
                                add returnValue/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">The rest of this page
                    may be used for any additional details or comments regarding the accident</label>
                <ClearableInput ref="additional_details_or_comments" name="additional_details_or_comments"
                                type="textarea" placeholder="Additional Details / Comments"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={6}
                title="6. Employer's Declaration"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                    I hereby declare that the particulars, shown in items 1 to 62 of this report,
                    of an alleged injury on duty, are to the best of my knowledge andbelief true and accurate.
                </label>

                <ClearableInput ref="employer_signature" name="employer_signature" type="signature"
                                placeholder="Employer's Signature" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employer_signature_name" name="employer_signature_name" type="text"
                                placeholder="Name of Person Signing" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employer_signature_date" name="employer_signature_date" type="date"
                                placeholder="Signature Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default NewWCL2Dialog;
