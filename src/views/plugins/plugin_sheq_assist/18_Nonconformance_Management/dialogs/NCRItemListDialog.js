// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {execWhen, getRandomRolor} from '../../../../../utils/Utils';
import {renderLeftButtonsForExpiryOnly} from '../../../../../utils/ComponentUtils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from '../../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../../components/dialogs/ConfirmDialog';
import {Button, ClearableInput, DateRangeInput, SelectEmployeeInput} from '../../../../../components/inputs';
import {THead} from '../../../../../components/tables';

import NewNCRDialog from './NewNCRDialog.js';
import EditNCRDialog from './EditNCRDialog.js';
import ProfileNCRDialog from './ProfileNCRDialog';

import ProfileSiteDialog from '../../../plugin_general/Sites/ProfileDialog.js';
import ProfileAuditDialog from '../../21_Internal_Audit/dialogs/ProfileAuditDialog.js';
import ProfileIncidentDialog from '../../17_Incident_Investigation/dialogs/ProfileIncidentDialog.js';

import NCRRenderRow from "./NCRRenderRow";
import ExportNCRDialog from "./ExportNCRDialog";

import style from "./NCRItemListDialog.lazy.css";

// </editor-fold>

@observer
class NCRItemListDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "NCRItemListDialog";
    title = "Non-Conformances";
    @observable
    selfState = {
        lists: {
            type: ['Corrective Action', 'Preventative Action', 'Opportunity For Improver'],
            priority: ['Low', 'Medium', 'High', 'Critical'],
            status: ['Pending', 'Progress', 'Approved', 'Rejected', 'Completed'],
            result: ['Pass', 'Fail'].map(text => {
                return {text, value: text, checked: false}
            }),
            source: ['Site Audit', 'Compliance Audit', 'Inspection', 'Incident Investigation']
        },
        source: null
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onExport = this.onExport.bind(this);
        this.onViewItemSource = this.onViewItemSource.bind(this);
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

    // <editor-fold defaultstate="collapsed" desc="onExport">
    onExport(evt, btn) {
        const {getDialogByRef} = this.refs.root;
        const {source} = this.selfState;
        const exportNCRDialog = getDialogByRef('exportNCRDialog');
        exportNCRDialog.extraProp('source', source).open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onViewItemSource">
    onViewItemSource(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];

        const {source} = this.selfState;
        
        const {getDialogByRef} = this.refs.root;
        
        let name;
        if(source === "Site Audit") {
            name = "profileSiteDialog";
        } else if(source === "Compliance Audit") {
            name = "profileAuditDialog";
        } else if(source === "Inspection"){
//            name = "";
        } else if(source === "Incident Investigation"){
            name = "profileIncidentDialog";
        }

        const {selected_source_ref} = item.data;
        if(!selected_source_ref) {
            infoDialog.open(`Selected item is not attached to any ${source} from the system.`);
            return;
        }
        
        const profileDialog = getDialogByRef(name);
        profileDialog && profileDialog.open(selected_source_ref);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    onLoadList(root, isNew) {
        this.selfState.source = this.extraProp('source');
        return execWhen(() => this.state.defaultList);
    }
    // </editor-fold>

    @computed get path() {
        const {selfState: {source}, props: {path}} = this;
        return {path: `${path}list`, data: {source}};
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {permissionKey} = this.props;
        const item = this.refs.root.list[idx];
        const {selected_source_ref} = item.data;
        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            {selected_source_ref && <hr />}
            {selected_source_ref && <NavItem action="view" onClick={this.onViewItemSource} faIconLeft="eye" title="View NCR Source"/>}
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." className="col-lg-6 pull-left margin-b-10 form-control" onChange={onChange}/>
            <SelectEmployeeInput name="approving_person" placeholder="Approving Person..." className="col-lg-6 pull-left margin-b-10 form-control" onChange={onChange}/>
            <ClearableInput name="type" type="select" placeholder="Type..." className="col-lg-6 margin-b-10 form-control" onChange={onChange} values={this.selfState.lists.type} returnValue/>
            <ClearableInput name="priority" type="select" placeholder="Priority..." className="col-lg-3 margin-b-10 form-control" onChange={onChange} values={this.selfState.lists.priority} returnValue/>
            <ClearableInput ref="source" name="source" type="select" placeholder="Source..." className="col-lg-3 margin-b-10 form-control" onChange={onChange} values={this.selfState.lists.source} returnValue/>
            <ClearableInput name="status" type="select" placeholder="Status..." className="col-lg-6 pull-left margin-b-10 form-control" onChange={onChange} values={this.selfState.lists.status} returnValue/>
            <ClearableInput ref="result" name="result" type="radio" placeholder="Result" className="col-lg-6 margin-b-10 form-control" onChange={onChange} values={this.selfState.lists.result} returnValue/>
            <DateRangeInput name="due_date_range" className="col-lg-4 h-105 grid-6 form-control" placeholder="Due Date" onChange={onChange}>
                <label className="min-w-60">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <DateRangeInput ref="progress_date_range" name="progress_date_range" className="col-lg-4 h-105 grid-6 form-control" placeholder="Progress Date" onChange={onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <DateRangeInput name="completed_date_range" className="col-lg-4 h-105 grid-6 form-control" placeholder="Date Completed" onChange={onChange}>
                <label className="min-w-60">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
    renderDefaultLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee;// || isContractorView;
        return !isReadonly && <div className="left-buttons pull-left padding-l-10">
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {source} = this.selfState;
        return <THead>
            <div className="td fixed-flex min-w-20">#</div>
            <div className="td fixed-flex min-w-100">Due Date</div>
            <div className="td fixed-flex min-w-130">Date Completed</div>
            <div className="td fixed-flex min-w-70">Priority</div>
            <div className="td fixed-flex min-w-180">Type</div>
            <div className="td">Finding/NCR Description</div>
            <div className="td fixed-flex min-w-180">Responsible Person</div>
            <div className="td fixed-flex min-w-90">Status</div>
            <div className="td fixed-flex min-w-60">Result</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {source} = this.selfState;
        return <NCRRenderRow key={item.id} idx={n} item={item} source={source} onClick={onClick}/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        return <APageListReadWrite 
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="non-conformance"
            pageTitleSingular="non-conformance"
            noAnimation={true}
            onLoadList={this.onLoadList}
            renderDefaultLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
            renderLeftButtons={this.renderDefaultLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>  
            <TitlePanel state={this.selfState}/>
            
            <ConfirmDialog ref="removeDialog"/>
            
            <NewNCRDialog ref="newDialog"/>
            <EditNCRDialog ref="editDialog"/>
            <ProfileNCRDialog ref="profileDialog"/>
            
            <ProfileSiteDialog ref="profileSiteDialog"/>
            <ProfileAuditDialog ref="profileAuditDialog"/>
            <ProfileIncidentDialog ref="profileIncidentDialog"/>

            <ExportNCRDialog ref="exportNCRDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="TitlePanel">
@observer
class TitlePanel extends React.Component {

    render() {
        const {state: {source}} = this.props;
        if(!source) return null;
        const style = {background: getRandomRolor()};
        return <React.Fragment>
            <div style={style} className="TitlePanel flex margin-10 padding-20 color_white b">
                {source} Non-Comformances
            </div>
            <div className="TitlePanel-message text-center">
                Non-Conformances below are are listed per <b>{source}</b>
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

export default NCRItemListDialog;
