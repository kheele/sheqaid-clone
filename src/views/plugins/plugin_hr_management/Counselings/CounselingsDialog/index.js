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
import CounselingsRenderRow from "./CounselingsRenderRow";
import {THead} from "components/tables";
import {
	ClearableInput,
	SelectEmployeeInput,
} from "components/inputs";

import findByIdContractorHRCounselingsDashboardStatsByLogged
	from "./Query/List/findByIdContractorHRCounselingsDashboardStatsByLogged";
import findByIdContractorHRCounselingsDateRangeDashboardStatsByLogged
	from "./Query/List/findByIdContractorHRCounselingsDateRangeDashboardStatsByLogged";
import updateEmployeeCounselling from "mutations/all/EmployeeCounselling/updateEmployeeCounselling";
// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
	pageKey = "CounsellingsDialog";
	title = "Counsellings";
	titleSingular = "Counselling";
	permissionKey = "Counseling";
	module = "Counseling";
	onUpdate = updateEmployeeCounselling;
	hasSignatures = true;
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
			responsible_person_id,
			types,
			reasons,
		} = filterData || {};
		return {
			path: 'employees/docs/counsellings',
			responsible_person_id,
			types,
			reasons,
		};
	}
	//</editor-fold>

	//<editor-fold desc="loadDashboardTopStats">
	async loadDashboardTopStats() {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;

		if (isContractorView) {
			return findByIdContractorHRCounselingsDashboardStatsByLogged();
		} else {
			if (isConsultant) {
				console.log('load', 'isConsultant')
				if (selectedSite) {
					console.log('load', 'selectedSite')
					return siteStore.findByIdHRCounselingsDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					console.log('load', 'selectedProject')
					return projectStore.findByIdHRCounselingsDashboardStatsByLogged(selectedProject);
				} else if (selectedClient) {
					console.log('load', 'selectedClient')
					return clientStore.findByIdHRCounselingsDashboardStatsByLogged(selectedClient);
				} else {
					console.log('load', 'company')
					return companyStore.findByIdHRCounselingsDashboardStatsByLogged();
				}
			} else if (!isNoProjects) {//client with projects
				if (selectedSite) {
					return siteStore.findByIdHRCounselingsDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					return projectStore.findByIdHRCounselingsDashboardStatsByLogged(selectedProject);
				} else {
					return companyStore.findByIdHRCounselingsDashboardStatsByLogged();
				}
			} else {//client with no projects
				return companyStore.findByIdHRCounselingsDashboardStatsByLogged();
			}
		}
	};

	//</editor-fold>

	//<editor-fold desc="loadDashboardBottomStats">
	async loadDashboardBottomStats() {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
		if (isContractorView) {
			return findByIdContractorHRCounselingsDateRangeDashboardStatsByLogged();
		} else {
			if (isConsultant) {
				console.log('load', 'isConsultant')
				if (selectedSite) {
					console.log('load', 'selectedSite')
					return siteStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					console.log('load', 'selectedProject')
					return projectStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedProject);
				} else if (selectedClient) {
					console.log('load', 'selectedClient')
					return clientStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedClient);
				} else {
					console.log('load', 'company')
					return companyStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged();
				}
			} else if (!isNoProjects) {//client with projects
				if (selectedSite) {
					return siteStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					return projectStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged(selectedProject);
				} else {
					return companyStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged();
				}
			} else {//client with no projects
				return companyStore.findByIdHRCounselingsDateRangeDashboardStatsByLogged();
			}
		}
	};

	//</editor-fold>

	//<editor-fold desc="renderFilterNodeAll">
	renderFilterNodeAll(onChange) {
		const types = [
			'Directive Counseling',
			'Nondirective Counseling',
			'Cooperative Counseling',
			'Participative Counseling',
			'Desensitization',
			'Catharsis',
			'Insight',
			'Developing the new patterns'
		].map(label => {
			return {label, value: label};
		});
		const reasons = [
			'Attendance',
			'Behaviour / Teamwork',
			'Inappropriate Conduct',
			'Inappropriate Dress',
			'Safety Violation',
			'Sleeping On The Job',
			'Substandard Work',
			'Violence'
		].map(label => {
			return {label, value: label};
		});
		return <>
			<SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." className="form-control"
			                     onChange={onChange}/>
			<ClearableInput name="types" type="select_multi" placeholder="Counseling Types..." className="form-control"
			                onChange={onChange} values={types} returnValue add/>
			<ClearableInput name="reasons" type="select_multi" placeholder="Reasons For Counseling..."
			                className="form-control" onChange={onChange} values={reasons} returnValue
			                add/>
		</>;
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadAll">
	renderTHeadAll({view}) {
		const {isConsultant, hasProjects, isContractor} = storage.is;
		if (view === 'Employee') {
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
				<div className="td fixed-flex min-w-140">Responsible Person</div>
				<div className="td fixed-flex min-w-120">Counseling Types</div>
				<div className="td fixed-flex min-w-160">Reasons For Counseling</div>
				<div className="td fixed-flex min-w-105">Date Created</div>
				<div className="td fixed-flex min-w-105">Completion Date</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
			</THead>;
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemAll">
	renderItemAll({item, idx, view, onClick}) {
		return <CounselingsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
	}

	// </editor-fold>

}

export default Dialog;
