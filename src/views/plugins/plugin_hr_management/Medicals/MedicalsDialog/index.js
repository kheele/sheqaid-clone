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
import MedicalsRenderRow from "./MedicalsRenderRow";
import {THead} from "components/tables";
import {
    ClearableInput, SelectDepartmentInput,
    SelectEmployeeInput, SelectJobPositionInput, SelectTeamInput,
} from "components/inputs";

import byLogged from "./Query/List/listAllMedicalByLogged";
import findByIdContractorHRMedicalsDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRMedicalsDashboardStatsByLogged";
import findByIdContractorHRMedicalsDateRangeDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRMedicalsDateRangeDashboardStatsByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "MedicalsDialog";
    title = "Medicals";
    titleSingular = "Medical";
    permissionKey = "Medicals";
    module = "Medicals";

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, ExportDialog,
    };

    // <editor-fold defaultstate="collapsed" desc="selfState">
    @observable
    selfState = {
        lists: {
            annexture_3: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
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
            return findByIdContractorHRMedicalsDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRMedicalsDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRMedicalsDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRMedicalsDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRMedicalsDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRMedicalsDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRMedicalsDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRMedicalsDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRMedicalsDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isContractorView) {
            return findByIdContractorHRMedicalsDateRangeDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRMedicalsDateRangeDashboardStatsByLogged();
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

            <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?" className="form-control" onChange={onChange} values={this.selfState.lists.annexture_3} returnValue/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadAll">
    renderTHeadAll({view}) {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        if(view === 'Employee') {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td">Department</div>
                <div className="td">Job Position</div>
                {hasProjects && <div className="td sm-hidden">Location</div>}
                <div className="td fixed-flex min-w-105">Latest On</div>
                <div className="td fixed-flex min-w-240">Stats</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        } else {
            return <THead>
                <div className="td fixed-flex min-w-50">ID</div>
                <div className="td">Employee</div>
                <div className="td">Restrictions</div>
                <div className="td fixed-flex min-w-120">Annexture 3?</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <MedicalsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
    // </editor-fold>

}

export default Dialog;
