// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Permissions} from 'utils/Utils';
import {ActionsButton, Button, ClearableInput, Clickable, SelectJobCategoryInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ImportJobPositionsDialog from "./ImportJobPositionsDialog";
import NewJobPositionDialog from "./NewJobPositionDialog";
import ProfileJobPositionDialog from "./ProfileJobPositionDialog";
import EditJobPositionDialog from "./EditJobPositionDialog";

import style from "./JobPositionsDialog.lazy.css";
import AggregateStat from "components/AggregateStat";
import updateJobPosition from "mutations/all/JobPosition/updateJobPosition";
import ADialogTab from "views/ADialogTab";
import {Tabs} from "components/tabs";
import ActiveTab from "../ActiveTab";
import RemovedTab from "../RemovedTab";

// </editor-fold>

@observer
class JobPositionsDialog extends ADialogTab {
	path;
	pageKey = "JobPositionsDialog";
	title = "Job Positions";
	titleSingular = "Job Position";
	permissionKey = "Job Positions";
	onUpdate = updateJobPosition;
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.path = props.path + 'job-positions/';
		
		this.onBuildQuery = this.onBuildQuery.bind(this);
		
		this.onImport = this.onImport.bind(this);
		this.onViewByDoc = this.onViewByDoc.bind(this);
		
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="componentWillMount">
	componentWillMount() {
		style.use();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
	componentWillUnmount() {
		style.unuse();
	}
	
	// </editor-fold>
	
	//<editor-fold desc="onBuildQuery">
	onBuildQuery(filterData = {}) {
		const {
			name,
			job_category_id,
		} = filterData || {};
		
		return {
			path: "job-positions",
			attrs: {
				name,
				job_category_id,
				exact_orgs_company: true,
			},
		};
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onSoftDeleteProhibit">
	onSoftDeleteProhibit(item) {
		const {id, data: {employee_list_aggregate}} = item;
		const prohibit = employee_list_aggregate.aggregate.count > 0;
		if (prohibit) {
			infoDialog.open(<p>
				The Job Position can't be removed while<br/>
				there are employees attached to it.<br/><br/>
				Please first remove the employees or assign<br/>
				them to other Job Position(s) before removing<br/>
				this Job Position.
			</p>);
		}
		return prohibit;
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="actions">
	onImport(e, btn) {
		this.refs.importDialog.open().then(list => {
			this.refs.root.list.push(...list);
		});
	}
	
	onViewByDoc(e, btn) {
		const {idx} = btn.props;
		const {mainTabs} = this.refs;
		
		let tabKey;
		if (mainTabs.state.activeIndex === 0) {
			tabKey = "activeTab";
		} else {
			tabKey = "removedTab";
		}
		mainTabs.getTabByRef(tabKey).refs.root.onView(e, btn);
	}
	
	// </editor-fold>
	
	//<editor-fold desc="renderFuns">
	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee || isContractorView;
		if (isReadonly) return null;
		const {permissions_other} = storage.loggedUser.user.data;
		const permissions_other_JobPositions = (permissions_other || []).find(v => v.key === this.permissionKey);
		
		return <div className="left-buttons pull-left">
			{Permissions.allow(permissions_other_JobPositions) &&
				<Button className="btn btn-primary pull-right min-w-110" onClick={this.onImport}>
					Import Job Positions
				</Button>}
		</div>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderFilterNode">
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
			<SelectJobCategoryInput name="job_category" className="form-control" onChange={onChange}/>
		</div>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderTHead">
	renderTHead() {
		const {isConsultant} = storage.is;
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Job Title</div>
			<div className="td">Job Category</div>
			<div className="td">Job Description</div>
			{isConsultant && <div className="td">Company</div>}
			<div className="td fixed-flex min-w-400">Stats</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(item, idx, onClick) {
		const {
			id,
			data: {
				created_at, name, desc, doc,
				job_category,
				company, client, project, site,
				employee_list_aggregate, employee_external_list_aggregate,
				ppe_list_aggregate,
				toolbox_talk_list_aggregate, training_plan_list_aggregate,
			}
		} = item;
		
		const {isConsultant} = storage.is;

//        console.log(item)
		return <TRow key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{name || 'N/A'}</div>
			<div className="td">{job_category ? job_category.name : 'N/A'}</div>
			<div className="td">{
				doc ? <Clickable idx={idx} onClick={this.onViewByDoc}><a href="#">PDF Document</a></Clickable> : (desc || 'N/A')
			}</div>
			{isConsultant && <div className="td">
				{client ? (client.name || client.data.name) : 'All'}
			</div>}
			<div className="td fixed-flex min-w-400 flex td-stats">
				<StatsPanel item={item}/>
			</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>
		</TRow>;
	}
	
	// </editor-fold>
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderPage">
	renderPage() {
		const {
			onUpdate,
			onBuildQuery,
			titleSingular,
			title,
			permissionKey,
			renderFilterNode,
			renderTHead,
			renderItem
		} = this;
		
		return <>
			<Tabs
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
					onSoftDeleteProhibit={this.onSoftDeleteProhibit}
					renderLeftButtons={this.renderLeftButtons}
					renderFilterNode={renderFilterNode}
					renderTHead={renderTHead}
					renderItem={renderItem}
					NewDialog={NewJobPositionDialog}
					ProfileDialog={ProfileJobPositionDialog}
					EditDialog={EditJobPositionDialog}
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
					ProfileDialog={ProfileJobPositionDialog}
					permissionKey={permissionKey}
				/>
			</Tabs>
			
			<ImportJobPositionsDialog ref="importDialog" path={this.path}/>
		</>;
	}
	
	// </editor-fold>
	
}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {
	
	render() {
		const {
			data: {
				employee_list_aggregate, employee_external_list_aggregate,
				ppe_list_aggregate,
				toolbox_talk_list_aggregate, training_plan_list_aggregate,
			}
		} = this.props.item;
		
		return <>
			<AggregateStat title="Employees" className="h-70" value={employee_list_aggregate}/>
			<AggregateStat title="External Persons" className="h-70" value={employee_external_list_aggregate}/>
			<AggregateStat title="PPE" className="h-70" value={ppe_list_aggregate}/>
			<AggregateStat title="Toolbox Talks" className="h-70" value={toolbox_talk_list_aggregate}/>
			<AggregateStat title="Training Plans" className="h-70" value={training_plan_list_aggregate}/>
		</>;
	}
}

// </editor-fold>

export default JobPositionsDialog;
