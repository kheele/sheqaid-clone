// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, getRandomRolor} from 'utils/Utils';
import {
	ActionsButton,
	ClearableInput,
	DateRangeInput,
	SelectEmployeeInput,
	SelectJobPositionInput, SelectTrainingCourseInput,
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
import AuditTableRow from "../AuditTableRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'Internal Audit';
	titlePlural = 'Internal Audits';
	
	get excludePDF() {
		return true;
	}
	
	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	exportFn = sockets.of('audits').fn('export-excel');
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {},
		searchList: []
	};
	@observable
	filterData = {
		//
		client_id: null,
		project_id: null,
		site_id: null,
		//
		representative_id: null,
		auditor: null,
		//
		type: null,
		scope: null,
	};
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
	}
	
	// </editor-fold>
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			client_id,
			project_id,
			site_id,
			//
			representative_id,
			auditor,
			type,
			scope,
			date_range,
		} = filterData || {};
		
		const listByLogged = sockets.of('audits').fn('listByLogged');
		
		return listByLogged({
			client_id,
			project_id,
			site_id,
			//
			representative_id,
			auditor,
			type,
			scope,
			date_range,
			//
			exact_orgs: true,
			//
			limit: 0,
			offset: 0,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
	renderTHeadFrom() {
		return <THead>
			<div className="td fixed-flex min-w-40">ID</div>
			<div className="td fixed-flex min-w-110">Audit Date</div>
			<div className="td fixed-flex min-w-200">Audit Type</div>
			<div className="td fixed-flex min-w-200">Scope Of Audit</div>
			<div className="td fixed-flex min-w-200">Company</div>
			<div className="td">Auditor(s)</div>
			<div className="td">Company Representative(s)</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
		</THead>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderItemFrom">
	renderItemFrom(item, n, onClick, renderActionsCol) {
		return <AuditTableRow key={item.id} idx={n} item={item} isExport renderActionsCol={renderActionsCol}
		                      onClick={onClick}/>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFields">
	get renderFields() {
		return <>
			<SelectEmployeeInput name="representative_id" placeholder="Company Representative..." className="form-control"
			                     onChange={this.form.onChange}/>
			<ClearableInput name="auditor" type="text" placeholder="Auditor" className="form-control"
			                onChange={this.form.onChange}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput name="type" type="text" placeholder="Audit Type" className="form-control"
			                onChange={this.form.onChange}/>
			<ClearableInput name="scope" type="text" placeholder="Scope Of Audit" className="form-control"
			                onChange={this.form.onChange}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
			                placeholder="Audit Date Range" onChange={this.form.onChange}>
				<label className="min-w-65">From</label>
				<label className="min-w-50">To</label>
			</DateRangeInput>
		</>;
	}
	
	// </editor-fold>
}

export default ExportDialog;
