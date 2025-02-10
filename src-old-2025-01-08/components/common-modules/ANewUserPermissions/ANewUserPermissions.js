// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';
import {ATableSavable, Table, TBody, THead, TRow} from '../../tables';
import ButtonWrapper from "./ButtonWrapper";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ANewUserPermissions">
@observer
class ANewUserPermissions extends ATableSavable {
	@observable
	selfState = {
		lists: {}
	};

	constructor(props, args = {}) {
		super(props);

		const {plugin, key: plugin_key} = args;

		if (plugin) {
			let {selectedList, readonly} = props;

			const {selectedClientModules: {[plugin]: defaultList}} = storage.selected;

			// console.log('ANewUserPermissions defaultList', plugin, defaultList.slice())

			if (selectedList) {
				// console.log('ANewUserPermissions selectedList', plugin_key, selectedList.slice())
				selectedList = selectedList.filter(({id, module, actions}) => module.plugin.key === plugin_key).map(v => {
					if (!('create' in v.actions)) {
						extendObservable(v.actions, {create: false});
					}
					if (!('edit' in v.actions)) {
						extendObservable(v.actions, {edit: false});
					}
					if (!('view' in v.actions)) {
						extendObservable(v.actions, {view: false});
					}
					if (!('remove' in v.actions)) {
						extendObservable(v.actions, {remove: false});
					}
					if (!('share' in v.actions)) {
						extendObservable(v.actions, {share: false});
					}
					return v;
				});
				const newList = defaultList.filter(({module: {key}}) => {
					return selectedList.noneMatch(({module: {key: __key}}) => {
						return key === __key;
					});
				});
				// selectedList.sortBy('status');
				selectedList.sortBy('module.title');
				this.state.list = [...newList, ...selectedList];
			} else {
				// defaultList.sortBy('status');
				defaultList.sortBy('module.title');
				this.state.list = defaultList;
			}

			if (!readonly) {
				// const {onChange, name} = props;
				// onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);
			}
		}

		this.selectAll = this.selectAll.bind(this);
		this.unselectAll = this.unselectAll.bind(this);
		this.onChangeInternal = this.onChangeInternal.bind(this);
		this.onChangeGroup = this.onChangeGroup.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}

	selectAll() {
		const {name, onChange} = this.props;
		const {groupCreate, groupEdit, groupView, groupDelete, groupShare,} = this.refs;
		groupCreate.selectAll();
		groupEdit.selectAll();
		groupView.selectAll();
		groupDelete.selectAll();
		groupShare.selectAll();

		this.list.forEach(({actions}) => {
			actions.create = true;
			actions.edit = true;
			actions.view = true;
			actions.remove = true;
			actions.share = true;
		});
		onChange && onChange(toJS(this.list), name, this);
	}

	unselectAll() {
		const {name, onChange} = this.props;
		const {groupCreate, groupEdit, groupView, groupDelete, groupShare,} = this.refs;
		groupCreate.unselectAll();
		groupEdit.unselectAll();
		groupView.unselectAll();
		groupDelete.unselectAll();
		groupShare.unselectAll();

		this.list.forEach(({actions}) => {
			actions.create = false;
			actions.edit = false;
			actions.view = false;
			actions.remove = false;
			actions.share = false;
		});
		onChange && onChange(toJS(this.list), name, this);
	}

	onChangeInternal(val) {
		const {name, onChange, disableOneChange} = this.props;
		const {list} = this;
		list.sortBy('key.value');
		list.sortBy('module.title');
		this.onChange(list, name, this);

		if (disableOneChange) {
			onChange && onChange(toJS(list), name, this);
		} else {
			const {item, action, oldVal, newVal, onComplete} = val;
			onChange && onChange({list: toJS(list), item, action, oldVal, newVal, onComplete}, name, this);
		}
	}

	onChangeGroup(action, groupChecked) {
		const {name, onChange, disableOneChange} = this.props;
		const {list} = this;
		list.sortBy('key.value');
		list.sortBy('module.title');
		list.forEach(({actions}) => {
			actions[action] = groupChecked;
		});
		this.onChange(list, name, this);

		if(disableOneChange) {
			onChange && onChange(toJS(list), name, this);
		} else {

		}
	}

	renderItem(n, onClick) {
		const item = this.state.list[n];
		const {id, key, module, actions} = item;
		const desc = key ? key.value : module.title;
		// console.log('item', desc, item)
		const {readonly, disableOneChange} = this.props;
		return <TRow key={"item-" + n} className="tr-readonly w-full">
			<div className="td td-question"><h5 className="no-margin">{desc}</h5></div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="create"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="edit"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="view"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="remove"
				               onChange={this.onChangeInternal}/>
			</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60">
				<ButtonWrapper item={item} readonly={readonly} disableOneChange={disableOneChange} action="share"
				               onChange={this.onChangeInternal}/>
			</div>
		</TRow>;
	}

	render() {
		const {readonly, disableOneChange} = this.props;
		return (<Table className="pull-left">
			<THead>
				<div className="td">Permission</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					Create
					<ButtonWrapper ref="groupCreate" readonly={readonly} disableOneChange={disableOneChange} group action="create"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					Edit
					<ButtonWrapper ref="groupEdit" readonly={readonly} disableOneChange={disableOneChange} group action="edit"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					View
					<ButtonWrapper ref="groupView" readonly={readonly} disableOneChange={disableOneChange} group action="view"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60">
					Delete
					<ButtonWrapper ref="groupDelete" readonly={readonly} disableOneChange={disableOneChange} group action="remove"
					               onChange={this.onChangeGroup}/>
				</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60 margin-r-10">
					Share
					<ButtonWrapper ref="groupShare" readonly={readonly} disableOneChange={disableOneChange} group action="share"
					               onChange={this.onChangeGroup}/>
				</div>
			</THead>
			<TBody
				ref="body"
				title="Permission"
				renderItem={this.renderItem}
				state={this.state}
				onLoadList={this.onLoadList}
				disablePullToRefresh={true}/>
		</Table>);
	}
}

// </editor-fold>

export default ANewUserPermissions;