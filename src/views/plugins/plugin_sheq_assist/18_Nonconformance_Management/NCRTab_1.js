// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import {Dates} from "utils/Utils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, TBody, TRow} from 'components/tables';

import NCRItemTHead from './dialogs/NCRItemTHead';

import NewNCRDialog from './dialogs/NewNCRDialog.js';
import EditNCRDialog from './dialogs/EditNCRDialog.js';
import ProfileNCRDialog from './dialogs/ProfileNCRDialog';

import style from "./NCRTab.lazy.css";

// </editor-fold>

@observer
class NCRTab extends React.Component {
    path;
    pageKey = "NCRTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'ncr/';

        this.onNew = this.onNew.bind(this);
        
        this.onApprove = this.onApprove.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.onEditItem = this.onEditItem.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
                
        this.onCloseAll = this.onCloseAll.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNew">
    onNew(source, selected_source_ref) {
//        alert('source: ' + source)
//        alert('selected_source_ref: ' + selected_source_ref)
        const {list, getDialogByRef} = this.refs.root;
        const newDialog = getDialogByRef('newDialog');
        let d;
        if(isString(source)) {
            d = newDialog.extraProp('source', source);
        }
        if(selected_source_ref && isObject(selected_source_ref)) {
            d = newDialog.extraProp('selected_source', selected_source_ref);
        }
        
        (d || newDialog).open().then(item => {
            list.push(item);
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onApprove">
    onApprove(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];   
        confirmDialog.open("Are you sure you want to approve the non-comformance?").then(res => {
            if(res === 1) {
                progressDialog.open("Approving the non-comformance...");
                neonBinding.events.emit(this.path + "add-status", item.id, "ApprovedIncident").then(res => {
                    progressDialog.close();
                    console.log("res", res)
//                    if(!item.data.status) {
//                        setTimeout(() => {
//                            extendObservable(item.data, {status: ['ApprovedIncident']});
//                        });
//                    }
                    infoDialog.open("Non-Comformance successfully approved.");
                    infoDialog.close(2000);
                });   
            }
        })
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onReject">
    onReject(e, el) {
        
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onProgress">
    onProgress(e, el) {
        
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onComplete">
    onComplete(e, el) {
        
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCopy">
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onEditItem">
    onEditItem(evt, btn) {
        const {idx} = btn.props;
        const {list, onEdit} = this.refs.root;
        const item = list[idx];
        onEdit(evt, null, item);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {id, data: {
                created_at, 
                source, selected_source_id, selected_source_item,
                desc,
                due_date, responsible_person, approving_person, 
                document_list,
                comments,
                remarks
            }
        } = item;
        const {id: user_uid} = storage.loggedUser.user;
        const isResponsible = () => {
            return responsible_person && user_uid === responsible_person.id;
        };
        const isApproving = () => {
            return approving_person && user_uid === approving_person.id;
        };
        
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            {isResponsible() && <React.Fragment>
                <hr action="writable"/>
                <NavItem action="writable" idx={idx} onClick={this.onProgress} faIconLeft="copy" title="Progressed"/>
                <NavItem action="writable" idx={idx} onClick={this.onComplete} faIconLeft="copy" title="Complete"/>
            </React.Fragment>}
            {isApproving() && <React.Fragment>
                <hr action="writable"/>
                <NavItem action="writable" idx={idx} onClick={this.onApprove} faIconLeft="check" title="Approve"/>
                <NavItem action="writable" idx={idx} onClick={this.onReject} faIconLeft="check" title="Reject"/>
            </React.Fragment>}
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="source" type="text" placeholder="Source" className="form-control" onChange={onChange}/>
            <ClearableInput name="responsible_person" type="text" placeholder="Responsible Person" className="form-control" onChange={onChange}/>
            <ClearableInput name="approving_person" type="text" placeholder="Approving Person" className="form-control" onChange={onChange}/>
            <ClearableInput name="due_date" type="date" placeholder="Due Date" className="form-control" onChange={onChange}/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <NCRItemTHead/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCloseAll">
    onCloseAll(idx) {
        this.refs.root.listGroup.filter((item, n) => idx !== n).forEach(item => {
            item.tbody_ref.close();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onListByGroup">
    onListByGroup(list) {
        const sources = list.groupBy('data.source');
        const sourcesList = Object.keys(sources).map(k => {
            let list = sources[k];
            return {source: k, list};
        });
        return sourcesList;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getTBodyProps">
    getTBodyProps(listGroup, onLoadList, onClick) {
        return {
            className: 'NCRItemTBodyElement AAuditItemTBodyElement'
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="RenderItemSite">
    RenderItemSite({item, n, source, sourceIdx, readonly, onCloseAll, onClick, onNew, onEditItem}) {
        let {
            list
        } = item;
        
        const onAdd = (evt, btn) => {
            onNew(source);
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        
        return <div key={"item-" + sourceIdx + '-' + n} className="td-RenderItem td-ItemTBodySubElement">
            <label className='title flex'>
                <span>{sourceIdx + 1}. {source}</span>
                <Button className='btn btn-primary fixed-flex' text='View' onClick={onView}/>
                {!readonly && <Button className='btn btn-primary fixed-flex' text='Add' onClick={onAdd}/>}
            </label>
            <NCRItemTBody ref={onSetRef} defaultValue={list} sourceIdx={sourceIdx} selectedSourceIdx={n} readonly={readonly} onEditItem={onEditItem}/>
        </div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="RenderItem">
    RenderItem({item, n, readonly, onCloseAll, onClick, onNew, onEditItem}) {
        let {
            source, list
        } = item;
        
        const onAdd = (evt, btn) => {
            onNew(source);
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        return <div className="td-RenderItem td-ItemTBodyElement" key={"item-" + n}>
            <label className='title'> 
                <span>{n + 1}. {source}</span>
                <Button className='btn btn-primary' text='View' onClick={onView}/>
                {!readonly && <Button className='btn btn-primary' text='Add' onClick={onAdd}/>}
            </label>
            <NCRItemTBodySubElement ref={onSetRef} defaultValue={list} source={source} sourceIdx={n} readonly={readonly} onNew={onNew} onEditItem={onEditItem}/>
        </div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const {RenderItem, RenderItemSite} = this;
        const item = this.refs.root.listGroup[n];
        let {
            source, list
        } = item;
        
        const key = n + '-' + new Date().getTime();
        const props = {
            key,
            n,
            item,
            readonly: false,
            onNew: this.onNew,
            onEditItem: this.onEditItem,
            onCloseAll: this.onCloseAll,
            onClick
        };
        if(source === 'Site Audit') {
            return <RenderItemSite {...props} source={source} sourceIdx={n}/>;
        }
        return <RenderItem {...props}/>;
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
            pageTitle="Non-Conformances"
            pageTitleSingular="non-conformance"
            path={this.path}
            noAnimation={true}
            onListByGroup={this.onListByGroup}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            getTBodyProps={this.getTBodyProps}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewNCRDialog ref="newDialog"/>
            <EditNCRDialog ref="editDialog"/>
            <ProfileNCRDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="NCRItemTBodySubElement">
@observer
class NCRItemTBodySubElement extends ATableSavable {
    
    @observable selfState = {
        rendered: false
    };
    
    constructor(props) {
        super(props);
        
        this.onCloseAll = this.onCloseAll.bind(this);
    }

    @computed get listGroup() {
        console.log('listGroup', this.state.list.slice())
        const selected_sources = this.state.list.groupBy('data.selected_source_id');
        const selected_sourcesList = Object.keys(selected_sources).map(k => {
            let list = selected_sources[k];
            return {selected_source_id: k, list};
        });
        return selected_sourcesList;
    }
    
    onCloseAll(idx) {
        this.listGroup.filter((item, n) => idx !== n).forEach(item => {
            item.tbody_ref.close();
        });
    }
    
    toggle() {
        this.selfState.rendered = !this.selfState.rendered;
    }
    
    close() {
        this.selfState.rendered = false;
    }
    
    RenderItem({item, n, source, sourceIdx, readonly, onCloseAll, onClick, onNew, onEditItem}) {
        let {
            selected_source_id, list
        } = item;
        
        const {data: {selected_source_ref}} = list.find(v => v.data.selected_source_id === selected_source_id);
        const onAdd = (evt, btn) => {
            onNew(source, selected_source_ref)
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        
        const mapAuditor = ({fname, lname}) => {
            return lname + ' ' + fname;
        };
        
        const renderTitle = () => {
            switch(source) {
                case "Site Audit": {
                    return null;
                }
                case "Compliance Audit": {
                    const {id, data:{created_at, company, scope, date, type, representative_list, auditor_list, definition_list, list}} = selected_source_ref;
                    return <span>
                        {type} by <b>{auditor_list.map(mapAuditor)}</b> on <b>{Dates.formatDate(date)}</b>
                    </span>;
                }
                case "Checklist": 
                case "Inspection": {
                    const {id, data: {created_at, name, template: {data: template_data, name: template_name}, score, conducted, completed}} = selected_source_ref;
                    return <span>
                        {template_name || template_data.name} created on <b>{Dates.formatDate(created_at)}</b>
                    </span>;
                }
                case "Incident Investigation": {
                    let {id, data: {
                        created_at, status,
                        classification,
                        investigation,
                        sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data, 
                        sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data, 
        //                sec1_data: {category_list, short_desc},//1
        //                sec2_data: {sub_category_list},//2
        //                sec3_data: {type},//3
        //                sec4_data: {secondary_type_list},//4
        //                sec5_data: {person_involved_list},//5
        //                sec6_data: {person_reporting},//6
        //                sec7_data: {person_reported_to, date_reported, time_reported},//7
        //                sec8_data: {witness_list},//8
        //                sec9_data: {incident_date, incident_time, exact_location},//9
        //                sec10_data: {document_list, desc},//10
        //                sec11_data: {person_injured, injured_person_dob, injured_person_gender, nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list},//11
        //                sec12_data: {test_undertaken, test_type_list, test_type_drug_undertaken, test_type_alcohol_undertaken, test_type_mobile_device_undertaken},//12
        //                sec13_data: {is_vehicle_incident, is_infringement_issued, did_police_attend_scene, collision_reported_to_police_station, have_charges_been_laid},//13
        //                sec14_data: {consequence, frequency, risk_rating},//15
        //                sec15_data: {distribution_list}//16
                    }} = selected_source_ref;
                    if(!status) {
                        extendObservable(item.data, {status: []});
                    }

                    const AssignedInvestigator = !!classification && !!classification.sec5_data && !!classification.sec5_data.investigation_team_list;
                    const isInvestigating = !!investigation;

                    if(classification) {
                        sec1_data = classification.sec1_data || sec1_data;
                        sec2_data = classification.sec2_data || sec2_data;
                        sec3_data = classification.sec3_data || sec3_data;
                        sec4_data = classification.sec4_data || sec4_data;
                    }
                    return <span>
                        {sec3_data.type} at <b>{sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}</b>
                        &nbsp;on <b>{sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}</b>
                    </span>;
                }
            }
        };
        
//        console.log('list', selected_source_id, selected_source, list)
        return <div key={"item-" + sourceIdx + '-' + n} className="td-RenderItem td-ItemTBodySubElement">
            <label className='title flex'>
                <span>{sourceIdx + 1}.{n + 1}. {renderTitle()}</span>
                {!readonly && <Button className='btn btn-primary fixed-flex' text='Add' onClick={onAdd}/>}
                <Button className='btn btn-primary fixed-flex' text='View' onClick={onView}/>
            </label>
            <NCRItemTBody ref={onSetRef} defaultValue={list} sourceIdx={sourceIdx} selectedSourceIdx={n} readonly={readonly} onEditItem={onEditItem}/>
        </div>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, source, sourceIdx, onEditItem, onNew} = this.props;
        const item = this.listGroup[n];
        return <RenderItem key={sourceIdx + n + new Date().getTime()} source={source} sourceIdx={sourceIdx} n={n} item={item} readonly={readonly} onCloseAll={this.onCloseAll} onClick={onClick} onNew={onNew} onEditItem={onEditItem}/>;
    }

    render() {
        if(!this.selfState.rendered) return null;
        const list = this.listGroup;
        return (<TBody 
            ref="body" 
            className='NCRItemTBodySubElement AAuditItemTBodySubElement'
            title="Assessed Items" 
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            list={list}
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}>
        </TBody>);
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NCRItemTBody">
@observer
class NCRItemTBody extends ATableSavable {
    
    @observable selfState = {
        rendered: false
    };
    
    constructor(props) {
        super(props);
    }

    toggle() {
        this.selfState.rendered = !this.selfState.rendered;
    }
    
    close() {
        this.selfState.rendered = false;
    }

    RenderItem({item, n, sourceIdx, selectedSourceIdx, readonly, onClick, onEditItem}) {
        let {
            source, selected_source_id,
            due_date, responsible_person, approving_person, 
            desc,
            document_list,
            comments,
            remarks
        } = item.data;
        
        let responsible_personName = null;
        let approving_personName = null;
        if(responsible_person) {
            const {fname, lname, data} = responsible_person;
            responsible_personName = (fname || data.fname).charAt(0).toUpperCase() + '. ' + (lname || data.lname);
        } else {
            responsible_personName = "";
        }
        if(approving_person) {
            const {fname, lname, data} = approving_person;
            approving_personName = (fname || data.fname).charAt(0).toUpperCase() + '. ' + (lname || data.lname);
        } else {
            approving_personName = "";
        }
        
        return <TRow key={"item-" + sourceIdx + '-' + selectedSourceIdx + '-' + n}>
            <div className="td">
                <span className="counter max-w-20">{sourceIdx + 1}.{selectedSourceIdx + 1}.{n + 1}</span>
                {desc}
            </div>
            <div className="td fixed-flex min-w-150">{(document_list || []).map(v => {
                
            })}</div>
            
            <div className="td td-risk-control-measures padding-l-0 padding-r-0">{comments}</div>
            
            <div className="td td-tr fixed-flex flex min-w-110 padding-0">
                <div className="td td-calc td-rotate-single"><span>{responsible_personName}</span></div>
                <div className="td td-calc td-rotate-single"><span>{Dates.formatDate(due_date)}</span></div>
                <div className="td td-calc td-rotate-single"><span></span></div>
            </div>
            
            <div className="td td-risk-control-measures padding-l-0 padding-r-0">{remarks}</div>
            
            <div className="td td-tr fixed-flex flex min-w-110 padding-0">
                <div className="td td-calc td-rotate-single"><span>{approving_personName}</span></div>
                <div className="td td-calc td-rotate-single"><span></span></div>
                <div className="td td-calc td-rotate-single"><span></span></div>
            </div>
            
            {!readonly && <div className="td td-actions">
                <Button idx={n} action="edit" className="btn btn-primary fa fa-edit pull-left no-border-radius-r" onClick={onEditItem}/>
                <Button idx={n} action="delete" className="btn btn-primary fa fa-times-circle pull-right no-border-radius-l" onClick={onClick}/>
            </div>}
        </TRow>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, sourceIdx, selectedSourceIdx, onEditItem} = this.props;
        const item = this.state.list[n];
        return <RenderItem key={sourceIdx + selectedSourceIdx + n + new Date().getTime()} sourceIdx={sourceIdx} selectedSourceIdx={selectedSourceIdx} n={n} item={item} readonly={readonly} onClick={onClick} onEditItem={onEditItem}/>;
    }

    render() {
        if(!this.selfState.rendered) return null;
        return (<TBody 
            ref="body" 
            title="Assessed Items" 
            className='NCRItemTBody AAuditItemTBody'
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            state={this.state}
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}/>);
    }
}
// </editor-fold>

export default NCRTab;
