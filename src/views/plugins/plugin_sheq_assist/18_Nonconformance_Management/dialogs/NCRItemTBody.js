// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import {Dates} from "../../../../../utils/Utils";
import {Button} from '../../../../../components/inputs';
import {ATableSavable, TBody, TRow} from '../../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NCRItemTBodyElement">
@observer
class NCRItemTBodyElement extends ATableSavable {
    
    constructor(props) {
        super(props);
        
        if(props.isNew) {
            this.state.list = [];
        }
        
        this.onCloseAll = this.onCloseAll.bind(this);
    }

    @computed get listGroup() {
        const sources = this.state.list.groupBy('source.label');
        const sourcesList = Object.keys(sources).map(k => {
            let list = sources[k];
            return {source: k, list};
        });
        return sourcesList;
    }
    
    refresh() {
        this.refs.stats && this.refs.stats.refresh();
    }
    
    onCloseAll(idx) {
        this.listGroup.filter((item, n) => idx !== n).forEach(item => {
            item.tbody_ref.close();
        });
    }
    
    RenderItem({item, n, readonly, onCloseAll, onClick, onNew, onEditItem}) {
        let {
            source: source_label, list
        } = item;
        const {source} = list.find(v => v.source.label === source_label);
        
        const onAdd = (evt, btn) => {
            onNew();
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        return <div className="td-RenderItem td-ItemTBodyElement" key={"item-" + n}>
                <label className='title flex'>
                    <span>{n + 1}. {source_label}</span>
                    {!readonly && <Button className='btn btn-primary fixed-flex' text='Add' onClick={onAdd}/>}
                    <Button className='btn btn-primary fixed-flex' text='View' onClick={onView}/>
                </label>
                <NCRItemTBodySubElement ref={onSetRef} defaultValue={list} source={source} sourceIdx={n} readonly={readonly} onNew={onNew} onEditItem={onEditItem}/>
            </div>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, onEditItem, onNew} = this.props;
        const item = this.listGroup[n];
        return <RenderItem key={n + '-' + new Date().getTime()} n={n} item={item} readonly={readonly} onCloseAll={this.onCloseAll} onClick={onClick} onNew={onNew} onEditItem={onEditItem}/>;
    }

    render() {
        const list = this.listGroup;
        return (<TBody 
            ref="body" 
            className='NCRItemTBodyElement AAuditItemTBodyElement'
            title="Assessed Items" 
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            list={list}
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}/>);
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NCRItemTBodySubElement">
@observer
class NCRItemTBodySubElement extends ATableSavable {
    
    @observable selfState = {
        rendered: false
    };
    
    constructor(props) {
        super(props);
        
        if(props.isNew) {
            this.state.list = [];
        }
        
        this.onCloseAll = this.onCloseAll.bind(this);
    }

    @computed get listGroup() {
        const selected_sources = this.state.list.groupBy('selected_source.id');
        const selected_sourcesList = Object.keys(selected_sources).map(k => {
            let list = selected_sources[k];
            return {selected_source: k, list};
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
            selected_source: selected_source_id, list
        } = item;
        
        const {selected_source} = list.find(v => v.selected_source.id === selected_source_id);
        const onAdd = (evt, btn) => {
//            alert(selected_source.id)
            onNew(selected_source)
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        
        const renderTitle = () => {
            switch(source.label) {
                case "Site Audit":
                    return <span>
                        {template_name || template_data.name} created on <b>{Dates.formatDate(created_at)}</b>
                    </span>;
                case "Compliance Audit": {
                    return <span>
                        {source.label} by <b>bb</b> on <b>{Dates.formatDate(date)}</b>
                    </span>;
                }
                case "Inspection": {
                    const {id, data: {created_at, name, template: {data: template_data, name: template_name}, score, conducted, completed}} = selected_source;
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
                    }} = selected_source;
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
                        {sec3_data && sec3_data.type ? sec3_data.type : 'N/A'} at <b>{sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}</b>
                         on <b>{sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}</b>
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
        
        if(props.isNew) {
            this.state.list = [];
        }
        
        this.onEditItem = this.onEditItem.bind(this);
    }

    toggle() {
        this.selfState.rendered = !this.selfState.rendered;
    }
    
    close() {
        this.selfState.rendered = false;
    }

    onEditItem(evt, btn) {
        const {onChange, name, onEditItem} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const item = list[idx];
        onEditItem(item).then(item_updated => {
            list.removeIf((v, n) => n === idx);
            list.insertAt(idx, item_updated);
            
            onChange && onChange(toJS(this.list), name, this);
        });
    }
    
    RenderItem({item, n, sourceIdx, selectedSourceIdx, readonly, onClick, onEditItem}) {
        let {
            source, selected_source,
            due_date, responsible_person, approving_person, 
            desc,
            document_list,
            comments,
            remarks
        } = item;
        
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
                <   Button idx={n} action="edit" className="btn btn-primary fa fa-edit pull-left no-border-radius-r" onClick={onEditItem}/>
                <Button idx={n} action="delete" className="btn btn-primary fa fa-times-circle pull-right no-border-radius-l" onClick={onClick}/>
            </div>}
        </TRow>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, sourceIdx, selectedSourceIdx} = this.props;
        const item = this.state.list[n];
        return <RenderItem key={sourceIdx + selectedSourceIdx + n + new Date().getTime()} sourceIdx={sourceIdx} selectedSourceIdx={selectedSourceIdx} n={n} item={item} readonly={readonly} onClick={onClick} onEditItem={this.onEditItem}/>;
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

export default NCRItemTBodyElement;
