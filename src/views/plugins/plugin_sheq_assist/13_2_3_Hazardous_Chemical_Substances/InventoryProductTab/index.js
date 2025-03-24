// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./InventoryProductTab.lazy.css";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    Button,
    ClearableInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput,
    SelectChemicalPhysicalStateInput,
    SelectChemicalTypesInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewInventoryProductDialog from '../forms/NewInventoryProductDialog';
import ProfileInventoryProductDialog from '../forms/ProfileInventoryProductDialog';
import EditInventoryProductDialog from '../forms/EditInventoryProductDialog';

import NewMSDSDialog from '../forms/NewMSDSDialog';
import NewHazchemSheetDialog from '../forms/NewHazchemSheetDialog';

import ExportInventoryProductsDialog from '../dialogs/ExportInventoryProductsDialog.js';

import InventoryProductRenderRow from "./InventoryProductRenderRow";
import ProfilePDFReader from '../printers/ProfileInventoryProductPDFReader';
import {updateChemicalHazchemsheet} from "mutations/update";

// </editor-fold>

@observer
class InventoryProductTab extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    path;
    pageKey = "InventoryProductTab";
    @observable
    state = {
        lists: {
            risk_level: ['Low', 'Medium', 'High', 'Very High'],
            is_combustible: ['Yes', 'No'],
            is_flammable: ['Yes', 'No'],
            is_hazardous: ['Yes', 'No'],
            is_stable: ['Yes', 'No']
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onExportAll = this.onExportAll.bind(this);

        this.onRemoved = this.onRemoved.bind(this);

        this.onExport = this.onExport.bind(this);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);

        this.onAttachSDS = this.onAttachSDS.bind(this);
        this.onAttachHazchemSheet = this.onAttachHazchemSheet.bind(this);
        this.onAttachRiskAssessment = this.onAttachRiskAssessment.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentMount">
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
            manufacturer,
            type,
            category,
            physical_state,
            risk_level,
            is_stable,
            is_hazardous,
            is_combustible,
            is_flammable,
        } = filterData || {};

        const listByLogged = sockets.of('chemicals/products').fn('listByLogged');

        return listByLogged({
            name,
            manufacturer,
            type,
            category,
            physical_state,
            risk_level,
            is_stable,
            is_hazardous,
            is_combustible,
            is_flammable,
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

    // <editor-fold defaultstate="collapsed" desc="onExportAll">
    onExportAll(e, btn) {
        const {getDialogByRef} = this.refs.root;
        const exportDialog = getDialogByRef('exportDialog');
        exportDialog.open();
    }

    onRemoved(item) {
        this.refs.root.list.removeIf((v, n) => v.id === item.id);
    }

    // <editor-fold defaultstate="collapsed" desc="actions">
    onExport(e, btn) {
        this.refs.exportDialog.open();
    }

    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }

    onAttachSDS(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];

        if (this.hasSDS(item)) {
            const {id, data: {has_sds, sds, sds_doc}} = item;
            this.refs.editDialog.extraProp('sds_attached', {has_sds, sds, sds_doc}).open(item).then(updateAttrs => {
                const {sds, sds: {data: {date_identified}}, sds_doc} = updateAttrs;
                setTimeout(() => {
                    item.data.sds = sds;
                    item.data.sds_doc = sds_doc;
                    item.data.sds_date = date_identified;
                    item.data.has_sds = "Yes";
                });
            });
        } else {
            this.refs.newSDSDialog.open(item).then(res => {
                const {id, data: {date_identified}} = res;
                setTimeout(() => {
                    item.data.sds = res;
                    //                item.data.sds_doc = res;
                    item.data.sds_date = date_identified;
                    item.data.has_sds = "Yes";
                });
            });
        }
    }

    onAttachHazchemSheet(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];

        if (this.hasHazchemSheet(item)) {
            const {id, data: {has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc}} = item;
            this.refs.editDialog.extraProp('hazchem_sheet_attached', {
                has_hazchem_sheet,
                hazchem_sheet,
                hazchem_sheet_doc
            }).open(item).then(updateAttrs => {
                const {hazchem_sheet, hazchem_sheet_doc, hazchem_sheet_date} = updateAttrs;
                setTimeout(() => {
                    item.data.hazchem_sheet = hazchem_sheet;
                    item.data.hazchem_sheet_doc = hazchem_sheet_doc;
                    item.data.hazchem_sheet_date = hazchem_sheet_date;
                    item.data.has_hazchem_sheet = "Yes";
                });
            });
        } else {
            this.refs.newHazchemSheetDialog.open(item).then(res => {
                const {id, data: {date_identified}} = res;
                setTimeout(() => {
                    item.data.hazchem_sheet = res;
                    //                item.data.hazchem_sheet_doc = res;
                    //                item.data.hazchem_sheet_date = date_identified;
                    item.data.has_hazchem_sheet = "Yes";
                });
            });
        }
    }

    onAttachRiskAssessment(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];

        const {id, data: {has_risk_assessment, risk_assessment, risk_assessment_doc}} = item;

        this.refs.editDialog.extraProp('ra_attached', {
            has_risk_assessment,
            risk_assessment,
            risk_assessment_doc
        }).open(item).then(updateAttrs => {
            const {risk_assessment, risk_assessment_doc, risk_assessment_date} = updateAttrs;
            setTimeout(() => {
                item.data.risk_assessment = risk_assessment;
                item.data.risk_assessment_doc = risk_assessment_doc;
                item.data.risk_assessment_date = risk_assessment_date;
                item.data.has_risk_assessment = "Yes";
            });
        });
    }

    // </editor-fold>

    hasSDS(item) {
        const {id, data: {has_sds, sds, sds_doc}} = item;
        return has_sds === "Yes" || !!sds || !!sds_doc;
    }

    hasHazchemSheet(item) {
        const {id, data: {has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc}} = item;
        return has_hazchem_sheet === "Yes" || !!hazchem_sheet || !!hazchem_sheet_doc;
    }

    hasRiskAssessment(item) {
        const {id, data: {has_risk_assessment, risk_assessment, risk_assessment_doc}} = item;
        return has_risk_assessment === "Yes" || !!risk_assessment || !!risk_assessment_doc;
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        return !isReadonly && <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {
            id, data: {
                has_sds, sds, sds_doc,
                has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc,
                has_risk_assessment, risk_assessment, risk_assessment_doc
            }
        } = item;

        const hasSDS = this.hasSDS(item);
        const hasHazchemSheet = this.hasHazchemSheet(item);
        const hasRA = this.hasRiskAssessment(item);

        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onAttachSDS} faIconLeft="edit"
                     title={`${hasSDS ? 'Change' : 'Attach'} Safety Data Sheet`}/>
            <NavItem action="writable" idx={idx} onClick={this.onAttachHazchemSheet} faIconLeft="edit"
                     title={`${hasHazchemSheet ? 'Change' : 'Attach'} Hazchem Sheet`}/>
            <NavItem action="writable" idx={idx} onClick={this.onAttachRiskAssessment} faIconLeft="edit"
                     title={`${hasRA ? 'Change' : 'Attach'} Risk Assessment`}/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"
                     title="Save As PDF"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="name" type="text" placeholder="Product Name"
                            className="col-lg-3 margin-b-10 form-control" onChange={onChange}/>
            <SelectChemicalManufacturerInput name="manufacturer" placeholder="Manufacturer..."
                                             className="col-lg-3 margin-b-10 form-control" onChange={onChange}/>
            <SelectChemicalTypesInput name="type" placeholder="Type..." className="col-lg-3 margin-b-10 form-control"
                                      onChange={onChange}/>
            <SelectChemicalCategoryInput name="category" placeholder="Category..."
                                         className="col-lg-3 margin-b-10 form-control" onChange={onChange}/>

            <SelectChemicalPhysicalStateInput name="physical_state" placeholder="Physical State..."
                                              className="col-lg-2 form-control" onChange={onChange}/>
            <ClearableInput name="risk_level" type="select" placeholder="Risk Level..."
                            className="col-lg-2 form-control" onChange={onChange} values={this.state.lists.risk_level}
                            returnValue/>
            <ClearableInput name="is_stable" type="select" placeholder="Is Stable?" className="col-lg-2 form-control"
                            onChange={onChange} values={this.state.lists.is_stable} returnValue/>
            <ClearableInput name="is_hazardous" type="select" placeholder="Is Hazardous?"
                            className="col-lg-2 form-control" onChange={onChange} values={this.state.lists.is_hazardous}
                            returnValue/>

            <ClearableInput name="is_combustible" type="select" placeholder="Is Combustible?"
                            className="col-lg-2 form-control" onChange={onChange}
                            values={this.state.lists.is_combustible} returnValue/>
            <ClearableInput name="is_flammable" type="select" placeholder="Is Flammable?"
                            className="col-lg-2 form-control" onChange={onChange} values={this.state.lists.is_flammable}
                            returnValue/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Product Name</div>
            <div className="td fixed-flex min-w-110">Physical State</div>
            <div className="td fixed-flex min-w-110">Type</div>
            <div className="td">Category</div>
            <div className="td fixed-flex min-w-120">Documents</div>
            <div className="td fixed-flex min-w-140">Other Statuses</div>
            <div className="td fixed-flex min-w-110">PPE Required</div>
            <div className="td fixed-flex min-w-100">Risk Level</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <InventoryProductRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Chemical Products"
            pageTitleSingular="chemical product"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateChemicalHazchemsheet}/>

            <ProfileInventoryProductDialog ref="profileDialog" onRemoved={this.onRemoved}/>
            <NewInventoryProductDialog ref="newDialog" onRemoved={this.onRemoved}/>
            <EditInventoryProductDialog ref="editDialog" onRemoved={this.onRemoved}/>

            <NewMSDSDialog ref="newSDSDialog"/>
            <NewHazchemSheetDialog ref="newHazchemSheetDialog"/>

            <ProfilePDFReader ref="pdfReader"/>
            <ExportInventoryProductsDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }

    // </editor-fold>

}

export default InventoryProductTab;
