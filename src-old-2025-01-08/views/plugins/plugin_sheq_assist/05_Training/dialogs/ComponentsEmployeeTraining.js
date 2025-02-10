// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from 'utils/Utils';
import {ActionsButton, Clickable} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeTrainingMatrixTable">
@observer
class EmployeeTrainingMatrixTable extends ATableSavable {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.listGroup[n];
        return <EmployeeTrainingPlanTableGroupRow 
            key={"item-new-" + n} 
            idx={n} 
            item={item}
            closeAll={this.closeAll}
            onSetRef={this.onSetRef}
        />;
    }
    // </editor-fold>
    
    render() {
        const {list} = this;
        return null;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeTrainingRegisterTable">
@observer
class EmployeeTrainingRegisterTable extends ATableSavable {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.listGroup[n];
        return <EmployeeTrainingPlanTableGroupRow 
            key={"item-new-" + n} 
            idx={n} 
            item={item}
            closeAll={this.closeAll}
            onSetRef={this.onSetRef}
        />;
    }
    // </editor-fold>
    
    render() {
        const {list} = this;
        return null;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EmployeeTrainingPlanTable, EmployeeTrainingPlanTableGroupRow">
@observer
class EmployeeTrainingPlanTable extends ATableSavable {

    // <editor-fold defaultstate="collapsed" desc="fields">
    selfRefs = {};
    
    @observable selfState = {
        groupBy: 'year'
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onSetRef = this.onSetRef.bind(this);
        
        this.closeAll = this.closeAll.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSetRef, closeAll">
    onSetRef(groupIdx, ref) {
        this.selfRefs[groupIdx] = ref;
    }
    
    closeAll(groupIdx) {
        Object.keys(this.selfRefs).filter((k, n) => groupIdx !== k).forEach((k, n) => {
            this.selfRefs[k].close();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="isYear, listGroup">
    @computed get isYear() {
        return this.selfState.groupBy === 'year';
    }
    
    @computed get listGroup() {
        //{frequency, course_or_module, status[Completed, Awaiting Certificate, Uncompleted, Progress, Upcoming]}
        const {groupBy} = this.selfState;
        const groups = this.list.groupBy(groupBy);
        return Object.keys(groups).map(k => {
            let list = groups[k];
            return {[groupBy]: k, list};
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.listGroup[n];
        return <EmployeeTrainingPlanTableGroupRow 
            key={"item-new-" + n} 
            idx={n} 
            item={item}
            closeAll={this.closeAll}
            onSetRef={this.onSetRef}
        />;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {list} = this;
        return <Table className="w-auto padding-0 -margin-l-10">
            <THead>
                <div className="td fixed-flex min-w-110">Date Created</div>
                <div className="td fixed-flex min-w-200">Frequency</div>
                {this.isYear && <div className="td">Course</div>}
                {!this.isYear && <div className="td fixed-flex min-w-300">Year</div>}
                <div className="td fixed-flex min-w-100">Status</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody 
                ref="body" 
                title="" 
                renderItem={this.renderItem} 
                onClick={this.onClick} 
                state={this.state} 
                list={this.listGroup} 
                disablePullToRefresh={true}
            />
        </Table>;
    }
    // </editor-fold>
}

@observer
class EmployeeTrainingPlanTableGroupRow extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable selfState = {
        rendered: false
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        props.onSetRef(props.idx, this);
        
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.onView = this.onView.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="toggle, close, onView">
    toggle() {
        this.selfState.rendered = !this.selfState.rendered;
    }
    
    close() {
        this.selfState.rendered = false;
    }
    
    onView(evt, elem) {
        const {idx: groupIdx, closeAll} = this.props;
        closeAll(groupIdx);
        
        this.toggle();
        
        const elemJQ = $(elem.getDOMNode());
        const parent = elemJQ.closest('ons-list');
        const container = parent.closest('.dialog-content');
        scrollTo(parent, container);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="item, isYear, title">
    @computed get item() {
        return this.props.item;
    }
    
    @computed get isYear() {
        return !!this.item.year;
    }
    
    @computed get title() {
        const {item: {year, course_or_module, list}} = this;
        if(!!year) return "Year: " + year;
        return "Course: " + course_or_module;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        //{frequency, course_or_module, status[Completed, Awaiting Certificate, Uncompleted, Progress, Upcoming]}
        const item = this.list[n];
        const {id, data:{created_at, course_or_module: {data: {name, frequency}}, status, year}} = item;
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex min-w-110">{Dates.formatDate(created_at)}</div>
            <div className="td fixed-flex min-w-200">{frequency}</div>
            {this.isYear && <div className="td">{name}</div>}
            {!this.isYear && <div className="td fixed-flex min-w-300">{year}</div>}
            <div className="td fixed-flex min-w-100">{status}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>
        
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if(!this.item) return null;
        const {title, item: {list}} = this;
        const {idx: groupIdx} = this.props;
        
        return (<div className="QuestionGroupRow QuestionRegulationGroupRow pos-relative">
            <Clickable onClick={this.toggle}>
                <label className='title flex'>
                    <span>{groupIdx + 1}. {title}</span> 
                </label>
            </Clickable>
            {this.selfState.rendered && <Table className="padding-0 margin-0 margin-l-10 padding-l-10">
                <TBody 
                    ref="body" 
                    title="" 
                    renderItem={this.renderItem} 
                    onClick={this.onClick} 
                    state={this.state}  
                    disablePullToRefresh={true}
                />
            </Table>}
        </div>);
    }
    // </editor-fold>
}
// </editor-fold>

export {EmployeeTrainingMatrixTable, EmployeeTrainingRegisterTable, EmployeeTrainingPlanTable};
