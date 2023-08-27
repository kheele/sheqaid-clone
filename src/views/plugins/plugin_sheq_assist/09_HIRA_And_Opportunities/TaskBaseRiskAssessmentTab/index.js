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
import byLogged from "./Query/List/listAllTaskBaseRiskAssessmentByLogged";

@observer
class TaskBaseRiskAssessmentTab extends React.Component {

	pageKey = "task-base-risk-assessment";

	constructor(props) {
		super(props);

		this.onLoadList = this.onLoadList.bind(this);

		this.onViewReport = this.onViewReport.bind(this);
		this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
		this.printImpl = this.printImpl.bind(this);

		this.renderItem = this.renderItem.bind(this);
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
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

		const limit = 50;

		const args = {
			removed: false,
			activity,
			risk_tolerance,
			//
			limit,
			//
			exact_orgs: true,
		};

		if(!isNew) {
			args.offset = this.refs.root.list.length;
		} else {
			args.offset = 0;
		}

		return byLogged(args).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}

	//</editor-fold>

	printImpl() {
		return neonBinding.events.emit(this.path + "create/pdf");
	}

	onSaveAsPDF(e, btn) {
		btn.text("Saving As PDF...").disabled();
		this.printImpl().then(res => {
			this.refs.viewReportPDFDialog.open(res);
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
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee || isContractorView;
		return !isReadonly && <div className="left-buttons pull-left">
			<Button className="btn btn-primary pull-right _888 min-w-90" onClick={this.onViewReport}>
				<i className="fa fa-eye icon-left"/> View Report
			</Button>
			<Button className="btn btn-primary pull-right _888 min-w-90" onClick={this.onSaveAsPDF}>
				<i className="fa fa-file-pdf-o icon-left"/> Save As PDF
			</Button>
		</div>;
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
			<ClearableInput name="activity" type="text" placeholder="Activity" className="form-control" onChange={onChange}/>
		</div>;
	}

	renderTHead() {
		const {isHasProjects} = storage.is;
		return <THead>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Description Of Task</div>
			{isHasProjects && <div className="td">Project</div>}
			{isHasProjects && <div className="td">Site</div>}
			<div className="td fixed-flex min-w-120">Risk Tolerance</div>
			<div className="td fixed-flex min-w-100">Revision Date</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	renderItem(n, onClick) {
		const {isHasProjects} = storage.is;

		const item = this.refs.root.list[n];
		const {id, data: {created_at, activity, expiry_date, risk_tolerance, list, client, project, site}} = item;
		console.log('TaskBase RA', item)
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{activity}</div>

			{isHasProjects && RenderUtils.renderOrgTD(project, null, 'Project')}
			{isHasProjects && RenderUtils.renderOrgTD(site, null, 'Site')}

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
			<ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Risk_Assessment_Task-Based_Full_Report"
			                     title="Task Base Risk Assessment Full Report"/>
		</APageListReadWrite>;
	}
}

export default TaskBaseRiskAssessmentTab;
