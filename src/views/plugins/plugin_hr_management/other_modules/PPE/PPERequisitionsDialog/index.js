// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ADialogList from "../../../../../ADialogList";
import APageListReadWrite from "../../../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    Button,
    ClearableInput,
    DateRangeInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewPPERequisitionDialog from './NewPPERequisitionDialog';
import EditPPERequisitionDialog from './EditPPERequisitionDialog';
import ProfilePPERequisitionDialog from './ProfilePPERequisitionDialog';

import style from "./PPERequisitionDialog.lazy.css";
import SignatureDialog from "components/dialogs/SignatureDialog";
import PPERequisitionRenderRow from "./PPERequisitionRenderRow";
import {updatePPERequisition} from "mutations/update";
import {listPPERequisitions} from "mutations/listByLogged";
import SelectPPETypeInput from "components/inputs/SelectPPETypeInput";
import {exportExcelPPERequisitions} from "mutations/exportExcel";
import ExportDialog from "components/exports/ExportDialog";

// </editor-fold>

@observer
class PPERequisitionDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "PPERequisitionDialog";
    title = "PPE";
    selfState = {
        lists: {
            auto_reorder_trigger: ['Automatic', 'Manual'].map(value => ({
                label: value, value,
            })),
            approval_status: ['Pending', 'Declined', 'Approved'].map(value => ({
                label: value, value,
            })),
        },
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onRemoved = this.onRemoved.bind(this);

        this.onExport = this.onExport.bind(this);

        this.onSignatures = this.onSignatures.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderExportFilterNode = this.renderExportFilterNode.bind(this);
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
            created_at_range,
            auto_reorder_trigger,
            approval_status,
            ppe_type_id,
            //
            team_id,
            department_id,
            job_position_id,
            employee_id,
        } = filterData || {};

        return listPPERequisitions({
            created_at_range,
            auto_reorder_trigger,
            approval_status,
            ppe_type_id,
            //
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

    onExport() {
        // this.refs.ppeIssueDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
            </Button>
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
            <ClearableInput name="auto_reorder_trigger" type="radio" placeholder="Reorder Type"
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}
                            values={this.selfState.lists.auto_reorder_trigger}
            />
            <ClearableInput name="approval_status" type="select" placeholder="Approval Status..."
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}
                            values={this.selfState.lists.approval_status}
            />
            <SelectPPETypeInput name="ppe_type" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>
            <DateRangeInput name="created_at_range" className="col-lg-12 margin-0 form-control" placeholder=""
                            onChange={onChange}>
                <label className="min-w-100">Reorder Start Date</label>
                <label className="min-w-100">Reorder End Date</label>
            </DateRangeInput>
        </>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls -margin-b-30">
            <ClearableInput name="auto_reorder_trigger" type="select" placeholder="Reorder Type"
                            className="col-lg-2 margin-b-10 form-control"
                            onChange={onChange}
                            values={this.selfState.lists.auto_reorder_trigger}
            />
            <ClearableInput name="approval_status" type="select" placeholder="Approval Status..."
                            className="col-lg-2 margin-b-10 form-control"
                            onChange={onChange}
                            values={this.selfState.lists.approval_status}
            />
            <SelectPPETypeInput name="ppe_type" placeholder="PPE Type..." className="col-lg-4 margin-b-10 form-control"
                                onChange={onChange} addButton={false}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="col-lg-4 margin-b-10 form-control"
                                 onChange={onChange} addButton={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="col-lg-4 margin-b-10 form-control"
                             onChange={onChange}
                             addButton={false}/>
            <SelectDepartmentInput name="department" placeholder="Department..."
                                   className="col-lg-4 margin-b-10 form-control"
                                   onChange={onChange} addButton={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..."
                                    className="col-lg-4 margin-b-10 form-control"
                                    onChange={onChange} addButton={false}/>
            <DateRangeInput name="created_at_range" className="col-lg-6 form-control" placeholder=""
                            onChange={onChange}>
                <label className="min-w-160">Reorder Start Date</label>
                <label className="min-w-160">Reorder End Date</label>
            </DateRangeInput>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">PPE Type</div>
            <div className="td fixed-flex min-w-160">Measurement Unit</div>
            <div className="td fixed-flex min-w-120">Quantity</div>
            <div className="td">Employee</div>
            <div className="td">Reason</div>
            <div className="td fixed-flex min-w-110">Reorder Type</div>
            <div className="td fixed-flex min-w-120">Date</div>
            <div className="td fixed-flex min-w-120">Approval Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <PPERequisitionRenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView}
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
            listCountTopTitle="ppe requisition"
            pageTitleSingular="ppe requisition"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updatePPERequisition}/>

            <NewPPERequisitionDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>
            <ProfilePPERequisitionDialog ref="profileDialog"/>
            <EditPPERequisitionDialog ref="editDialog"/>

            <ExportDialog
                ref="exportDialog"
                titlePlural={this.title}
                renderExportFilterNode={this.renderExportFilterNode}
                exportFn={exportExcelPPERequisitions}
                addHRFilters
            />
            <SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="PPE"/>
        </APageListReadWrite>;
    }

    //</editor-fold>

}

export default PPERequisitionDialog;
