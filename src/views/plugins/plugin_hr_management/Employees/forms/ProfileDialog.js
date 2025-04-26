// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed} from 'mobx';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, ProfilePic, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import OptionalInfoSection from './ViewOptionalInfoSection';
import DocumentsSection from './ViewDocumentsSection';
import CounselingSection from "./ViewCounselingSection";
import WarningSection from "./ViewWarningSection";
import TimeOffSection from "./ViewTimeoffSection";

import DashboardSection from "./DashboardSection";

import style from "./ProfileDialog.lazy.css";
import {findByIdEmployee} from "mutations/findById";
import {CircularProgress} from "@mui/material";
import ProfilePDFReport from "../reports/ProfilePDFReport";
import EmployeeProfileSettings from "utils/EmployeeProfileSettings";
import {updateEmployee} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Employee";
    className = "AProfileEmployeeDocDialog";
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
            text = isEmployee ? "My Account" : "Employee";
        } else {
            const {removed} = item.data;
            text = isEmployee ? "My Account" : `Employee (${removed ? "Removed" : "Active"})`;
        }

        return <>{text}{item && item.id &&
            <strong className="bg-eee75 font-size-14 margin-l-10 padding-h-10 padding-v-5 border-radius-20"> ID
                #: {item.id}</strong>}</>;
    }

    // onSaveAsPDF(e, btn) {
    //     this.refs.controls.onSaveAsPDF(e, btn);
    // }

//    
//    get topButtonsHiddenDelete() {
//        if(this.props.isRemoved) {
//            return true;
//        }
//        const {user} = storage.loggedUser;
//        const {permissions_other} = user.data;
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
//        if(!Permissions.allowRemove(permissions_other_Employees)) {
//            return true;
//        }
//        return this.isLoggedUser;
//    }
//    
//    get topButtonsHiddenPrint() {
//        const {user} = storage.loggedUser;
//        const {permissions_other} = user.data;
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
//        if(!Permissions.allowPrint(permissions_other_Employees)) {
//            return true;
//        }
//        return false;
//    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        const {item} = this.state;
        return storage.is.isEmployee && item && item.id === user.id;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
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
        // {title: 'Job Observations', comp: JobObservationsSection, ref: "jobObservationsSection"},
        // {title: 'Training', comp: TrainingsSection, ref: "trainingsTab"},
        // {title: 'PPE', comp: PPESection, ref: "ppeTab"},
        // {title: 'Incidents', comp: IncidentsSection, ref: "incidentsTab"},
        // {title: 'COID', comp: COIDSection, ref: "coidTab"},
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

        this.onViewOtherInfo = this.onViewOtherInfo.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
        this.onUploaded = this.onUploaded.bind(this);
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {
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
        alert(id)

        const show = ({mainSection, childLevel1Ref, childLevel2Ref}) => {
            mainSection.onFormGoto();
            // console.log('mainSection.refs', mainSection.refs);
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

    onUploaded(path) {
        this.item.data.profile_pic = path;
    }

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.profilePDFReport.open(this.item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewOtherInfo">
    onViewOtherInfo(e, btn) {
        const {action} = btn.props;
        this.refs[action + "Dialog"].open('employee.id', this.item);
    }

    // <editor-fold defaultstate="collapsed" desc="renderComponent">
    renderComponent({title, comp: Comp, sectionClassName, ref: refName, props, activeAlways = false, isLast}, n) {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
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
                dialog: {renderProfileCover}
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

        console.log('employee', this.item)

        return <FormControls ref="formControls">
            <RowOrgs
                active={false}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                client={client}
                project={project}
                site={site}
                readonly
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Basic Info"
                >
                    <ProfilePic role="Staff" id={item.id} profilePic={profile_pic}
                                onUploaded={this.onUploaded}/>
                    <ProfileField name="fname" title="First Name" value={fname} className="col-lg-6"/>
                    <ProfileField name="lname" title="Last Name" value={lname} className="col-lg-6"/>
                    <ProfileField name="id_num" title="Identification No." value={id_num} className="col-lg-6"/>
                    <ProfileField name="passport_num" title="Passport No." value={passport_num} className="col-lg-6"/>
                    <ProfileField name="dob" type="date" title="Date of Birth" value={dob} className="col-lg-6"/>
                    <ProfileField name="sex" title="Gender" value={sex} className="col-lg-6"/>
                </Row>
            </RowOrgs>
            {EmployeeProfileSettings.isEmployeeContactDetailsViewers(item) && <Row
                rendered
                idx={2}
                title="2. Contact Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField name="phone" title="Phone No." value={phone} className="col-lg-6"/>
                <ProfileField name="email" title="Email Address" value={email} className="col-lg-6"/>
            </Row>}
            {this.components.map(this.renderComponent)}
            <ProfilePDFReport ref="profilePDFReport"/>
        </FormControls>;
    }

    // </editor-fold>
}

export default ProfileDialog;
//351
