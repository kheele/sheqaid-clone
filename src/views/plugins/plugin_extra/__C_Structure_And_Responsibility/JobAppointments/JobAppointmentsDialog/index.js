// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from "mobx";

import ExportDialog from '../ExportDialog.js';

import {NewDialog, EditDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from 'views/plugins/plugin_hr_management/AEmployeeDocDialog';

import siteStore from "mutations/all/Site";
import projectStore from "mutations/all/Project";
import clientStore from "mutations/all/Client";
import companyStore from "mutations/all/Company";
import JobAppointmentsRenderRow from "./JobAppointmentsRenderRow";
import {THead} from "components/tables";
import {
    ClearableInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTrainingCourseInput
} from "components/inputs";

import * as listAllJobAppointmentByLogged from "./Query/List/listAllJobAppointmentByLogged";
// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "JobAppointmentsDialog";
    title = "Job Appointments";
    titleSingular = "Job Appointment";
    permissionKey = "Job Appointments";
    module = "JobAppointments";

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, ExportDialog,
    };

    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    //<editor-fold desc="onBuildQuery">
    onBuildQuery() {
        return listAllJobAppointmentByLogged;
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isConsultant) {
            console.log('load', 'isConsultant')
            if (selectedSite) {
                console.log('load', 'selectedSite')
                return siteStore.findByIdHRJobAppointmentsDashboardStatsByLogged(selectedSite);
            } else if (selectedProject) {
                console.log('load', 'selectedProject')
                return projectStore.findByIdHRJobAppointmentsDashboardStatsByLogged(selectedProject);
            } else if (selectedClient) {
                console.log('load', 'selectedClient')
                return clientStore.findByIdHRJobAppointmentsDashboardStatsByLogged(selectedClient);
            } else {
                console.log('load', 'company')
                return companyStore.findByIdHRJobAppointmentsDashboardStatsByLogged();
            }
        } else if (!isNoProjects) {//client with projects
            if (selectedSite) {
                return siteStore.findByIdHRJobAppointmentsDashboardStatsByLogged(selectedSite);
            } else if (selectedProject) {
                return projectStore.findByIdHRJobAppointmentsDashboardStatsByLogged(selectedProject);
            } else {
                return companyStore.findByIdHRJobAppointmentsDashboardStatsByLogged();
            }
        } else {//client with no projects
            return companyStore.findByIdHRJobAppointmentsDashboardStatsByLogged();
        }
    };
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isConsultant) {
            console.log('load', 'isConsultant')
            if (selectedSite) {
                console.log('load', 'selectedSite')
                return siteStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedSite);
            } else if (selectedProject) {
                console.log('load', 'selectedProject')
                return projectStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedProject);
            } else if (selectedClient) {
                console.log('load', 'selectedClient')
                return clientStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedClient);
            } else {
                console.log('load', 'company')
                return companyStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged();
            }
        } else if (!isNoProjects) {//client with projects
            if (selectedSite) {
                return siteStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedSite);
            } else if (selectedProject) {
                return projectStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged(selectedProject);
            } else {
                return companyStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged();
            }
        } else {//client with no projects
            return companyStore.findByIdHRJobAppointmentsDateRangeDashboardStatsByLogged();
        }
    };
    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        return <div className="controls grid-3 grid-gap-5 -margin-b-35 padding-r-10">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput name="date" type="date" placeholder="Start Date..." className="form-control" onChange={onChange}/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadAll">
    renderTHeadAll({view}) {
        const {isConsultant, isHasProjects, isContractor} = storage.is;
        if(view === 'Employee') {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td">Department</div>
                <div className="td">Job Position</div>
                {isHasProjects && <div className="td sm-hidden">Location</div>}
                <div className="td fixed-flex min-w-105">Latest On</div>
                <div className="td fixed-flex min-w-240">Stats</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td fixed-flex min-w-105">Start Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <JobAppointmentsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
    // </editor-fold>

}

export default Dialog;
