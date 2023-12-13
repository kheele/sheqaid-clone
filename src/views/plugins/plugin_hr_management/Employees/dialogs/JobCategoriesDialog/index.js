// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates, Permissions} from 'utils/Utils';
import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput, Clickable} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ImportJobCategoriesDialog from "./ImportJobCategoriesDialog";
import NewJobCategoryDialog from "./NewJobCategoryDialog";
import ProfileJobCategoryDialog from "./ProfileJobCategoryDialog";
import EditJobCategoryDialog from "./EditJobCategoryDialog";

import style from "./JobCategoriesDialog.lazy.css";
import AggregateStat from "components/AggregateStat";
import updateJobCategory from "mutations/all/JobCategory/updateJobCategory";

// </editor-fold>

@observer
class JobCategoriesDialog extends ADialogList {
	path;
	pageKey = "JobCategoriesDialog";
	title = "Job Categories";

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.path = props.path + 'job-positions/';

		this.onLoadList = this.onLoadList.bind(this);

		this.onImport = this.onImport.bind(this);
		this.onViewByDoc = this.onViewByDoc.bind(this);

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
		} = filterData || {};

		const listByLogged = sockets.of('job-categories').fn('listByLogged');

		return listByLogged({
			name,
			//
			exact_orgs: true,
			exact_orgs_company: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
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
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee || isContractorView;
		if (isReadonly) return null;
		const {permissions_other} = storage.loggedUser.user.data;
		const permissions_other_JobCategories = (permissions_other || []).find(v => v.key === "Job Categories");

		return <div className="left-buttons pull-left">
			{Permissions.allow(permissions_other_JobCategories) &&
				<Button className="btn btn-primary pull-right min-w-110" onClick={this.onImport}>
					Import Job Categories
				</Button>}
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		const permissionKey = "Job Categories";
		return <Options idx={idx} permissionOtherKey={permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
		</Options>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFilterNode">
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHead">
	renderTHead() {
		const {isConsultant} = storage.is;
		return <THead>
			<div className="td fixed-flex min-w-50">ID</div>
			<div className="td">Name</div>
			{isConsultant && <div className="td">Company</div>}
			<div className="td fixed-flex min-w-100">Stats</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {
			id,
			data: {
				created_at, name,
				company, client, project, site,
				job_position_list_aggregate,
			}
		} = item;

		const {isConsultant} = storage.is;

//        console.log(item)
		return <TRow key={id}>
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td">{name || 'N/A'}</div>
			{isConsultant && <div className="td">
				{client ? (client.name || client.data.name) : 'All'}
			</div>}
			<div className="td fixed-flex min-w-100 flex td-stats">
				<StatsPanel item={item}/>
			</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
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
			listCountTopTitle="job category"
			pageTitleSingular="job category"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog" onSoftDelete={updateJobCategory}/>

			<ImportJobCategoriesDialog ref="importDialog" path={this.path}/>
			<NewJobCategoryDialog ref="newDialog" path={this.path}/>
			<ProfileJobCategoryDialog ref="profileDialog" onSoftDelete={updateJobCategory}/>
			<EditJobCategoryDialog ref="editDialog" path={this.path}/>
		</APageListReadWrite>;
	}

	// </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {

	render() {
		const {
			data: {
				job_position_list_aggregate,
			}
		} = this.props.item;

		return <>
			<AggregateStat title="Job Positions" value={job_position_list_aggregate}/>
		</>;
	}
}

// </editor-fold>

export default JobCategoriesDialog;
