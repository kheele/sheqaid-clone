import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog, ViewReportPDFDialog} from 'components/dialogs';
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTaskBaseRiskAssessmentDialog from './forms/NewTaskBaseRiskAssessmentDialog';
import ProfileTaskBaseRiskAssessmentDialog from './forms/ProfileTaskBaseRiskAssessmentDialog';
import EditTaskBaseRiskAssessmentDialog from './forms/EditTaskBaseRiskAssessmentDialog';
import ViewTaskBaseRiskAssessmentReportDialog from './forms/ViewTaskBaseRiskAssessmentReportDialog';

import style from "./TaskBaseRiskAssessmentTab.lazy.css";
import AList from "views/AList";
import ViewDocumentDialog from "../../../../../components/dialogs/ViewDocumentDialog";
import ExportBaselineRiskAssessmentDialog from "../BaselineRiskAssessmentTab/forms/ExportBaselineRiskAssessmentDialog";
import ExportTaskBaseRiskAssessmentDialog from "./forms/ExportTaskBaseRiskAssessmentDialog";

@observer
class TaskBaseRiskAssessmentTab extends AList {

	pageKey = "task-base-risk-assessment";

	constructor(props) {
		super(props);

		this.onViewReport = this.onViewReport.bind(this);
		this.printImpl = this.printImpl.bind(this);
	}

	componentWillMount() {
		style.use();
	}

	componentWillUnmount() {
		style.unuse();
	}

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			activity,
			risk_tolerance,
		} = filterData || {};

		const listByLogged = sockets.of('hira-and-opportunities/task-based-ra').fn('listByLogged');
		
		return listByLogged({
			activity,
			risk_tolerance,
			//
			exact_orgs: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}

	//</editor-fold>

	printImpl() {
		const createPDF = sockets.of('hira-and-opportunities/task-based-ra').fn('createPDF');
		
		const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
		const {selectedClient, selectedProject, selectedSite,} = storage.selected;
		
		const company_id = sess_company_id;
		const client_id = selectedClient && selectedClient.id;
		const project_id = selectedProject && selectedProject.id;
		const site_id = selectedSite && selectedSite.id;
		
		return createPDF({
			company_id,
			client_id,
			project_id,
			site_id,
		}).then((res) => {
			console.log('createPDF res', res)
			return res;
		});
	}

	onSaveAsPDF(e, btn) {
		btn.text("Saving As PDF...").disabled();
		this.printImpl().then(res => {
			this.refs.viewReportPDFDialog.open({path: res, previewPath: res});
			infoDialog.open("Record successfully saved as PDF.");
			infoDialog.close(2000);
		}).finally(() => {
			btn.text("Save As PDF").enabled();
		});
	}

	onViewReport() {
		this.refs.viewTaskBaseRiskAssessmentReportDialog.open(this.refs.root.list);
	}

	renderLeftButtons() {
		return null;
		// const {isEmployee, isContractorView} = storage.is;
		// const isReadonly = isEmployee || isContractorView;
		// return !isReadonly && <div className="left-buttons pull-left">
		// 	<Button className="btn btn-primary pull-right _888 min-w-90" onClick={this.onViewReport}>
		// 		<i className="fa fa-eye icon-left"/> View Report
		// 	</Button>
		// 	<Button className="btn btn-primary pull-right _888 min-w-90" onClick={this.onSaveAsPDF}>
		// 		<i className="fa fa-file-pdf-o icon-left"/> Save As PDF
		// 	</Button>
		// </div>;
	}

	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
		</Options>;
	}

	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls">
			<ClearableInput name="activity" type="text" placeholder="Description of Task" className="form-control" onChange={onChange}/>
		</div>;
	}

	renderTHead() {
		const {hasProjects} = storage.is;
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Description Of Task</div>
			{hasProjects && <div className="td">Project</div>}
			{hasProjects && <div className="td">Site</div>}
			<div className="td fixed-flex min-w-120">Risk Tolerance</div>
			<div className="td fixed-flex min-w-100">Revision Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	renderItem(n, onClick) {
		const {hasProjects} = storage.is;

		const item = this.refs.root.list[n];
		const {id, data: {created_at, activity, expiry_date, risk_tolerance, list, client, project, site}} = item;
		console.log('TaskBase RA', item)
		return <TRow key={"item-" + id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{activity}</div>
			
			{hasProjects && RenderUtils.renderOrgTD(project, null, 'Project')}
			{hasProjects && RenderUtils.renderOrgTD(site, null, 'Site')}
			
			<div className="td fixed-flex min-w-120">{!!risk_tolerance ? String(risk_tolerance) : 'N/A'}</div>
			<div className="td fixed-flex min-w-100">{Dates.formatDate(expiry_date) || 'N/A'}</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	
	render() {
		return <APageListReadWrite
			hasBackBtn={false}
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={this.pageKey + "-tab"}
			pageTitle="Task Base Risk Assessment"
			pageTitleSingular="task base risk assessment"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>

			<ProfileTaskBaseRiskAssessmentDialog ref="profileDialog"/>
			<NewTaskBaseRiskAssessmentDialog ref="newDialog"/>
			<EditTaskBaseRiskAssessmentDialog ref="editDialog"/>

			<ViewTaskBaseRiskAssessmentReportDialog ref="viewTaskBaseRiskAssessmentReportDialog"/>
			<ViewDocumentDialog ref="viewReportPDFDialog" title="Task Base Risk Assessment Full Report" showDownload
			                    fileName="Risk_Assessment_Task-Based_Full_Report"/>
			<ExportTaskBaseRiskAssessmentDialog ref="exportDialog"/>
		</APageListReadWrite>;
	}
}

export default TaskBaseRiskAssessmentTab;
