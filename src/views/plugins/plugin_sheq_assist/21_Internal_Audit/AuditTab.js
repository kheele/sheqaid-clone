import React from "react";
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ClearableInput} from '../../../../components/inputs';
import {THead} from '../../../../components/tables';

import {AuditTableRow} from './dialogs/InternalAuditComponents';

import NewAuditDialog from './dialogs/NewAuditDialog.js';
import EditAuditDialog from './dialogs/EditAuditDialog.js';
import ProfileAuditDialog from './dialogs/ProfileAuditDialog.js';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./AuditTab.lazy.css";

@observer
class AuditTab extends React.Component {
    path;
    pageKey = "AuditTab";

    constructor(props) {
        super(props);

        this.path = props.path + 'audit/';

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onDownload = this.onDownload.bind(this);
        
        this.onCopy = this.onCopy.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
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

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="date" type="date" placeholder="Audit Date" className="form-control" onChange={onChange}/>
            <ClearableInput name="type" type="text" placeholder="Audit Type" className="form-control" onChange={onChange}/>
            <ClearableInput name="auditor" type="text" placeholder="Auditor" className="form-control" onChange={onChange}/>
            <ClearableInput name="company" type="text" placeholder="Company" className="form-control" onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-110">Date Created</div>
            <div className="td fixed-flex min-w-110">Audit Date</div>
            <div className="td">Audit Type</div>
            <div className="td">Auditor</div>
            <div className="td">Scope Of Audit</div>
            <div className="td">Company</div>
            <div className="td fixed-flex min-w-195">Company Representative</div>
            <div className="td fixed-flex min-w-70"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <AuditTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }

    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Non-Conformance Report"
            pageTitleSingular="non-conformance report"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewAuditDialog ref="newDialog"/>
            <EditAuditDialog ref="editDialog"/>
            <ProfileAuditDialog ref="profileDialog"/>
            <ProfilePDFReader ref="pdfReader"/>
        </APageListReadWrite>;
    }
}

export default AuditTab;
