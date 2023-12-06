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
import LeavesRenderRow from "./LeavesRenderRow";
import {THead} from "components/tables";
import {
    ClearableInput
} from "components/inputs";

import findByIdContractorHRLeavesDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRLeavesDashboardStatsByLogged";
import findByIdContractorHRLeavesDateRangeDashboardStatsByLogged
    from "./Query/List/findByIdContractorHRLeavesDateRangeDashboardStatsByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
    pageKey = "LeavesDialog";
    title = "Leaves";
    titleSingular = "Leave";
    permissionKey = "Leaves";
    module = "Leaves";
    filterNodeGrid = 5;
    filterNodeMarginB = 35;

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
            type,
            due_to,
            date,
        } = filterData || {};
        return {
            path: 'employees/docs/leaves',
            type,
            due_to,
            date,
        };
    }
    //</editor-fold>

    //<editor-fold desc="loadDashboardTopStats">
    async loadDashboardTopStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;

        if (isContractorView) {
            return findByIdContractorHRLeavesDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRLeavesDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRLeavesDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRLeavesDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRLeavesDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRLeavesDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRLeavesDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRLeavesDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRLeavesDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="loadDashboardBottomStats">
    async loadDashboardBottomStats() {
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
        if (isContractorView) {
            return findByIdContractorHRLeavesDateRangeDashboardStatsByLogged();
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRLeavesDateRangeDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRLeavesDateRangeDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRLeavesDateRangeDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRLeavesDateRangeDashboardStatsByLogged();
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="renderFilterNodeAll">
    renderFilterNodeAll(onChange) {
        const types = ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Family Responsibility'];
        const due_to = [{label: 'Occurred Incident', value: 'Occurred Incident'}, {label: 'Other', value: 'Other'}];
        return <>
            <ClearableInput name="type" type="select" placeholder="Leave Type..." className="form-control" onChange={onChange} values={types} returnValue/>
            <ClearableInput name="due_to" type="select" placeholder="Leave Due To..." className="form-control" onChange={onChange} values={due_to} returnValue/>
            <ClearableInput name="date" type="date" placeholder="Start Date..." className="form-control" onChange={onChange}/>
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
                <div className="td fixed-flex min-w-180">Leave Type</div>
                <div className="td fixed-flex min-w-160">Leave Due To</div>
                <div className="td">Reason Of Leave</div>
                <div className="td fixed-flex min-w-120 font-size-12">Days Booked</div>
                <div className="td fixed-flex min-w-105">Start Date</div>
                <div className="td fixed-flex min-w-105">Expiry Date</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemAll">
    renderItemAll({item, idx, view, onClick}) {
        return <LeavesRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
    }
    // </editor-fold>

}

export default Dialog;
