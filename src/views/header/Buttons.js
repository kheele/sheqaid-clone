// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {Button} from 'components/inputs';
import Popover from 'components/popovers/Popover';
import NavItem from 'components/navs/NavItem';
import {calculateRightPos, Permissions} from 'utils/Utils';

//import NewPlannedJobObservationDialog from 'views/plugins/plugin_hr_management/Employees/dialogs/NewPlannedJobObservationDialog.js';
import NewAttendanceDialog from 'views/plugins/plugin_hr_management/other_modules/Attendances/NewAttendanceDialog.js';
import NewAttendanceSelfDialog
    from 'views/plugins/plugin_hr_management/other_modules/Attendances/NewAttendanceSelfDialog.js';
import NewPPERegisterDialog from 'views/plugins/plugin_hr_management/other_modules/PPE/NewPPERegisterDialog.js';

import NewScreeningDialog from 'views/plugins/plugin_extra/__A_COVID_Management/dialogs/NewScreeningDialog.js';
import NewIncidentQuickDialog
    from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/NewIncidentQuickDialog.js';
import NewIncidentDialog from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/NewIncidentDialog.js';
import NewCheckableDialog from 'views/plugins/plugin_sheq_assist/Inspections/InspectionTab/forms/NewCheckableDialog.js';
import Divider from "@mui/material/Divider";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PluginsBtn">
@observer
class PluginsBtn extends React.Component {

    constructor() {
        super();
        this.onViewPluginsHub = this.onViewPluginsHub.bind(this);
    }

    onViewPluginsHub() {
        this.refs.pluginHubDialog.open();
    }

    render() {
        const {isEmployee, isContractor, isContractorViewIncContractorPack} = storage.is;
        if (!loggedInApp.defaultView || isEmployee || isContractor)
            return null;
        return null;/*<React.Fragment>
            <Button className="fa fa-th btn" key="Plugins" hoverText="Plugins" onClick={this.onViewPluginsHub}/>
            <PluginHubDialog ref="pluginHubDialog"/>
        </React.Fragment>;*/
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CalendarBtn">
@observer
class CalendarBtn extends React.Component {

    render() {
//        const {isEmployee, isContractor, isContractorViewVisited, isContractorViewIncContractorPack} = storage.is;
//        if (!loggedInApp.defaultView || isEmployee || isContractor || isContractorViewVisited)
            return null;
        /*return <Button ref="calendar" className="fa fa-calendar-alt btn" module="Calendar" hoverText="Calendar"
                       onClick={defaultView.onOpenPage}/>;*/
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ChatsBtn">
@observer
class ChatsBtn extends React.Component {

    render() {
        return null; //<Button className="fa fa-comment-dots btn" module="Chats" hoverText="Chats" onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="DashboardBtn">
@observer
class DashboardBtn extends React.Component {

    render() {
        if (!loggedInApp.defaultView)
            return null;
        return null;//<Button ref="dashboard" className="fa fa-tachometer-alt btn" module="Dashboard" hoverText="Dashboard" onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AuditTrailBtn">
@observer
class AuditTrailBtn extends React.Component {

    render() {
        const {isConsultant} = storage.is;
        const {clients} = storage.list;
//        if (!loggedInApp.defaultView)
//            return null;
        if (isConsultant && clients.isEmpty()) return null;

        if (Permissions.disallowOther("Audit Logs"))
//            return null;

        if (storage.is.isEmployee) {
            return null;
        }

        return <Button className="fa fa-file-text btn" module="AuditTrail" hoverText="Audit Log"
                       onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectOrgsBtn">
@observer
class SelectOrgsBtn extends React.Component {

    constructor() {
        super();

        this.onPopoverSettings = this.onPopoverSettings.bind(this);
    }

    onPopoverSettings(e) {
        const {isConsultant} = storage.is;

        this.refs.popover.settings({
            style: {left: "auto", right: calculateRightPos(this.refs.more.getDOMNode()), top: 60, width: 150},
            contentNode: <div key="more">
                {Permissions.allowOther("Sectors") &&
                    <NavItem module="Sectors" onClick={defaultView.onOpenPage} faIconLeft="project-diagram"
                             title="Sectors"/>}
                <Divider />
                {isConsultant && Permissions.allowOther("Clients") &&
                    <NavItem module="Clients" onClick={defaultView.onOpenPage} faIconLeft="building" title="Clients"/>}
                {Permissions.allowOther("Projects") &&
                    <NavItem module="Projects" onClick={defaultView.onOpenPage} faIconLeft="project-diagram"
                             title="Projects"/>}
                {Permissions.allowOther("Sites") &&
                    <NavItem module="Sites" onClick={defaultView.onOpenPage} faIconLeft="dumpster" title="Sites"/>}
            </div>
        }).open();
    }

    render() {
        const {isConsultant, isContractorView, isContractor, isEmployee, isNoProjects} = storage.is;
        if (isContractor || isContractorView || isEmployee || isNoProjects) {
            return null;
        }

        if (!Permissions.allowOther("Sectors") && !Permissions.allowOther("Clients") && !Permissions.allowOther("Projects") && !Permissions.allowOther("Sites")) {
            return null;
        }

        let hoverText = 'Sectors, ';
        if(isConsultant) {
            hoverText += 'Companies, ';
        }
        hoverText += 'Projects & Sites';

        return <React.Fragment>
            <Button ref="more" className="fa fa-project-diagram btn" hoverText={hoverText}
                    onClick={this.onPopoverSettings}/>
            <Popover key="popover" ref="popover"/>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectShortcutsBtn">
@observer
class SelectShortcutsBtn extends React.Component {

    constructor() {
        super();

        this.onClickAttendance = this.onClickAttendance.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPopoverSettings = this.onPopoverSettings.bind(this);
    }

    onClickAttendance(e, el) {
        const {action} = el.props;
        switch (action) {
            case 'Self':
                this.refs.newAttendanceSelfDialog.open();
                break;
            case 'Other':
                this.refs.newAttendanceDialog.open();
                break;
        }
    }

    onClick(e, el) {
        const {isSupervisor, isEmployee} = storage.is;
        const {action} = el.props;
        switch (action) {
            case 'Job Observation':
                this.refs.newPlannedJobObservationDialog.open();
                break;
            case 'PPE':
                this.refs.newPPERegisterDialog.open();
                break;
            case 'Screening':
                this.refs.newScreeningDialog.open();
                break;
            case 'QuickIncident':
                this.refs.newQuickIncidentDialog.open();
                break;
            case 'Incident':
                this.refs.newIncidentDialog.open();
                break;
            case 'Inspection':
                this.refs.newInspectionDialog.open();
                break;
            case 'Attendance': {
                if (isEmployee && !isSupervisor) {
                    this.refs.newAttendanceSelfDialog.open();
                } else {
                    popover.settings({
                        style: {
                            left: "auto",
                            right: calculateRightPos(this.refs.shortcuts.getDOMNode()),
                            top: 60,
                            width: 260
                        },
                        contentNode: <div key="shortcuts">
                            <React.Fragment>
                                <NavItem action="Self" onClick={this.onClickAttendance} title="Attendance For Myself"/>
                                <NavItem action="Other" onClick={this.onClickAttendance}
                                         title="Attendance For Other Person"/>
                            </React.Fragment>
                        </div>
                    }).open();
                }
                break;
            }
        }
    }

    onPopoverSettings(e) {
        const {is: {isConsultant}, loggedUser} = storage;

        this.refs.popover.settings({
            style: {left: "auto", right: calculateRightPos(this.refs.shortcuts.getDOMNode()), top: 60, width: 260},
            contentNode: <div key="shortcuts">
                {Permissions.allowMod("__A_COVID_Management") &&
                    <NavItem action="Screening" onClick={this.onClick} title="+ COVID Screening"/>}
                {Permissions.allowOther("Quick Incident") &&
                    <NavItem action="QuickIncident" onClick={this.onClick} title="+ Quick Incident"/>}
                {Permissions.allowMod("_21_Internal_Audit") &&
                    <NavItem action="Inspection" onClick={this.onClick} title="+ Inspection"/>}
                {Permissions.allowMod("Attendance") &&
                    <NavItem action="Attendance" onClick={this.onClick} title="+ Attendance"/>}
                {Permissions.allowMod("PPE") &&
                    <NavItem action="PPE" onClick={this.onClick} title="+ PPE"/>}
                {/*Permissions.allowOther("Planned Job Observations") && <NavItem action="Job Observation" onClick={this.onClick} title="+ Planned Job Observation"/>*/}
            </div>
        }).open();
    }

    @computed
    get shouldRender() {
        return Permissions.allowMod("__A_COVID_Management") ||
            (Permissions.hasModule('_17_Incident_Investigation') && Permissions.allowOther("Quick Incident")) ||
            Permissions.allowMod("_21_Internal_Audit") ||
            Permissions.allowMod("Attendance") ||
            Permissions.allowMod("PPE")/* ||
                Permissions.allowOther("Planned Job Observations")*/;
    }

    render() {
        const {isContractor, isContractorView} = storage.is;
        if (isContractor || isContractorView) {
            return null;
        }

        if (!this.shouldRender) {
            return null;
        }

        const path = 'plugin_sheq_assist/';
        return <React.Fragment>
            {/*<NewPlannedJobObservationDialog ref="newPlannedJobObservationDialog"/>*/}
            <NewPPERegisterDialog ref="newPPERegisterDialog"/>
            <NewScreeningDialog ref="newScreeningDialog"/>
            <NewIncidentQuickDialog ref="newQuickIncidentDialog"/>
            <NewIncidentDialog ref="newIncidentDialog"/>
            <NewCheckableDialog ref="newInspectionDialog" title="Inspection" type="Inspection"
                                path={path + '21_Internal_Audit/inspection/'}/>
            <NewAttendanceDialog ref="newAttendanceDialog"/>
            <NewAttendanceSelfDialog ref="newAttendanceSelfDialog"/>
            <Button ref="shortcuts" className="fa fa-share btn" hoverText="Shortcuts" onClick={this.onPopoverSettings}/>
            <Popover key="popover" ref="popover"/>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="UsersBtn">
@observer
class UsersBtn extends React.Component {

    render() {
        if (isAdminApp) {
            if (Permissions.disallowOther("Users"))
                return null;

            return <Button className="fa fa-users btn" module="Users" hoverText="Users"
                           onClick={defaultView.onOpenPage}/>;
        }
        const {isContractorViewVisited, isContractor, isEmployee} = storage.is;
        if (isContractorViewVisited || !loggedInApp.defaultView || isEmployee)
            return null;

        if(!isContractor) {
            if (Permissions.disallowOther("Users"))
                return null;
        }

        return <Button className="fa fa-users btn" module="Users" hoverText="Users" onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="QuestionsBtn">
@observer
class QuestionsBtn extends React.Component {

    render() {
        const {isContractorView, isContractor, isContractorViewIncContractorPack, isEmployee} = storage.is;
        if ((!isContractor && !isContractorView) || (isContractorView && !isContractorViewIncContractorPack) || isEmployee)
            return null;

        return <Button className="fa fa-question btn" module="__B_Contractors" hoverText="Questions"
                       onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeesBtn">
@observer
class EmployeesBtn extends React.Component {

    render() {
        if (isAdminApp) {
            return null;
        }
        const {isEmployee, isContractorView, isContractorViewIncContractorPack} = storage.is;
        if (!loggedInApp.defaultView || isEmployee)
            return null;
        if (isContractorView && !isContractorViewIncContractorPack)
            return null;

        if (!loggedInApp.defaultView || isEmployee || (isContractorView && !isContractorViewIncContractorPack))
            return null;
        if (!loggedInApp.defaultView || isEmployee || (isContractorView && !isContractorViewIncContractorPack))
            return null;
        if (!loggedInApp.defaultView || isEmployee || (isContractorView && !isContractorViewIncContractorPack))
            return null;

        if (!isContractorView) {
            if (Permissions.disallowMod("Employees"))
                return null;
        }

        return <Button className="fa fa-user-tie btn" module="Employees" hoverText="Employees"
                       onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

export {
    PluginsBtn,
    CalendarBtn,
    ChatsBtn,
    DashboardBtn,
    AuditTrailBtn,
    SelectOrgsBtn,
    SelectShortcutsBtn,
    UsersBtn,
    EmployeesBtn,
    QuestionsBtn
};
