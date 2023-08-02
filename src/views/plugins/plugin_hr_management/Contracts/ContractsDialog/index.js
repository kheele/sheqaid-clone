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
import ContractsRenderRow from "./ContractsRenderRow";
import {THead} from "components/tables";
import {
	ClearableInput, SelectDepartmentInput,
	SelectEmployeeInput, SelectJobPositionInput, SelectTeamInput,
} from "components/inputs";

import byLogged from "./Query/List/listAllContractByLogged";
import findByIdContractorHRContractsDashboardStatsByLogged
	from "./Query/List/findByIdContractorHRContractsDashboardStatsByLogged";
import findByIdContractorHRContractsDateRangeDashboardStatsByLogged
	from "./Query/List/findByIdContractorHRContractsDateRangeDashboardStatsByLogged";

// </editor-fold>

@observer
class Dialog extends AEmployeeDocDialog {
	pageKey = "ContractsDialog";
	title = "Contracts";
	titleSingular = "Contract";
	permissionKey = "Contracts";
	module = "Contracts";

	dialogs = {
		NewDialog, EditDialog, ProfileDialog, ExportDialog,
	};

	// <editor-fold defaultstate="collapsed" desc="selfState">
	@observable
	selfState = {
		lists: {
			contract_type: ['Fixed Term', 'Permanent'].map(label => {
				return {label, value: label};
			}),
			payment_types: [{label: 'Salary (Fixed Payment)', value: 'Salary'}, {label: 'Hourly Wage', value: 'Wage'}],
			salary_intervals: [
				{label: 'Weekly', value: 'Weekly'},
				{label: 'Bi-Weekly', value: 'Bi-Weekly'},
				{label: 'Monthly', value: 'Monthly'}
			],
			expiry_date: [{label: 'No Expiry', value: 'null'}, {label: 'Expired', value: -1}, {
				label: '1 month',
				value: 1
			}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
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
			return findByIdContractorHRContractsDashboardStatsByLogged();
		} else {
			if (isConsultant) {
				console.log('load', 'isConsultant')
				if (selectedSite) {
					console.log('load', 'selectedSite')
					return siteStore.findByIdHRContractsDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					console.log('load', 'selectedProject')
					return projectStore.findByIdHRContractsDashboardStatsByLogged(selectedProject);
				} else if (selectedClient) {
					console.log('load', 'selectedClient')
					return clientStore.findByIdHRContractsDashboardStatsByLogged(selectedClient);
				} else {
					console.log('load', 'company')
					return companyStore.findByIdHRContractsDashboardStatsByLogged();
				}
			} else if (!isNoProjects) {//client with projects
				if (selectedSite) {
					return siteStore.findByIdHRContractsDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					return projectStore.findByIdHRContractsDashboardStatsByLogged(selectedProject);
				} else {
					return companyStore.findByIdHRContractsDashboardStatsByLogged();
				}
			} else {//client with no projects
				return companyStore.findByIdHRContractsDashboardStatsByLogged();
			}
		}
	};

	//</editor-fold>

	//<editor-fold desc="loadDashboardBottomStats">
	async loadDashboardBottomStats() {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;
		if (isContractorView) {
			return findByIdContractorHRContractsDateRangeDashboardStatsByLogged();
		} else {
			if (isConsultant) {
				console.log('load', 'isConsultant')
				if (selectedSite) {
					console.log('load', 'selectedSite')
					return siteStore.findByIdHRContractsDateRangeDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					console.log('load', 'selectedProject')
					return projectStore.findByIdHRContractsDateRangeDashboardStatsByLogged(selectedProject);
				} else if (selectedClient) {
					console.log('load', 'selectedClient')
					return clientStore.findByIdHRContractsDateRangeDashboardStatsByLogged(selectedClient);
				} else {
					console.log('load', 'company')
					return companyStore.findByIdHRContractsDateRangeDashboardStatsByLogged();
				}
			} else if (!isNoProjects) {//client with projects
				if (selectedSite) {
					return siteStore.findByIdHRContractsDateRangeDashboardStatsByLogged(selectedSite);
				} else if (selectedProject) {
					return projectStore.findByIdHRContractsDateRangeDashboardStatsByLogged(selectedProject);
				} else {
					return companyStore.findByIdHRContractsDateRangeDashboardStatsByLogged();
				}
			} else {//client with no projects
				return companyStore.findByIdHRContractsDateRangeDashboardStatsByLogged();
			}
		}
	};

	//</editor-fold>

	//<editor-fold desc="renderFilterNodeAll">
	renderFilterNodeAll(onChange) {
		return <div className="controls grid-5 grid-gap-5 padding-r-10 -margin-b-35">
			<SelectDepartmentInput name="department" placeholder="Department..." className="form-control" onChange={onChange}
			                       add={false}/>
			<SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
			                        onChange={onChange} add={false}/>
			<SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>

			<ClearableInput ref="contract_type" name="contract_type" type="select" placeholder="Contract Type..."
			                className="form-control" onChange={onChange} values={this.selfState.lists.contract_type}
			                returnValue/>
			<ClearableInput ref="payment_type" name="payment_type" type="select" placeholder="Payment Type..."
			                className="form-control" onChange={onChange} values={this.selfState.lists.payment_types}
			                returnValue/>
			<ClearableInput ref="salary_interval" name="salary_interval" type="select" placeholder="Salary Interval..."
			                className="form-control" onChange={onChange} values={this.selfState.lists.salary_intervals}
			                returnValue/>
			<ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control"
			                onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
		</div>;
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHeadAll">
	renderTHeadAll({view}) {
		const {isConsultant, isHasProjects, isContractor} = storage.is;
		if (view === 'Employee') {
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
				<div className="td fixed-flex min-w-140">Contract Type</div>
				<div className="td fixed-flex min-w-120">Payment Type</div>
				<div className="td fixed-flex min-w-140">Salary Interval</div>
				<div className="td fixed-flex min-w-150">Time Range</div>
				<div className="td fixed-flex min-w-140">Working Hours</div>
				<div className="td fixed-flex min-w-105">Start Date</div>
				<div className="td fixed-flex min-w-105">Expiry Date</div>
				<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
			</THead>;
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItemAll">
	renderItemAll({item, idx, view, onClick}) {
		return <ContractsRenderRow key={item.id} idx={idx} item={item} view={view} onClick={onClick}/>;
	}

	// </editor-fold>

}

export default Dialog;
