import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';
import {Button} from 'components/inputs';
import {Table} from 'components/tables';

import Dialog from 'components/dialogs/Dialog';

import NewAuditItemDialog from './NewAuditItemDialog';
import AuditItemTHead from './AuditItemTHead';
import AuditItemTBody from './AuditItemTBody';

import deleteAuditItem from "mutations/all/AuditsAndInspections/AuditItem/deleteAuditItem";

import style from "./AuditFindingItemTable.lazy.css";

@observer
class AuditFindingItemTable extends React.Component {
    
    @observable
    state = {
        list: []
    };
    
    constructor(props) {
        super(props);
        
        this.onEditItem = this.onEditItem.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onNew = this.onNew.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
        const {isDialog, defaultValue} = this.props;
        if(!isDialog) {
            this.state.list = defaultValue;
        }
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    setOnCancel(onCancel) {
        this._onCancel = onCancel;
        return this;
    }

    open(list) {
        return new Promise((resolve, reject) => {
            this.onDone = resolve;
            if (list) {
                this.state.list = list;
            }
            this.refs.dialog.open(this.props.title || "Select Item(s)");
        });
    }

    close() {
        this.onDone = null;
        this.state.list = [];
        this.refs.dialog.close();
    }

    onCancel(e, btn) {
        this._onCancel && this._onCancel();
        this.close();
    }
    
    onEditItem(item) {
        return this.refs.newDialog.open(item);
    }
    
    onSelect(item) {
        const {onChange, name} = this.props;
        onChange && onChange(item, name, this);
        this.close();
    }
    
    onNew(element, sub_element) {
        const {onChange, name} = this.props;
        const {tbody, newDialog} = this.refs;
        let d;
        if(isString(element)) {
            d = newDialog.extraProp('element', element);
        }
        if(isString(sub_element)) {
            d = newDialog.extraProp('sub_element', sub_element);
        }
        
        (d || newDialog).open().then(item => {
            tbody.state.list.push(item);
            
            onChange && onChange(toJS(tbody.state.list), name, this);
        });
    }
    
    refresh() {
        this.refs.tbody.refresh();
    }
    
    @computed get topButtons() {
        return <>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
        </>;
    }

    render() {
        const {isDialog, isSingleSelect, name, savable, auditItem, onAttrs, readonly, isNew, onChange, onSelect} = this.props;
        const tbl = <Table className="AAuditItemTable AuditFindingItemTable w-full min-h-380 padding-0 margin-0">
            {!readonly && !isDialog && <NewAuditItemDialog ref="newDialog" savable={savable} auditItem={auditItem}/>}
            <AuditItemTHead/>  
            <AuditItemTBody
              ref="tbody"
              name={name}
              readonly={readonly}
              savable={savable}
              targetItem={auditItem ? {key: 'audit_id', item: auditItem} : null}
              deleteFn={deleteAuditItem}
              onAttrs={onAttrs}
              isSingleSelect={isSingleSelect}
              isNew={isNew}
              onNew={this.onNew}
              onEditItem={this.onEditItem}
              onSelect={this.onSelect}
              state={this.state}
              onChange={onChange}
            />
            
            {!readonly && !isDialog && <Button className="btn btn-primary add-item-b" onClick={this.onNew}>
                <i className="fa fa-plus"/> Add Item
            </Button>}
        </Table>;
        if(isDialog) {
            return <Dialog 
                key={'AuditFindingItemTable'} 
                ref="dialog" 
                className={'ANewTableFormDialog AuditFindingItemTable-dialog'} 
                topButtons={this.topButtons} 
                onCancel={this.onCancel}
                dialog={this}
            >
                <div className="controls-wrapper">
                    <div className="controls padding-0">
                        <div className="row padding-0 margin-0 h-full">{tbl}</div>
                    </div>
                </div>
            </Dialog>;
        } else {
            return tbl;
        }
    }
}

export default AuditFindingItemTable;
