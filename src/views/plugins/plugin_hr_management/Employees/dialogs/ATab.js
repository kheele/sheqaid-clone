// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import APageListReadWrite from "views/APageListReadWrite";
import Popover from 'components/popovers/Popover';
import {ConfirmDialog} from 'components/dialogs';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ATab">
@observer
class ATab extends React.Component {
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onUpdate = props.onUpdate;
		this.onSoftDeleteProhibit = props.onSoftDeleteProhibit;
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}
	
	// </editor-fold>
	
	get removed() {
		return this.pageKey === "RemovedTab";
	}
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {removed, props: {onBuildQuery}} = this;
		const {page, lastItem, filterData, filtered, isNew} = params;
		
		const {path, attrs} = onBuildQuery(filterData);
		
		const listByLogged = sockets.of(path).fn('listByLogged');
		
		return listByLogged({
			removed,
			//
			...attrs,
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
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		const {renderItem} = this.props;
		return renderItem(item, n, onClick);
	}
	
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {
			NewDialog, ProfileDialog, EditDialog, ImportDialog,
			titleSingular,
			renderLeftButtons,
			renderFilterNode,
			renderTHead,
		} = this.props;
		
		const {renderPopoverOptions} = this;
		
		return <APageListReadWrite
			ref="root"
			page={this}
			pageId={this.pageKey + "-tab"}
			pageTitleSingular={titleSingular}
			onLoadList={this.onLoadList}
			hasCreateBtn={() => !this.removed && !!NewDialog}
			createBtnRendered={!this.removed && !!NewDialog}
			noAnimation={true}
			renderLeftButtons={renderLeftButtons}
			renderPopoverOptions={renderPopoverOptions}
			renderFilterNode={renderFilterNode}
			renderTHead={renderTHead}
			renderItem={this.renderItem}
		>
			<ConfirmDialog ref="removeDialog"/>
			
			{NewDialog && <NewDialog ref="newDialog"/>}
			{ProfileDialog && <ProfileDialog ref="profileDialog"/>}
			{EditDialog && <EditDialog ref="editDialog"/>}
			
			<Popover ref="popover"/>
		</APageListReadWrite>;
	}
	
	// </editor-fold>
}

// </editor-fold>

export default ATab;
