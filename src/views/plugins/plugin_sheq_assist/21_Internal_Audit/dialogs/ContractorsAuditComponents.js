// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {scrollTo} from 'utils/Utils';

import {Button, ClearableInput, Clickable} from 'components/inputs';
import {Table, TBody} from 'components/tables';

// </editor-fold>

@observer
class QuestionRegulationGroupRow extends React.Component {
    
    selfRefs = {};
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        props.onSetRef(props.idx, this);
        
        this.onSetRef = this.onSetRef.bind(this);
        
        this.close = this.close.bind(this);
        this.onView = this.onView.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    onChange(item, requirementIdx, subjectIdx) {
        const {idx: regulationIdx, onChange} = this.props;
        onChange(item, requirementIdx, subjectIdx, regulationIdx);
    }
    
    onSetRef(parentIdx, idx, ref) {
        this.selfRefs[parentIdx + '-' + idx] = ref;
    }
    
    onView(evt, elem) {
        const {idx: regulationIdx, closeAll} = this.props;
        closeAll(regulationIdx);
        
        const {parentIdx, idx} = elem.props;
        const key = parentIdx + '-' + idx;
        Object.keys(this.selfRefs).filter((k, n) => key !== k).forEach((k, n) => {
            this.selfRefs[k].close();
        });
        this.selfRefs[key].toggle();
        
        const elemJQ = $(elem.getDOMNode());
        const parent = elemJQ.closest('ons-list');
        const container = parent.closest('.dialog-content');
        scrollTo(parent, container);
    }
    
    close() {
        Object.keys(this.selfRefs).forEach((k, n) => {
            this.selfRefs[k].close();
        });
    }

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.listGroup[n];
        return <QuestionSubjectGroupRow 
            key={"item-new-" + n} 
            parentIdx={this.props.idx} 
            idx={n} 
            onSetRef={this.onSetRef} 
            item={item} 
            onClick={this.onView}
            onChange={this.onChange}
        />;
    }
    // </editor-fold>

    @computed get listGroup() {
        const {item: {list}} = this;
        const groups = list.groupBy('subject');
        return Object.keys(groups).map(k => {
            let list = groups[k];
            return {subject: k, list};
        });
    }
    
    @computed get item() {
        return this.props.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if(!this.item) return null;
        const {item, item: {regulation, list}} = this;
        const {idx} = this.props;
        
        return (<div className="QuestionGroupRow QuestionRegulationGroupRow pos-relative">
            <label className='title flex'>
                <span>{idx + 1}. {regulation}</span> 
            </label>
            <Table className="padding-0 margin-0 margin-l-10 padding-l-10">
                <TBody 
                    ref="body" 
                    title="" 
                    renderItem={this.renderItem} 
                    onClick={this.onClick} 
                    state={this.state} 
                    list={this.listGroup} 
                    disablePullToRefresh={true}
                />
            </Table>
        </div>);
    }
    // </editor-fold>
}

@observer
class QuestionSubjectGroupRow extends React.Component {
    @observable state = {
        rendered: false
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        props.onSetRef(props.parentIdx, props.idx, this);
        
        this.onChange = this.onChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    onChange(item, requirementIdx) {
        const {parentIdx, idx: subjectIdx, onChange} = this.props;
        onChange(item, requirementIdx, subjectIdx);
    }
    
    toggle() {
        this.state.rendered = !this.state.rendered;
    }
    
    close() {
        this.state.rendered = false;
    }
    
    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const {item: {subject, list}} = this;
        const item = list[n];
        return <QuestionRow 
            key={"item-new-" + n} 
            grandParentIdx={this.props.parentIdx}
            parentIdx={this.props.idx} 
            idx={n} 
            item={item}
            onChange={this.onChange}
        />;
    }
    // </editor-fold>

    @computed get item() {
        return this.props.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if(!this.item) return null;
        const {item, item: {subject, list}} = this;
        const {parentIdx, idx} = this.props;
        
        return (<div className="QuestionGroupRow QuestionSubjectGroupRow pos-relative">
            <Clickable parentIdx={parentIdx} idx={idx} onClick={this.props.onClick}>
                <label className='title flex'>
                    <span>{parentIdx + 1}.{idx + 1}. {subject}</span> 
                </label>
            </Clickable>
            {this.state.rendered && <Table className="padding-0 margin-0 margin-l-10 padding-l-10">
                <TBody 
                    ref="body" 
                    title="" 
                    renderItem={this.renderItem} 
                    onClick={this.onClick} 
                    state={this.state} 
                    list={list} 
                    disablePullToRefresh={true}
                />
            </Table>}
        </div>);
    }
    // </editor-fold>
}

@observer
class QuestionRow extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        const {item, item: {achieved_score}} = props;
        item.achieved_score = achieved_score && parseInt(achieved_score);
        
        this.form = new Form();
        this.form.addChangeOne("photos", this.onPhotosChanged.bind(this));
        this.form.addChangeOne("comments", this.onCommentsChanged.bind(this));
        this.form.addChangeOne("achieved_score", this.onAchievedScoreChanged.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onPhotosChanged, onCommentsChanged, onPossibleScoreChanged, onAchievedScoreChanged">
    onPhotosChanged(el, val) {
        const {item, props: {idx, onChange}} = this;
        onChange(item, idx);
    }
    
    onCommentsChanged(el, val) {
        const {item, props: {idx, onChange}} = this;
        item.comments = val;
        onChange(item, idx);
    }
    
    onAchievedScoreChanged(el, val) {
        const {item, props: {idx, onChange}} = this;
        item.achieved_score = parseInt(val);
        calcCompliance(item);
        onChange(item, idx);
    }
    // </editor-fold>
    
    @computed get item() {
        return this.props.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if(!this.item) return null;
        const {item, item: {
                subject, 
                requirement, comments,
                possible_score, achieved_score
            }
        } = this;
        const achieved_scores = setAchievedScores(possible_score);
        const {grandParentIdx, parentIdx, idx} = this.props;
        
        return (<div className="QuestionRow pos-relative">
            <div className="row">
                <label className="section">{grandParentIdx + 1}.{parentIdx + 1}.{idx + 1}. Requirement</label>
                <div className="section-val">{requirement}</div>
            </div>
            <div className="row">
                <label className="section">Photo(s)</label>
                <Photos item={item} name="photos" onChange={this.form.onChange}/>
            </div>
            <div className="row">
                <label className="section">Comments</label>
                <ClearableInput name="comments" type="textarea" defaultValue={comments} placeholder="Comments" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </div>
            <div className="row">
                <label className="section">Score & Compliance</label>
                <div className="flex padding-r-10">
                    <ClearableInput name="possible_score" type="text" defaultValue={possible_score} isEditable={false} readonly placeholder="Possible Score" className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="achieved_score" type="select" defaultValue={achieved_score} placeholder="Achieved Score" className="form-control" onChange={this.form.onChange} values={achieved_scores} returnValue/>
                    <Compliance item={item} onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="Photos">
@observer
class Photos extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.renderPhoto = this.renderPhoto.bind(this);
    }
    
    onClick(e, btn) {
        const {onChange, item, idx} = this.props;
        electronDialog.showOpenDialogImage().then(res => {
            if(res) {
                const {previewPath, path} = res;
                item.photos.push({previewPath, path});
                onChange && onChange(item, this.props.name, this);
            }
        });
    }
    
    onRemove(e, elem) {
        const {onChange, item, idx} = this.props;
        item.photos.removeAt(elem.props.idx);
    }
    
    renderPhoto({previewPath}, idx) {
        return <div>
            <Clickable idx={idx} onClick={this.onRemove}>
                <i className="fa fa-close"/>
            </Clickable>
            <img src={previewPath}/>
        </div>;
    }
    
    PhotoList({item, renderPhoto}) {
        return <React.Fragment>
            {item.photos.map(renderPhoto)}
        </React.Fragment>;
    }
    
    render() {
        const {PhotoList, props: {onChange, item, idx}} = this;
        
        return <div key={Math.random()} className="photo-grid-cover">
            <Button idx={idx} className="btn btn-primary pull-left padding-5" onClick={this.onClick}>+ Photo</Button>
            <div className="photo-grid pull-left">
                <PhotoList item={item} renderPhoto={this.renderPhoto}/>
            </div>
        </div>;
        //return <ClearableInput key={Math.random()} idx={idx} ref="photos" name="photos" type="text" placeholder="" defaultValue={item.compliance || 'N/A'} readonly className="form-control" onChange={onChange}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Compliance">
@observer
class Compliance extends React.Component {

    render() {
        const {onChange, item} = this.props;
        return <ClearableInput key={Math.random()} ref="compliance" name="compliance" type="text" placeholder="Compliance" defaultValue={item.compliance || 'N/A'} readonly className="form-control" onChange={onChange}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="setAchievedScores">
function setAchievedScores(max){
    const l = [];
    for(var n = 0; n <= max; n++) {
        l.push(String(n));
    }
    return l;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="calcCompliance">
function calcCompliance(item, na) {
    let perc;
    if(na) {
        perc = 'N/A';
    } else {
        const {achieved_score: val, possible_score} = item;
        if (!!val) {
            perc = ((parseInt(val) / parseInt(possible_score)) * 100) + '%'; 
        } else if (isNullable(val)) {
            perc = 'N/A';
        }
    }
    item.compliance = perc;
}
// </editor-fold>

export {QuestionRegulationGroupRow, QuestionSubjectGroupRow, QuestionRow};
