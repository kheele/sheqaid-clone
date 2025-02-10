// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectTeamInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewTeamListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewTeamListTable";
    title = "Teams";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.team || item.id)) {
            console.log('renderItem', item)
            const {id, data} = item.team || item;

            const {
                created_at, name, supervisor,
            } = data || (item.team || item);

            const {lname, fname} = supervisor || {};

            const tr = <>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{supervisor ? (lname + " " + fname) : "N/A"}</div>
                <div className="td">{name}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </>;

            return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <NewRow idx={n} onClick={onClick}>
                <SelectTeamInput
                    ref={this.onSetRef}
                    name="team"
                    placeholder="Add Team..."
                    className="no-border-radius-r w-full form-control"
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
            <div className="td">Supervisor</div>
            <div className="td">Team Name</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;