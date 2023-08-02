import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import Form from 'utils/Form';
import {getRandomRolor} from 'utils/Utils';
import {ClearableInput} from 'components/inputs';
import {Chart} from 'components/FormComponents';

import style from "./StatsPanel.lazy.css";

@observer
class StatsPanel extends React.Component {
    
    @observable
    state = {
        dataLoaded: false,
        dataError: false,
        list: []
    };

    constructor(props) {
        super(props);
        
        this.load = this.load.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
    }

    componentWillMount() {
        style.use();
    }
    
    componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
        style.unuse();
    }

    async load() {
        this.state.dataLoaded = false;
        this.state.dataError = false;
        this.state.list = [];
        neonBinding.events.emit(this.props.path + "stats").then(res => {
            this.state.list = res;
            this.state.dataLoaded = true;
            this.state.dataError = false;
        }).catch(e => {
            console.log(e)
            this.state.dataLoaded = true;
            this.state.dataError = true;
        });        
    }
    
    update() {
        this.load();
    }
    
    renderItem({title, count}, n){
        return <Stat title={title} value={count} getDialogRef={this.getDialogRef}/>;
    }
    
    render() {
        const {
            dataLoaded, dataError, list
        } = this.state;
        return <div className="StatsPanel row margin-0">
            <StatsGraph key={new Date().getTime()} path={this.props.path + "stats"}/>
            <div className="row stats-count flex">
                {!dataLoaded && <div className="results-loading">
                    <CircularProgress/>
                    Loading statistics...
                </div>}
                {(dataLoaded && dataError) && <div className="results-none">
                    An error occurred while loading
                </div>}
                {(dataLoaded && !dataError) && list.map(this.renderItem)}
            </div>
        </div>;
    }
}

@observer
class Stat extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick(e){
//        const {filter: {key, value}, getDialogRef} = this.props;
//        const dialog = getDialogRef();
//        dialog.open(key, value);
    }
    
    render() {
        const {title, value} = this.props;
        const className = "panel col-lg-3";
        const style = {background: getRandomRolor()};
        return <div className={className} onClick={this.onClick}>
            <div className="decor" style={style}></div>
            <h4>{title}</h4>
            <div className="count">{value}</div>
        </div>;
    }
}

@observer
class StatsGraph extends React.Component {
    path;

    @observable
    state = {
        dataLoaded: false,
        lists: {years: []},
        year: new Date().getFullYear(),
        column_charts: null
    };

    constructor(props) {
        super(props);
        
        this.path = props.path + "/graphs";
        
        const start = this.state.year;
        const end = start - 2020;
        for (var value = start; value >= 2020; value--) {
            this.state.lists.years.push({label: value, value});
        }
        
        this.form = new Form();
        
        this.onChangeYear = this.onChangeYear.bind(this);
        this.form.addChangeOne("year", this.onChangeYear);
    }
    
    onChangeYear(el, val) {
        let year;
        if (val) {
            year = parseInt(val);
        } else {
            year = this.state.year;
        }
        this.state.dataLoaded = false;
        neonBinding.events.emit(this.path, year).then(async charts => {
            const mapper = function(k) {
                return function(v) {
                    v.dataPoints = v.dataPoints.map(function(v) {
                                    let d = new Date(v.x);
                                    if (k === "indexLabel") {
                                        let s = d.toString();
                                        s = s.substring(3, s.indexOf('01') - 1);
                                        v[k] = s + '-' + Math.round(v.y);
                                    } else if (k === "label") {
                                        let s = d.toString();
                                        s = s.substring(3, s.indexOf('01') - 1);
                                        v[k] = s;// + '-' + Math.round(v.y);
                                        delete v.x;
                                    } else {
                                        v[k] = d;
                                    }
                                    return v;
                    });
                    return v;
                };
            };

            charts.data = charts.data.map(mapper('label'));
            this.update(charts);
        }).catch(e => {
            console.error(e)
        });
    }
    
    update(charts) {
        this.state.column_charts = charts;
        this.state.dataLoaded = true;

        setTimeout(() => {
            if (this.refs.column) {
                this.refs.column.update();
            }
        });
    }
    
    get year() {
        const value = this.state.year;
        return {label: value, value};
    }

    render() {
        const {column_charts} = this.state;
        return <div className="stats-graphs">
            <ClearableInput name="year" type="select" placeholder="Year..." className="min-w-140 form-control" onChange={this.form.onChange} defaultValue={this.year} values={this.state.lists.years} returnValue/>
            {!this.state.dataLoaded && <div className="fixed-center"><CircularProgress/><br />Loading Statistics...</div>}
            {this.state.dataLoaded && <div className="stats-graph">
                <div className="red">
                    <div className="flex">
                        <Chart ref="column" options={column_charts}/>
                    </div>
                </div>
            </div>}
            {this.state.dataLoaded && <div className="trial-hider"/>}
        </div>;
    }

}

export default StatsPanel;