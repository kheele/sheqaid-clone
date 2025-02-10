// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import NavItem from '../../../../../components/navs/NavItem';

import style from "./ActiveTab.lazy.css";

import ATab from "./ATab";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ActiveTab">
@observer
class ActiveTab extends ATab {

    pageKey = "ActiveTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
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

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {permissionKey} = this.props;
        const {isEmployee} = this;
        const isEditable = !isEmployee;
        return <Options idx={idx} permissionModKey={permissionKey} permissionOtherKey={permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={onView} faIconLeft="eye" title="View"/>
            {isEditable && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
        </Options>;
    }

    // </editor-fold>

    // </editor-fold>
}

// </editor-fold>

export default ActiveTab;
