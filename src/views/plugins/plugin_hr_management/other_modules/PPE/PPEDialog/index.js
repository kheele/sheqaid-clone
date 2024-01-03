// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectDepartmentInput, SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTeamInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewPPEDialog from '../NewPPEDialog';
import EditPPEDialog from '../EditPPEDialog';
import ProfilePPEDialog from '../ProfilePPEDialog';

import PPEIssueDialog from '../PPEIssueDialog';

import style from "./PPEDialog.lazy.css";
import SignatureDialog from "components/dialogs/SignatureDialog";
import PPERenderRow from "./PPERenderRow";
import updatePPE from "mutations/all/PPE/updatePPE";

// </editor-fold>

@observer
class PPEDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "plugin_sheq_assist/employees/ppe/";
    pageKey = "PPEDialog";
    title = "PPE";
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onRemoved = this.onRemoved.bind(this);

        this.onViewPPEIssue = this.onViewPPEIssue.bind(this);
        this.onSignatures = this.onSignatures.bind(this);

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
            unit,
            team_id,
            department_id,
            job_position_id,
            employee_id,
        } = filterData || {};

        const listByLogged = sockets.of('ppe').fn('listByLogged');

        return listByLogged({
            name,
            unit,
            team_id,
            department_id,
            job_position_id,
            employee_id,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    onRemoved(item) {
        this.refs.root.list.removeIf((v, n) => v.id === item.id);
    }

    // <editor-fold defaultstate="collapsed" desc="onSignatures">
    onSignatures(e, btn) {
        this.refs.signaturesDialog.open();
    }

    // </editor-fold>

    onViewPPERegister() {
        this.refs.newPPERegisterDialog.open();
    }

    onViewPPEIssue() {
        this.refs.ppeIssueDialog.open();
    }

    onViewPPEMatrix() {
        this.refs.ppeMatrixDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPEIssue}>
                PPE Issue
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
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

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-3 grid-gap-10">
            <ClearableInput name="name" type="text" placeholder="Item Description" className="form-control"
                            onChange={onChange}/>
            <ClearableInput name="unit" type="text" placeholder="Item Unit" className="form-control"
                            onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control"
                                   onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
                                    onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td fixed-flex min-w-80">Photo</div>
            <div className="td">Item Description</div>
            <div className="td fixed-flex min-w-120">Item Unit</div>
            <div className="td fixed-flex min-w-120">Qty Received</div>
            <div className="td fixed-flex min-w-100">Qty Issued</div>
            <div className="td fixed-flex min-w-120">Qty In Stock</div>
            <div className="td fixed-flex min-w-80">Teams</div>
            <div className="td fixed-flex min-w-110">Departments</div>
            <div className="td fixed-flex min-w-110">Job Positions</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <PPERenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView} onClick={onClick}/>;
    }

    renderPage() {
        return <APageListReadWrite
          ref="root"
          page={this}
          hasBackBtn={false}
          createBtnTitle="Create"
          pageId={this.pageKey + '-page'}
          listCountTopTitle="ppe"
          pageTitleSingular="ppe"
          onLoadList={this.onLoadList}
          noAnimation={true}
          renderLeftButtons={this.renderLeftButtons}
          renderPopoverOptions={this.renderPopoverOptions}
          renderFilterNode={this.renderFilterNode}
          renderTHead={this.renderTHead}
          renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updatePPE}/>

            <NewPPEDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>
            <ProfilePPEDialog ref="profileDialog" onRemoved={this.onRemoved}/>
            <EditPPEDialog ref="editDialog" onRemoved={this.onRemoved}/>

            <PPEIssueDialog ref="ppeIssueDialog"/>

            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="PPE"/>
        </APageListReadWrite>;
    }

}

export default PPEDialog;
