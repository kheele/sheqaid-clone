// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import {Dates} from '../../utils/Utils';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewChemicalStockItemListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewChemicalStockItemListTable";
    title = "Chemical Stock Items";
    style = style;

    constructor(props) {
        super(props);

        extendObservable(this.selfState, {
            lists: {
                is_clearly_labeled: ['Yes', 'No'].map(text => {
                    return {text, value: text === 'Yes'};
                }),
                storage_location: [],
                unit: ['g', 'kg', 'ml', 'l']
            }
        });
    }

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.chemical_stock || item.is_clearly_labeled)) {
            const {
                is_clearly_labeled,
                storage_location,
                unit,
                qty,
                date_received,
                expiry_date
            } = item.chemical_stock || item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div
                    className="td fixed-flex min-w-120">{isBoolean(is_clearly_labeled) ? is_clearly_labeled ? 'Yes' : 'No' : 'N/A'}</div>
                <div className="td">{storage_location}</div>
                <div className="td fixed-flex min-w-50">{unit}</div>
                <div className="td fixed-flex min-w-70">{qty}</div>
                <div className="td fixed-flex min-w-110">{Dates.formatDate(date_received)}</div>
                <div className="td fixed-flex min-w-100">{Dates.formatDate(expiry_date)}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={n} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <NewRow idx={n} onClick={onClick}>
                <div className="td grid-2 grid-gap-10 padding-0 margin-0 h-auto min-h-130">
                    <ClearableInput ref={this.onSetRef} name="is_clearly_labeled" type="radio"
                                    placeholder="Clearly Labeled?" className="form-control" onChange={this.onChange}
                                    values={this.selfState.lists.is_clearly_labeled} returnValue/>
                    <ClearableInput ref={this.onSetRef} name="storage_location" type="select"
                                    placeholder="Storage Location..." required className="form-control"
                                    onChange={this.onChange} values={this.selfState.lists.storage_location} add
                                    returnValue/>
                    <ClearableInput ref={this.onSetRef} name="unit" type="select" placeholder="Unit..." required
                                    className="form-control" onChange={this.onChange} values={this.selfState.lists.unit}
                                    add returnValue/>
                    <ClearableInput ref={this.onSetRef} name="qty" type="number" placeholder="Quantity" required
                                    className="form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="date_received" type="date" placeholder="Date Received..."
                                    required className="form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="expiry_date" type="date" placeholder="Expiry Date..."
                                    className="form-control" onChange={this.onChange}/>
                </div>
            </NewRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td font-size-13 fixed-flex min-w-30">#</div>
            <div className="td font-size-13 fixed-flex min-w-120">Clearly Labeled?</div>
            <div className="td font-size-13">Storage Location</div>
            <div className="td font-size-13 fixed-flex min-w-50">Unit</div>
            <div className="td font-size-13 fixed-flex min-w-70">Quantity</div>
            <div className="td font-size-13 fixed-flex min-w-110">Date Received</div>
            <div className="td font-size-13 fixed-flex min-w-100">Expiry Date</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;