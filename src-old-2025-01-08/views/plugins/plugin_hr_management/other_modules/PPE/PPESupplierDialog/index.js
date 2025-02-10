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
    SelectPPEItemInput,
    SelectPPETypeInput,
    SelectTeamInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewPPESupplierDialog from './NewPPESupplierDialog';
import EditPPESupplierDialog from './EditPPESupplierDialog';
import ProfilePPESupplierDialog from './ProfilePPESupplierDialog';
import ExportDialog from 'components/exports/ExportDialog';

import style from "./PPESupplierDialog.lazy.css";
import PPESupplierRenderRow from "./PPESupplierRenderRow";
import {updatePPESupplier} from "mutations/update";
import {listPPESuppliers} from "mutations/listByLogged";
import {exportExcelPPESuppliers} from "mutations/exportExcel";

// </editor-fold>

@observer
class PPESupplierDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "PPESupplierDialog";
    title = "PPE Suppliers";
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
            contact_person,
            ppe_item_id,
            ppe_type_id,
            //
            team_id,
            department_id,
            job_position_id,
            employee_id,
        } = filterData || {};

        return listPPESuppliers({
            name,
            contact_person,
            ppe_item_id,
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
            <ClearableInput name="name" type="text" placeholder="Supplier"
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}/>
            <ClearableInput name="contact_person" type="text" placeholder="Contact Person"
                            className="col-lg-12 margin-0 form-control"
                            onChange={onChange}/>
            <SelectPPETypeInput name="ppe_type" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>
            <SelectPPEItemInput name="ppe_item" className="col-lg-12 form-control"
                                parentClassName="margin-0"
                                onChange={onChange} addButton={false}/>
        </>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-4 grid-gap-10">
            <ClearableInput name="name" type="text" placeholder="Supplier" className="form-control"
                            onChange={onChange}/>
            <ClearableInput name="contact_person" type="text" placeholder="Contact Person" className="form-control"
                            onChange={onChange}/>
            <SelectPPETypeInput name="ppe_type" className="form-control"
                                onChange={onChange} addButton={false}/>
            <SelectPPEItemInput name="ppe_item" className="form-control"
                                onChange={onChange} addButton={false}/>

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
            <div className="td">Supplier</div>
            <div className="td">Contact Person</div>
            <div className="td">Email Address</div>
            <div className="td">Phone No.</div>
            <div className="td">Address</div>
            <div className="td fixed-flex min-w-110">PPE Items</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <PPESupplierRenderRow key={item.id} idx={n} item={item} onView={this.refs.root.onView}
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
            listCountTopTitle="ppe supplier"
            pageTitleSingular="ppe supplier"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updatePPESupplier}/>

            <NewPPESupplierDialog ref="newDialog"/>
            <ProfilePPESupplierDialog ref="profileDialog"/>
            <EditPPESupplierDialog ref="editDialog"/>

            <ExportDialog
                ref="exportDialog"
                titlePlural={this.title}
                renderExportFilterNode={this.renderExportFilterNode}
                exportFn={exportExcelPPESuppliers}
                addHRFilters
            />
        </APageListReadWrite>;
    }

    //</editor-fold>

}

export default PPESupplierDialog;
