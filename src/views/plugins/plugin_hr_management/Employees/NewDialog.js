// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import parsePhoneNumber from 'libphonenumber-js';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';
import {execWhen, SAIdUtils} from '../../../../utils/Utils';

import {
    ClearableInput,
    ProfilePic,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../components/inputs';
import {Row} from '../../../../components/FormComponents';
import {ANewDialog} from '../../../../components/dialogs';

import OptionalInfoTab from './NewDialogOptionalInfoTab';
import DocumentsTab from './NewDocumentsTab';
import DependentsAndNextOfKinTab from './NewDependentsAndNextOfKinTab';
import SpecificComplianceRequirementsTab from './NewDialogSpecificComplianceRequirementsTab';

import style from "./NewDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "Employees";
    title = "Create Employee";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/';
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            genders: ["Male", "Female", "Other"],
            receive_expired_docs_notifs: [{text: "Receive Expired Documents Notifications", value: true, checked: false}],
        },
        index: 0
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.form = new Form();
        this.form.addChangeOne("id_num", this.onChangeIdNum.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        
    }
    // </editor-fold>
    
    onChangeIdNum(el, val) {
        execWhen(() => this.refs.dob && this.refs.sex).then(() => {
            const {
                dob: dob_ref, sex: sex_ref
            } = this.refs;
            if(val) {
                const sex = SAIdUtils.getGender(val);
                const dob = SAIdUtils.getDOB(val);
                sex && sex_ref.onChange({label: sex, value: sex});
                dob && dob_ref.onChange(dob);
            }
        });
    }
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {optionalInfoTab, documentsTab, dependantsAndNextOfKinTab, specificComplianceRequirementsTab}} = this;
        
        if (!form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }
        if (!form.isValid('id_num') && !form.isValid('passport_num')) {
            infoDialog.open('Identification No / Passport No is required');
            return;
        }
        if (form.isValid('email') && !form.get('email').isEmailAddress()) {
            infoDialog.open('Email Address is not valid');
            return;
        }
        
        let phone;
        if (form.isValid('phone')) {
            const phoneNumber = parsePhoneNumber(form.get('phone'), 'ZA');
            if(!phoneNumber) {
                infoDialog.open('Phone Number is not valid');
                return;
            }
            phone = phoneNumber.formatNational().trim().replaceAll(' ', '');
            if(phone.startsWith('0')) {
                phone = phone.substring(1, phone.length);
            }
            if(phone.length < 9) {
                infoDialog.open('Phone Number is not valid');
                return;
            }
        }
        
        const {
            profile_pic, fname, lname, id_num, passport_num, dob, sex, 
            site, project, client, 
            email,
            receive_expired_docs_notifs,
        } = form.data;
        
        const data = {fname, lname};
        
        if(profile_pic) {
            data.profile_pic = profile_pic.path;
        }
        if(id_num) {
            data.id_num = id_num;
        }
        if(passport_num) {
            data.passport_num = passport_num;
        }
        if(dob) {
            data.dob = dob.getTime();
        }
        if(sex) {
            data.sex = sex;
        }
        
        if(client) {
            if(client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if(project) {
            if(project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
            } else {
                data.project = project;
            }
        }
        if(site) {
            if(site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
            } else {
                data.site = site;
            }
        }   
        
        if(phone) {
            data.phone = phone;
        }
        if(email) {
            data.email = email;
        }
        
        if(receive_expired_docs_notifs) {
            data.receive_expired_docs_notifs = receive_expired_docs_notifs;
        } else {
            data.receive_expired_docs_notifs = false;
        }

        console.log(optionalInfoTab, documentsTab, dependantsAndNextOfKinTab, specificComplianceRequirementsTab)
        const optional_info = toNoneNullObject(optionalInfoTab.form.data);
        if (optional_info) {
            data.optional_info = {};
            if(optional_info.employment_date) {
                data.optional_info.employment_date = optional_info.employment_date.getTime();
            }
            if(optional_info.employee_num) {
                data.optional_info.employee_num = optional_info.employee_num;
            }
            if(optional_info.department) {
                const {department} = optional_info;
                if(department.id) {
                    const {id, name, data: _data} = department;
                    data.optional_info.department = {id, name: name || _data.name};
                } else {
                    data.optional_info.department = department;
                }
            }
            if(optional_info.job_position) {
                const {job_position} = optional_info;
                if(job_position.id) {
                    const {id, name, data: _data} = job_position;
                    data.optional_info.job_position = {id, name: name || _data.name};
                } else {
                    data.optional_info.job_position = job_position;
                }
            }
            
            if(optional_info.supervisor_name) {
                const {id, data: {fname, lname}} = optional_info.supervisor_name;
                data.optional_info.supervisor_name = {id, fname, lname};
            }
            if(optional_info.supervisor_phone) {
                data.optional_info.supervisor_phone = optional_info.supervisor_phone;
            }
            if(optional_info.supervisor_email) {
                data.optional_info.supervisor_email = optional_info.supervisor_email;
            }
            
            if(optional_info.living_addr_street) {
                data.optional_info.living_addr_street = optional_info.living_addr_street;
            }
            if(optional_info.living_addr_local_area) {
                data.optional_info.living_addr_local_area = optional_info.living_addr_local_area;
            }
            if(optional_info.living_addr_city) {
                data.optional_info.living_addr_city = optional_info.living_addr_city;
            }
            if(optional_info.living_addr_province) {
                data.optional_info.living_addr_province = optional_info.living_addr_province;
            }
            if(optional_info.living_addr_doc) {
                data.optional_info.living_addr_doc = optional_info.living_addr_doc.path;
            }
            
            if(optional_info.banking_name) {
                data.optional_info.banking_name = optional_info.banking_name;
            }
            if(optional_info.banking_branch) {
                data.optional_info.banking_branch = optional_info.banking_branch;
            }
            if(optional_info.banking_branch_code) {
                data.optional_info.banking_branch_code = optional_info.banking_branch_code;
            }
            if(optional_info.banking_account_num) {
                data.optional_info.banking_account_num = optional_info.banking_account_num;
            }
            if(optional_info.banking_doc) {
                data.optional_info.banking_doc = optional_info.banking_doc.path;
            }
        }
        
        const documents = toNoneNullObject(documentsTab.form.data);
        if (documents) {
            data.documents = {};
            //
            if(documents.doc_id_or_passport_expiry) {
                data.documents.doc_id_or_passport_expiry = documents.doc_id_or_passport_expiry.getTime();
            }
            if(documents.doc_id_or_passport) {
                data.documents.doc_id_or_passport = documents.doc_id_or_passport.path;
            }
            //
            if(documents.doc_driver_or_operator_licence_expiry) {
                data.documents.doc_driver_or_operator_licence_expiry = documents.doc_driver_or_operator_licence_expiry.getTime();
            }
            if(documents.doc_driver_or_operator_licence) {
                data.documents.doc_driver_or_operator_licence = documents.doc_driver_or_operator_licence.path;
            }
            //
            if(documents.doc_pdrp_expiry) {
                data.documents.doc_pdrp_expiry = documents.doc_pdrp_expiry.getTime();
            }
            if(documents.doc_pdrp) {
                data.documents.doc_pdrp = documents.doc_pdrp.path;
            }
            //
            if(documents.doc_work_permit_expiry) {
                data.documents.doc_work_permit_expiry = documents.doc_work_permit_expiry.getTime();
            }
            if(documents.doc_work_permit) {
                data.documents.doc_work_permit = documents.doc_work_permit.path;
            }
        }
        
        const dependantsAndNextOfKin = toNoneNullObject(dependantsAndNextOfKinTab.form.data);
        if (dependantsAndNextOfKin) {
            data.next_of_kin_1 = {};
            if(dependantsAndNextOfKin.next_of_kin_1_fname) {
                data.next_of_kin_1.fname = dependantsAndNextOfKin.next_of_kin_1_fname;
            }
            if(dependantsAndNextOfKin.next_of_kin_1_lname) {
                data.next_of_kin_1.lname = dependantsAndNextOfKin.next_of_kin_1_lname;
            }
            if(dependantsAndNextOfKin.next_of_kin_1_phone1) {
                data.next_of_kin_1.phone1 = dependantsAndNextOfKin.next_of_kin_1_phone1;
            }
            if(dependantsAndNextOfKin.next_of_kin_1_phone2) {
                data.next_of_kin_1.phone2 = dependantsAndNextOfKin.next_of_kin_1_phone2;
            }
            if(dependantsAndNextOfKin.next_of_kin_1_relationship) {
                data.next_of_kin_1.relationship = dependantsAndNextOfKin.next_of_kin_1_relationship;
            }
            data.next_of_kin_2 = {};
            if(dependantsAndNextOfKin.next_of_kin_2_fname) {
                data.next_of_kin_2.fname = dependantsAndNextOfKin.next_of_kin_2_fname;
            }
            if(dependantsAndNextOfKin.next_of_kin_2_lname) {
                data.next_of_kin_2.lname = dependantsAndNextOfKin.next_of_kin_2_lname;
            }
            if(dependantsAndNextOfKin.next_of_kin_2_phone1) {
                data.next_of_kin_2.phone1 = dependantsAndNextOfKin.next_of_kin_2_phone1;
            }
            if(dependantsAndNextOfKin.next_of_kin_2_phone2) {
                data.next_of_kin_2.phone2 = dependantsAndNextOfKin.next_of_kin_2_phone2;
            }
            if(dependantsAndNextOfKin.next_of_kin_2_relationship) {
                data.next_of_kin_2.relationship = dependantsAndNextOfKin.next_of_kin_2_relationship;
            }
            
            if(dependantsAndNextOfKin.dependants) {
                data.dependants = dependantsAndNextOfKin.dependants.map(v => {
                    v.dob = v.dob.getTime();
                    return v;
                });
            } else {
                data.dependants = [];
            }
        }
        
        const compliance_requirements = toNoneNullObject(specificComplianceRequirementsTab.form.data);
        if (compliance_requirements) {
            data.compliance_requirements = compliance_requirements.list;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            if (res === "EMAIL_DUP") {
                infoDialog.open("An Employee with this email address already exist.");
            } else if (res === "PHONE_DUP") {
                infoDialog.open("An Employee with this phone number address already exist.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, isHasProjects} = storage.is;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {isHasProjects && <Row 
                    active
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>}
                <Row 
                    rendered 
                    idx={1}
                    title="1. Basic Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfilePic name="profile_pic" onChange={this.form.onChange}/>
                    <ClearableInput name="fname" type="text" placeholder="First Name" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="lname" type="text" placeholder="Last Name" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="id_num" type="text" placeholder="Identification No" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="passport_num" type="text" placeholder="Passport No" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="dob" name="dob" type="date" placeholder="Date of Birth..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="sex" name="sex" type="select" placeholder="Gender..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.genders} returnValue/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Contact Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="phone" type="text" placeholder="Phone No." className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="email" type="email" placeholder="Email Address / Username" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Notifications Settings" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.receive_expired_docs_notifs} returnValue/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="4. Employment Info" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <OptionalInfoTab ref="optionalInfoTab" title="Employment Info"
                            onFormNext={onFormNext} onFormBack={onFormBack} onFormOpen={onFormOpen}/>
                </Row>
                <Row 
                    rendered 
                    idx={5}
                    title="5. Documents" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <DocumentsTab ref="documentsTab" title="Documents"
                            onFormNext={onFormNext} onFormBack={onFormBack} onFormOpen={onFormOpen}/>
                </Row>
                <Row 
                    rendered 
                    idx={6}
                    title="6. Dependents & Next Of Kin" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <DependentsAndNextOfKinTab ref="dependantsAndNextOfKinTab" title="Dependents & Next Of Kin"
                            onFormNext={onFormNext} onFormBack={onFormBack} onFormOpen={onFormOpen}/>
                </Row>
                <Row 
                    rendered 
                    idx={7}
                    title="7. Compliance" 
                    onFormOpen={onFormOpen}  
                    onFormBack={onFormBack} 
                >
                    <SpecificComplianceRequirementsTab ref="specificComplianceRequirementsTab" title="Compliance"/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;