// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewNCRResponsiblePartyListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewNCRResponsiblePartyListTable";
    title = "Responsible Parties";
    style = style;

    @observable
    selfState2 = {
        lists: {
            responsible_party_list: ['Consultant', 'Client', 'External', 'Internal'],
        },
    };

    constructor(props) {
        super(props);
    }

    onClickComplete(e, el) {
        let {savable, targetItem, insertFn, deleteFn, onAttrs, onUpdated} = this.props;

        if (savable && targetItem) {
            let {action, idx, item} = el.props;

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                insertFn({
                    [targetItem.key]: targetItem.item.id,
                    ...onAttrs(item),
                }).then(savedItem => {
                    if (!savedItem) {
                        infoDialog.open("Sorry! Record couldn't be added.");
                    } else {
                        infoDialog.open("Record successfully added.");
                    }

                    infoDialog.close(2000);
                }).catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    if (!item.id) return;

                    progressDialog.open();
                    deleteFn(item.id).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
        }
    }

    onPostChange(val, name, el) {
        if (!val) {
            return;
        }

        const {idx} = el.props;
        this.onClick(null, {
            props: {action: "save", idx},
        });
    }

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        console.log('NewNCRResponsiblePartyListTable item', item)
        if (item && (
            item.id ||
            item.value
        )) {
            const {
                id,
            } = item;

            let v = item;
            if (v.data) {
                v = v.data;
            }
            const value = v.value;

            if (!value) {
                return null;
            }

            const tr = <>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{value}</div>
                {!readonly && <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </>;

            return <TRow key={id}
                         className={"tr-readonly w-full padding-l-5 margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <NewRow idx={n} onClick={onClick}>
                <ClearableInput
                    ref={this.onSetRef}
                    name="value"
                    type="select"
                    placeholder="Add Responsible Party..."
                    idx={n}
                    required
                    className="form-control"
                    onChange={this.onChange}
                    values={this.selfState2.lists.responsible_party_list}
                    returnValue
                    add
                />
            </NewRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Responsible Party</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }

}

// </editor-fold>

export default ListTable;
