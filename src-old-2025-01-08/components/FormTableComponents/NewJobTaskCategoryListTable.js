// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import Chip from "@material-ui/core/Chip";

import ANewListTable from './ANewListTable';
import {Button, Clickable} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewJobTaskCategoryListTable.lazy.css";
import NewRow from "./NewRow";
import SelectJobTasksCategoriesInput from "../inputs/SelectJobTasksCategoriesInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewJobTaskCategoryListTable";
    title = "Job Task Categories";
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
        if (item && isString(item.job_task_category)) {
            return null;
        }

        if (item && (item.job_task_category || item.id)) {
            const _item = item.job_task_category || item;
            const {
                id,
                client, project, site,
                name,
                desc,
            } = _item.data || _item;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">
                    <Clickable
                        idx={n}
                    >
                        <Chip
                            label={name}
                            size="medium"
                            sx={{cursor: "pointer", height: "50px !important"}}
                        />
                    </Clickable>
                </div>
                <div className="td">{desc}</div>
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
            return <NewRow idx={n} onClick={onClick}>
                <SelectJobTasksCategoriesInput
                    ref={this.onSetRef}
                    name="job_task_category"
                    placeholder="Add Job Task Category..."
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
            <div className="td">Job Task Category</div>
            <div className="td">Description</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;
