// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput, SelectEmployeeInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewPartItemOrderRequestsListTable.lazy.css";
import styleDialog from "./NewOrderRequestDialog.lazy.css";
import {calculateRightPos, Dates} from "../../utils/Utils";
import {ANewDialog} from "../dialogs";
import {AControls, FormControls, Row} from "../FormComponents";
import NavItem from "../navs/NavItem";
import {extendObservable} from "mobx";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewPartItemOrderRequestsListTable";
    title = "Part Item Order";
    style = style;

    constructor(props) {
        super(props);

        this.onOptions = this.onOptions.bind(this);
        this.onView = this.onView.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onSendToApprovals = this.onSendToApprovals.bind(this);
        this.onCreateOrder = this.onCreateOrder.bind(this);
        this.onCancelOrder = this.onCancelOrder.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    onOptions(evt, btn) {
        const {idx} = btn.props;
        let elem = window.$(evt.target);
        if (!elem.hasClass("btn")) {
            elem = elem.closest("button");
        }
        const offset = elem.offset();
        const style = {
            left: "auto",
            right: calculateRightPos(elem[0], false) + 10,
            top: 'auto',
            bottom: `clamp(${-offset.top - elem.outerHeight()}px, ${-offset.top - elem.outerHeight()}px, 0px)`,//-offset.top - elem.outerHeight(),
            width: "auto"
        };

        popover.settings({
            style,
            contentNode: <div>
                <NavItem idx={idx} onClick={this.onView} faIconLeft="eye" title="View"/>
                <NavItem idx={idx} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>
                <NavItem idx={idx} onClick={this.onRemove} faIconLeft="ban" title="Remove"/>
                <hr className=""/>
                <NavItem idx={idx} onClick={this.onSendToApprovals} faIconLeft="send" title="Send To Approvals"/>
                <hr className=""/>
                <NavItem idx={idx} onClick={this.onCreateOrder} faIconLeft="check" title="Create Order"/>
                <NavItem idx={idx} onClick={this.onCancelOrder} faIconLeft="ban" title="Cancel Order"/>
            </div>
        }).open();
    }

    onView(evt, el) {
        const {idx} = el.props;
        const {list} = this.state;
        const item = list[idx];
        // this.refs.viewDialog.open(item).then(item => {
        //     if (item) {
        //         this.edit(item, idx);
        //     }
        // });
    }

    onEdit(evt, el) {
        const {idx} = el.props;
        const {list} = this.state;
        const item = list[idx];
        this.refs.newDialog.open(item).then(item => {
            if (item) {
                this.edit(item, idx);
            }
        });
    }

    onRemove(evt, el) {
        const {idx} = el.props;
        const {list} = this.state;
        const item = list[idx];
        confirmDialog.open('Are you sure you want to remove this item?').then(res => {
            if(res === 1) {
                this.removeAt(idx);
            }
        });
    }

    onSendToApprovals(evt, el) {
        const {idx} = el.props;
        const {list} = this.state;
        const item = list[idx];
        confirmDialog.open('Are you sure you want to send this item to approvals?').then(res => {
            if(res === 1) {
                extendObservable(item, {status: 'AwaitingApproval'});
                this.edit(item, idx);
            }
        });
    }

    onCreateOrder(evt, el) {
        const {idx} = el.props;
        const {list} = this.state;
        const item = list[idx];

    }

    onCancelOrder(evt, el) {
        const {idx} = el.props;
        const {list} = this.state;
        const item = list[idx];
        confirmDialog.open('Are you sure you want to cancel this order?').then(res => {
            if(res === 1) {
                extendObservable(item, {status: 'CanceledOrder'});
                this.edit(item, idx);
            }
        });
    }

    onAdd(evt, btn) {
        this.refs.newDialog.open().then(item => {
            if (item) {
                this.addFirst(item);
            }
        });
    }

    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {
                requested_by, date_requested, request_reason, measurement_unit, qty_requested
            } = item;

            const get_person = requested_by => {
                if (!requested_by) return 'N/A';
                const {fname, lname, data} = requested_by;
                return `${lname || data.lname} ${fname || data.fname}`;
            };

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td fixed-flex min-w-50">{measurement_unit}</div>
                <div className="td fixed-flex min-w-120">{qty_requested}</div>
                <div className="td">{get_person(requested_by)}</div>
                <div className="td fixed-flex min-w-120">{Dates.formatDate(date_requested)}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} className="btn btn-primary hor-center w-40" onClick={this.onOptions}>
                        <i className="fa fa-bars"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={n} className={"w-full tr-readonly margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <TRow key="item-new" className="w-full padding-10">
                <div className="td flex flex-center padding-0 margin-0">
                    <Button idx={n} action="save"
                            className="btn btn-primary fixed-flex min-w-200 margin-0 border-radius-20"
                            onClick={this.onAdd}>
                        <i className="fa fa-plus"/> Add Request
                    </Button>
                </div>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td fixed-flex min-w-50">Unit</div>
            <div className="td fixed-flex min-w-120">Qty Requested</div>
            <div className="td">Requested By</div>
            <div className="td fixed-flex min-w-120">Date Requested</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            <NewOrderRequestDialog ref='newDialog'/>
        </THead>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewOrderRequestDialog extends ANewDialog {
    pageKey = "NewOrderRequestDialog";
    title = "Create Part Order Request";

    constructor(props) {
        super(props, styleDialog);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends AControls {

    state = {
        lists: {
            measurement_unit: ['ml', 'l', 'mg', 'g', 'kg', 'unit', 'each']
        }
    };

    // <editor-fold defaultstate="collapsed" desc="title">
    get title() {
        return 'Create Part Order Request';
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const data = super.onSubmit(e, btn, onSaved);

        console.log(data)

        onSaved(data);
        this.props.close();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <FormControls>
            <Row
                rendered
                activeAlways
                idx={1}
                title="1. Order Request"
            >
                <SelectEmployeeInput ref="requested_by" name="requested_by" placeholder="Requested By..."
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="date_requested" name="date_requested" type="date" placeholder="Date Requested..."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <hr className="margin-t-5 margin-b-10 pull-left"/>

                <ClearableInput ref="request_reason" name="request_reason" type="textarea"
                                placeholder="Reason For Request" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <hr className="margin-t-5 margin-b-10 pull-left"/>

                <ClearableInput ref="measurement_unit" name="measurement_unit" type="select"
                                placeholder="Measurement Unit..." className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.measurement_unit} add returnValue/>
                <ClearableInput ref="qty_requested" name="qty_requested" type="number" placeholder="Quantity Requested"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default ListTable;