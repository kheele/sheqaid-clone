// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {getRandomRolor} from "utils/Utils";

import APageListReadWrite from "views/APageListReadWrite";
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, Button} from 'components/inputs';
import {TRow} from 'components/tables';

import NCRItemListDialog from '../dialogs/NCRItemListDialog';
import ExportNCRByGroupDialog from '../dialogs/ExportNCRDialog.js';

import {NewNCRDialog, EditNCRDialog, ProfileNCRDialog} from '../forms';


import style from "./NCRTab.lazy.css";
import updateNCR from "mutations/all/NCR/updateNCR";

// </editor-fold>

@observer
class NCRTab extends React.Component {
    pageKey = "NCRTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
        
        this.onRemoved = this.onRemoved.bind(this);

        this.onNew = this.onNew.bind(this);
        this.onView = this.onView.bind(this);
        this.onExport = this.onExport.bind(this);
        this.onExportAll = this.onExportAll.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
        } = filterData || {};

        const listByLogged = sockets.of('ncr').fn('listByLogged');
        
        return listByLogged({
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

    // <editor-fold defaultstate="collapsed" desc="onNew">
    onNew(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.listGroup[idx];
        const {source, selected_source_ref} = item;
        
        const {list, getDialogByRef} = this.refs.root;
        const newDialog = getDialogByRef('newDialog');
        let d;
        if(isString(source)) {
            d = newDialog.extraProp('source', source);
        }
        if(selected_source_ref && isObject(selected_source_ref)) {
            d = newDialog.extraProp('selected_source', selected_source_ref);
        }
        
        (d || newDialog).open().then(item => {
            list.push(item);
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.listGroup[idx];
        const {source, selected_source_ref, list} = item;
        
        const {getDialogByRef} = this.refs.root;
        const ncrItemListDialog = getDialogByRef('ncrItemListDialog');
        ncrItemListDialog.extraProp('source', source).open(list);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onExport, onExportAll">
    onExport(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.listGroup[idx];
        const {source, selected_source_ref, list} = item;
        
        const {getDialogByRef} = this.refs.root;
        const exportNCRByGroupDialog = getDialogByRef('exportNCRByGroupDialog');
        exportNCRByGroupDialog.extraProp('source', source).open(list);
    }
    
    onExportAll(e, btn) {
        const {getDialogByRef} = this.refs.root;
        const exportNCRByGroupDialog = getDialogByRef('exportNCRByGroupDialog');
        exportNCRByGroupDialog.open();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onListByGroup">
    onListByGroup(list) {
        const sources = list.groupBy('data.source');
        const sourcesList = Object.keys(sources).map(k => {
            let list = sources[k];
            return {source: k, list};
        });
        return sourcesList;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee;// || isContractorView;
        return !isReadonly && <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onExportAll}>
                Export
            </Button>
        </div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return null;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.listGroup[n];
        let {
            source, list
        } = item;
        
        const style = {background: getRandomRolor()};        
        return <TRow key={n} style={style} className="padding-t-15">
            <div className="td">
                <h4 className="font-size-16 color_white font-bold margin-0">{source}</h4>
                <h6 className="font-size-13 color_white font-bold margin-v-5">Non-Comformances</h6>                
            </div>
            <div className="td">
                <span className="counter font-size-30 min-h-50 min-w-50">{list.length}</span>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-100">
            	<ActionsButton idx={n} className="btn btn-primary pull-right w-40" icon="plus" onClick={this.onNew}/>
            	<ActionsButton idx={n} className="btn btn-primary pull-right w-40" icon="eye" onClick={this.onView}/>
            	<ActionsButton idx={n} className="btn btn-primary pull-right w-40" icon="file-export" onClick={this.onExport}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {permissionKey} = this.props;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Non-Conformances"
            pageTitleSingular="non-conformance"
            onLoadList={this.onLoadList}
            noAnimation={true}
            onListByGroup={this.onListByGroup}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            getTBodyProps={this.getTBodyProps}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateNCR}/>
            
            <NewNCRDialog ref="newDialog"/>
            <EditNCRDialog ref="editDialog" onRemoved={this.onRemoved}/>
            <ProfileNCRDialog ref="profileDialog" onRemoved={this.onRemoved}/>
            
            <NCRItemListDialog ref="ncrItemListDialog" permissionKey={permissionKey}/>
             
            <ExportNCRByGroupDialog ref="exportNCRByGroupDialog"/> 
        </APageListReadWrite>;
    }
    // </editor-fold>
    
}

export default NCRTab;
