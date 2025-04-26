// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import parsePhoneNumber from 'libphonenumber-js';
import {autorun, computed, observable} from 'mobx';

import Form from 'utils/Form';

import {execWhen, SAIdUtils, ShouldUpdate} from 'utils/Utils';
import {ClearableInput, ProfilePic, RowOrgs, SelectGenderInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import OptionalInfoSection from './EditOptionalInfoSection';
import DocumentsSection from './EditDocumentsSection';
import CounselingSection from "./EditCounselingSection";
import WarningSection from "./EditWarningSection";
import TimeOffSection from "./EditTimeoffSection";
import DashboardSection from "./DashboardSection";

import style from "./EditDialog.lazy.css";
import {CircularProgress} from "@mui/material";
import {findByIdEmployee} from "mutations/findById";
import {updateEmployee} from "mutations/update";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "Employee";
    // className = 'ANewTableFormDialog';
    className = "AEditEmployeeDocDialog";
    findById = findByIdEmployee;
    removeById = updateEmployee;

    constructor(props) {
        super(props, style);
    }

    @computed
    get title() {
        const {item} = this;
        const {isEmployee} = storage.is;
        let text;
        if (!item) {
            text = isEmployee ? "Edit My Account" : "Edit Employee";
        } else {
            const {removed} = item.data;
            text = isEmployee ? "Edit My Account" : `Edit Employee (${removed ? "Removed" : "Active"})`;
        }

        return <>{text}{item && item.id &&
            <strong className="bg-eee75 font-size-14 margin-l-10 padding-h-10 padding-v-5 border-radius-20"> ID
                #: {item.id}</strong>}</>;
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            receive_expired_docs_notifs: [{
                text: "Receive Expired Documents Notifications",
                value: true,
                checked: false
            }],
        },
    };
    components = [
        {title: 'Employment Info', comp: OptionalInfoSection, ref: "optionalInfoSection"},
        {title: 'Documents', comp: DocumentsSection, ref: "documentsSection"},
        {
            title: 'Counseling',
            comp: CounselingSection,
            ref: "counselingSection",
            sectionClassName: "-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
        },
        {
            title: 'Warnings',
            comp: WarningSection,
            ref: "warningSection",
            sectionClassName: "-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
        },
        {
            title: 'Time-off',
            comp: TimeOffSection,
            ref: "timeOffSection",
            sectionClassName: "-margin-l-10 margin-t-35 -margin-b-10 w-full-calc-add-20"
        },
        // {title: 'Dependents & Next Of Kin', comp: DependentsAndNextOfKinSection, ref: "dependentsAndNextOfKinTab"},
        // {title: 'Trainings', comp: TrainingsSection, ref: "trainingsSection"},
        // {
        //     title: 'PPE Issue',
        //     comp: ViewPPETab,
        //     ref: "ppeTab"
        // },
        // {
        //     title: 'Incidents',
        //     comp: IncidentsTab,
        //     ref: "incidentsTab"
        // },
        // {
        //     title: 'Attendance',
        //     comp: ViewAttendanceTab,
        //     ref: "attendanceTab"
        // },
        // {
        //     title: 'Compliance',
        //     comp: SpecificComplianceRequirementsTab,
        //     ref: "specificComplianceRequirementsTab"
        // },
        // {
        //     title: 'Notification Settings',
        //     comp: ViewNotificationSettingsTab,
        //     ref: "viewNotificationSettingsTab",
        // },
        {
            title: 'Dashboard',
            comp: DashboardSection,
            ref: "dashboardSection",
            props: {onClick: this.onOpenSections.bind(this)},
            activeAlways: true,
            isLast: true
        }
    ];
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onFormSave = this.onFormSave.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
        this.onUploaded = this.onUploaded.bind(this);

        this.form = new Form();
        this.form.addChangeOne("id_num", this.onChangeIdNum.bind(this));
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // </editor-fold>
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {dialog} = this.props;

        autorun(async () => {
            if (!this.item) return;

            const {removed} = this.item.data;
            const node = await dialog.execWhen(() => dialog.getTitleDOMNode());
            const jqEl = $(node);

            if (removed) {
                jqEl.addClass('removed');
                jqEl.removeClass('active');
            } else {
                jqEl.addClass('active');
                jqEl.removeClass('removed');
            }
        });
    }

    //<editor-fold desc="onChangeIdNum">
    onChangeIdNum(el, val) {
        execWhen(() => this.refs.dob && this.refs.sex).then(() => {
            const {
                dob: dob_ref, sex: sex_ref
            } = this.refs;
            if (val) {
                const sex = SAIdUtils.getGender(val);
                console.log('sex', sex)
                const dob = SAIdUtils.getDOB(val);
                sex && sex_ref.onChange({label: sex, value: sex});
                dob && dob_ref.onChange(dob);
            }
        });
    }

    //</editor-fold>

    onUploaded(path) {
        this.item.data.profile_pic = path;
    }

    // </editor-fold>

    onOpenSections(id) {
        const {dialog} = this.props;

        const {
            optionalInfoSection,
            documentsSection,
            counselingSection,
            warningSection,
            timeOffSection,
        } = this.refs;

        const show = ({mainSection, childLevel1Ref, childLevel2Ref}) => {
            mainSection.onFormGoto();
            // childLevel1Ref && dialog.execWhen(() => mainSection.refs[childLevel1Ref]).then(ref => {
            //     ref.onFormGoto();
            //     childLevel2Ref && dialog.execWhen(() => ref.refs[childLevel2Ref]).then(ref => {
            //         ref.onFormGoto();
            //     });
            // });
            mainSection.onFormGotoChild(childLevel1Ref);
            mainSection.onFormGotoChild(childLevel2Ref);
        };

        switch (id) {
            //Employment Info: 3
            case "living_address":
                show({mainSection: optionalInfoSection, childLevel1Ref: 'residentialAddress'});
                break;
            case "banking_detail":
                show({mainSection: optionalInfoSection, childLevel1Ref: 'bankingDetails'});
                break;
            case "next_of_kin":
                show({mainSection: optionalInfoSection, childLevel1Ref: 'next_of_kins'});
                break;
            case "dependent":
                show({mainSection: optionalInfoSection, childLevel1Ref: 'dependants'});
                break;
            //Documents: 4
            //Personal Documents: 4.1
            case "document_id_passport":
                show({
                    mainSection: documentsSection,
                    childLevel1Ref: 'personalDocuments',
                    childLevel2Ref: 'document_id_passport',
                });
                break;
            case "work_permit":
                show({
                    mainSection: documentsSection,
                    childLevel1Ref: 'personalDocuments',
                    childLevel2Ref: 'work_permit',
                });
                break;
            case "license":
                show({
                    mainSection: documentsSection,
                    childLevel1Ref: 'personalDocuments',
                    childLevel2Ref: 'license',
                });
                break;
            case "document_prdp":
                show({
                    mainSection: documentsSection,
                    childLevel1Ref: 'personalDocuments',
                    childLevel2Ref: 'document_prdp',
                });
                break;

            case "competency":
                show({mainSection: documentsSection, childLevel1Ref: 'competency'});
                break;
            case "contract":
                show({mainSection: documentsSection, childLevel1Ref: 'contract'});
                break;
            case "job_appointment":
                show({mainSection: documentsSection, childLevel1Ref: 'job_appointment'});
                break;
            case "medical":
                show({mainSection: documentsSection, childLevel1Ref: 'medical'});
                break;

            //5
            case "counselling":
                show({mainSection: counselingSection});
                break;
            //6
            case "warning":
                show({mainSection: warningSection});
                break;
            //7
            case "leave":
                show({mainSection: timeOffSection});
                break;
            //8
            // case "trainer_training":
            //
            //     break;
            //9
            // case "ppe_type":
            //
            //     break;
            //10
            // case "supervisor_employee":
            //
            //     break;
        }
    }

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
            refs: {optionalInfoSection, documentsSection, specificComplianceRequirementsTab}
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateEmployee({id: this.item.id, ...data}).then(res => {
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
                    // this.props.close();
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }

            const {
                site, project, client,
            } = form.data;

            const data = {};

            if (isContractor) {
                ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
            } else {
                ShouldUpdate.checkClient(data, old_data, client);
                ShouldUpdate.checkProject(data, old_data, project);
                ShouldUpdate.checkSite(data, old_data, site);
            }

            onSubmit(data);
            return;
        }

        if (idx === 1) {
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

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            if (form.isValid('email') && !form.get('email').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }

            let phone;
            if (form.isValid('phone')) {
                const phoneNumber = parsePhoneNumber(form.get('phone'), 'ZA');
                if (!phoneNumber) {
                    infoDialog.open('Phone Number is not valid');
                    return;
                }
                phone = phoneNumber.formatNational().trim().replaceAll(' ', '');
                if (phone.startsWith('0')) {
                    phone = phone.substring(1, phone.length);
                }
                if (phone.length < 9) {
                    infoDialog.open('Phone Number is not valid');
                    return;
                }
            }

            const {
                email,
            } = form.data;
            const data = {};
            ShouldUpdate.check(data, old_data, phone, 'phone');
            ShouldUpdate.check(data, old_data, email, 'email');

            onSubmit(data);
            return;
        }

        console.log('idx', idx)

        if (idx == '3.1') {
            console.log(optionalInfoSection)
            // const optionalInfoFormData = optionalInfoSection.formData;
            // if (optionalInfoFormData) {
            // const {
            //     employment_date,
            //     employment_num,
            //     job_position_id,
            //     department_id,
            // } = optionalInfoFormData;
            //
            // const data = {};
            //
            // ShouldUpdate.checkDate(data, old_data, employment_date, 'employment_date');
            // ShouldUpdate.check(data, old_data, employment_num, 'employment_num');
            // ShouldUpdate.checkDepartment(data, old_data, department_id, 'department');
            // ShouldUpdate.checkJobPosition(data, old_data, job_position_id, 'job_position');

            // onSubmit(data);
            // return;
            // }
            optionalInfoSection.onSubmit(btn);
            return;
        }

        if (idx == '3.2') {
            console.log(optionalInfoSection)
            // const optionalInfoFormData = optionalInfoSection.formData;
            // if (optionalInfoFormData) {
            //     const {
            //         supervisor_id,
            //     } = optionalInfoFormData;
            //
            //     const data = {};
            //
            //     ShouldUpdate.checkEmployee(data, old_data, supervisor_id, 'supervisor_id');
            //     // ShouldUpdate.check(data, old_data, supervisor_phone, 'supervisor_phone');
            //     // ShouldUpdate.check(data, old_data, supervisor_email, 'supervisor_email');
            //
            //     onSubmit(data);
            //     return;
            // }
            optionalInfoSection.onSubmit(btn);
            return;
        }

        if (idx == '3.3') {
            console.log(optionalInfoSection)
            const optionalInfoFormData = optionalInfoSection.formData;
            if (optionalInfoFormData) {
                const {
                    living_address_list,
                } = optionalInfoFormData;

                const data = {};

                ShouldUpdate.checkListToJS(data, old_data, living_address_list, 'living_address_list');
                // ShouldUpdate.check(data, old_data, living_addr_street, 'living_addr_street');
                // ShouldUpdate.check(data, old_data, living_addr_local_area, 'living_addr_local_area');
                // ShouldUpdate.check(data, old_data, living_addr_city, 'living_addr_city');
                // ShouldUpdate.check(data, old_data, living_addr_province, 'living_addr_province');
                // ShouldUpdate.checkFile(data, old_data, living_addr_doc, 'living_addr_doc');

                onSubmit(data);
                return;
            }
            return;
        }

        if (idx == '3.4') {
            console.log(optionalInfoSection)
            const optionalInfoFormData = optionalInfoSection.formData;
            if (optionalInfoFormData) {
                const {
                    banking_detail_list,
                } = optionalInfoFormData;

                const data = {};

                ShouldUpdate.checkListToJS(data, old_data, banking_detail_list, 'banking_detail_list');
                // ShouldUpdate.check(data, old_data, banking_name, 'banking_name');
                // ShouldUpdate.check(data, old_data, banking_branch, 'banking_branch');
                // ShouldUpdate.check(data, old_data, banking_branch_code, 'banking_branch_code');
                // ShouldUpdate.check(data, old_data, banking_account_num, 'banking_account_num');
                // ShouldUpdate.checkFile(data, old_data, banking_doc, 'banking_doc');

                onSubmit(data);
                return;
            }
            return;
        }

        if (idx == '4.1') {
            console.log(documentsSection)
            const documentsFormData = documentsSection.formData;
            if (documentsFormData) {
                const {
                    document_list,
                } = documentsFormData;

                const data = {};

                ShouldUpdate.checkListToJS(data, old_data, document_list, 'document_list');
                // //
                // ShouldUpdate.checkDate(new_documents, old_data.documents, documents.doc_id_or_passport_expiry, 'doc_id_or_passport_expiry');
                // ShouldUpdate.checkFile(new_documents, old_data.documents, documents.doc_id_or_passport, 'doc_id_or_passport');
                onSubmit(data);
                return;
            }
            return;
        }

        if (idx == '4.2') {//Competencies
            return;
        }

        if (idx == '4.3') {//Contracts
            return;
        }

        if (idx == '4.4') {//Job Appointments
            return;
        }

        if (idx == '4.5') {//Counselling
            return;
        }

        if (idx == '4.6') {//Leaves
            return;
        }

        //Licenses & PrDP
        if (idx == '4.7.1') {//Licenses
            return;
        }

        if (idx == '4.7.2') {//PrDP
            return;
        }

        if (idx == '4.8') {//Medical Fitness
            return;
        }

        if (idx == '4.9') {//Warnings
            return;
        }

        if (idx == '4.10') {//Work Permit
            return;
        }

        return true;
    }

    // <editor-fold defaultstate="collapsed" desc="renderComponent">
    renderComponent({title, comp: Comp, ref: refName, props, sectionClassName, activeAlways = false, isLast}, n) {
        const {props: {onFormNext, onFormBack, onFormOpen}, onFormSave,} = this;
        n += 3;

        const row = <Row
            activeAlways={activeAlways}
            rendered
            idx={n}
            title={n + '. ' + title}
            sectionClassName={sectionClassName}
            onFormOpen={onFormOpen}
            onFormBack={onFormBack}
            onFormNext={!isLast && onFormNext}
        >
            <Comp
                ref={refName}
                idx={n}
                title={title}
                item={this.item}
                {...(props || {})}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={onFormSave}
            />
        </Row>;

        if (!Comp.isValid || Comp.isValid(this.item)) return row;
        return null;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
            },
            item, item: {
                id, data: {
                    created_at,
                    profile_pic,
                    client, project, site,
                    fname, lname, id_num, passport_num, dob, sex,
                    phone, email,
                }
            }
        } = this;

//        console.log(this.item)

        return <FormControls ref="formControls">
            <RowOrgs
                onChange={this.form.onChange}
                active={false}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
                client={client}
                project={project}
                site={site}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Basic Info"
                >
                    <ProfilePic role="Staff" id={item.id} profilePic={profile_pic}
                                onUploaded={this.onUploaded}/>
                    <ClearableInput name="fname" type="text" placeholder="First Name" defaultValue={fname} required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="lname" type="text" placeholder="Last Name" defaultValue={lname} required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="id_num" type="text" placeholder="Identification No" defaultValue={id_num}
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="passport_num" type="text" placeholder="Passport No"
                                    defaultValue={passport_num} className="col-lg-6 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput ref="dob" name="dob" type="date" placeholder="Date of Birth..." defaultValue={dob}
                                    required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <SelectGenderInput ref="sex" name="sex" defaultValue={sex} className="col-lg-6 form-control"
                                       onChange={this.form.onChange}/>
                </Row>
            </RowOrgs>
            {EmployeeProfileSettings.isEmployeeContactDetailsViewers(item) && <Row
                rendered
                idx={2}
                title="2. Contact Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="phone" type="text" placeholder="Phone No." defaultValue={phone}
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="email" type="email" placeholder="Email Address / Username"
                                defaultValue={email} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>}
            {/*<Row*/}
            {/*    rendered*/}
            {/*    idx={3}*/}
            {/*    title="3. Notifications Settings"*/}
            {/*    onFormOpen={onFormOpen}*/}
            {/*    onFormBack={onFormBack}*/}
            {/*>*/}
            {/*    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" defaultValue={receive_expired_docs_notifs} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.receive_expired_docs_notifs} returnValue/>*/}
            {/*</Row>*/}
            {this.components.map(this.renderComponent)}
        </FormControls>;
    }

    // </editor-fold>
}

export default EditDialog;
