import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import {execWhen} from '../utils/Utils';

import APageList from "./APageList";

@observer
class APageListReadWrite extends APageList {

    constructor(props) {
        super(props);

        this.hasCreateBtn = this.hasCreateBtn.bind(this);//
        this.onNew = this.onNew.bind(this);//
        this.onEdit = this.onEdit.bind(this);//
        this.onRemove = this.onRemove.bind(this);//
    }

    componentDidMount() {
        super.componentDidMount();
        const {isContractorView, isContractor} = storage.is;
        if(isContractorView) {
            const {forceCreate} = this.props;
            if(!isContractor && !forceCreate) {
                return;
            }
        }

        execWhen(() => this.getDialogByRef("newDialog")).then(async newDialog => {
            let hasCreateBtn = this.hasCreateBtn();
            if(hasCreateBtn instanceof Promise) {
                hasCreateBtn = await hasCreateBtn.then(res => res);
            }
            if (!hasCreateBtn)
                return;            

            this.refs.pageTitle.refs.buttonCreate.show();
        });
        
        const {args} = this.props.page.props;
        if(!!args) {
            setTimeout(() =>{
                let parts = args.split('&');
                const action = parts.removeFirst();
                if(action === 'New') {
                    if(!parts.isEmpty()) {
                        const newDialog = this.getDialogByRef("newDialog");
                        if(!!newDialog){
                            const {extraProps} = newDialog;
                            let keyVal = parts[0];
                            parts = keyVal.split('=');
                            if(!parts.isEmpty()) {
                                extraProps[parts[0]] = parts[1];
                            }
                        }
                    }
                    this.onNew();
                }
            }, 800);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
//        const {props, props: {args}} = this.props.page;
//        if(!!args) {
//            delete props.args;
//        }
    }

    hasCreateBtn() {
        const {isContractorViewVisited, isEmployee} = storage.is;
        const {forceCreate} = this.props;
        if(!forceCreate && (isEmployee || isContractorViewVisited)) return false;
        if (this.props.hasCreateBtn) {
            return this.props.hasCreateBtn();
        } else {
            return true;
        }
    }

    renderPopoverOptions(idx, e, btn, onView, Options) {
        return this.props.renderPopoverOptions(idx, {onView, onEdit: this.onEdit, onRemove: this.onRemove, Options}, e, btn);
    }

    onNew(evt, elem, item) {
        const newDialog = this.getDialogByRef("newDialog");
        if (newDialog) {
            const {props: {promise}, onNewItem} = this.props.page;
            newDialog.open(item).then(item => {
                if(!onNewItem) {
                    this.state.list.pushFirst(item);
                } else {
                    onNewItem(item);
                }
                promise && promise.resolve && promise.resolve(item);
            }).catch(e => {
                promise && promise.reject && promise.reject(e);
                throw e;
            });
        } else {
            infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
        }
    }

    onEdit(evt, elem, item) {
        const editDialog = this.getDialogByRef("editDialog");
        if (editDialog) {            
            let idx;
            if(!item) {
                if (!('idx' in elem.props)) {
                    idx = parseInt(elem._reactInternals.key.replace("item-edit-", ""));
                } else {
                    idx = elem.props.idx;
                }
                
                item = this.list[idx];
            } else {
                idx = this.list.indexOf(item);
            }
            editDialog.open(item).then(updateAttrs => {
                if(updateAttrs) {
                    setTimeout(() => {
                        extendObservable(item.data, updateAttrs);
                    }, 0);
                    setTimeout(() => {
                        this.list.removeIf((item, _idx) => _idx === idx);
                    }, 50);
                    setTimeout(() => {
                        this.list.insertAt(idx, item);
                    }, 100);
                }
            });
        } else {
            infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
        }
    }

    onRemove(evt, elem) {
        const removeDialog = this.getDialogByRef("removeDialog");
        if (removeDialog) {
            let {idx} = elem.props;
            if (!('idx' in elem.props)) {
                idx = parseInt(elem._reactInternals.key.replace("item-remove-", ""));
            } else {
                idx = elem.props.idx;
            }
                
            removeDialog.open("Are you sure you want to remove the " + this.props.pageTitleSingular + "?").then(res => {
                if (res === 1) {
                    const item = this.list[idx];
                    progressDialog.open("Removing the " + this.props.pageTitleSingular);
                    window.neonBinding.events.emit(this.props.path + "remove", item.id).then(res => {
                        setTimeout(function () {
                            this.list.removeIf((item, _idx) => _idx === idx);
                        }.bind(this), 0);
                        const {onRemoved} = this.props;
                        onRemoved && onRemoved(item);
                        infoDialog.open("Record successfully removed.");
                        infoDialog.close(2000);
                    }).finally(() => {
                        progressDialog.close();
                    });
                }
            });
        } else {
            infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
        }
    }

}

export default APageListReadWrite;
