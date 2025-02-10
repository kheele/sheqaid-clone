// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectIncidentInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewIncidentListTable.lazy.css";
import {
    IncidentTableRow
} from "../../views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponentRows";
import {TransferEmployeesDialog} from "../../views/plugins/plugin_hr_management/Employees/dialogs";
import ExportIncidentsDialog
    from "../../views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ExportIncidentsDialog";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewIncidentListTable";
    title = "Names";
    style = style;
    innerRefs = {};

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
    }

    onSelect() {
        this.innerRefs.exportIncidentsDialog.extraProp('role', 'select').open().then(list => {
            this.state.list = [...list, null];
        });
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
//        console.log('item', item)
        if (item) {
            const id = item.id;

            const onRenderActionCell = (item, idx) => {
                if (readonly) {
                    return <div className="td fixed-flex min-w-0 padding-0"/>;
                }
                return <div className="td fixed-flex min-w-60">
                    <Button idx={idx} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>;
            };

            return <IncidentTableRow
                key={id}
                idx={n}
                item={item}
                className="tr-readonly w-full padding-l-5 margin-r-0"
                onRenderActionCell={onRenderActionCell}
            />;
        } else {
            return <TRow key="item-new" className="padding-10 w-full">
                <div className="td flex flex-center padding-0 margin-0">
                    <Button idx={n} action="save" text="Add Incident(s)"
                            className="btn btn-primary fixed-flex border-radius-20 min-w-200" onClick={this.onSelect}/>
                </div>
                <ExportIncidentsDialog ref={ref => this.innerRefs.exportIncidentsDialog = ref}/>
            </TRow>;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            {/*<div className="td fixed-flex min-w-30">#</div>*/}
            <div className="td fixed-flex min-w-120">Incident Date</div>
            <div className="td fixed-flex min-w-140">Group</div>
            <div className="td">Category</div>
            <div className="td">Description</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-140">Status</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }

}

// </editor-fold>

export default ListTable;