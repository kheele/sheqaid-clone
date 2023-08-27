import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./SOPTab.lazy.css";

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewSOPDialog from './forms/NewSOPDialog';
import ProfileSOPDialog from './forms/ProfileSOPDialog';
import EditSOPDialog from './forms/EditSOPDialog';
import byLogged from "./Query/List/listAllSOPByLogged";

@observer
class SOPTab extends React.Component {

	pageKey = "SOPTab";
	@observable
	state = {
		lists: {
			category: [{text: 'Machine', value: 'Machine'}, {text: 'Task', value: 'Task'}, {text: 'Action', value: 'Action'}],
			risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}]
		}
	};

	constructor(props) {
		super(props);

		this.onLoadList = this.onLoadList.bind(this);

		this.renderItem = this.renderItem.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
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
			category,
			risk_level,
			location,
			task,
		} = filterData || {};

		const limit = 50;

		const args = {
			removed: false,
			//
			category,
			risk_level,
			location,
			task,
			//
			limit,
			//
			exact_orgs: true,
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

	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		return <Options idx={idx} permissionModKey={this.props.permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
		</Options>;
	}

	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="category" type="radio" placeholder="Category" className="fixed-flex min-w-420 form-control"
			                onChange={onChange} values={this.state.lists.category}/>
			<ClearableInput name="risk_level" type="radio" placeholder="Risk Level"
			                className="fixed-flex min-w-395 form-control" onChange={onChange}
			                values={this.state.lists.risk_level}/>
			<ClearableInput name="location" type="text" placeholder="Location" className="form-control" onChange={onChange}/>
		</div>;
	}

	renderTHead() {
		return <THead>
			{/*<div className="td fixed-flex min-w-70"></div>*/}
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Category</div>
			<div className="td">Task / Activity</div>
			<div className="td">Location</div>
			<div className="td">Risk Level</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {id, data: {created_at, category, task, location, risk_level, doc}} = item;
		console.log('sop', item)
		return <TRow key={"item-" + n}>
			{/*<div className="td fixed-flex min-w-70">{RenderUtils.renderImage(photo, 50, 50)}</div>*/}
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{category}</div>
			<div className="td">{task}</div>
			<div className="td">{location}</div>
			<div className="td">{risk_level}</div>
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
			pageTitle="Safe Operating Procedure"
			pageTitleSingular="safe operating procedure"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>

			<ProfileSOPDialog ref="profileDialog"/>
			<NewSOPDialog ref="newDialog"/>
			<EditSOPDialog ref="editDialog"/>
		</APageListReadWrite>;
	}
}

export default SOPTab;
