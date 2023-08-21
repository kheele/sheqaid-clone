// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, Permissions} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput, Clickable, SelectJobCategoryInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ImportJobPositionsDialog from "./ImportJobPositionsDialog";
import NewJobPositionDialog from "./NewJobPositionDialog";
import ProfileJobPositionDialog from "./ProfileJobPositionDialog";
import EditJobPositionDialog from "./EditJobPositionDialog";

import style from "./JobPositionsDialog.lazy.css";
import AggregateStat from "components/AggregateStat";
import byLogged from "./Query/List/listAllJobPositionByLogged";
import updateJobPosition from "mutations/all/JobPosition/updateJobPosition";

// </editor-fold>

@observer
class JobPositionsDialog extends ADialogList {
	path;
	pageKey = "JobPositionsDialog";
	title = "Job Positions";

	@observable selfState = {
		selectedItems: []
	};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.path = props.path + 'job-positions/';

		this.onLoadList = this.onLoadList.bind(this);

		this.onImport = this.onImport.bind(this);
		this.onViewByDoc = this.onViewByDoc.bind(this);
		this.onSelect = this.onSelect.bind(this);

		this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
		this.renderTHead = this.renderTHead.bind(this);
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

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			name,
			job_category_id,
		} = filterData || {};

		const limit = 50;

		const args = {
			name,
			job_category_id,
			//
			limit,
		};

		if (!isNew) {
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

	// <editor-fold defaultstate="collapsed" desc="actions">
	onImport(e, btn) {
		this.refs.importDialog.open().then(list => {
			this.refs.root.list.push(...list);
		});
	}

	onViewByDoc(e, btn) {
		const {idx} = btn.props;
		this.refs.root.onView(e, btn);
	}

	onSelect(e, btn) {
		const {idx} = btn.props;
		const item = this.refs.root.list[idx];
		//this.refs.root.onView(e, btn);
		const {selectedItems} = this.selfState;
		if (selectedItems.contains(item.id)) {
			selectedItems.remove(item.id);
		} else {
			selectedItems.push(item.id);
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee || isContractorView;
		if (isReadonly) return null;
		const {permissions_other} = storage.loggedUser.user.data;
		const permissions_other_JobPositions = (permissions_other || []).find(v => v.key === "Job Positions");

		return <div className="left-buttons pull-left">
			{Permissions.allow(permissions_other_JobPositions) &&
				<Button className="btn btn-primary pull-right min-w-110" onClick={this.onImport}>
					Import Job Positions
				</Button>}
			<ButtonSelectAll page={this} selectedItems={this.selfState.selectedItems}/>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		const permissionKey = "Job Positions";
		return <Options idx={idx} permissionOtherKey={permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
			<hr/>
			<NavItem onClick={this.onSelect} faIconLeft="check" title="Select"/>
		</Options>;
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
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Job Title</div>
			<div className="td">Job Category</div>
			<div className="td">Job Description</div>
			{isConsultant && <div className="td">Company</div>}
			<div className="td fixed-flex min-w-400">Stats</div>
			<HeaderLastCell selectedItems={this.selfState.selectedItems}/>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
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
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{name || 'N/A'}</div>
			<div className="td">{job_category ? job_category.name : 'N/A'}</div>
			<div className="td">{
				doc ? <Clickable idx={n} onClick={this.onViewByDoc}><a href="#">PDF Document</a></Clickable> : (desc || 'N/A')
			}</div>
			{isConsultant && <div className="td">
				{client ? (client.name || client.data.name) : 'All'}
			</div>}
			<div className="td fixed-flex min-w-400 flex td-stats">
				<StatsPanel item={item}/>
			</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ButtonW selectedItems={this.selfState.selectedItems} idx={n} id={id} onClick={onClick}
				         onSelect={this.onSelect}/>
			</div>
		</TRow>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPage">
	renderPage() {
		return <APageListReadWrite
			ref="root"
			page={this}
			hasBackBtn={false}
			createBtnTitle="Create"
			pageId={this.pageKey + '-page'}
			listCountTopTitle="job position"
			pageTitleSingular="job position"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog" onSoftDelete={updateJobPosition}/>

			<ImportJobPositionsDialog ref="importDialog" path={this.path}/>
			<NewJobPositionDialog ref="newDialog" path={this.path}/>
			<ProfileJobPositionDialog ref="profileDialog" path={this.path}/>
			<EditJobPositionDialog ref="editDialog" path={this.path}/>

			<SelectionActions selectedItems={this.selfState.selectedItems} path={this.path}/>
		</APageListReadWrite>;
	}

	// </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="ButtonSelectAll">
@observer
class ButtonSelectAll extends React.Component {

	@observable state = {
		selectedAll: false
	};

	constructor(props) {
		super(props);

		this.onClear = this.onClear.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
	}

	onClear(evt, btn) {
		const {selectedItems} = this.props;
		selectedItems.clear();
	}

	onSelectAll(evt, btn) {
		const {page, selectedItems} = this.props;
		const ids = page.refs.root.list.map(v => v.id);
		selectedItems.push(...ids);
	}

	render() {
		const {selectedItems} = this.props;
		return <React.Fragment>
			{!selectedItems.isEmpty() &&
				<Button className="btn btn-primary pull-right" text="Clear Selection" onClick={this.onClear}/>}
			<Button className="btn btn-primary pull-right" text="Select All" onClick={this.onSelectAll}/>
		</React.Fragment>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectionActions">
@observer
class SelectionActions extends React.Component {

	constructor(props) {
		super(props);

		this.onRemove = this.onRemove.bind(this);
	}

	onRemove(evt, el) {
		const {selectedItems} = this.props;
		progressDialog.open("Please wait...");
		neonBinding.events.emit(this.props.path + "remove", selectedItems.slice()).then(res => {
			console.log("res", res)
			infoDialog.open(selectedItems.length + " record(s) successfully removed.");
			infoDialog.close(2000);
			selectedItems.clear();
		}).finally(() => {
			progressDialog.close();
		});
	}

	render() {
		const {selectedItems} = this.props;
		console.log('SelectionActions', selectedItems.isEmpty())
		if (selectedItems.isEmpty()) {
			return null;
		}

		return <div className="SelectionActions block fixed-center padding-10">
			<label className="w-full text-center">---Actions---</label>
			<hr className="margin-0"/>
			<NavItem className="min-w-110" onClick={this.onRemove} faIconLeft="ban" title="Remove"/>
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="HeaderLastCell">
@observer
class HeaderLastCell extends React.Component {
	render() {
		const {selectedItems} = this.props;
		console.log('HeaderLastCell', selectedItems.isEmpty())
		if (selectedItems.isEmpty()) {
			return <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>;
		} else {
			return <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>;
		}
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonW">
@observer
class ButtonW extends React.Component {
	render() {
		const {idx, id, selectedItems, onSelect, onClick} = this.props;
		const isSelected = selectedItems.contains(id);
		console.log('ButtonW', isSelected)
		if (selectedItems.isEmpty()) {
			return <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>;
		}
		return <Button idx={idx} className="btn btn-primary pull-right w-40 min-w-40" onClick={onSelect}>
			<ButtonWCheckbox id={id} selectedItems={selectedItems}/>
		</Button>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWCheckbox">
@observer
class ButtonWCheckbox extends React.Component {
	render() {
		const {id, selectedItems} = this.props;
		const isSelected = selectedItems.contains(id);
		console.log('ButtonWCheckbox', isSelected)
		if (isSelected) {
			return <i className="fa fa-check"/>;
		} else {
			return <i className="fa fa-times"/>;
		}
	}
}

// </editor-fold>

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
			<AggregateStat title="Employees" value={employee_list_aggregate}/>
			<AggregateStat title="External Persons" value={employee_external_list_aggregate}/>
			<AggregateStat title="PPE" value={ppe_list_aggregate}/>
			<AggregateStat title="Toolbox Talks" value={toolbox_talk_list_aggregate}/>
			<AggregateStat title="Training Plans" value={training_plan_list_aggregate}/>
		</>;
	}
}

// </editor-fold>

export default JobPositionsDialog;
