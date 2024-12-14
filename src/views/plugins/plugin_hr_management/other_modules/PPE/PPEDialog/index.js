// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
	Button,
	ClearableInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput,
	SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewPPEDialog from './NewPPEDialog';
import EditPPEDialog from './EditPPEDialog';
import ProfilePPEDialog from './ProfilePPEDialog';

import NewPPEItemDialog from './NewPPEItemDialog';
import EditPPEItemDialog from './EditPPEItemDialog';
import ProfilePPEItemDialog from './ProfilePPEItemDialog';

import PPEIssueDialog from '../PPEIssueDialog';

import style from "./PPEDialog.lazy.css";
import SignatureDialog from "components/dialogs/SignatureDialog";
import PPERenderRow from "./PPERenderRow";
import {updatePPE} from "mutations/update";

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

        this.onExportPPEItem = this.onExportPPEItem.bind(this);
        this.onExportPPEType = this.onExportPPEType.bind(this);

        this.onViewPPEIssue = this.onViewPPEIssue.bind(this);
        this.onCreatePPEItem = this.onCreatePPEItem.bind(this);

        this.onSignatures = this.onSignatures.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderRightButtons = this.renderRightButtons.bind(this);
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

        const listByLogged = sockets.of('ppe-types').fn('listByLogged');

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

    onExportPPEItem() {
        // this.refs.ppeIssueDialog.open();
    }

    onExportPPEType() {
        // this.refs.ppeIssueDialog.open();
    }

    onViewPPEIssue() {
        this.refs.ppeIssueDialog.open();
    }

    onCreatePPEItem() {
        this.refs.newPPEItemDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
            </Button>
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onExportPPEItem}>
                Export PPE Item
            </Button>
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onExportPPEType}>
                Export PPE Type
            </Button>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderRightButtons">
    renderRightButtons() {
        // const w = $(window).width();
        // const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <>
            <Button className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onViewPPEIssue}>
                <i key="buttonCreateIcon" className="fa fa-plus icon-left"/>Issue PPE
            </Button>
            <Button className="btn btn-primary pull-right top-btn-nav__create" onClick={this.onCreatePPEItem}>
                <i key="buttonCreateIcon" className="fa fa-plus icon-left"/>Create PPE Item
            </Button>
        </>;
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
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control"
                                 onChange={onChange}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}/>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control"
                                   onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
                                    onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td fixed-flex min-w-80">Photo</div>
            <div className="td">PPE Type</div>
            <div className="td fixed-flex min-w-160">Measurement Unit</div>
            <div className="td fixed-flex min-w-80">Teams</div>
            <div className="td fixed-flex min-w-110">Departments</div>
            <div className="td fixed-flex min-w-110">Job Positions</div>
            <div className="td fixed-flex min-w-110">Employees</div>
            <div className="td fixed-flex min-w-110">PPE Items</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <PPERenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView} onClick={onClick}/>;
    }

    //<editor-fold desc="renderPage">
    renderPage() {
        return <APageListReadWrite
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create PPE Type"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="ppe type"
            pageTitleSingular="ppe type"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderRightButtons={this.renderRightButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updatePPE}/>

            <NewPPEDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>
            <ProfilePPEDialog ref="profileDialog"/>
            <EditPPEDialog ref="editDialog"/>

            <NewPPEItemDialog ref="newPPEItemDialog" onSetSignatureSettings={this.onSignatures}/>
            <ProfilePPEItemDialog ref="profileItemDialog"/>
            <EditPPEItemDialog ref="editItemDialog"/>

            <PPEIssueDialog ref="ppeIssueDialog"/>

            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="PPE"/>
        </APageListReadWrite>;
    }

    //</editor-fold>

}

export default PPEDialog;
