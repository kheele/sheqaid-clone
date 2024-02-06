import React from "react";
import {observer} from 'mobx-react';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog, ViewReportPDFDialog} from 'components/dialogs';
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewBaselineRiskAssessmentDialog from './forms/NewBaselineRiskAssessmentDialog';
import ProfileBaselineRiskAssessmentDialog from './forms/ProfileBaselineRiskAssessmentDialog';
import EditBaselineRiskAssessmentDialog from './forms/EditBaselineRiskAssessmentDialog';
import ViewBaselineRiskAssessmentReportDialog from './forms/ViewBaselineRiskAssessmentReportDialog';

import style from "./BaselineRiskAssessmentTab.lazy.css";
import ExportBaselineRiskAssessmentDialog from "./forms/ExportBaselineRiskAssessmentDialog";
import AList from "views/AList";

@observer
class BaselineRiskAssessmentTab extends AList {

	pageKey = "baseline-risk-assessment";

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

		const listByLogged = sockets.of('hira-and-opportunities/baseline-ra').fn('listByLogged');
		
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
	
	// <editor-fold defaultstate="collapsed" desc="onExport">
	onExport(e, btn) {
		const {getDialogByRef} = this.refs.root;
		const exportDialog = getDialogByRef('exportDialog');
		exportDialog.open();
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
		this.refs.viewBaselineRiskAssessmentReportDialog.open(this.refs.root.list);
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
		const {hasProjects} = storage.is;
		return <THead>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Activity</div>
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
		console.log('Baseline RA', item)
		return <TRow key={"item-" + n}>
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
			pageTitle="Baseline Risk Assessment"
			pageTitleSingular="baseline risk assessment"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>

			<ProfileBaselineRiskAssessmentDialog ref="profileDialog"/>
			<NewBaselineRiskAssessmentDialog ref="newDialog"/>
			<EditBaselineRiskAssessmentDialog ref="editDialog"/>

			<ViewBaselineRiskAssessmentReportDialog ref="viewBaselineRiskAssessmentReportDialog"/>
			<ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Risk_Assessment_Baseline_Full_Report"
			                     title="Baseline Risk Assessment Full Report"/>
			<ExportBaselineRiskAssessmentDialog ref="exportDialog"/>
		</APageListReadWrite>;
	}
}

export default BaselineRiskAssessmentTab;
