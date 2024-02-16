// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ActionsButton, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewTeamDialog from "./NewTeamDialog";
import ProfileTeamDialog from "./ProfileTeamDialog";
import EditTeamDialog from "./EditTeamDialog";

import style from "./TeamsDialog.lazy.css";
import AggregateStat from "components/AggregateStat";
import updateTeam from "mutations/all/Team/updateTeam";
import {Tabs} from "components/tabs";
import ActiveTab from "../ActiveTab";
import RemovedTab from "../RemovedTab";
import ADialogTab from "views/ADialogTab";

// </editor-fold>

@observer
class TeamsDialog extends ADialogTab {
	path;
	pageKey = "TeamsDialog";
	title = "Teams";
	titleSingular = "Team";
	permissionKey = "Teams";
	onUpdate = updateTeam;
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.path = props.path + 'teams/';
		
		this.onBuildQuery = this.onBuildQuery.bind(this);
		
		this.renderFilterNode = this.renderFilterNode.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="mounts">
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount() {
		style.unuse();
	}
	
	// </editor-fold>
	
	//<editor-fold desc="onBuildQuery">
	onBuildQuery(filterData = {}) {
		const {
			name,
			supervisor_id,
			employee_id,
		} = filterData || {};
		
		return {
			path: "teams",
			attrs: {
				name,
				supervisor_id,
				employee_id,
			},
		};
	}
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFuns">
	//<editor-fold desc="renderFilterNode">
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="name" type="text" placeholder="Team Name" className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="supervisor" placeholder="Supervisor..." className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
		</div>;
	}
	//</editor-fold>
	
	//<editor-fold desc="renderTHead">
	renderTHead() {
		const {isConsultant} = storage.is;
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Supervisor</div>
			<div className="td">Team Name</div>
			{isConsultant && <div className="td">Company</div>}
			<div className="td fixed-flex min-w-200">Stats</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	//</editor-fold>
	
	//<editor-fold desc="renderItem">
	renderItem(item, idx, onClick) {
		const {
			id,
			data: {
				created_at, supervisor, name, status,
				company, client, project, site,
				employee_list_aggregate, ppe_type_list_aggregate
			}
		} = item;
		
		const {isConsultant} = storage.is;

//        console.log(item)
		return <TRow key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{supervisor ? `${supervisor.lname} ${supervisor.fname}` : 'N/A'}</div>
			<div className="td">{name}</div>
			{isConsultant && <div className="td">
				{client ? client.name : 'All'}
			</div>}
			<div className="td fixed-flex min-w-200 flex td-stats">
				<StatsPanel item={item}/>
			</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	//</editor-fold>
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderPage">
	renderPage() {
		const {onUpdate, onBuildQuery, titleSingular, title, permissionKey, renderFilterNode, renderTHead, renderItem} = this;
		
		return <Tabs
			key="tabs"
			ref="mainTabs"
			permissionKey={permissionKey}
			index={this.state.index}
			onChange={this.onChange}
		>
			<ActiveTab
				ref="activeTab"
				onUpdate={onUpdate}
				onBuildQuery={onBuildQuery}
				title="Active"
				titleSingular={titleSingular}
				titlePlural={title}
				renderFilterNode={renderFilterNode}
				renderTHead={renderTHead}
				renderItem={renderItem}
				NewDialog={NewTeamDialog}
				ProfileDialog={ProfileTeamDialog}
				EditDialog={EditTeamDialog}
				permissionKey={permissionKey}
			/>
			<RemovedTab
				ref="removedTab"
				onUpdate={onUpdate}
				onBuildQuery={onBuildQuery}
				title="Removed"
				titleSingular={titleSingular}
				titlePlural={title}
				renderFilterNode={renderFilterNode}
				renderTHead={renderTHead}
				renderItem={renderItem}
				ProfileDialog={ProfileTeamDialog}
				permissionKey={permissionKey}
			/>
		</Tabs>;
	}
	
	// </editor-fold>
	
}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {
	
	render() {
		const {
			data: {
				employee_list_aggregate, ppe_type_list_aggregate,
			}
		} = this.props.item;
		
		return <>
			<AggregateStat title="Employees" value={employee_list_aggregate}/>
			<AggregateStat title="PPE" value={ppe_type_list_aggregate}/>
		</>;
	}
}

// </editor-fold>

export default TeamsDialog;
