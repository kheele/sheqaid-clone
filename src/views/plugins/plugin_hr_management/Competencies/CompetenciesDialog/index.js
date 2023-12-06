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
import CompetenciesRenderRow from "./CompetenciesRenderRow";
import {THead} from "components/tables";
import {
	ClearableInput,
	SelectTrainingCourseInput
} from "components/inputs";

import findByIdContractorHRCompetenciesDashboardStatsByLogged
	from "./Query/List/findByIdContractorHRCompetenciesDashboardStatsByLogged";
import findByIdContractorHRCompetenciesDateRangeDashboardStatsByLogged
	from "./Query/List/findByIdContractorHRCompetenciesDateRangeDashboardStatsByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
	pageKey = "CompetenciesDialog";
	title = "Competencies";
	titleSingular = "Competency";
	permissionKey = "Competencies";
	module = "Competencies";
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
			type,
			competency_type,
			course_id,
		} = filterData || {};
		return {
			path: 'employees/docs/competencies',
			type,
			competency_type,
			course_id,
		};
	}
	//</editor-fold>

	//<editor-fold desc="loadDashboardTopStats">
	async loadDashboardTopStats() {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {isConsultant, isNoProjects, isContractorView} = storage.is;

		if (isContractorView) {
			return findByIdContractorHRCompetenciesDashboardStatsByLogged();
		} else {
			if (isConsultant) {
				console.log('load', 'isConsultant')
				if (selectedSite) {
					console.log('load', 'selectedSite')
					return siteStore.findByIdHRCompetenciesDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					console.log('load', 'selectedProject')
					return projectStore.findByIdHRCompetenciesDashboardStatsByLogged(selectedProject);
				} else if (selectedClient) {
					console.log('load', 'selectedClient')
					return clientStore.findByIdHRCompetenciesDashboardStatsByLogged(selectedClient);
				} else {
					console.log('load', 'company')
					return companyStore.findByIdHRCompetenciesDashboardStatsByLogged();
				}
			} else if (!isNoProjects) {//client with projects
				if (selectedSite) {
					return siteStore.findByIdHRCompetenciesDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					return projectStore.findByIdHRCompetenciesDashboardStatsByLogged(selectedProject);
				} else {
					return companyStore.findByIdHRCompetenciesDashboardStatsByLogged();
				}
			} else {//client with no projects
				return companyStore.findByIdHRCompetenciesDashboardStatsByLogged();
			}
		}
	};

	//</editor-fold>

	//<editor-fold desc="loadDashboardBottomStats">
	async loadDashboardBottomStats() {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
		if (isContractorView) {
			return findByIdContractorHRCompetenciesDateRangeDashboardStatsByLogged();
		} else {
			if (isConsultant) {
				console.log('load', 'isConsultant')
				if (selectedSite) {
					console.log('load', 'selectedSite')
					return siteStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					console.log('load', 'selectedProject')
					return projectStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedProject);
				} else if (selectedClient) {
					console.log('load', 'selectedClient')
					return clientStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedClient);
				} else {
					console.log('load', 'company')
					return companyStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged();
				}
			} else if (!isNoProjects) {//client with projects
				if (selectedSite) {
					return siteStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					return projectStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged(selectedProject);
				} else {
					return companyStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged();
				}
			} else {//client with no projects
				return companyStore.findByIdHRCompetenciesDateRangeDashboardStatsByLogged();
			}
		}
	};

	//</editor-fold>

	//<editor-fold desc="renderFilterNodeAll">
	renderFilterNodeAll(onChange) {
		const type = [{text: "Accredited", value: "Accredited"}, {text: "Non-Accredited", value: "Non-Accredited"}];
		const competency_type = [{label: 'Behavioural', value: 'Behavioural'}, {
			label: 'Technical / Functional',
			value: 'Technical / Functional'
		}, {label: 'Leadership', value: 'Leadership'}];
		return <>
			<SelectTrainingCourseInput name="course" placeholder="Course..." className="form-control" onChange={onChange}
			                           add={false}/>
			<ClearableInput name="type" type="radio" className="form-control" onChange={onChange} values={type} returnValue/>
			<ClearableInput name="competency_type" type="select" placeholder="Competency Type..." className="form-control"
			                onChange={onChange} values={competency_type} returnValue/>
			<ClearableInput name="issued_date" type="date" placeholder="Date Of Issue..." className="form-control"
			                onChange={onChange}/>
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
				<div className="td fixed-flex min-w-140">Accreditation No.</div>
				<div className="td fixed-flex min-w-120">Certificate Type</div>
				<div className="td fixed-flex min-w-160">Competency Type</div>
				<div className="td">Course</div>
				<div className="td fixed-flex min-w-105">Issued Date</div>
				<div className="td fixed-flex min-w-105">Expiry Date</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
			</THead>;
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemAll">
	renderItemAll({item, idx, view, onClick}) {
		return <CompetenciesRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
	}

	// </editor-fold>

}

export default Dialog;
