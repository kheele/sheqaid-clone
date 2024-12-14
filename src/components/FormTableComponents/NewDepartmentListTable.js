// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectDepartmentInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewDepartmentListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewDepartmentListTable";
    title = "Departments";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.department || item.id)) {
            console.log('renderItem', item)
            const {id, data} = item.department || item;

            const {
                name,
            } = data || (item.department || item);

            const tr = <>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
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
            return <TRow key="item-new" className="w-full w-full h-100 padding-10">
                <div className="td grid grid-1 grid-gap-10 h-auto flex-center padding-0 margin-0">
                    <SelectDepartmentInput ref={this.onSetRef} name="department" placeholder="Add Department..."
                                           required className="no-border-radius-r w-full form-control"
                                           onChange={this.onChange}/>
                    <Button idx={n} action="save"
                            className="btn btn-primary hor-center w-80 margin-0 border-radius-30"
                            onClick={onClick}>
                        <i className="fa fa-check"/> ADD
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
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;