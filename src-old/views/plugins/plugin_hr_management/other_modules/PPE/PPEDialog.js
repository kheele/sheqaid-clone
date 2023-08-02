// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from '../../../../../utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from '../../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../../components/dialogs/ConfirmDialog';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectDepartmentInput,
    SelectJobPositionInput,
    SelectTeamInput
} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import NewPPEDialog from './NewPPEDialog';
import EditPPEDialog from './EditPPEDialog';
import ProfilePPEDialog from './ProfilePPEDialog';

import NewPPERegisterDialog from './NewPPERegisterDialog';
import PPEIssueDialog from './PPEIssueDialog';
import PPEMatrixDialog from './PPEMatrixDialog';

import style from "./PPEDialog.lazy.css";
import SignatureDialog from "../../../../../components/dialogs/SignatureDialog";

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

        this.onViewPPERegister = this.onViewPPERegister.bind(this);
        this.onViewPPEIssue = this.onViewPPEIssue.bind(this);
        this.onViewPPEMatrix = this.onViewPPEMatrix.bind(this);
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
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPERegister}>
                PPE Register
            </Button>
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPEIssue}>
                PPE Issue
            </Button>
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPEMatrix}>
                PPE Matrix
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
            </Button>
        </div>;
    }

    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "PPE";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Item Description" className="form-control"
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
            <div className="td fixed-flex min-w-140">Date Created</div>
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
        const {id,
            data: {
                created_at,
                profile_pic,
                name,
                unit,
                qty_received,
                qty_issued,
                qty_in_stock,
                team_list,
                department_list,
                job_position_list
            }
        } = item;
        console.log(item)
        return <TRow key={id}>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-80">{RenderUtils.renderImage(profile_pic, '100%')}</div>
            <div className="td">{name}</div>
            <div className="td fixed-flex min-w-120">{unit}</div>
            <div className="td fixed-flex min-w-120">{qty_received}</div>
            <div className="td fixed-flex min-w-100">{qty_issued}</div>
            <div className="td fixed-flex min-w-120">{qty_in_stock}</div>
            <div className="td fixed-flex min-w-80">{team_list ? team_list.length : 'N/A'}</div>
            <div className="td fixed-flex min-w-110">{department_list ? department_list.length : 'N/A'}</div>
            <div className="td fixed-flex min-w-110">{job_position_list ? job_position_list.length : 'N/A'}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        const {onLoadList} = this.props;
        return <APageListReadWrite
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="ppe"
            pageTitleSingular="ppe"
            path={this.path}
            onLoadList={onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewPPEDialog ref="newDialog"/>
            <ProfilePPEDialog ref="profileDialog"/>
            <EditPPEDialog ref="editDialog"/>

            <NewPPERegisterDialog ref="newPPERegisterDialog"/>
            <PPEIssueDialog ref="ppeIssueDialog"/>
            <PPEMatrixDialog ref="ppeMatrixDialog"/>

            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="PPE"/>
        </APageListReadWrite>;
    }

}

export default PPEDialog;
