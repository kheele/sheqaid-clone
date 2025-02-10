// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import NavItem from 'components/navs/NavItem';

import style from "./ActiveTab.lazy.css";

import {extendObservable} from "mobx";

import ATab from "./ATab";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ActiveTab">
@observer
class ActiveTab extends ATab {

    pageKey = "ActiveTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNewItem = this.onNewItem.bind(this);
        this.onAdd && (this.onAdd = this.onAdd.bind(this));
        this.onEdit && (this.onEdit = this.onEdit.bind(this));
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

    // <editor-fold defaultstate="collapsed" desc="onAdd">
    onAdd(e, el) {
        const {idx} = el.props;
        const employeeItem = this.refs.root.list[idx];
        const dialog = this.refs.root.getDialogByRef('newDialog');
        dialog && dialog.open(employeeItem).then(data => {
//            extendObservable(item.data, data);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onEdit">
    onEdit(e, el) {
        const {idx} = el.props;
        const docItem = this.refs.root.list[idx];
        const dialog = this.refs.root.getDialogByRef('editDialog');
        dialog && dialog.open(docItem).then(data => {
            extendObservable(docItem.data, data);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNewItem">
    onNewItem(item) {
        const {list} = this.refs.root;
        const existingItem = list.find(v => v.id === item.id);
        if (existingItem) {
            setTimeout(() => {
                extendObservable(existingItem.data, item.data);
                const idx = list.indexOf(existingItem);
                list.removeIf((item, _idx) => _idx === idx);
                list.insertAt(idx, item);
            }, 0);
        } else {
            list.pushFirst(item);
        }
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
            {isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"
                                    title={`Add ${titleSingular}`}/>}
            {isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            {/*<hr action="writable"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"*/}
            {/*         title="Save As PDF"/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsExcel} faIconLeft="file-excel-o"*/}
            {/*         title="Save As Excel"/>*/}
        </Options>;
    }

    // </editor-fold>

    // </editor-fold>
}

// </editor-fold>

export default ActiveTab;