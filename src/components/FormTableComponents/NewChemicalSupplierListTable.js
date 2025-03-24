// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewChemicalSupplierListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewChemicalSupplierListTable";
    title = "Manufacturers / Suppliers";
    style = style;

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

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {
                id,
                manufacturer,
                email,
                phone,
                fax,
                website,
                address,
            } = item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{manufacturer}</div>
                <div className="td">{email}</div>
                <div className="td">{phone}</div>
                <div className="td">{fax}</div>
                <div className="td">{website}</div>
                <div className="td">{address}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full grid-1 grid-gap-10 padding-10 min-h-195">
                <div className="td grid-2 grid-gap-10 padding-0 margin-0 min-h-130">
                    <ClearableInput
                        ref={this.onSetRef}
                        name="manufacturer"
                        placeholder="Manufacturer/Supplier"
                        required
                        className="form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        ref={this.onSetRef}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        ref={this.onSetRef}
                        name="phone"
                        placeholder="Phone No."
                        className="form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        ref={this.onSetRef}
                        name="fax"
                        placeholder="Fax No."
                        className="form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        ref={this.onSetRef}
                        name="website"
                        placeholder="Website"
                        className="form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        ref={this.onSetRef}
                        name="address"
                        type="textarea"
                        placeholder="Address"
                        className="form-control"
                        onChange={this.onChange}
                    />
                </div>
                <div className="td grid-1 grid-gap-10 padding-0 margin-0">
                    <Button idx={n} action="save"
                            className="btn btn-primary fixed-flex hor-center w-200 margin-0 border-radius-20"
                            onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Manufacturer/Supplier</div>
            <div className="td">Email Address</div>
            <div className="td">Phone No.</div>
            <div className="td">Fax No.</div>
            <div className="td">Website</div>
            <div className="td">Address</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;