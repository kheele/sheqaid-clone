// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';
import ADialogList from "../../ADialogList";
import NavItem from '../../../components/navs/NavItem';
import {Button} from '../../../components/inputs';

// </editor-fold>

@observer
class ADialog extends ADialogList {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props, style) {
        super(props);
        this.style = style;
        this.classNames += "LeftButtonsForExpiryOnlyPage";

        this.onSignatures = this.onSignatures.bind(this);
        this.onExport = this.onExport.bind(this);
        this.onNewItem = this.onNewItem.bind(this);
        this.onView && (this.onView = this.onView.bind(this));
        this.onAdd && (this.onAdd = this.onAdd.bind(this));
        this.onEdit && (this.onEdit = this.onEdit.bind(this));
        this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
        this.renderFilterNode && (this.renderFilterNode = this.renderFilterNode.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        this.style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        this.style.unuse();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(e, el) {
        const {idx, isEmployee} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        const dialog = this.refs.root.getDialogByRef('profileDialog');
        if (dialog) {
            if (isEmployee) {
                dialog.open(item);
            } else {
                const employeeItem = list.find(v => v.id === item.data.employee.id);
                dialog.extraProp('activeId', item.id).open(employeeItem);
            }
        }
    }

    // </editor-fold>

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

    // <editor-fold defaultstate="collapsed" desc="onSignatures">
    onSignatures(e, btn) {
        this.refs.signaturesDialog.open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        this.refs.exportDialog.open();
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

    // <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
    renderDefaultLeftButtons() {
        const {isContractorView} = storage.is;

//        const {permissions_other} = storage.loggedUser.user.data;
//        //
//        const permissions_other_Medicals = (permissions_other || []).find(v => v.key === "Medicals");
//        const c_Medicals = Permissions.allow(permissions_other_Medicals) ? "allowed" : "disallowed";

//        const writable = storage.is.isContractor || !isContractorView;
        return <React.Fragment>
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
            </Button>
        </React.Fragment>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {isRemoved} = this.props;
        const {isEmployee} = btn.props;
        const isEditable = !isRemoved && !isEmployee;
        return <Options idx={idx} permissionOtherKey={this.permissionKey}>
            <NavItem action="view" isEmployee={isEmployee} onClick={this.onView} faIconLeft="eye" title="View"/>
            {isEmployee && <NavItem action="add" btn={btn} onClick={this.onAdd} faIconLeft="plus"
                                    title={`Add ${this.titleSingular}`}/>}
            {isEditable && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {isEditable && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
        </Options>;
    }

    // </editor-fold>

}

export default ADialog;
