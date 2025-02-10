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
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewPPEInventoryDialog from './NewPPEInventoryDialog';
import EditPPEInventoryDialog from './EditPPEInventoryDialog';
import ProfilePPEInventoryDialog from './ProfilePPEInventoryDialog';

import style from "./PPEInventoryDialog.lazy.css";
import PPEInventoryRenderRow from "./PPEInventoryRenderRow";
import {updatePPEInventory} from "mutations/update";
import {listPPEInventory} from "mutations/listByLogged";

// </editor-fold>

@observer
class PPEInventoryDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "PPEInventoryDialog";
    title = "PPE Inventories";
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
            unit,
            team_id,
            department_id,
            job_position_id,
            employee_id,
        } = filterData || {};

        return listPPEInventory({
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

    onExport() {
        // this.refs.ppeIssueDialog.open();
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

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-3 grid-gap-10">
            <ClearableInput name="name" type="text" placeholder="Item Description" className="form-control"
                            onChange={onChange}/>
            <ClearableInput name="unit" type="text" placeholder="Item Unit" className="form-control"
                            onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control"
                                 onChange={onChange} addButton={false}/>
            <SelectTeamInput name="team" placeholder="Team..." className="form-control" onChange={onChange}
                             addButton={false}/>
            <SelectDepartmentInput name="department" placeholder="Department..." className="form-control"
                                   onChange={onChange} addButton={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." className="form-control"
                                    onChange={onChange} addButton={false}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">PPE Type</div>
            <div className="td">PPE Inventory Location</div>
            <div className="td fixed-flex min-w-160">Quantity</div>
            <div className="td fixed-flex min-w-160">Reorder Threshold</div>
            <div className="td fixed-flex min-w-110">PPE Items</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <PPEInventoryRenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView}
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
            listCountTopTitle="ppe inventory"
            pageTitleSingular="ppe inventory"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updatePPEInventory}/>

            <NewPPEInventoryDialog ref="newDialog"/>
            <ProfilePPEInventoryDialog ref="profileDialog"/>
            <EditPPEInventoryDialog ref="editDialog"/>
        </APageListReadWrite>;
    }

    //</editor-fold>

}

export default PPEInventoryDialog;
