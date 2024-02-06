import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./SOPTab.lazy.css";

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewSOPDialog from './forms/NewSOPDialog';
import ProfileSOPDialog from './forms/ProfileSOPDialog';
import EditSOPDialog from './forms/EditSOPDialog';
import ExportSOPDialog from "./forms/ExportSOPDialog";
import AList from "views/AList";

@observer
class SOPTab extends AList {
	
	pageKey = "SOPTab";
	@observable
	state = {
		lists: {
			category: [{text: 'Machine', value: 'Machine'}, {text: 'Task', value: 'Task'}, {text: 'Action', value: 'Action'}],
			risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}],
		}
	};
	
	constructor(props) {
		super(props);
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
			prepared_by_list,
		} = filterData || {};
		
		const listByLogged = sockets.of('hira-and-opportunities/sop').fn('listByLogged');
		
		return listByLogged({
			category,
			risk_level,
			location,
			prepared_by_list,
			//
			exact_orgs: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	onExport(e, btn) {
		const {getDialogByRef} = this.refs.root;
		const exportDialog = getDialogByRef('exportDialog');
		exportDialog.open();
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const {isEmployee, isContractorView} = storage.is;
		const isReadonly = isEmployee;// || isContractorView;
		return <div className="left-buttons pull-left">
			{!isReadonly && <Button className="btn btn-primary pull-right" onClick={this.onExport}>
				Export
			</Button>}
		</div>;
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
			<ClearableInput name="category" type="radio" placeholder="Category" className="form-control"
			                onChange={onChange} values={this.state.lists.category}/>
			<ClearableInput name="risk_level" type="radio" placeholder="Risk Level"
			                className="form-control" onChange={onChange}
			                values={this.state.lists.risk_level}/>
			<ClearableInput name="location" type="text" placeholder="Location"
			                className="form-control" onChange={onChange}/>
			<SelectEmployeeInput name="prepared_by_list" type="select_multi" placeholder="Prepared By..." className="form-control"
			                     onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-30">ID</div>
			<div className="td fixed-flex min-w-120">Date Created</div>
			<div className="td">Prepared By</div>
			<div className="td">Category</div>
			<div className="td">Location</div>
			<div className="td">Risk Level</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
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
		console.log('sop', item)
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex min-w-30">{id}</div>
			<div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
			<div className="td">{prepared_by ? prepared_by.full_name : 'N/A'}</div>
			<div className="td">{category}</div>
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
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>
			
			<ProfileSOPDialog ref="profileDialog"/>
			<NewSOPDialog ref="newDialog"/>
			<EditSOPDialog ref="editDialog"/>
			
			<ExportSOPDialog ref="exportDialog"/>
		</APageListReadWrite>;
	}
}

export default SOPTab;
