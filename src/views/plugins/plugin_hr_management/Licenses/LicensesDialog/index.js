// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ExportDialog from '../ExportDialog.js';

import {NewDialog, EditDialog, ProfileDialog} from '../forms';

import AEmployeeDocDialog from '../../AEmployeeDocDialog';

import siteStore from "mutations/all/Site";
import projectStore from "mutations/all/Project";
import clientStore from "mutations/all/Client";
import companyStore from "mutations/all/Company";
import LicensesRenderRow from "./LicensesRenderRow";
import {THead} from "components/tables";

import byLogged from "./Query/List/listAllLicenseByLogged";
import findByIdContractorHRLicensesDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRLicensesDashboardStatsByLogged";
import findByIdContractorHRLicensesDateRangeDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRLicensesDateRangeDashboardStatsByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "LicensesDialog";
    title = "Licenses";
    titleSingular = "License";
    permissionKey = "Licenses";
    module = "Licenses";

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, ExportDialog,
    };

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
            return findByIdContractorHRLicensesDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRLicensesDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRLicensesDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRLicensesDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRLicensesDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRLicensesDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRLicensesDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRLicensesDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRLicensesDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isContractorView) {
            return findByIdContractorHRLicensesDateRangeDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRLicensesDateRangeDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRLicensesDateRangeDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRLicensesDateRangeDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRLicensesDateRangeDashboardStatsByLogged();
            }
        }
    };
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
        return <LicensesRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
    // </editor-fold>

}

export default Dialog;
