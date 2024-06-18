// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import ANewListTable from './ANewListTable';
import {Button, SelectEmployeeInput} from '../inputs';
import {THead, TRow} from '../tables';

import CustomPersonalInfoDialog from '../../components/dialogs/CustomPersonalInfoDialog';

import style from "./NewEmployeeListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewEmployeeListTable";
    title = "Names";
    style = style;

    constructor(props) {
        super(props);
        this.onAddOtherPerson = this.onAddOtherPerson.bind(this);
        this.excludeIds = this.excludeIds.bind(this);
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

    onPostChange(val, name, el) {
        if (!val) {
            return;
        }

        const {idx} = el.props;
        this.onClick(null, {
            props: {action: "save", idx},
        });
    }

    onAddOtherPerson(e, btn) {
        const {name, onChange} = this.props;
        this.refs.otherPersonDialog.open().then(other_person => {
            this.insertAt(this.state.list, {other_person});
            onChange && onChange(toJS(this.list), name, this);
        });
    }

    excludeIds() {
        const {list} = this;
        return list.filter(item => {
            if (!item) return false;

            const {id} = item;
            if (id) return true;

            const {employee, investigator, person_involved, witness} = item;
            const v = employee || investigator || person_involved || witness;
            if (v && v.id) return true;
        }).map(item => {
            const {id} = item;
            if (id) return id;

            const {employee, investigator, person_involved, witness} = item;
            const v = employee || investigator || person_involved || witness;
            return v.id;
        });
    }

    renderItem(n, onClick) {
        const {readonly, placeholder, renderTable, disableOtherPerson} = this.props;
        const item = this.state.list[n];
//        console.log('item', item)
        if (item && (
            item.id ||
            item.employee ||
            item.investigator ||
            item.person_involved ||
            item.witness ||
            item.other_person ||
            item.investigator_other ||
            item.person_involved_other ||
            item.witness_other ||
            (item.id_num || item.passport_num)
        )) {
            const {
                employee, investigator, person_involved, witness,
                other_person, investigator_other, person_involved_other, witness_other,
            } = item;

            let id, lname, fname, email;
            if (
                employee || investigator || person_involved || witness
            ) {
                let v = employee || investigator || person_involved || witness;
                id = v.id;
                if (v.data) {
                    v = v.data;
                }
                lname = v.lname;
                fname = v.fname;
                email = v.email;
            } else if (
                other_person || investigator_other || person_involved_other || witness_other
            ) {
                let v = other_person || investigator_other || person_involved_other || witness_other;
                lname = v.lname;
                fname = v.fname;
                email = v.email;
            } else {
                id = item.id;
                let v = item;
                if (v.data) {
                    v = v.data;
                }
                lname = v.lname;
                fname = v.fname;
                email = v.email;
            }

            if (!lname && !fname) {
                return null;
            }

            const tr = <>
                <div className="td fixed-flex min-w-35"><span>{n + 1}</span></div>
                <div className="td">{lname + ' ' + fname}</div>
                <div className="td">{email}</div>
                {!readonly && <div className="td fixed-flex min-w-40">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </>;

            return <TRow key={id}
                         className={"tr-readonly w-full padding-l-5 margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="padding-10 w-full">
                <div className="td flex padding-0 margin-0">
                    <SelectEmployeeInput
                        ref={this.onSetRef}
                        name="employee"
                        placeholder={placeholder || "Add Existing Employee..."}
                        idx={n}
                        required
                        excludeIds={this.excludeIds}
                        className="form-control"
                        onChange={this.onChange}
                    />
                    {!disableOtherPerson && <h4 className="min-w-60 fixed-flex text-center">OR</h4>}
                    {!disableOtherPerson && <Button
                        idx={n}
                        action="save"
                        className="btn btn-primary fixed-flex w-160 margin-0 border-radius-20"
                        onClick={this.onAddOtherPerson}
                    >
                        <i className="fa fa-plus"/>Add Other Person
                    </Button>}
                </div>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly, disableOtherPerson, employeeCol} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">{employeeCol || "Employee / Other Person"}</div>
            <div className="td">Email Address</div>
            {!readonly && <div className="td fixed-flex min-w-40 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            {!disableOtherPerson && <CustomPersonalInfoDialog ref="otherPersonDialog"/>}
        </THead>;
    }

}

// </editor-fold>

export default ListTable;
