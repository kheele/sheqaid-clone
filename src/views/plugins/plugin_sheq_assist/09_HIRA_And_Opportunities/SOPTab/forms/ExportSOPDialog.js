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
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
	titleSingular = 'Safe Operating Procedure';
	titlePlural = 'Safe Operating Procedures';
	
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
	path = "plugin_sheq_assist/09_HIRA_And_Opportunities/sop/";
	
	// <editor-fold defaultstate="collapsed" desc="fields">
	@observable
	state = {
		lists: {
			category: [{text: 'Machine', value: 'Machine'}, {text: 'Task', value: 'Task'}, {text: 'Action', value: 'Action'}],
			risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}],
		},
		searchList: [],
	};
	
	@observable
	filterData = {
		//
		client_id: null,
		project_id: null,
		site_id: null,
		//
		category: null,
		risk_level: null,
		location: null,
		prepared_by_id: null,
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
			category,
			risk_level,
			location,
			prepared_by_id,
		} = filterData || {};
		
		const listByLogged = sockets.of('hira-and-opportunities/sop').fn('listByLogged');
		
		return listByLogged({
			client_id,
			project_id,
			site_id,
			//
			category,
			risk_level,
			location,
			prepared_by_id,
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
			<div className="td fixed-flex min-w-30">ID</div>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Prepared By</div>
			<div className="td">Category</div>
			<div className="td">Location</div>
			<div className="td">Risk Level</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
		</THead>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderItemFrom">
	renderItemFrom(item, n, onClick, renderActionsCol) {
		const {
			id, data: {
				created_at,
				//
				category,
				risk_level,
				location,
				prepared_by,
				date_created,
				date_revised,
				doc
			}
		} = item;
		
		return <>
			<div className="td fixed-flex min-w-30">{id}</div>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{prepared_by ? prepared_by.full_name : 'N/A'}</div>
			<div className="td">{category}</div>
			<div className="td">{location}</div>
			<div className="td">{risk_level}</div>
			{renderActionsCol && renderActionsCol(item, n, onClick)}
		</>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFields">
	get renderFields() {
		return <>
			<SelectEmployeeInput ref="prepared_by_id" name="prepared_by_id" placeholder="Prepared By..."
			                     className="col-lg-12 form-control"
			                     onChange={this.form.onChange}/>
			<hr className="pull-left no-border bg-ddd h-2"/>
			<ClearableInput ref="category" name="category" type="radio" placeholder="Category"
			                className="col-lg-12 form-control"
			                onChange={this.form.onChange}
			                values={this.state.lists.category}/>
			<ClearableInput ref="risk_level" name="risk_level" type="radio" placeholder="Risk Level"
			                className="col-lg-12 form-control"
			                onChange={this.form.onChange}
			                values={this.state.lists.risk_level}/>
			<ClearableInput ref="location" name="location" type="text" placeholder="Location"
			                className="col-lg-12 form-control"
			                onChange={this.form.onChange}/>
		</>;
	}
	
	// </editor-fold>
}

export default ExportDialog;
