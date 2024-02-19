// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {THead, TRow} from "components/tables";
import {
	ActionsButton,
	Button, Clickable,
} from "components/inputs";
import MKBox from "components/MK/MKBox";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PPEIssueRenderRow">
@observer
class PPEIssueRenderRow extends React.Component {
	
	get view() {
		return this.props.view;
	}
	
	get isEmployee() {
		return this.view === 'Employee';
	}
	
	get isTeam() {
		return this.view === 'Team';
	}
	
	get isDepartment() {
		return this.view === 'Department';
	}
	
	get isJobPosition() {
		return this.view === 'Job Position';
	}
	
	get isPPEType() {
		return this.view === 'PPE Type';
	}
	
	render() {
		const {item, idx, view, onClick, onIssuePPE, onView, readonly, disableOneChange, renderActionsCol} = this.props;
		
		console.log(item)
		
		if (this.isEmployee) {
			return <PPEIssueRenderRowByEmployee
				idx={idx}
				item={item}
				disableOneChange={disableOneChange}
				renderActionsCol={renderActionsCol}
				readonly={readonly}
				onIssuePPE={onIssuePPE}
				onView={onView}
				onClick={onClick}
			/>;
		}
		
		return null;
	}
	
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PPEIssueRenderRowByEmployee">
@observer
class PPEIssueRenderRowByEmployee extends React.Component {
	
	render() {
		const {item, idx, onClick, onIssuePPE, onView, readonly, disableOneChange, renderActionsCol} = this.props;
		const {id, data: {full_name, job_position, department, team, ppe_type_list, ppe_item_list}} = item;
		
		console.log(item)
		
		const disabled = ppe_type_list.filter(v => !v.is_issued).isEmpty();
		
		return <TRow key={"item-" + id} className="w-full">
			<div className="td fixed-flex min-w-60">{id}</div>
			<div className="td">{full_name}</div>
			<div className="td">{job_position && job_position.name || 'N/A'}</div>
			<div className="td">{department && department.name || 'N/A'}</div>
			<div className="td">{team && team.name || 'N/A'}</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-150">
				<Button idx={idx} className="btn btn-primary pull-right min-w-100 margin-r-10" onClick={onIssuePPE}>
					Issue PPE
				</Button>
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	
}

// </editor-fold>

export {PPEIssueRenderRow};
