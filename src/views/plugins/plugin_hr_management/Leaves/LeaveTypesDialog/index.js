// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from 'components/inputs';
import {THead} from 'components/tables';

import NewLeaveTypeDialog from './NewLeaveTypeDialog';
import EditLeaveTypeDialog from './EditLeaveTypeDialog';
import ProfileLeaveTypeDialog from './ProfileLeaveTypeDialog';
import ExportDialog from 'components/exports/ExportDialog';

import style from "./LeaveTypeDialog.lazy.css";
import LeaveTypeRenderRow from "./LeaveTypeRenderRow";
import {updateEmployeeLeaveType} from "mutations/update";
import {listEmployeeLeaveTypes} from "mutations/listByLogged";
import {exportExcelEmployeeLeaveTypes} from "mutations/exportExcel";

// </editor-fold>

@observer
class LeaveTypeDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "LeaveTypeDialog";
    title = "Leave Types";
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onRemoved = this.onRemoved.bind(this);

        this.onExport = this.onExport.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        return listEmployeeLeaveTypes({
            name,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        });
    }

    //</editor-fold>

    onRemoved(item) {
        this.refs.root.list.removeIf((v, n) => v.id === item.id);
    }

    onExport() {
        this.refs.exportDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onExport}>
                Export
            </Button>
        </div>;
    }

    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "PPE";
        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderExportFilterNode(onChange) {
        return <>
            <ClearableInput name="name" type="text" placeholder="Leave Type"
                            className="margin-0 form-control"
                            onChange={onChange}/>
        </>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name" type="text" placeholder="Leave Type" className="col-lg-12 form-control"
                            onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">Leave Type</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-130">Days Allocated</div>
            <div className="td fixed-flex min-w-100">Days Used</div>
            <div className="td fixed-flex min-w-150">Days Carried Over</div>
            <div className="td fixed-flex min-w-120">Days Accrued</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <LeaveTypeRenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView}
                                   onClick={onClick}/>;
    }

    //<editor-fold desc="renderPage">
    renderPage() {
        return <APageListReadWrite
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="leave type"
            pageTitleSingular="leave type"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateEmployeeLeaveType}/>

            <NewLeaveTypeDialog ref="newDialog"/>
            <ProfileLeaveTypeDialog ref="profileDialog"/>
            <EditLeaveTypeDialog ref="editDialog"/>

            <ExportDialog
                ref="exportDialog"
                titlePlural={this.title}
                renderExportFilterNode={this.renderExportFilterNode}
                exportFn={exportExcelEmployeeLeaveTypes}
                addHRFilters
            />
        </APageListReadWrite>;
    }

    //</editor-fold>

}

export default LeaveTypeDialog;
