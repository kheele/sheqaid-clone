// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {execWhen} from "utils/Utils";
import {createColumnChart} from 'utils/ChartUtils';
import {Button} from 'components/inputs';
import {Chart} from 'components/FormComponents';
import {ATableSavable, TBody, TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AuditItemTBodyElement">
@observer
class AuditItemTBodyElement extends ATableSavable {
    
    constructor(props) {
        super(props);
        
        if(props.state) {
            this.state.list = props.state.list;
        }
        if(props.isNew) {
            this.state.list = [];
        }
        
        this.onCloseAll = this.onCloseAll.bind(this);
    }

    @computed get listGroup() {
        const elements = this.state.list.groupBy('element');
        const elementsList = Object.keys(elements).map(k => {
            let list = elements[k];
            return {element: k, list};
        });
        return elementsList;
    }
    
    refresh() {
        this.refs.stats && this.refs.stats.refresh();
    }
    
    onCloseAll(idx) {
        this.listGroup.filter((item, n) => idx !== n).forEach(item => {
            item.tbody_ref.close();
        });
    }
    
    RenderItem({item, n, readonly, savable, targetItem, deleteFn, onAttrs, onCloseAll, isSingleSelect, onClick, onNew, onEditItem, onSelect}) {
        let {
            element, list
        } = item;
        const calculateScore = () => {
            const possible_score = list.map(({possible_score}) => possible_score).reduce((n1, n2) => n1 + n2, 0);
            const achieved_score = list.map(({achieved_score}) => achieved_score).reduce((n1, n2) => n1 + n2, 0);
            const compliance = (achieved_score / possible_score * 100).toFixed(1);
            return {possible_score, achieved_score, compliance};
        };
        
        const onAdd = (evt, btn) => {
            onNew(element);
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
//            if(btn.isClosed)
//            btn.text();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        return <div className="td-RenderItem td-ItemTBodyElement" key={"item-" + n}>
                <label className='title flex'>
                    <span>{n + 1}. {element}</span> 
                    {!isSingleSelect && <ScoreTotal calculateScore={calculateScore}/>}
                    {!readonly && !isSingleSelect && <Button className='btn btn-primary fixed-flex' text='Add' onClick={onAdd}/>}
                    <Button className='btn btn-primary fixed-flex' text='View' onClick={onView}/>
                </label>
                <AuditItemTBodySubElement 
                    ref={onSetRef} 
                    defaultValue={list} 
                    isSingleSelect={isSingleSelect} 
                    element={element} 
                    elementIdx={n} 
                    readonly={readonly}
                    onNew={onNew}
                    onEditItem={onEditItem}
                    onSelect={onSelect}
                    savable={savable}
                    targetItem={targetItem}
                    deleteFn={deleteFn}
                    onAttrs={onAttrs}
                />
            </div>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, onEditItem, savable, targetItem, deleteFn, onAttrs, onSelect, onNew, isSingleSelect} = this.props;
        const item = this.listGroup[n];
        return <RenderItem 
            key={n + '-' + new Date().getTime()} 
            n={n} 
            item={item} 
            readonly={readonly} 
            onCloseAll={this.onCloseAll} 
            isSingleSelect={isSingleSelect} 
            onClick={onClick} 
            onNew={onNew} 
            onEditItem={onEditItem}
            onSelect={onSelect}
            savable={savable}
            targetItem={targetItem}
            deleteFn={deleteFn}
            onAttrs={onAttrs}
        />;
    }

    render() {
        const {isSingleSelect} = this.props;
        const list = this.listGroup;
        return <TBody 
            ref="body" 
            className='AuditItemTBodyElement AAuditItemTBodyElement'
            title="Assessed Items" 
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            list={list}
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}>
            {!isSingleSelect && <ScoreTotal list={this.state.list}/>}
            {!isSingleSelect && <Stats ref="stats" list={list} title="Element" name="All Elements"/>}
        </TBody>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AuditItemTBodySubElement">
@observer
class AuditItemTBodySubElement extends ATableSavable {
    
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
        const sub_elements = this.state.list.groupBy('sub_element');
        const sub_elementsList = Object.keys(sub_elements).map(k => {
            let list = sub_elements[k];
            return {sub_element: k, list};
        });
        return sub_elementsList;
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
    
    RenderItem({item, n, element, elementIdx, readonly, savable, targetItem, deleteFn, onAttrs, isSingleSelect, onCloseAll, onClick, onNew, onEditItem, onSelect}) {
        let {
            sub_element, list
        } = item;
        
        const calculateScore = () => {
            const possible_score = list.map(({possible_score}) => possible_score).reduce((n1, n2) => n1 + n2, 0);
            const achieved_score = list.map(({achieved_score}) => achieved_score).reduce((n1, n2) => n1 + n2, 0);
            const compliance = (achieved_score / possible_score * 100).toFixed(1);
            return {possible_score, achieved_score, compliance};
        };
        
        const onAdd = (evt, btn) => {
            onNew(element, sub_element);
        };
        const onView = (evt, btn) => {
            onCloseAll(n);
            item.tbody_ref.toggle();
        };
        const onSetRef = ref => {
            item.tbody_ref = ref;
        };
        return <div key={"item-" + elementIdx + '-' + n} className="td-RenderItem td-ItemTBodySubElement">
                <label className='title flex'>
                    <span>{elementIdx + 1}.{n + 1}. {sub_element}</span>
                    {!isSingleSelect && <ScoreTotal calculateScore={calculateScore}/>}
                    {!readonly && !isSingleSelect && <Button className='btn btn-primary fixed-flex' text='Add' onClick={onAdd}/>}
                    <Button className='btn btn-primary fixed-flex' text='View' onClick={onView}/>
                </label>
                <AuditItemTBody 
                    ref={onSetRef} 
                    defaultValue={list} 
                    isSingleSelect={isSingleSelect} 
                    elementIdx={elementIdx} 
                    subElementIdx={n} 
                    readonly={readonly} 
                    onEditItem={onEditItem}
                    onSelect={onSelect}
                    savable={savable}
                    targetItem={targetItem}
                    deleteFn={deleteFn}
                    onAttrs={onAttrs}
                />
            </div>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, savable, targetItem, deleteFn, onAttrs, element, elementIdx, isSingleSelect, onEditItem, onSelect, onNew} = this.props;
        const item = this.listGroup[n];
        return <RenderItem 
            key={elementIdx + n + new Date().getTime()} 
            n={n} 
            item={item} 
            isSingleSelect={isSingleSelect} 
            element={element} 
            elementIdx={elementIdx} 
            readonly={readonly}
            onCloseAll={this.onCloseAll}
            onClick={onClick} 
            onNew={onNew} 
            onEditItem={onEditItem}
            onSelect={onSelect}
            savable={savable}
            targetItem={targetItem}
            deleteFn={deleteFn}
            onAttrs={onAttrs}
        />;
    }

    render() {
        if(!this.selfState.rendered) return null;
        const {isSingleSelect} = this.props;
        const list = this.listGroup;
        return (<TBody 
            ref="body" 
            className='AuditItemTBodySubElement AAuditItemTBodySubElement'
            title="Assessed Items" 
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            list={list}
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}>
            {!isSingleSelect && <Stats list={list} title="Sub-Element" name={this.props.element}/>}
        </TBody>);
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AuditItemTBody">
@observer
class AuditItemTBody extends ATableSavable {
    
    @observable selfState = {
        rendered: false
    };
    
    constructor(props) {
        super(props);
        
        if(props.isNew) {
            this.state.list = [];
        }
        
        this.onEditItem = this.onEditItem.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
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
    
    onSelectItem(evt, btn) {
        const {onChange, name, onSelect} = this.props;
        const {idx} = btn.props;
        const {list} = this.state;
        const item = list[idx];
        onSelect && onSelect(item);
    }
    
    RenderItem({item, n, elementIdx, subElementIdx, readonly, isSingleSelect, onClick, onEditItem, onSelectItem}) {
        let {
            responsible_person,
            audit_findings, audit_summary,
            possible_score, achieved_score, compliance,
            comments
        } = item;
            
        return <TRow key={"item-" + elementIdx + '-' + subElementIdx + '-' + n}>
            <div className="td">
                <span className="counter max-w-20">{elementIdx + 1}.{subElementIdx + 1}.{n + 1}</span>
                {audit_findings}
            </div>
            <div className="td fixed-flex min-w-120">{audit_summary}</div>
            
            <div className="td td-tr fixed-flex flex min-w-150 padding-0">
                <div className="td td-calc">{possible_score}</div>
                <div className="td td-calc">{achieved_score}</div>
                <div className="td td-calc">{compliance}%</div>
            </div>
            
            <div className="td td-risk-control-measures padding-l-0 padding-r-0">{comments}</div>
            
            {isSingleSelect && <div className="td td-actions">
                <Button idx={n} action="select" className="btn btn-primary pull-left" text="Select" onClick={onSelectItem}/>
            </div>}
            {!readonly && !isSingleSelect && <div className="td td-actions">
                <Button idx={n} action="edit" className="btn btn-primary fa fa-edit pull-left no-border-radius-r" onClick={onEditItem}/>
                <Button idx={n} action="delete" className="btn btn-primary fa fa-times-circle pull-right no-border-radius-l" onClick={onClick}/>
            </div>}
        </TRow>;
    }
    
    renderItem(n, onClick) {
        const {RenderItem} = this;
        const {readonly, isSingleSelect, elementIdx, subElementIdx} = this.props;
        const item = this.state.list[n];
        return <RenderItem 
            key={elementIdx + subElementIdx + n + new Date().getTime()} 
            n={n} 
            isSingleSelect={isSingleSelect} 
            elementIdx={elementIdx} 
            subElementIdx={subElementIdx} 
            item={item} 
            readonly={readonly} 
            onClick={onClick} 
            onEditItem={this.onEditItem}
            onSelectItem={this.onSelectItem}
        />;
    }

    render() {
        if(!this.selfState.rendered) return null;
        return (<TBody 
            ref="body" 
            title="Assessed Items" 
            className='AuditItemTBody AAuditItemTBody'
            renderItem={this.renderItem} 
            onClick={this.onClick} 
            state={this.state}
            onLoadList={this.onLoadList} 
            disablePullToRefresh={true}/>);
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ScoreTotal">
@observer
class ScoreTotal extends React.Component {
    render() {
        let {calculateScore, list} = this.props;
        calculateScore = calculateScore || function() {
            const possible_score = list.map(({possible_score}) => possible_score).reduce((n1, n2) => n1 + n2, 0);
            const achieved_score = list.map(({achieved_score}) => achieved_score).reduce((n1, n2) => n1 + n2, 0);
            const compliance = (achieved_score / possible_score * 100).toFixed(1);
            return {possible_score, achieved_score, compliance};
        };
        const {possible_score, achieved_score, compliance} = calculateScore();
        
        const _compliance = parseFloat(compliance);                                                   
        let color;
        if(isNumber(_compliance)) {
            if(_compliance < 25) {
                color = 'red';
            } else if(_compliance < 50) {
                color = 'orange';
            } else if(_compliance < 75) {
                color = 'yellow';
            } else if(_compliance >= 75) {
                color = 'green';
            }
        } else {
            color = 'grey';
        }
        return <div key={Math.random()} className={"ScoreTotal flex fixed-flex min-w-500 " + color + (list ? " ScoreTotalAll" : "")}>
            <div className="PossibleScore">Possible Score<span>{possible_score}</span></div>
            <div className="AchievedScore">Achieved Score<span>{achieved_score}</span></div>
            <div className="Compliance">Compliance<span>{compliance.replace('.0', '')}%</span></div>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {
    
    @observable
    state = {
        charts: null,
        dataLoaded: false
    };
    
    componentDidMount() {
        this.load();
    }
    
    refresh() {
        execWhen(() => this.refs.chart).then(chart_ref => {
            chart_ref.update();
        });
    }
    
    async load() {
        const {list, title: title_axis_x} = this.props;
        if(list.isEmpty()) return;
        
        function round(value, precision) {
            const multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
        let data_points = list.map(({element, sub_element, list}) => {
            const calculateCompliance = () => {
                const possible_score = list.map(({possible_score}) => possible_score).reduce((n1, n2) => n1 + n2, 0);
                const achieved_score = list.map(({achieved_score}) => achieved_score).reduce((n1, n2) => n1 + n2, 0);
                return round((achieved_score / possible_score) * 100, 1);
            };
            const sum = calculateCompliance();
            const label = element || sub_element;
            return {label, y: sum};
        });

        const title = "Audit Summary";
        const title_axis_y = "Compliance (%)";
        const y_value_format_string = `#`;
        const charts = createColumnChart({title, title_axis_y, title_axis_x, y_value_format_string, data_points});
        this.update(charts);
    }

    update(charts) {
        this.state.charts = charts;
        this.state.dataLoaded = true;

        execWhen(() => this.refs.chart).then(chart_ref => {
            chart_ref.update();
        });
    }
    
    render() {
        const {list, name} = this.props;
        const {state: {charts, dataLoaded}} = this;
        return !list.isEmpty() && <div className="Statistics">
            <label className="hor-center margin-t-10">{name} Statistics</label>
            {!dataLoaded && <div className="fixed-center"><CircularProgress/><br />Loading...</div>}
            {dataLoaded && <div className="content">
                <Chart ref="chart" options={charts}/>
                <div className="chart-hider"/>
            </div>}
            <hr />
        </div>;
    }
}
// </editor-fold>

export default AuditItemTBodyElement;
