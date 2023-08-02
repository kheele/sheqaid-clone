// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from "mobx";

import ExportDialog from '../ExportDialog.js';

import {NewDialog, EditDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';

import siteStore from "mutations/all/Site";
import projectStore from "mutations/all/Project";
import clientStore from "mutations/all/Client";
import companyStore from "mutations/all/Company";
import WorkPermitsRenderRow from "./WorkPermitsRenderRow";
import {THead} from "components/tables";
import {
    ClearableInput, SelectDepartmentInput,
    SelectEmployeeInput, SelectJobPositionInput, SelectTeamInput,
} from "components/inputs";

import byLogged from "./Query/List/listAllWorkPermitByLogged";
import findByIdContractorHRWorkPermitsDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRWorkPermitsDashboardStatsByLogged";
import findByIdContractorHRWorkPermitsDateRangeDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRWorkPermitsDateRangeDashboardStatsByLogged";
// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "WorkPermitsDialog";
    title = "Work Permits";
    titleSingular = "Work Permit";
    permissionKey = "WorkPermits";
    module = "WorkPermits";

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
    onBuildQuery(args) {
        return byLogged(args);
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;

        if (isContractorView) {
            return findByIdContractorHRWorkPermitsDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRWorkPermitsDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRWorkPermitsDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRWorkPermitsDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRWorkPermitsDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRWorkPermitsDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRWorkPermitsDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRWorkPermitsDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRWorkPermitsDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isContractorView) {
            return findByIdContractorHRWorkPermitsDateRangeDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRWorkPermitsDateRangeDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        return <div className="controls grid-4 grid-gap-5 padding-r-10 -margin-b-35">
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control" onChange={onChange} add={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control" onChange={onChange} add={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>

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
                <div className="td">Notes</div>
                <div className="td fixed-flex min-w-105">Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <WorkPermitsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
    // </editor-fold>

}

export default Dialog;
