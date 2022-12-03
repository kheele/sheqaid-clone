// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput, SelectPartItemInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewPartItemListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewPartItemListTable";
    title = "Part Item";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {
                part: {
                    id,
                    data: {
                        created_at,
                        client, project, site,
                        name, part_photo, asset, asset_type,
                        order_received_list = [],//{invoice_num}
                    },
                },
                qty,
            } = item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">
                    {RenderUtils.renderImage(part_photo, '100%')}
                    {name}
                </div>
                <div className="td">{asset_type}</div>
                <div className="td">{asset ? (asset.name || asset.data.name) : 'N/A'}</div>
                <div className="td fixed-flex min-w-60">{qty}</div>
                <div className="td fixed-flex min-w-90">cos</div>
                <div className="td">sup</div>
                <div className="td fixed-flex min-w-90">inv</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={id} className={"w-full tr-readonly margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full tr-item-new padding-10">
                <div className="td grid-1 gap-10 margin-0">
                    <SelectPartItemInput ref={this.onSetRef} name="part" placeholder="Add Part Item..."
                                         required className="form-control" onChange={this.onChange}
                                         add={false}/>
                    <ClearableInput ref={this.onSetRef} name="qty" type="number" placeholder="Quantity"
                                    required className="form-control" onChange={this.onChange}/>
                    <Button idx={n} action="save"
                            className="btn btn-primary fixed-flex hor-center min-w-160 margin-0 border-radius-20 margin-0" onClick={onClick}>
                        <i className="fa fa-check"/> Add
                    </Button>
                </div>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Name</div>
            <div className="td">Asset Type</div>
            <div className="td">Asset</div>
            <div className="td fixed-flex min-w-60">QTY</div>
            <div className="td fixed-flex min-w-90">Unit Cost</div>
            <div className="td">Supplier</div>
            <div className="td fixed-flex min-w-90">Invoice #</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;