import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import {execWhen} from 'utils/Utils';

import APageList from "../APageList";

@observer
class APageListReadWrite extends APageList {

    constructor(props) {
        super(props);

        this.hasCreateBtn = this.hasCreateBtn.bind(this);
        this.onNew = this.onNew.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    get parentListPage() {
        return this.props.page;
    }

    componentDidMount() {
        super.componentDidMount();
        const {isContractorView, isContractor} = storage.is;
        if (isContractorView) {
            const {forceCreate} = this.props;
            if (!isContractor && !forceCreate) {
                return;
            }
        }

        const {createBtnRendered} = this.props;
        if (!createBtnRendered) {
            execWhen(() => this.getDialogByRef("newDialog")).then(async newDialog => {
                let hasCreateBtn = this.hasCreateBtn();
                if (hasCreateBtn instanceof Promise) {
                    hasCreateBtn = await hasCreateBtn.then(res => res);
                }
                if (!hasCreateBtn)
                    return;

                this.refs.pageTitle.refs.buttonCreate.show();
            });
        } else {
            this.refs.pageTitle.refs.buttonCreate.show();
        }

        const {args} = this.props.page.props;
        if (!!args) {
            setTimeout(() => {
                let parts = args.split('&');
                const action = parts.removeFirst();
                if (action === 'New') {
                    if (!parts.isEmpty()) {
                        const newDialog = this.getDialogByRef("newDialog");
                        if (!!newDialog) {
                            const {extraProps} = newDialog;
                            let keyVal = parts[0];
                            parts = keyVal.split('=');
                            if (!parts.isEmpty()) {
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
        if (!forceCreate && (isEmployee || isContractorViewVisited)) return false;
        if (this.props.hasCreateBtn) {
            return this.props.hasCreateBtn();
        } else {
            return true;
        }
    }

    renderPopoverOptions(idx, e, btn, onView, Options) {
        return this.props.renderPopoverOptions(idx, {
            onView,
            onEdit: this.onEdit,
            onRemove: this.onRemove,
            Options
        }, e, btn);
    }

    onNew(evt, elem, item) {
        const newDialog = this.getDialogByRef("newDialog");
        if (newDialog) {
            const {props: {promise}, onNewItem} = this.props.page;
            newDialog.open(item).then(item => {
                if (!onNewItem) {
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
            if (!item) {
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
                if (updateAttrs) {
                    setImmediate(() => {
                        updateAttrs = updateAttrs.data || updateAttrs;
                        extendObservable(item.data, updateAttrs);
                    });
                }
            });
        } else {
            infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
        }
    }

    onRemove(evt, elem) {
        const removeDialog = this.getDialogByRef("removeDialog");
        if (removeDialog) {
            removeDialog.open("Are you sure you want to remove the " + (this.props.pageTitleSingular || "item") + "?").then(async res => {
                if (res === 1) {
                    let {idx} = elem.props;
                    if (!('idx' in elem.props)) {
                        idx = parseInt(elem._reactInternals.key.replace("item-remove-", ""));
                    } else {
                        idx = elem.props.idx;
                    }

                    const item = this.list[idx];

                    const {onSoftDelete} = removeDialog.props;

                    const editDialog = this.getDialogByRef("editDialog");
                    const profileDialog = this.getDialogByRef("profileDialog");

                    const {onSoftDeleteProhibit, onUpdate} = this.parentListPage;

                    const {onDelete, softDeleteAttrs} = ((onUpdate, onSoftDelete, editDialog, profileDialog) => {
                        profileDialog = profileDialog || {};
                        editDialog = editDialog || {};

                        const {softDeleteAttrs: softDeleteAttrsProfile} = profileDialog;
                        const {softDeleteAttrs: softDeleteAttrsEdit} = editDialog;

                        const res = {softDeleteAttrs: softDeleteAttrsProfile || softDeleteAttrsEdit};

                        if (onSoftDelete || onUpdate) {
                            res.onDelete = onSoftDelete || onUpdate;
                        } else {
                            const {removeById: removeByIdProfile} = profileDialog;
                            const {removeById: removeByIdEdit} = editDialog;
                            res.onDelete = removeByIdProfile || removeByIdEdit;
                        }

                        return res;
                    })(onUpdate, onSoftDelete, editDialog, profileDialog);

                    if (onDelete) {
                        if (onSoftDeleteProhibit) {
                            let prohibit = onSoftDeleteProhibit(item);
                            if (prohibit instanceof Promise) {
                                prohibit = await prohibit;
                            }
                            if (prohibit) {
                                return;
                            }
                        }

                        progressDialog.open(`Removing the ${this.props.pageTitleSingular || "item"}`);
                        let args = {id: item.id};
                        if (softDeleteAttrs) {
                            args = {...args, ...softDeleteAttrs};
                        } else {
                            args.removed = true;
                        }

                        onDelete(args).then(res => {
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
                    } else {
                        infoDialog.open("Action not permitted.");
                    }
                    // workers.emit(this.props.path + "remove", item.id);
                }
            });
        } else {
            infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
        }
    }

}

export default APageListReadWrite;
