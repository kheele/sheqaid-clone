// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectUserInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewUserListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewUserListTable";
    title = "Users";
    style = style;

    constructor(props) {
        super(props);
        this.excludeIds = this.excludeIds.bind(this);
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
                    this.removeAt(idx);
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

    excludeIds() {
        const {list} = this;
        return list.filter(item => {
            if (!item) return false;

            const {id} = item;
            if (id) return true;

            const {user} = item;
            if (user && user.id) return true;
        }).map(item => {
            const {id} = item;
            if (id) return id;

            const {user} = item;
            return user.id;
        });
    }

    renderItem(n, onClick) {
        const {readonly, renderTable, placeholder} = this.props;
        const item = this.state.list[n];
//        console.log('item', item)
        if (item && (
            item.id ||
            item.user
        )) {
            const {
                user,
            } = item;

            let id, lname, fname, username;
            if (
                user
            ) {
                let v = user;
                id = v.id;
                if (v.data) {
                    v = v.data;
                }
                lname = v.lname;
                fname = v.fname;
                username = v.username;
            } else {
                id = item.id;
                let v = item;
                if (v.data) {
                    v = v.data;
                }
                lname = v.lname;
                fname = v.fname;
                username = v.username;
            }

            if (!lname && !fname) {
                return null;
            }

            const tr = <>
                <div className="td fixed-flex min-w-35"><span>{n + 1}</span></div>
                <div className="td">{lname + ' ' + fname}</div>
                <div className="td">{username}</div>
                {!readonly && <div className="td fixed-flex min-w-40">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </>;

            return <TRow
                key={id}
                className={"tr-readonly w-full padding-l-5 margin-r-0" + (renderTable ? " tr-table" : "")}
            >
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <NewRow idx={n} onClick={onClick}>
                <SelectUserInput
                    ref={this.onSetRef}
                    name="user"
                    placeholder={placeholder || `Add Existing System User...`}
                    idx={n}
                    required
                    excludeIds={this.excludeIds}
                    className="form-control"
                    onChange={this.onChange}
                />
            </NewRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">System User</div>
            <div className="td">Username</div>
            {!readonly && <div className="td fixed-flex min-w-40 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }

}

// </editor-fold>

export default ListTable;
