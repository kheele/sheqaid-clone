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

// import NewPPERegisterDialog from 'views/plugins/plugin_hr_management/other_modules/PPE/NewPPERegisterDialog.js';
import NewIncidentQuickDialog
    from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/NewIncidentQuickDialog.js';
import NewIncidentDialog from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/NewIncidentDialog.js';
import NewCheckableDialog from 'views/plugins/plugin_sheq_assist/Inspections/InspectionTab/forms/NewCheckableDialog.js';
import Divider from "@mui/material/Divider";
import {NewDialog as NewLeaveDialog} from "../plugins/plugin_hr_management/Leaves/forms";
import ProfileUserDialog from "../default/Users/ProfileDialog";
import EditUserDialog from '../default/Users/EditDialog';
import NewEmployeeDialog from 'views/plugins/plugin_hr_management/Employees/forms/NewDialog';
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
        const {isEmployee, isContractor, isContractorViewVisited, isContractorViewIncContractorPack} = storage.is;
        // if (!loggedInApp.defaultView || isEmployee || isContractor || isContractorViewVisited)
        return null;
        // return <Button ref="calendar" className="fa fa-calendar-alt btn" module="Calendar" hoverText="Calendar"
        //                onClick={defaultView.onOpenPage}/>;
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
        return <Button ref="dashboard" className="fa fa-tachometer-alt btn" module="Dashboard" hoverText="Dashboard"
                       hoverTextLeft
                       onClick={defaultView.onOpenPage}/>;
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
            return null;

        if (storage.is.isEmployee) {
            return null;
        }

        return <Button className="fa fa-file-text btn" module="AuditTrail" hoverText="Audit Log" hoverTextLeft
                       onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SettingsBtn">
@observer
class SettingsBtn extends React.Component {

    render() {
        const {isConsultant} = storage.is;
        const {clients} = storage.list;
//        if (!loggedInApp.defaultView)
//            return null;
        if (isConsultant && clients.isEmpty()) return null;

        if (Permissions.disallowOther("Settings"))
            return null;

        if (storage.is.isEmployee) {
            return null;
        }

        return <Button className="fa fa-gear btn" module="Settings" hoverText="Settings" hoverTextLeft
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
                <Divider/>
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
        if (isConsultant) {
            hoverText += 'Companies, ';
        }
        hoverText += 'Projects & Sites';

        return <React.Fragment>
            <Button ref="more" className="fa fa-project-diagram btn" hoverText={hoverText} hoverTextLeft
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

    @computed
    get shouldRender() {
        return (Permissions.hasModule('_17_Incident_Investigation') && Permissions.allowOther("Quick Incident")) ||
            Permissions.allowMod("_21_Internal_Audit") ||
            Permissions.allowMod("Attendance") ||
            Permissions.allowMod("PPE")/* ||
                Permissions.allowOther("Planned Job Observations")*/;
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
            case 'Leaves':
                if (isEmployee) {
                    const {loggedUser: {user}} = storage;
                    this.refs.newLeaveDialog.open(user);
                } else {
                    const {loggedUser: {user, user: {data: {linked_employee_id}}}} = storage;
                    if (!linked_employee_id) {
                        return infoDialog.action("Register As Employee", () => {
                            infoDialog.close();
                            this.refs.profileUserDialog.extraProp('linked_employee', true).open(user).then(() => {

                            });
                        }).open(<p>
                            Your Account is not linked to any Employee Profile.<br/>
                            Please link your account with your Employee Profile.
                        </p>);
                    }
                    this.refs.newLeaveDialog.open({id: linked_employee_id});
                }
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
                {Permissions.allowOther("Quick Incident") &&
                    <NavItem action="QuickIncident" onClick={this.onClick} title="+ Quick Incident"/>}
                {Permissions.allowMod("_21_Internal_Audit") &&
                    <NavItem action="Inspection" onClick={this.onClick} title="+ Inspection"/>}
                {Permissions.allowMod("Attendance") &&
                    <NavItem action="Attendance" onClick={this.onClick} title="+ Attendance"/>}
                {Permissions.allowMod("PPE") &&
                    <NavItem action="PPE" onClick={this.onClick} title="+ PPE"/>}
                <NavItem action="Leaves" onClick={this.onClick} title="+ Request Time-off"/>
                {/*Permissions.allowOther("Planned Job Observations") && <NavItem action="Job Observation" onClick={this.onClick} title="+ Planned Job Observation"/>*/}
            </div>
        }).open();
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
            {/*<NewPPERegisterDialog ref="newPPERegisterDialog"/>*/}
            <NewLeaveDialog ref="newLeaveDialog" isSelfRequest/>
            <NewIncidentQuickDialog ref="newQuickIncidentDialog"/>
            <NewIncidentDialog ref="newIncidentDialog"/>
            <NewCheckableDialog ref="newInspectionDialog" title="Inspection" type="Inspection"
                                path={path + '21_Internal_Audit/inspection/'}/>
            <NewAttendanceDialog ref="newAttendanceDialog"/>
            <NewAttendanceSelfDialog ref="newAttendanceSelfDialog"/>
            <ProfileUserDialog ref="profileUserDialog" EditDialog={EditUserDialog}
                               NewEmployeeDialog={NewEmployeeDialog}/>
            <Button ref="shortcuts" className="fa fa-share btn" hoverText="Shortcuts" hoverTextLeft
                    onClick={this.onPopoverSettings}/>
            <Popover key="popover" ref="popover"/>
        </React.Fragment>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="UsersBtn">
@observer
class UsersBtn extends React.Component {

    render() {
        const {isContractorViewVisited, isContractor, isEmployee} = storage.is;
        if (isContractorViewVisited || !loggedInApp.defaultView || isEmployee)
            return null;

        if (!isContractor) {
            if (Permissions.disallowOther("Users"))
                return null;
        }

        return <Button
            className="btn w-auto h-35 flex flex-center"
            module="Users"
            hoverText="Users" hoverTextLeft
            onClick={defaultView.onOpenPage}
        >
            <i className="fa fa-users font-size-20 margin-r-5"/> Users
        </Button>;
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

        return <Button className="fa fa-question btn" module="__B_Contractors" hoverText="Questions" hoverTextLeft
                       onClick={defaultView.onOpenPage}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeesBtn">
@observer
class EmployeesBtn extends React.Component {

    render() {
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

        return <Button
            className="btn w-auto h-35 flex flex-center"
            module="Employees"
            hoverText="Employees" hoverTextLeft
            onClick={defaultView.onOpenPage}
        >
            <i className="fa fa-user-tie font-size-20 margin-r-5"/> Employees
        </Button>;
    }
}

// </editor-fold>

export {
    PluginsBtn,
    CalendarBtn,
    ChatsBtn,
    DashboardBtn,
    AuditTrailBtn,
    SettingsBtn,
    SelectOrgsBtn,
    SelectShortcutsBtn,
    UsersBtn,
    EmployeesBtn,
    QuestionsBtn
};
