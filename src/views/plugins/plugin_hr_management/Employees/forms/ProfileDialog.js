// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed} from 'mobx';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, ProfilePic, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import OptionalInfoSection from './ViewOptionalInfoSection';
import DocumentsSection from './ViewDocumentsSection';
import TimeoffSection from "./ViewTimeoffSection";
import PPESection from './ViewPPESection';
import IncidentsSection from './ViewIncidentsSection';
import COIDSection from './ViewCOIDSection';
import TrainingsSection from './ViewTrainingsSection';
import DependentsAndNextOfKinSection from './ViewDependentsAndNextOfKinSection';

import DashboardSection from "./DashboardSection";

import style from "./ProfileDialog.lazy.css";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import {CircularProgress} from "@mui/material";
import ProfilePDFReport from "../reports/ProfilePDFReport";
import EmployeeProfileSettings from "../../../../../utils/EmployeeProfileSettings";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Employee";
    className = "AProfileEmployeeDocDialog";
    findById = findByIdEmployee;

    constructor(props) {
        super(props, style);
    }

    @computed
    get title() {
        if (!this.item) {
            return storage.is.isEmployee ? "My Account" : "Employee";
        }
        const {removed} = this.item.data;
        return storage.is.isEmployee ? "My Account" : `Employee (${removed ? "Removed" : "Active"})`;
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
    path = 'plugin_sheq_assist/employees/';

    // <editor-fold defaultstate="collapsed" desc="fields">
    components = [
        {title: 'Employment Info', comp: OptionalInfoSection, ref: "optionalInfoTab"},
        {title: 'Documents', comp: DocumentsSection, ref: "documentsTab"},
        {
            title: 'Time-off',
            comp: TimeoffSection,
            ref: "timeOffTab",
            sectionClassName: "-margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
        },
        {title: 'Dependents & Next Of Kin', comp: DependentsAndNextOfKinSection, ref: "dependentsAndNextOfKinTab"},
        // {title: 'Job Observations', comp: JobObservationsSection, ref: "jobObservationsSection"},
        {title: 'Training', comp: TrainingsSection, ref: "trainingsTab"},
        {title: 'PPE', comp: PPESection, ref: "ppeTab"},
        {title: 'Incidents', comp: IncidentsSection, ref: "incidentsTab"},
        {title: 'COID', comp: COIDSection, ref: "coidTab"},
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
    renderComponent({title, comp: Comp, sectionClassName, ref, activeAlways = false, isLast}, n) {
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
                ref={ref}
                idx={n}
                title={title}
                item={this.item}
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

        return <FormControls>
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
