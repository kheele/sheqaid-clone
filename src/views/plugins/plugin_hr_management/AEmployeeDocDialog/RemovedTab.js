// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import NavItem from 'components/navs/NavItem';

import style from "./RemovedTab.lazy.css";

import ATab from "./ATab";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RemovedTab">
@observer
class RemovedTab extends ATab {

    pageKey = "RemovedTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onRestore = this.onRestore.bind(this);
    }

    // </editor-fold>

    //<editor-fold desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    //</editor-fold>

    //<editor-fold desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onRestore">
    onRestore(evt, btn) {
        confirmDialog.open("Are you sure you want to restore the item?").then(res => {
            if (res === 1) {
                const {store} = this.props;
                const {idx} = btn.props;
                const {list} = this.refs.root;
                const item = list[idx];
                progressDialog.open("Restoring the item...");
                store.restore(item).then(res => {
                    setTimeout(() => {
                        list.removeIf((item, _idx) => _idx === idx);
                    });
                    infoDialog.open("Item successfully restored.");
                    infoDialog.close(2000);
                }).finally(() => {
                    progressDialog.close();
                });
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {permissionKey, titleSingular} = this.props;
        const {isEmployee} = this;
        const isEditable = !isEmployee;
        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={this.onView} faIconLeft="eye" title="View"/>
            {isEditable && <NavItem action="remove" idx={idx} onClick={this.onRestore} faIconLeft="ban" title="Restore"/>}
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"
                     title="Save As PDF"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsExcel} faIconLeft="file-excel-o"
                     title="Save As Excel"/>
        </Options>;
    }

    // </editor-fold>

    // </editor-fold>
}

// </editor-fold>

export default RemovedTab;