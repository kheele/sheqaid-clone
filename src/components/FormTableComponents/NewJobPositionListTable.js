// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectJobPositionInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewJobPositionListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewJobPositionListTable";
    title = "Job Positions";
    style = style;

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.job_position || item.id)) {
            console.log('renderItem', item)
            const {id, data} = item.job_position || item;

            const {
                created_at, name, job_category, desc, doc,
            } = data || (item.job_position || item);

            const tr = <>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{name || 'N/A'}</div>
                <div className="td">{job_category ? job_category.name : 'N/A'}</div>
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
            return <TRow key="item-new" className="w-full padding-10">
                <div className="td flex padding-0 margin-0">
                    <SelectJobPositionInput ref={this.onSetRef} name="job_position" placeholder="Add Job Position..."
                                            required className="no-border-radius-r form-control"
                                            onChange={this.onChange}/>
                    <Button idx={n} action="save"
                            className="btn btn-primary fixed-flex w-40 margin-0 no-border-radius-l" onClick={onClick}>
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
            <div className="td">Job Title</div>
            <div className="td">Job Category</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;