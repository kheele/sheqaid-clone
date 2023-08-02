// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';

import {Dates} from 'utils/Utils';
import {Button, SelectClientInput, SelectProjectInput, SelectSiteInput} from 'components/inputs';
import {SelectTable, THead} from 'components/tables';

import {IncidentTableRow} from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponents';

import AuditItemTable from 'views/plugins/plugin_sheq_assist/21_Internal_Audit/AuditTab/forms/AuditItemTable';

// </editor-fold>

@observer
class SourceBtnWrapper extends React.Component {
    @observable
    state = {
        source: null
    };

    @computed
    get source() {
        return this.state.source;
    }

    set source(val) {
        this.state.source = val;
    }

    render() {
        const {onClick, onSelectSite} = this.props;
        const {source} = this;
        if(!source) return null;
        if(source.label === 'Site Audit') {
            return <React.Fragment>
                <SelectClientInput name="client" placeholder="Company..." required group="NCRSiteAudit" className="col-lg-12 form-control margin-b-10"/>
                <SelectProjectInput name="project" placeholder="Project..." required group="NCRSiteAudit" className="col-lg-12 form-control margin-b-10"/>
                <SelectSiteInput name="site" placeholder="Site..." required group="NCRSiteAudit" className="col-lg-12 form-control margin-b-10" onChange={onSelectSite} returnValue/>
            </React.Fragment>;
        }
        return <Button key={new Date().getTime()} text={"Select " + source.label + "..."} className='btn btn-primary block min-w-300 hor-center margin-b-5 border-radius-20' onClick={onClick}/>;
    }
}

@observer
class SelectSourceTable extends React.Component {
    @observable
    state = {
        source: null,
        selected_source: null,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.renderTHeadSource = this.renderTHeadSource.bind(this);
        this.renderTHeadSourceItem = this.renderTHeadSourceItem.bind(this);
        this.renderItemSource = this.renderItemSource.bind(this);
        this.renderItemSourceItem = this.renderItemSourceItem.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
    }
    // </editor-fold>
    
    open() {
        this.refs.selectSourceTable.open();
    }
    
    close() {
        const {selectSourceTable} = this.refs;
        selectSourceTable && selectSourceTable.close();
    }
    
    setOnCancel(fn) {
        
    }
    
    clearSelection() {
        this.refs.selectSourceTable.clearSelection();
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderTHeadSource">
    renderTHeadSource() {
        switch(this.source.label) {
            case "Site Audit":
                return <THead>
                    <div className="td">Company</div>
                    <div className="td">Project</div>
                    <div className="td">Site</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
            case "Compliance Audit": 
                return <THead>
                    <div className="td fixed-flex min-w-100">Audit Date</div>
                    <div className="td">Audit Type</div>
                    <div className="td">Auditor</div>
                    <div className="td">Scope Of Audit</div>
                    <div className="td">Company</div>
                    <div className="td fixed-flex min-w-195">Company Representative</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
            case "Inspection": 
                return <THead>
                    <div className="td fixed-flex min-w-120">Date Created</div>
                    <div className="td">Name</div>
                    <div className="td">Template</div>
                    <div className="td">Score</div>
                    <div className="td">Conducted</div>
                    <div className="td">Completed</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
            case "Incident Investigation": 
                return <THead>
                    <div className="td fixed-flex min-w-120">Incident Date</div>
                    <div className="td fixed-flex min-w-140">Type</div>
                    <div className="td">Category</div>
                    <div className="td">Description</div>
                    <div className="td">Location</div>
                    <div className="td fixed-flex min-w-120">Status</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
        }
    }
    
    renderTHeadSourceItem() {
        switch(this.source.label) {
            case "Site Audit":
                return <THead>
                    <div className="td">Company</div>
                    <div className="td">Project</div>
                    <div className="td">Site</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
            case "Compliance Audit": 
                return <THead>
                    <div className="td fixed-flex min-w-100">Audit Date</div>
                    <div className="td">Audit Type</div>
                    <div className="td">Auditor</div>
                    <div className="td">Scope Of Audit</div>
                    <div className="td">Company</div>
                    <div className="td fixed-flex min-w-195">Company Representative</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
            case "Inspection": 
                return <THead>
                    <div className="td fixed-flex min-w-120">Date Created</div>
                    <div className="td">Name</div>
                    <div className="td">Template</div>
                    <div className="td">Score</div>
                    <div className="td">Conducted</div>
                    <div className="td">Completed</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
            case "Incident Investigation": 
                return <THead>
                    <div className="td fixed-flex min-w-120">Incident Date</div>
                    <div className="td fixed-flex min-w-140">Type</div>
                    <div className="td">Category</div>
                    <div className="td">Description</div>
                    <div className="td">Location</div>
                    <div className="td fixed-flex min-w-120">Status</div>
                    <div className="td fixed-flex no-padding min-w-70"></div>
                </THead>;
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemSource">
    renderItemSource(item, n){
        switch(this.source.label) {
            case "Site Audit":
                return null;
            case "Compliance Audit": {
                const {id, data:{created_at, client, scope, date, type, representative_list, auditor_list, definition_list, list}} = item;
                return <React.Fragment>
                    <div className="td fixed-flex min-w-100">{Dates.formatDate(date)}</div>
                    <div className="td">{type || 'N/A'}</div>
                    <div className="td">{auditor_list ? auditor_list.map(v => v.lname + ' ' + v.fname) : 'N/A'}</div>
                    <div className="td">{scope || 'N/A'}</div>
                    <div className="td">{(client && (client.name || client.data.name)) || 'N/A'}</div>
                    <div className="td fixed-flex padding-l-10 min-w-195">{representative_list ? representative_list.map(v => v.lname + ' ' + v.fname) : 'N/A'}</div>
                </React.Fragment>;
            }
            case "Inspection": {
                const {id, data: {created_at, name, template: {data: template_data, name: template_name}, score, conducted, completed}} = item;
                return <React.Fragment>
                    <div className="td fixed-flex min-w-120">{Dates.formatDateTime(created_at)}</div>
                    <div className="td">{name}</div>
                    <div className="td">{template_name || template_data.name}</div>
                    <div className="td">{score}</div>
                    <div className="td fixed-flex min-w-140">{Dates.formatDateTime(conducted)}</div>
                    <div className="td fixed-flex padding-l-10 min-w-140">{Dates.formatDateTime(completed)}</div>
                </React.Fragment>;
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
                }} = item;
                if(!status) {
                    extendObservable(item.data, {status: []});
                }

                const AssignedInvestigator = !!classification && !!classification.sec5_data && !!classification.sec5_data.investigation_team_list;
                const isInvestigating = !!investigation;

                const Status = ({status}) => {
                    const statusVal = () => {
                        if(!status.contains('ApprovedIncident')) {
                            return ['Awaiting Approval'];
                        } else if(status.contains('ClosedIncident')) {
                            return ['Closed Incident'];
                        } else if(isInvestigating) {
                            return ['Investigating'];
                        } else {
                            return status.map(v => {
                                if(v === 'ApprovedIncident') {
                                    return 'Approved Incident';
                                } else if(AssignedInvestigator) {
                                    return 'Assigned Investigator';
                                } else if(v === 'ApprovedInvestigation') {
                                    return 'Approved Investigation';
                                } else {
                                    return v;
                                }
                            });
                        }
                    };
                    return <div key={new Date().getTime()} className="td fixed-flex padding-l-10 min-w-120">{statusVal().map(v => <span>{v}</span>)}</div>; 
                };

                if(classification) {
                    sec1_data = classification.sec1_data || sec1_data;
                    sec2_data = classification.sec2_data || sec2_data;
                    sec3_data = classification.sec3_data || sec3_data;
                    sec4_data = classification.sec4_data || sec4_data;
                }

                return <React.Fragment>
                    <div className="td fixed-flex min-w-120">{sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}</div>
                    <div className="td fixed-flex min-w-140">{sec3_data && sec3_data.type ? sec3_data.type : 'N/A'}</div>
                    <div className="td">{sec1_data && sec1_data.category_list ? sec1_data.category_list.map(v => <span>{v}</span>) : 'N/A'}</div>
                    <div className="td">{sec1_data && sec1_data.short_desc ? sec1_data.short_desc : 'N/A'}</div>
                    <div className="td">{sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}</div>
                    <Status key={new Date().getTime()} status={item.data.status}/>
                </React.Fragment>;
            }
        }
    }
    
    renderItemSourceItem(item, n){
        switch(this.source.label) {
            case "Site Audit":
                return null;
            case "Compliance Audit": {
                const {element, sub_element, audit_findings, audit_summary, possible_score, achieved_score, compliance} = item;
                console.log('item', item)
                return null;
                //<AuditItemTable ref="list" name="list" defaultValue={_list} isNew={!item} onChange={this.form.onChange}/>
            }
            case "Inspection": {
                const {} = item;
                return null;
            }
            case "Incident Investigation": {
                const {} = item;
                return null;
            }
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    onLoadList(isNew) {
        return neonBinding.events.emit("plugin_sheq_assist/" + this.source.value + 'list', {isNew});
    }
    // </editor-fold>

    @computed
    get source() {
        return this.state.source;
    }

    set source(val) {
        this.state.source = val;
    }

    @computed
    get selected_source() {
        return this.state.selected_source;
    }

    set selected_source(val) {
        this.state.selected_source = val;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onChange, onSelectSourceItem} = this.props;
        const {source, selected_source} = this;
        if(!source) return null;
        if(!source || source.label === 'Site Audit') return null;
        return <React.Fragment>
            {selected_source && <SelectedSource
                key={new Date().getTime()} 
                source={source}
                selected_source={selected_source}
                onClick={onSelectSourceItem}/>
            }
            <SelectTable ref="selectSourceTable"
            isDialog
            replaceCols 
            name="selected_source" 
            className="col-lg-12 margin-l-0 no-padding min-h-200 h-full SelectSourceTable" 
            btnClassName="w-80 min-w-80 margin-0"
            onChange={onChange}
            renderTHead={this.renderTHeadSource} 
            renderItem={this.renderItemSource} 
            onLoadList={this.onLoadList}
            checkBtnTitle="Select" 
            uncheckBtnTitle="Unselect"
            isSingleSelect
            isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
        </React.Fragment>;
    }
    // </editor-fold>
}

@observer
class SelectAuditItemTable extends React.Component {
    @observable
    state = {
        source: null,
        selected_source_item: null,
    };

    setOnCancel(fn) {
        return this.refs.selectSourceListTable.setOnCancel(fn);
    }

    @computed
    get source() {
        return this.state.source;
    }

    set source(val) {
        this.state.source = val;
    }

    @computed
    get selected_source_item() {
        return this.state.selected_source_item;
    }

    set selected_source_item(val) {
        this.state.selected_source_item = val;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onChange} = this.props;
        const {source, selected_source_item} = this;
        if(!source || (source.label !== 'Compliance Audit' || source.label === 'Site Audit')) return null;
        console.log('source', source)
        return <React.Fragment>
            {selected_source_item && <SelectedSourceItem key={new Date().getTime()} selected_source_item={selected_source_item}/>}
            <AuditItemTable 
                ref="selectSourceListTable" 
                name="selected_source_item" 
                title="Select Audit Finding"
                isDialog
                isSingleSelect
                isNew={false} 
                onChange={onChange}
            />
        </React.Fragment>;
    }
    // </editor-fold>
}

@observer
class SelectedSource extends React.Component {
    renderPerson({fname, lname, email}) {
        return <span>{lname} {fname}{email ? ' (' + email + ')' : ''}</span>;
    }
    
    renderIncidentCategory(v) {
        return <span>{v}</span>;
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderSiteAudit">
    get renderSiteAudit() {
        const {source, selected_source, onClick} = this.props;
        return "good";
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderAudit">
    get renderAudit() {
        const {source, selected_source, onClick} = this.props;
        const {id, data:{created_at, client, scope, date, type, representative_list, auditor_list, definition_list, list}} = selected_source;
        return <div className="row margin-0">
            <div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
                <label>Company</label><br />
                {(client && (client.name || client.data.name)) || 'N/A'}
            </div>
            <div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
                <label>Type</label><br />
                {type}
            </div>
            <div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
                <label>Scope</label><br />
                {scope}
            </div>
            <div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
                <label>Date</label><br />
                {Dates.formatDate(date)}
            </div>
            <div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
                <label>Representative(s)</label><br />
                {!representative_list ? 'N/A' : representative_list.map(this.renderPerson)}
            </div>
            <div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
                <label>Auditor(s)</label><br />
                {!auditor_list ? 'N/A' : auditor_list.map(this.renderPerson)}
            </div>
            <Button 
                text={"Select " + source.label + " Finding..."} 
                className='btn btn-primary block min-w-300 hor-center margin-t-10 margin-b-5 border-radius-20' 
                onClick={onClick}
            />
        </div>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderInspection">
    get renderInspection() {
        const {source, selected_source, onClick} = this.props;
        const {id, data: {client, type, scope, date, representative_list, auditor_list}} = selected_source;
        return <React.Fragment> 
            <div className="row margin-0">
                <div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
                    <label>Company</label><br />
                    {(client && (client.name || client.data.name)) || 'N/A'}
                </div>
                <div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
                    <label>Type</label><br />
                    {type}
                </div>
                <div className="col-lg-4 margin-b-5 margin-r-10 bg-f8f8f8 padding-10">
                    <label>Scope</label><br />
                    {scope}
                </div>
                <div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
                    <label>Date</label><br />
                    {Dates.formatDate(date)}
                </div>
                <div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
                    <label>Representative(s)</label><br />
                    {!representative_list ? 'N/A' : representative_list.map(this.renderPerson)}
                </div>
                <div className="col-lg-4 margin-r-10 bg-f8f8f8 padding-10">
                    <label>Auditor(s)</label><br />
                    {!auditor_list ? 'N/A' : auditor_list.map(this.renderPerson)}
                </div>
            </div>
        </React.Fragment>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderIncidentInvestigation">
    get renderIncidentInvestigation() {
        const {source, selected_source, onClick} = this.props;
        return <IncidentTableRow key={new Date().getTime()} item={selected_source}/>;
    }
    // </editor-fold>
    
    get renderSource() {
        const {source} = this.props;
        switch(source.label) {
            case "Site Audit":
                return this.renderSiteAudit;
            case "Compliance Audit": 
                return this.renderAudit;
            case "Inspection": 
                return this.renderInspection;
            case "Incident Investigation": 
                return this.renderIncidentInvestigation;
        }
        return null;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {source, selected_source, onClick} = this.props;
        console.log('selected_source', selected_source)
        
        return <div className="row margin-0">   
            <hr className="margin-t-10 margin-r-10 margin-b-0"/>
            <label className="bg-f8f8f8 block margin-0 margin-r-10 padding-5 text-center">Selected {source.label} Details</label>   
            <hr className="margin-t-0 margin-r-10 margin-b-5"/>
            {this.renderSource}
        </div>;
    }
    // </editor-fold>
}

@observer
class SelectedSourceItem extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {selected_source_item} = this.props;
        console.log('selected_source_item', selected_source_item)
        let {
            responsible_person,
            audit_findings, audit_summary,
            possible_score, achieved_score, compliance,
            comments
        } = selected_source_item;
        
        let responsible_personName = null;
        if(responsible_person) {
            const {fname, lname, data} = responsible_person;
            responsible_personName = (lname || data.lname) + ' ' + (fname || data.fname);
        }
        return <div className="row margin-0">   
            <hr className="margin-t-10 margin-r-10 margin-b-0"/>
            <label className="bg-f8f8f8 block margin-0 margin-r-10 padding-5 text-center">Selected Audit Findings</label>   
            <hr className="margin-t-0 margin-r-10 margin-b-5"/>
            <div className="row margin-0">
                <div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Audit Findings</label><br />{audit_findings || 'N/A'}</div>
                <div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Responsible Person</label><br />{responsible_personName || 'N/A'}</div>
                <div className="col-lg-3 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Audit Summary</label><br />{audit_summary || 'N/A'}</div>
                <div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Possible Score</label><br />{possible_score}</div>
                <div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Achieved Score</label><br />{achieved_score}</div>
                <div className="col-lg-2 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Compliance</label><br />{compliance}%</div>
                <div className="col-lg-12 margin-b-5 margin-r-10 bg-f8f8f8 padding-10"><label>Comments</label><br />{comments || 'N/A'}</div>
            </div>
        </div>;
    }
    // </editor-fold>
}

export {SourceBtnWrapper, SelectSourceTable, SelectAuditItemTable};
