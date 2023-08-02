// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../utils/Utils';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField, ProfilePic} from '../../../../components/inputs';
import {Row} from '../../../../components/FormComponents';

import {ViewAttendanceTab} from '../other_modules/Attendances';
import {ViewPPETab} from '../other_modules/PPE';

import OptionalInfoTab from './ViewOptionalInfoTab';
import DocumentsTab from './ViewDocumentsTab';
import DependentsAndNextOfKinTab from './ViewDependentsAndNextOfKinTab';
import SpecificComplianceRequirementsTab from './ViewSpecificComplianceRequirementsTab';

import {ViewContractsTab} from '../Contracts';
import {ViewLeavesTab} from '../Leaves';
import {ViewMedicalsTab} from '../Medicals';
import {ViewWarningsTab} from '../Warnings';

import TrainingsTab from './ViewTrainingsTab';
import JobAppointmentsTab from './ViewJobAppointmentsTab';
import ViewNotificationSettingsTab from './ViewNotificationSettingsTab';
import IncidentsTab from './ViewIncidentsTab';
import COVIDTab from './ViewCOVIDTab';

import ProfilePDFReader from './printers/ProfilePDFReader';
// </editor-fold>
import style from "./ProfileDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "Employee";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return storage.is.isEmployee ? "My Account" : ("Employee (" + (this.props.isRemoved ? "Removed" : "Active") + ")");
    }
    
    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
    
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
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/';
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
    };
    components = [
        {title: 'Employment Info', comp: OptionalInfoTab, ref: "optionalInfoTab"},
        {title: 'Documents', comp: DocumentsTab, ref: "documentsTab"},
        {title: 'Dependents & Next Of Kin', comp: DependentsAndNextOfKinTab, ref: "dependentsAndNextOfKinTab"},
        {title: 'Contracts', comp: ViewContractsTab, ref: "contractsTab"},
        {title: 'Job Appointment', comp: JobAppointmentsTab, ref: "jobAppointmentsTab"},
        {title: 'Medical Fitness Certificates', comp: ViewMedicalsTab, ref: "medicalsTab"},
        {title: 'Warnings', comp: ViewWarningsTab, ref: "warningsTab"},
        {title: 'Leaves', comp: ViewLeavesTab, ref: "leavesTab"},
        {
            title: 'Trainings', 
            comp: TrainingsTab, 
            ref: "trainingsTab"
        },
        {
            title: 'PPE Issue',
            comp: ViewPPETab,
            ref: "ppeTab"
        },
        {
            title: 'Incidents',
            comp: IncidentsTab,
            ref: "incidentsTab"
        },
        {
            title: 'COVID-19',
            comp: COVIDTab,
            ref: "covidTab"
        },
        {
            title: 'Attendance',
            comp: ViewAttendanceTab,
            ref: "attendanceTab"
        },
        {
            title: 'Compliance', 
            comp: SpecificComplianceRequirementsTab, 
            ref: "specificComplianceRequirementsTab"
        },
        {title: 'Notification Settings', comp: ViewNotificationSettingsTab, ref: "viewNotificationSettingsTab", isLast: true}
    ];
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onViewOtherInfo = this.onViewOtherInfo.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {dialog} = this.props;
	dialog.execWhen(() => {
            try{
		return dialog.getDOMNode();
            } catch(e) { }
        }).then(node => {
            const jqEl = $(node.querySelector('.dialog-header h3'));
            
            if(this.item.data.removed) {
                jqEl.removeClass('active');
            } else {
                jqEl.addClass('active');
            }
	});
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewOtherInfo">
    onViewOtherInfo(e, btn){
        const {action} = btn.props;
        this.refs[action + "Dialog"].open('employee.id', this.item);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderComponent">
    renderComponent({title, comp: Comp, ref, isLast}, n) {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        n += 3;
        return <Row 
            rendered 
            idx={n}
            title={n + '. ' + title} 
            onFormOpen={onFormOpen} 
            onBack={onFormBack}
            onFormNext={!isLast && onFormNext}
        >
            <Comp ref={ref} idx={n} title={title} item={this.item} onFormOpen={onFormOpen} onFormBack={onFormBack} onFormNext={onFormNext}/>
        </Row>;
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
                    client, project, site, phone, email,
                }
            }
        } = this;
        
        console.log('employee', this.item)
        
        const {isContractorView, isConsultant, isHasProjects} = storage.is;
        const isContractor = storage.is.isContractor || isContractorView;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <ProfilePic readonly profilePic={profile_pic}/>
                    <h3>{fname + ' ' + lname}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                {(isHasProjects || isContractor) && <Row 
                    rendered 
                    idx={0}
                    title="Company Details"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && !isContractor && <ProfileField name="client" title="Company" value={client} renderer={val => val.name || val.data.name} className="col-lg-12"/>}
                    {!isContractor && <ProfileField name="project" title="Project" value={project} renderer={val => val.name || val.data.name} className="col-lg-6"/>}
                    <ProfileField name="site" title="Site" value={site} renderer={val => val.name || val.data.name} className={"col-lg-" + (isContractor ? "12" : "6")}/>
                </Row>}
                <Row 
                    active
                    rendered 
                    idx={1}
                    title="1. Basic Details"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField name="fname" title="First Name" value={fname} required className="col-lg-6"/>
                    <ProfileField name="lname" title="Last Name" value={lname} required className="col-lg-6"/>
                    <ProfileField name="id_num" title="Identification No." value={id_num} className="col-lg-6"/>
                    <ProfileField name="passport_num" title="Passport No." value={passport_num} className="col-lg-6"/>
                    <ProfileField name="dob" type="date" title="Date of Birth" value={dob} className="col-lg-6"/>
                    <ProfileField name="sex" title="Gender" value={sex} className="col-lg-6"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Contact Details"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField name="phone" title="Phone No." value={phone} className="col-lg-6"/>
                    <ProfileField name="email" title="Email Address" value={email} className="col-lg-6"/>
                </Row>                
                {this.components.map(this.renderComponent)}
                <ProfilePDFReader ref="pdfReader"/>
            </div>
        </div>;
    }
    // </editor-fold>
}

export default ProfileDialog;
//351