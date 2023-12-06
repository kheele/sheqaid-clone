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
import WarningsRenderRow from "./WarningsRenderRow";
import {THead} from "components/tables";
import {
    ClearableInput,
    SelectEmployeeInput,
} from "components/inputs";

import byLogged from "./Query/List/listAllWarningByLogged";
import findByIdContractorHRWarningsDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRWarningsDashboardStatsByLogged";
import findByIdContractorHRWarningsDateRangeDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRWarningsDateRangeDashboardStatsByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "WarningsDialog";
    title = "Warnings";
    titleSingular = "Warning";
    permissionKey = "Warnings";
    module = "Warnings";
    filterNodeGrid = 5;

    dialogs = {
        NewDialog, EditDialog, ProfileDialog, ExportDialog,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    //<editor-fold desc="onBuildQuery">
    onBuildQuery(params) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            issued_by_id,
            witness_id,
            type,
            date,
        } = filterData || {};
        return {
            path: 'employees/docs/warnings',
            issued_by_id,
            witness_id,
            type,
            date,
        };
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;

        if (isContractorView) {
            return findByIdContractorHRWarningsDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRWarningsDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRWarningsDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRWarningsDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRWarningsDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRWarningsDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRWarningsDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRWarningsDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRWarningsDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isContractorView) {
            return findByIdContractorHRWarningsDateRangeDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRWarningsDateRangeDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRWarningsDateRangeDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRWarningsDateRangeDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRWarningsDateRangeDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const warning_types = ['Verbal', 'Written', 'Final'];
        return <>
            <SelectEmployeeInput ref="issued_by" name="issued_by" placeholder="Issued By..." className="form-control" onChange={onChange}/>
            <SelectEmployeeInput ref="witness" name="witness" placeholder="Witness..." className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="select" placeholder="Warning Type..." className="form-control" onChange={onChange} values={warning_types} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Warning Date..." className="form-control" onChange={onChange}/>
        </>;
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
                <div className="td">Issued By</div>
                <div className="td fixed-flex min-w-105">Witnesses</div>
                <div className="td">Warning Type</div>
                <div className="td">Details</div>
                <div className="td fixed-flex min-w-105">Warning Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <WarningsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
    // </editor-fold>

}

export default Dialog;
