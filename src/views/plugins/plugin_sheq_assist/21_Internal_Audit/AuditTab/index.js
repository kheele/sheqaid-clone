import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput, DateRangeInput, SelectEmployeeInput} from 'components/inputs';
import {THead} from 'components/tables';

import AuditTableRow from './AuditTableRow';

import NewAuditDialog from './forms/NewAuditDialog.js';
import EditAuditDialog from './forms/EditAuditDialog.js';
import ProfileAuditDialog from './forms/ProfileAuditDialog.js';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./AuditTab.lazy.css";

import updateAudit from "mutations/all/AuditsAndInspections/Audit/updateAudit";
import ExportAuditDialog from "./forms/ExportAuditDialog";

@observer
class AuditTab extends React.Component {
    path;
    pageKey = "AuditTab";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
        
        this.onExport = this.onExport.bind(this);
        
        this.onRemoved = this.onRemoved.bind(this);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onDownload = this.onDownload.bind(this);
        
        this.onCopy = this.onCopy.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }
    //</editor-fold>

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            representative_list,
            auditor,
            type,
            scope,
            date_range,
        } = filterData || {};
        
        const listByLogged = sockets.of('audits').fn('listByLogged');
        
        return listByLogged({
            representative_list,
            auditor,
            type,
            scope,
            date_range,
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

    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }

    async onDownload(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }
    
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }
    
    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(e, btn) {
        const {getDialogByRef} = this.refs.root;
        const exportDialog = getDialogByRef('exportDialog');
        exportDialog.open();
    }
    // </editor-fold>
    
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee;// || isContractorView;
        return <div className="left-buttons pull-left">
            {!isReadonly && <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>}
        </div>;
    }
    
    // </editor-fold>

    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onDownload} faIconLeft="download" title="Download"/>
            <NavItem action="writable" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
        </Options>;
    }
    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-3 grid-gap-10 -margin-b-35">
            <SelectEmployeeInput name="representative_list" type="select_multi" placeholder="Company Representative(s)..." className="form-control" onChange={onChange}/>
            <ClearableInput name="auditor" type="text" placeholder="Auditor" className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="text" placeholder="Audit Type" className="form-control" onChange={onChange}/>
            <ClearableInput name="scope" type="text" placeholder="Scope Of Audit" className="form-control" onChange={onChange}/>
            <DateRangeInput name="date_range" className="form-control"
                            placeholder="Audit Date" placeholderWidthClass="min-w-135" onChange={onChange}/>
        </div>;
    }
    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td fixed-flex min-w-110">Date Created</div>
            <div className="td fixed-flex min-w-110">Audit Date</div>
            <div className="td">Audit Type</div>
            <div className="td">Scope Of Audit</div>
            <div className="td">Company</div>
            <div className="td">Auditor(s)</div>
            <div className="td fixed-flex min-w-195">Company Representative(s)</div>
            <div className="td fixed-flex min-w-70"></div>
        </THead>;
    }
    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <AuditTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Audit"
            pageTitleSingular="audit"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateAudit}/>
            
            <NewAuditDialog ref="newDialog" onRemoved={this.onRemoved}/>
            <EditAuditDialog ref="editDialog" onRemoved={this.onRemoved}/>
            <ProfileAuditDialog ref="profileDialog" onRemoved={this.onRemoved}/>
            
            <ProfilePDFReader ref="pdfReader"/>
            
            <ExportAuditDialog ref="exportDialog"/>
        </APageListReadWrite>;
    }
    //</editor-fold>
    
}

export default AuditTab;
