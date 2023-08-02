// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {getRandomRolor} from '../../../../utils/Utils';
import {convertQuestionnaireObjectToArray} from "../../../../utils/ArrayMapperUtils";
import {Button} from '../../../../components/inputs';
import {TabledTopPanel} from '../../../../components/tables';

import NewQuestionnaireDialog from './dialogs/NewQuestionnaireDialog.js';

import {questionnairesOnUpdate} from './dialogs/AResponseUtils.js';

import style from "./DashboardSingleContractorTab.lazy.css";

// </editor-fold>

@observer
class DashboardTab extends React.Component {
    static key = 'Dashboard';
    
    @observable state = {
        list: [],
        loadStatus: null
    };

    // <editor-fold defaultstate="collapsed" desc="constructor, componentWillMount, componentWillUnmount">
    constructor(props) {
        super(props);
        
        this.onCreate = this.onCreate.bind(this);
    }

    componentWillMount() {
        style.use();
        this.onPromise = neonBinding.events.on(`${this.props.path}questionnaires/onUpdate`, ({updateVal, data}) => {
//            console.log(`${this.props.path}questionnaires/onUpdate`, updateVal, data)
            const {list} = this.state;
            questionnairesOnUpdate(list, {updateVal, data});
        });
    }
    
    componentDidMount() {
        this.state.loadStatus = "LOADING";
        neonBinding.events.emit(this.props.path + "questionnaires/list").then(list => {
            this.state.list = list;
            console.log('list', list)
            this.state.loadStatus = "SUCCESS";
        }).catch(err => {
            this.state.loadStatus = "ERROR";
        });
    }

    componentWillUnmount() {
        style.unuse();
        neonBinding.events.off(`${this.props.path}questionnaires/onUpdate`, this.onPromise);
    }
    // </editor-fold>
    
    onCreate(e, btn) {
        this.refs.newDialog.open();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const classNames = !storage.is.isContractor ? "contractor " : "";
        return (<div id="DashboardTab" className={classNames + "DashboardTab-page"}>
            {!storage.is.isContractor && <div className="page-title">
                <TabledTopPanel ref="tabledTopPanel">
                    <Button className="btn btn-primary pull-right" onClick={this.onCreate}>
                        <i className="fa fa-plus"/> Create
                    </Button>
                </TabledTopPanel>	
                <div className="clearfix"/>
            </div>}   
            <div className="page-content nice-scrollbars">
                <Content state={this.state}/>
            </div>
            {!storage.is.isContractor && <NewQuestionnaireDialog ref="newDialog"/>}
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="Content">
@observer
class Content extends React.Component {
    async calculateCompliance({data: {form: {questions}}}) {
        questions = await convertQuestionnaireObjectToArray(questions);
        questions = questions.
                    map(v => v.questions || [v]).
                    reduce((a1, a2) => [...a1, ...a2], []);
        
        const list = questions.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);
        
        const score = list.map(({score, maxScore}) => ((score && isNumber(score)) ? parseInt(score) : 0)).reduce((n1, n2) => n1 + n2, 0);
        const maxScore = list.map(({score, maxScore}) => ((maxScore && isNumber(maxScore)) ? parseInt(maxScore) : 0)).reduce((n1, n2) => n1 + n2, 0);
        
        const perc =  maxScore > 0 ? (score / maxScore) * 100 : 'N/A';
        console.log('calculateCompliance 2 - ', {score, maxScore, perc})
        return perc;
    }
    
    @computed get complianceLowest() {
        return Promise.all(this.complete.map(this.calculateCompliance)).then(list => {
            console.log('complianceLowest', list);
            list = list.filter(v => v !== 'N/A');
            return list.isEmpty() ? "N/A" : (Math.min(...list).toFixed(1) + "%");
        });
    }
    
    @computed get complianceHighest() {
        return Promise.all(this.complete.map(this.calculateCompliance)).then(list => {
            console.log('complianceHighest', list);
            list = list.filter(v => v !== 'N/A');
            return list.isEmpty() ? "N/A" : (Math.max(...list).toFixed(1) + "%");
        });
    }
    
    @computed get complianceAverage() {
        return Promise.all(this.complete.map(this.calculateCompliance)).then(list => {
            console.log('complianceAverage', list);
            list = list.filter(v => v !== 'N/A');
            return list.isEmpty() ? "N/A" : ((list.reduce((n1, n2) => n1 + n2, 0) / list.length).toFixed(1) + "%");
        });
    }
    
    @computed get active() {
        const {list} = this;
        return list.filter(({data}) => data.status !== "CompleteAccepted");
    }
    
    @computed get complete() {
        const {list} = this;
        return list.filter(({data}) => data.status === "CompleteAccepted");
    }
    
    @computed get requests() {
        const {list} = this;
        return list.filter(({data}) => data.status === "CompleteRequested");
    }
    
    @computed get declines() {
        const {list} = this;
        return list.filter(({data}) => data.status === "CompleteDeclined");
    }
    
    @computed get list() {
        const {props: {state: {list}}} = this;
        return list;
    }
    
    render() {
        const {list, props: {state: {loadStatus}}} = this;
        if(!loadStatus || loadStatus === "LOADING") {
            return <div className="results-loading grid-1 grid-gap-10 flex-center margin-t-50">
                <CircularProgress/>
                Loading statistics...
            </div>;
        } else if(loadStatus === "ERROR") {
            
        }
        
        return <React.Fragment>
            <div className="margin-0 margin-r-10 padding-b-5 grid-3 grid-gap-10">
                <Stats value={this.complianceLowest} title='Lowest Compliance'/>
                <Stats value={this.complianceHighest} title='Highest Compliance'/>
                <Stats value={this.complianceAverage} title='Average Compliance'/>
                
                <Stats value={list} title='All Questionnaires'/>
                <Stats value={this.active} title='Active Questionnaires'/>
                <Stats value={this.complete} title='Complete Questionnaires'/>
                
                <Stats value={this.requests} title='Completion Requests'/>
                <Stats value={this.declines} title='Declined Requests'/>
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {
    
    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;
        if(value instanceof Promise) {
            this.state.value = await value;
        } else {
            this.state.value = value;
        }
        this.state.loading = false;
    }
    
    render() {
        const {props: {title, className = ""}} = this;
        const {value, loading} = this.state;
//        console.log('value', value)
        const style = {background: getRandomRolor()};
        return <div style={style} className={"padding-10 Statistics " + className}>
            <label className="text-center w-full margin-b-10">{title}</label>
            <div className="content">
                {loading && <CircularProgress/>}
                {!loading && ((isArray(value) || isObservableArray(value)) ? value.length : value)}
            </div>
        </div>;
    }
}
// </editor-fold>

export default DashboardTab;
