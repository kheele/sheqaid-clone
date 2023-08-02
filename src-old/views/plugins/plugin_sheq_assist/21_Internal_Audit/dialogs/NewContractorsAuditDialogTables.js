import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {Button, ClearableInput, Clickable} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';

@observer
class Administration extends React.Component {
    
}

@observer
class ANewTable extends ATableSavable {

    @observable
    selfState = {
        lists: {
            audit_summary: ['Major', 'NC', 'Minor NC', 'Good Practice', 'Observation', 'Note']
        },
        compliance: null,
        regulations: [],
        subjects: []
    };

    constructor(props) {
        super(props);
//        this.state.list = TableData;
        
        this.selfState.regulations = this.list.map(({regulation}) => regulation).distinct().map(regulation => {
            return {regulation, n: this.list.filter(v=> v.regulation === regulation).length};
        });
        this.selfState.subjects = this.list.map(({subject}) => subject).distinct().map(subject => {
            return {subject, n: this.list.filter(v=> v.subject === subject).length};
        });
        
        this.onLoadListRegulation = this.onLoadListRegulation.bind(this);
        this.onLoadListSubject = this.onLoadListSubject.bind(this);
        
        this.onPostChange = this.onPostChange.bind(this);
        this.renderItemRegulation = this.renderItemRegulation.bind(this);
        this.renderItemSubject = this.renderItemSubject.bind(this);
        
        console.log(this.list.length)
    }
    
    async onLoadListRegulation(){ return this.selfState.regulations;}
    
    async onLoadListSubject(){ return this.selfState.subjects;}
    
    onPostChange(val, name, el){
        const {onChange} = this.props;
        const item = this.list[el.props.idx];
//        console.log(el.props.idx, name, val, item)
        if(name === 'achieved_score') {
            achieved_score();
        } else if(name === 'photos') {
            //do nothing
        } else {
            if(name === 'na_score') {
                console.log(name, val, item.achieved_score, item.compliance)
                //achieved_score, compliance
                if(val) {
                    achieved_score(true);
                } else {
                    achieved_score();
                }
            } else {
                if(!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
                    item[name] = val;
                } else {
                    delete item[name];
                }
            }
        }
        function achieved_score(na) {
            let perc;
            if(na) {
                perc = 'N/A';
            } else {
                if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
                    perc = ((parseInt(val) / parseInt(item.possible_score)) * 100) + '%'; 
                } else if (isNullable(val)) {
                    perc = 'N/A';
                }
            }
            item.compliance = perc;
        }
        onChange && onChange(toJS(this.list), this.props.name, this);
    }

    renderItemRegulation(n, onClick) {
        const item = this.selfState.regulations[n];
        let style = (item && item.n > 1) ? {height: (46 * item.n) + 0} : {height: 46};
        style = {...style, borderLeft: 'none', borderBottom: '2px solid', borderRight: 'none', borderTop: '0px solid'};
        return item ? <TRow key={"item-new-" + n}>
            <div className="td padding-l-0" style={style}>
                {item.regulation}
            </div>
        </TRow> : <TRow key={"item-new-" + n}/>;
    }

    renderItemSubject(n, onClick) {
        const item = this.selfState.subjects[n];
        let style = (item && item.n > 1) ? {height: (46 * item.n) + 0} : {height: 46};
        style = {...style, borderLeft: 'none', borderBottom: '0px solid', borderRight: 'none', borderTop: '0px solid'};
        return item ? <TRow key={"item-new-" + n}>
            <div className="td padding-l-0" style={style}>
                {item.subject}
            </div>
        </TRow> : <TRow key={"item-new-" + n}/>;
    }

    renderItem(n, onClick) {
        const item = this.list[n];
        item.achieved_score = item.achieved_score && parseInt(item.achieved_score);
        const achieved_scores = setAchievedScrores(item.possible_score);
        const na_score = [{text: '', checked: false}];
        
        return <TRow key={"item-new-" + n}>
            <div className="td">
                {item.requirement}
            </div>
            <div className="td fixed-flex min-w-50 td-possible-score">
                <ClearableInput idx={n} ref={this.onSetRef} name="possible_score" type="text" defaultValue={item.possible_score} isEditable={false} readonly required placeholder="" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-110 td-achieved-score">
                <ClearableInput idx={n} ref={this.onSetRef} name="achieved_score" type="select" placeholder="..." isClearable={false} required className="form-control" onChange={this.onChange} values={achieved_scores} returnValue/>
            </div>
            <div className="td fixed-flex min-w-50">
                <ClearableInput idx={n} ref={this.onSetRef} name="na_score" id="na_score" type="checkbox" placeholder="" isClearable={false} required className="form-control" onChange={this.onChange} values={na_score}/>
            </div>
            <div className="td fixed-flex min-w-140">
                <Photos idx={n} item={item} name="photos" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput idx={n} ref={this.onSetRef} name="comments" type="text" placeholder="" className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-65 td-compliance">
                <Compliance idx={n} item={item} onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex">
                <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-check"/>
                </Button>
            </div>
        </TRow>;
    }

    render() {
        const {showHead} = this.props;
        return (<div className="flex">
            <Table className="fixed-flex min-w-200 padding-0 margin-0">
                {showHead && <THead>
                    <div className="td font-size-13 padding-l-0">Section / Regulation</div>
                </THead>}
                <TBody ref="body" title="" renderItem={this.renderItemRegulation} onClick={this.onClick} state={this.state} onLoadList={this.onLoadListRegulation} disablePullToRefresh={true}/>
            </Table>
            <Table className="fixed-flex min-w-200 padding-0 margin-0">
                {showHead && <THead>
                    <div className="td font-size-13 padding-l-0">Subject</div>
                </THead>}
                <TBody ref="body" title="" renderItem={this.renderItemSubject} onClick={this.onClick} state={this.state} onLoadList={this.onLoadListSubject} disablePullToRefresh={true}/>
            </Table>
            <Table className="padding-0 margin-0">
                {showHead && <THead>
                    <div className="td font-size-13">Requirement</div>
                    <div className="td fixed-flex min-w-110 td-possible-score font-size-13">Possible Score</div>
                    <div className="td fixed-flex min-w-110 td-achieved-score font-size-13">Achieved Score</div>
                    <div className="td fixed-flex min-w-50 font-size-13">N/A</div>
                    <div className="td fixed-flex min-w-140 font-size-13">Photos</div>
                    <div className="td font-size-13">Comments</div>
                    <div className="td fixed-flex min-w-110 td-compliance font-size-13">Compliance</div>
                    <div className="td fixed-flex"></div>
                </THead>}
                <TBody ref="body" title="" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            </Table>
        </div>);
    }
}

@observer
class NewAdminTable extends ANewTable {

    constructor(props) {
        super(props);
    }
}

@observer
class NewRegistersTable extends ANewTable {

    constructor(props) {
        super(props);
    }
}

@observer
class NewAppointmentLettersTable extends ANewTable {

    constructor(props) {
        super(props);
    }
}

@observer
class NewSiteConditionsTable extends ANewTable {

    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.list[n];
        item.achieved_score = item.achieved_score && parseInt(item.achieved_score);
        const achieved_scores = setAchievedScrores(item.possible_score);
        const na_score = [{text: '', checked: false}];
        return <TRow key="item-new">
            <div className="td">
                {item.subject}
            </div>
            <div className="td fixed-flex min-w-50 td-possible-score">
                <ClearableInput idx={n} ref={this.onSetRef} name="possible_score" type="text" defaultValue={item.possible_score} isEditable={false} readonly required placeholder="" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-110 td-achieved-score">
                <ClearableInput idx={n} ref={this.onSetRef} name="achieved_score" type="select" placeholder="..." isClearable={false} required className="form-control" onChange={this.onChange} values={achieved_scores} returnValue/>
            </div>
            <div className="td fixed-flex min-w-50">
                <ClearableInput idx={n} ref={this.onSetRef} name="na_score" type="checkbox" placeholder="" isClearable={false} required className="form-control" onChange={this.onChange} values={na_score}/>
            </div>
            <div className="td fixed-flex min-w-140">
                <Photos idx={n} item={item} name="photos" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput idx={n} ref={this.onSetRef} name="comments" type="text" placeholder="" className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex min-w-65 td-compliance">
                <Compliance idx={n} item={item} onChange={this.onChange}/>
            </div>
            <div className="td fixed-flex">
                <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
                    <i className="fa fa-check"/>
                </Button>
            </div>
        </TRow>;
    }
    
    render() {
        return (<div className="flex">
            <Table>
                <THead>
                    <div className="td">Subject</div>
                    <div className="td fixed-flex min-w-110 td-possible-score">Possible Score</div>
                    <div className="td fixed-flex min-w-110 td-achieved-score">Achieved Score</div>
                    <div className="td fixed-flex min-w-50">N/A</div>
                    <div className="td fixed-flex min-w-140">Photos</div>
                    <div className="td">Comments</div>
                    <div className="td fixed-flex min-w-110 td-compliance">Compliance</div>
                    <div className="td fixed-flex"></div>
                </THead>
                <TBody ref="body" title="" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            </Table>
        </div>);
    }
}

@observer
class Photos extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }
    
    onClick(e, btn) {
        const {onChange, item, idx} = this.props;
        electronDialog.showOpenDialogImage().then(res => {
            if(res) {
                const {previewPath, path} = res;
                const base64 = previewPath;
                item.photos.push({base64, path});
                onChange && onChange(item, this.props.name, this);
            }
        });
    }
    
    onRemove(e, elem) {
        const {onChange, item, idx} = this.props;
        item.photos.removeAt(elem.props.idx);
    }
    
    renderPhoto = ({base64}, idx) => {
        return <div>
                    <Clickable idx={idx} onClick={this.onRemove}>
                        <i className="fa fa-close"/>
                    </Clickable>
                    <img src={base64}/>
                </div>;
    }
    
    render() {
        const {onChange, item: {photos}, idx} = this.props;
        return <div key={Math.random()} className="photo-grid-cover">
            <div className="photo-grid pull-left">
                {photos.map(this.renderPhoto)}
                {photos.isEmpty() && <Clickable onClick={this.onClick}><p className="margin-t-10 margin-b-10 hor-center">Add photo(s)</p></Clickable>}
            </div>
            <Button idx={idx} className="btn btn-primary pull-right" onClick={this.onClick}>+</Button>
        </div>;
        //return <ClearableInput key={Math.random()} idx={idx} ref="photos" name="photos" type="text" placeholder="" defaultValue={item.compliance || 'N/A'} readonly className="form-control" onChange={onChange}/>;
    }
}

@observer
class Compliance extends React.Component {

    render() {
        const {onChange, item, idx} = this.props;
        return <ClearableInput key={Math.random()} idx={idx} ref="compliance" name="compliance" type="text" placeholder="" defaultValue={item.compliance || 'N/A'} readonly className="form-control" onChange={onChange}/>;
    }
}

function setAchievedScrores(max){
    const l = [];
    for(var n = 0; n <= max; n++) {
        l.push(String(n));
    }
    return l;
}

//export default NewContractorsAuditDialog;
