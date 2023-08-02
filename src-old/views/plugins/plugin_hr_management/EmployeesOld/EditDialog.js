// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import parsePhoneNumber from 'libphonenumber-js';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';

import {execWhen, SAIdUtils, ShouldUpdate} from '../../../../utils/Utils';
import {
    ClearableInput,
    ProfilePic,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../components/inputs';
import {Row} from '../../../../components/FormComponents';
import {AEditDialog} from '../../../../components/dialogs';

import OptionalInfoTab from './NewDialogOptionalInfoTab';
import DocumentsTab from './NewDocumentsTab';
import DependentsAndNextOfKinTab from './NewDependentsAndNextOfKinTab';
import SpecificComplianceRequirementsTab from './NewDialogSpecificComplianceRequirementsTab';

import style from "./EditDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "Employees";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Employee";
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
        
        this.onUploaded = this.onUploaded.bind(this);
        
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
                console.log('sex', sex)
                const dob = SAIdUtils.getDOB(val);
                sex && sex_ref.onChange({label: sex, value: sex});
                dob && dob_ref.onChange(dob);
            }
        });
    }
    
    onUploaded(path) {
        this.item.data.profile_pic = path;
    }
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}, refs: {optionalInfoTab, documentsTab, dependantsAndNextOfKinTab, specificComplianceRequirementsTab}} = this;
        
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
        
        const data = {};
        ShouldUpdate.check(data, old_data, fname, 'fname');
        ShouldUpdate.check(data, old_data, lname, 'lname');
        
        ShouldUpdate.checkFile(data, old_data, profile_pic, 'profile_pic');
        ShouldUpdate.check(data, old_data, id_num, 'id_num');
        ShouldUpdate.checkDate(data, old_data, dob, 'dob');
        ShouldUpdate.check(data, old_data, passport_num, 'passport_num');
        ShouldUpdate.check(data, old_data, sex, 'sex');
        
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        ShouldUpdate.check(data, old_data, phone, 'phone');
        ShouldUpdate.check(data, old_data, email, 'email');
        
        ShouldUpdate.checkBox(data, old_data, receive_expired_docs_notifs, 'receive_expired_docs_notifs');

        console.log('old_data', old_data)
        
        console.log(optionalInfoTab, documentsTab, dependantsAndNextOfKinTab, specificComplianceRequirementsTab)
        const optional_info = toNoneNullObject(optionalInfoTab.form.data);
        if (optional_info) {
            const new_optional_info = {};
            ShouldUpdate.checkDate(new_optional_info, old_data.optional_info, optional_info.employment_date, 'employment_date');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.employee_num, 'employee_num');
            ShouldUpdate.checkDepartment(new_optional_info, old_data.optional_info, optional_info.department);
            ShouldUpdate.checkJobPosition(new_optional_info, old_data.optional_info, optional_info.job_position);
            
            ShouldUpdate.checkEmployee(new_optional_info, old_data.optional_info, optional_info.supervisor_name, 'supervisor_name');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.supervisor_phone, 'supervisor_phone');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.supervisor_email, 'supervisor_email');
            
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.living_addr_street, 'living_addr_street');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.living_addr_local_area, 'living_addr_local_area');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.living_addr_city, 'living_addr_city');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.living_addr_province, 'living_addr_province');
            ShouldUpdate.checkFile(new_optional_info, old_data.optional_info, optional_info.living_addr_doc, 'living_addr_doc');
            
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.banking_name, 'banking_name');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.banking_branch, 'banking_branch');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.banking_branch_code, 'banking_branch_code');
            ShouldUpdate.check(new_optional_info, old_data.optional_info, optional_info.banking_account_num, 'banking_account_num');
            ShouldUpdate.checkFile(new_optional_info, old_data.optional_info, optional_info.banking_doc, 'banking_doc');
            if(!Object.keys(new_optional_info).isEmpty()){
                data.optional_info = new_optional_info;
            }            
        }
        
        const documents = toNoneNullObject(documentsTab.form.data);
        if (documents) {
            const new_documents = {};
            //
            ShouldUpdate.checkDate(new_documents, old_data.documents, documents.doc_id_or_passport_expiry, 'doc_id_or_passport_expiry');
            ShouldUpdate.checkFile(new_documents, old_data.documents, documents.doc_id_or_passport, 'doc_id_or_passport');
            //
            ShouldUpdate.checkDate(new_documents, old_data.documents, documents.doc_driver_or_operator_licence_expiry, 'doc_driver_or_operator_licence_expiry');
            ShouldUpdate.checkFile(new_documents, old_data.documents, documents.doc_driver_or_operator_licence, 'doc_driver_or_operator_licence');
            //
            ShouldUpdate.checkDate(new_documents, old_data.documents, documents.doc_pdrp_expiry, 'doc_pdrp_expiry');
            ShouldUpdate.checkFile(new_documents, old_data.documents, documents.doc_pdrp, 'doc_pdrp');
            //
            ShouldUpdate.checkDate(new_documents, old_data.documents, documents.doc_work_permit_expiry, 'doc_work_permit_expiry');
            ShouldUpdate.checkFile(new_documents, old_data.documents, documents.doc_work_permit, 'doc_work_permit');
            if(!Object.keys(new_documents).isEmpty()){
                data.documents = new_documents;
            }
        }
        
        const dependantsAndNextOfKin = toNoneNullObject(dependantsAndNextOfKinTab.form.data);
        if (dependantsAndNextOfKin) {
            const new_next_of_kin_1 = {};
            ShouldUpdate.check(new_next_of_kin_1, old_data.next_of_kin_1, dependantsAndNextOfKin.next_of_kin_1_fname, 'fname');
            ShouldUpdate.check(new_next_of_kin_1, old_data.next_of_kin_1, dependantsAndNextOfKin.next_of_kin_1_lname, 'lname');
            ShouldUpdate.check(new_next_of_kin_1, old_data.next_of_kin_1, dependantsAndNextOfKin.next_of_kin_1_phone1, 'phone1');
            ShouldUpdate.check(new_next_of_kin_1, old_data.next_of_kin_1, dependantsAndNextOfKin.next_of_kin_1_phone2, 'phone2');
            ShouldUpdate.check(data.next_of_kin_1, old_data.next_of_kin_1, dependantsAndNextOfKin.next_of_kin_1_relationship, 'relationship');
            if(!Object.keys(new_next_of_kin_1).isEmpty()){
                data.next_of_kin_1 = new_next_of_kin_1;
            }
            
            const new_next_of_kin_2 = {};
            ShouldUpdate.check(new_next_of_kin_2, old_data.next_of_kin_2, dependantsAndNextOfKin.next_of_kin_2_fname, 'fname');
            ShouldUpdate.check(new_next_of_kin_2, old_data.next_of_kin_2, dependantsAndNextOfKin.next_of_kin_2_lname, 'lname');
            ShouldUpdate.check(new_next_of_kin_2, old_data.next_of_kin_2, dependantsAndNextOfKin.next_of_kin_2_phone1, 'phone1');
            ShouldUpdate.check(new_next_of_kin_2, old_data.next_of_kin_2, dependantsAndNextOfKin.next_of_kin_2_phone2, 'phone2');
            ShouldUpdate.check(new_next_of_kin_2, old_data.next_of_kin_2, dependantsAndNextOfKin.next_of_kin_2_relationship, 'relationship');
            if(!Object.keys(new_next_of_kin_2).isEmpty()){
                data.next_of_kin_2 = new_next_of_kin_2;
            }
            
            const dependants = (dependantsAndNextOfKin.dependants || []).map(v => {
                v.dob = v.dob.getTime();
                return v;
            });
            if(!dependants.isEmpty()) {
                ShouldUpdate.checkListToJS(data, old_data, dependants, 'dependants');
            }
        }
        
        const compliance_requirements = toNoneNullObject(specificComplianceRequirementsTab.form.data);
        if (compliance_requirements) {
            data.compliance_requirements = compliance_requirements.list;
        }
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            if (res === "EMAIL_DUP") {
                infoDialog.open("An Employee with this email address already exist.");
            } else if (res === "PHONE_DUP") {
                infoDialog.open("An Employee with this phone number address already exist.");
            } else {
                const res_data = res;
                onSaved && onSaved(res_data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }
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
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    profile_pic,
                    fname, lname, id_num, passport_num, dob, sex,
                    client, project, site, 
                    phone, email, password,
                    receive_expired_docs_notifs, 
                    optional_info,
                    documents, 
                    next_of_kin_1, next_of_kin_2, dependants, 
                    compliance_requirements, 
                    permissions_modules, permissions_other
                }
            }
        } = this;
        const {isConsultant, isHasProjects} = storage.is;
        
//        console.log(this.item)
        
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
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} showAll required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} showAll required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>}
                <Row 
                    rendered 
                    idx={1}
                    title="1. Basic Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfilePic path={this.path + "upload/profile-pic"} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                    <ClearableInput name="fname" type="text" placeholder="First Name" defaultValue={fname} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="lname" type="text" placeholder="Last Name" defaultValue={lname} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="id_num" type="text" placeholder="Identification No" defaultValue={id_num} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="passport_num" type="text" placeholder="Passport No" defaultValue={passport_num} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="dob" name="dob" type="date" placeholder="Date of Birth..." defaultValue={dob} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="sex" name="sex" type="select" placeholder="Gender..." defaultValue={sex} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.genders} returnValue/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Contact Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="phone" type="text" placeholder="Phone No." defaultValue={phone} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="email" type="email" placeholder="Email Address / Username" defaultValue={email} className="col-lg-6 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Notifications Settings" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" defaultValue={receive_expired_docs_notifs} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.receive_expired_docs_notifs} returnValue/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="4. Employment Info" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <OptionalInfoTab ref="optionalInfoTab" title="Employment Info" optional_info={optional_info}
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
                    <DocumentsTab ref="documentsTab" title="Documents" documents={documents}
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
                            next_of_kin_1={next_of_kin_1} next_of_kin_2={next_of_kin_2} dependants={dependants}
                            onFormNext={onFormNext} onFormBack={onFormBack} onFormOpen={onFormOpen}/>
                </Row>
                <Row 
                    rendered 
                    idx={7}
                    title="7. Compliance" 
                    onFormOpen={onFormOpen}  
                    onFormBack={onFormBack} 
                >
                    <SpecificComplianceRequirementsTab ref="specificComplianceRequirementsTab" title="Compliance" 
                        compliance_requirements={compliance_requirements}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default EditDialog;