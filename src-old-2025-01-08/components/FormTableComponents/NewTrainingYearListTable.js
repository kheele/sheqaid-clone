// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Button, ClearableInput} from '../inputs';
import ANewListTable from './ANewListTable';
import {THead, TRow} from '../tables';

import style from "./NewTrainingYearListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewTrainingYearListTable";
    title = "Training Years";
    style = style;

    componentWillMount() {
        super.componentWillMount();

        this.selfState.lists = {
            years: Array.range(new Date().getFullYear() - 20, new Date().getFullYear()).reverse()
        };
    }

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && item.year) {
            const {year} = item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{year}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={n} className={"tr-readonly margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <NewRow idx={n} onClick={onClick}>
                <ClearableInput
                    ref={this.onSetRef}
                    name="year"
                    type="select"
                    placeholder="Year"
                    required
                    className="no-border-radius-r form-control"
                    onChange={this.onChange}
                    values={this.selfState.lists.years}
                    returnValue
                />
            </NewRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Training Year</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;