// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectClientInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewClientListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewClientListTable";
    title = "Companies";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.company || item.id)) {
            const {
                id, data: {
                    name,
                    email,
                    address
                }
            } = item.company || item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{name}</div>
                <div className="td">{email}</div>
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
            return <NewRow idx={n} onClick={onClick}>
                <SelectClientInput
                    ref={this.onSetRef}
                    name="company"
                    placeholder="Add Company..."
                    required
                    className="no-border-radius-r form-control"
                    onChange={this.onChange}
                    add={false}
                />
            </NewRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Company Name</div>
            <div className="td">Email Address</div>
            <div className="td">Address</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;