// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../utils/Utils';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewNCRProgressListTable.lazy.css";
import Divider from "@mui/material/Divider";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewNCRProgressListTable";
    title = "Non-Conformance Progress";
    style = style;

    constructor(props) {
        super(props);
    }

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {
                outstanding,
                notes,
                date,
            } = item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{outstanding || 'N/A'}</div>
                <div className="td">{notes || 'N/A'}</div>
                <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
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
            return <TRow key="item-new" className="grid-1 grid-gap-10 w-full min-h-130 padding-10">
                <div className="td grid-1 grid-gap-10 padding-0 margin-0 h-auto min-h-130">
                    <ClearableInput ref={this.onSetRef} name="outstanding" type="textarea"
                                    placeholder="Outstanding"
                                    className="col-lg-12 form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="notes" type="textarea"
                                    placeholder="Notes"
                                    className="col-lg-12 form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="date" type="date" defaultValue={new Date()}
                                    placeholder="Progress Date..."
                                    required className="col-lg-12 form-control" onChange={this.onChange}/>
                </div>
                <Divider />
                <Button idx={n} action="save" className="btn btn-primary hor-center w-120 border-radius-20 margin-0" onClick={onClick}>
                    <i className="fa fa-check"/> Submit
                </Button>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td font-size-13 fixed-flex min-w-30">#</div>
            <div className="td font-size-13">Outstanding</div>
            <div className="td font-size-13">Notes</div>
            <div className="td font-size-13 fixed-flex min-w-110">Progress Date</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;