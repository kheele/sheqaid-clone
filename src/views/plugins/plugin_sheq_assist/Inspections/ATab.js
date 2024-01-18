import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';
import {
	ClearableInput,
	SelectAssetInput,
	SelectAssetTypeInput,
	SelectContractorQuestionnaireTemplateInput, SelectQuestionnaireTemplateInput
} from 'components/inputs';
import {THead} from 'components/tables';

import InspectionTableRow from './InspectionTab/InspectionTableRow';

import {NewQuestionnaireDialog, EditResponseDialog, ProfileResponseDialog} from './InspectionTab/forms';
import ConfirmDialog from "components/dialogs/ConfirmDialog";
import updateQuestionnaire from "mutations/all/Questionnaires/Questionnaires/updateQuestionnaire";
import {Dates} from "../../../../utils/Dates";

@observer
class ATab extends React.Component {
	
	@observable
	state = {
		lists: {
			interval: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually'].map(value => {
				return {value, label: value}
			})
		}
	};
	
	constructor(props) {
		super(props);
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.onRemoved = this.onRemoved.bind(this);
		
		this.onCopy = this.onCopy.bind(this);
		this.onStart = this.onStart.bind(this);

//        this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderTHead = this.renderTHead.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
	}
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {item: asset, fn} = this.props;
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			name,
			interval,
			template_id,
			asset_type,
			asset: asset2,
		} = filterData || {};
		
		const today = Dates.formatDateSQL(new Date());
		
		const listByLogged = sockets.of('inspections').fn(fn);
		
		return listByLogged({
			asset_id: (asset2 || asset) && (asset || asset2).id,
			//
			today,
			//
			name,
			interval,
			template_id,
			asset_type,
			//
			exact_orgs: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>
	
	onRemoved(item) {
		this.refs.root.list.removeIf((v, n) => v.id === item.id);
	}
	
	//<editor-fold desc="actions">
	onCopy(evt, elem) {
		const {idx, action} = elem.props;
		const {list} = this.refs.root;
		const copy = toJS(list[idx]);
		
		const newDialog = this.refs.root.getDialogByRef("newDialog");
		newDialog.open(copy);
	}
	
	onStart(evt, elem) {
		const {idx, action} = elem.props;
		const item = this.refs.root.list[idx];
		
		const editDialog = this.refs.root.getDialogByRef("editDialog");
		editDialog.open(item);
	}
	
	//</editor-fold>
	
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		const {renderPopoverOptions, permissionKey, isUpcoming, unanswered} = this.props;
		if (renderPopoverOptions) {
			return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
		}
		
		console.log('permissionKey', permissionKey)
		
		return <Options idx={idx} permissionModKey={permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
			<NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
			<hr action="writable"/>
			<NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
			{!isUpcoming && <NavItem action="writable" idx={idx} onClick={this.onStart} faIconLeft="plus" title="Inspect"/>}
		</Options>;
	}
	
	renderFilterNode(onChange) {
		const listByLogged = sockets.of('inspections').fn('listTemplatesByLogged');
		
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
			<ClearableInput
				name="interval"
				type="select"
				placeholder="Interval..."
				className="form-control"
				onChange={onChange}
				values={this.state.lists.interval}
				returnValue
			/>
			<SelectQuestionnaireTemplateInput
				name="template"
				placeholder="Template..."
				className="form-control"
				byLogged={listByLogged}
				onChange={onChange}
			/>
			<SelectAssetTypeInput name="asset_type" type="select_multi" placeholder="Asset Type(s)..."
			                      className="form-control" onChange={onChange}/>
			<SelectAssetInput name="asset" type="select" placeholder="Asset..."
			                  className="form-control" onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		const {item: asset, isUpcoming, unanswered} = this.props;
		const w = asset ? 170 : 270;
		return <THead>
			<div className="td fixed-flex min-w-40">ID</div>
			<div className="td">Name</div>
			{/*<div className="td fixed-flex min-w-140">Score</div>*/}
			{!asset && <div className="td fixed-flex min-w-140">Asset Type</div>}
			{!asset && <div className="td fixed-flex min-w-140">Asset</div>}
			<div className="td fixed-flex min-w-180">Responsible Person</div>
			<div className="td fixed-flex min-w-80">Interval</div>
			<div className="td fixed-flex min-w-100">Start Date</div>
			<div className="td fixed-flex min-w-120">Date Scheduled</div>
			{!isUpcoming && <div className="td fixed-flex min-w-120">Next Schedule</div>}
			<div className="td fixed-flex min-w-120">Questions</div>
			{!isUpcoming && !unanswered && <div className={`td fixed-flex min-w-${w}`}>Progress</div>}
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const {item: asset, isUpcoming, unanswered} = this.props;
		let item = this.refs.root.list[n];
		return <InspectionTableRow key={item.id} idx={n} item={item} asset={asset} isUpcoming={isUpcoming}
		                           unanswered={unanswered} onClick={onClick}/>;
	}
	
	render() {
		const {children, pageId, pageTitle, pageTitleSingular, item: asset, type, NewDialog} = this.props;
		return <APageListReadWrite
			hasBackBtn={false}
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={pageId}
			pageTitle={pageTitle}
			pageTitleSingular={pageTitleSingular}
			onLoadList={this.onLoadList}
			noAnimation={true}
			onLoaded={this.onLoaded}
			renderLeftButtons={this.renderLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog" onSoftDelete={updateQuestionnaire}/>
			
			<NewQuestionnaireDialog ref="newDialog" asset={asset}/>
			<EditResponseDialog ref="editDialog" onRemoved={this.onRemoved}/>
			<ProfileResponseDialog ref="profileDialog" onRemoved={this.onRemoved}/>
			<Popover key="popover" ref="popover"/>
		</APageListReadWrite>;
	}
}

export default ATab;
