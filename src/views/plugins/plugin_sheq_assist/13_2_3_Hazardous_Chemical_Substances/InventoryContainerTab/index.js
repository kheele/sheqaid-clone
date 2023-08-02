// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./InventoryContainerTab.lazy.css";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {
    Button,
    ClearableInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput
} from 'components/inputs';
import {THead} from 'components/tables';

import NewInventoryContainerDialog from './dialogs/NewInventoryContainerDialog';
import ProfileInventoryContainerDialog from './dialogs/ProfileInventoryContainerDialog';
import EditInventoryContainerDialog from './dialogs/EditInventoryContainerDialog';

import ExportInventoryContainersDialog from './dialogs/ExportInventoryContainersDialog.js';

import InventoryContainerRenderRow from "./InventoryContainerRenderRow";
import ProfilePDFReader from './printers/ProfileInventoryContainerPDFReader';

import {byClient, byCompany, byProject, bySite} from "./Query/List/listAllInspectionByLogged";
// </editor-fold>

@observer
class InventoryContainerTab extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    path;
    pageKey = "InventoryContainerTab";
    @observable
    state = {
        lists: {
            risk_level: ['Low', 'Medium', 'High', 'Very High']
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'container-inventory/';
        
        this.onExport = this.onExport.bind(this);
        
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        
        this.onCreateHazchemSheet = this.onCreateHazchemSheet.bind(this);

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

    // <editor-fold defaultstate="collapsed" desc="actions">
    onExport(e, btn) {
        this.refs.exportDialog.open();
    }
    
    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }
    
    onCreateHazchemSheet(evt, elem) {
        const {idx} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.newHazchemSheetDialog.open(item);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        return !isReadonly && <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export/Print
            </Button>
        </div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCreateHazchemSheet} faIconLeft="edit" title="Create Hazchem Sheet"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Product Name" className="form-control" onChange={onChange}/>
            <SelectChemicalCategoryInput name="category" placeholder="Category..." className="form-control" onChange={onChange}/>
            <SelectChemicalManufacturerInput name="manufacturer" placeholder="Manufacturer..." className="form-control" onChange={onChange}/>
            <ClearableInput name="risk_level" type="select" placeholder="Risk Level..." className="fixed-flex min-w-200 form-control" onChange={onChange} values={this.state.lists.risk_level} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Date Identified</div>
            <div className="td">Product Name</div>
            <div className="td fixed-flex min-w-180">Emergency Phone No.</div>
            <div className="td">Category</div>
            <div className="td">Manufacturer</div>
            <div className="td fixed-flex min-w-120">Risk Level</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <InventoryContainerRenderRow key={item.id} idx={n} item={item} onClick={onClick}/>;
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
            pageTitle="Safety Data Sheets"
            pageTitleSingular="safety data sheet"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <ProfileInventoryContainerDialog ref="profileDialog"/>
            <NewInventoryContainerDialog ref="newDialog"/>
            <EditInventoryContainerDialog ref="editDialog"/>
            
            <ProfilePDFReader ref="pdfReader"/>
            <ExportInventoryContainersDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

export default InventoryContainerTab;
