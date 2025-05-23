// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button} from 'components/inputs';
import {THead} from 'components/tables';

import NewLeavePolicyDialog from './NewLeavePolicyDialog';
import EditLeavePolicyDialog from './EditLeavePolicyDialog';
import ProfileLeavePolicyDialog from './ProfileLeavePolicyDialog';
import ExportDialog from 'components/exports/ExportDialog';

import style from "./LeavePoliciesDialog.lazy.css";
import LeavePolicyRenderRow from "./LeavePolicyRenderRow";
import {updateEmployeeLeavePolicy} from "mutations/update";
import {listEmployeeLeavePolicies} from "mutations/listByLogged";
import {exportExcelEmployeeLeavePolicies} from "mutations/exportExcel";
import SelectLeaveTypeInput from "../../../../../components/inputs/SelectLeaveTypeInput";

// </editor-fold>

@observer
class LeavePoliciesDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "LeavePoliciesDialog";
    title = "Leave Policies";
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
            //
            leave_type_id,
        } = filterData || {};

        return listEmployeeLeavePolicies({
            //
            leave_type_id,
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
            <SelectLeaveTypeInput name="leave_type" className="form-control"
                                  parentClassName="margin-0"
                                  onChange={onChange} addButton={false}/>
        </>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <SelectLeaveTypeInput name="leave_type" className="col-lg-12 form-control"
                                  onChange={onChange} addButton={false}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">Leave Type</div>
            <div className="td">Default Days Allocated</div>
            <div className="td">Max. Years To Carry Over</div>
            <div className="td">Accrual Period Start Date</div>
            <div className="td">Accrual Period End Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <LeavePolicyRenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView}
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
            listCountTopTitle="leave policy"
            pageTitleSingular="leave policy"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateEmployeeLeavePolicy}/>

            <NewLeavePolicyDialog ref="newDialog"/>
            <ProfileLeavePolicyDialog ref="profileDialog"/>
            <EditLeavePolicyDialog ref="editDialog"/>

            <ExportDialog
                ref="exportDialog"
                titlePlural={this.title}
                renderExportFilterNode={this.renderExportFilterNode}
                exportFn={exportExcelEmployeeLeavePolicies}
                addHRFilters
            />
        </APageListReadWrite>;
    }

    //</editor-fold>

}

export default LeavePoliciesDialog;
