import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import {Chart} from 'components/FormComponents';
import Dialog from 'components/dialogs/Dialog';
import WebWorker from "web-worker/WebWorker";

import style from "./StatsDialog.lazy.css";

@observer
class StatsDialog extends React.Component {
    static key = 'Stats';

    pageKey = "stats";

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        setTimeout(function () {
            //when(() => this.refs.stats.dataLoaded, () => {
            //app.onPageComplete();
            //});
        }.bind(this), 0);
    }

    componentWillUnmount() {
        style.unuse();
    }

    open() {
        return new Promise((resolve, reject) => {
            this.refs.dialog.open("Statistics");
            resolve();
        });
    }

    close() {
        this.refs.dialog.close();
    }

    render() {
        return (<Dialog
            key={this.pageKey + '-dialog'}
            ref="dialog"
            className={this.pageKey + '-dialog'}
            dialog={this}
        >
            <Stats ref="stats"/>
        </Dialog>);
    }
}

@observer
class Stats extends React.Component {

    render() {
        return <div className="stats">
            <StatsGraph ref="statsGraph"/>
	</div>;
    }
}

@observer
class StatsGraph extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/stats";

    @observable
    state = {
        dataLoaded: false,
        lists: {years: []},
        year: new Date().getFullYear(),
        column_charts: {
            nearmiss: null,
            first_aid: null,
            minor_injuries: null,
            serious_injuries: null,
            environmental_impacts: null
        },
        pie_charts: {
            nearmiss: null,
            first_aid: null,
            minor_injuries: null,
            serious_injuries: null,
            environmental_impacts: null
        }
    };

    constructor() {
        super();
        
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
        workers.emit(this.path, year).then(async res => {
            const worker = new WebWorker(() => {
                self.on("process", async (db, charts) => {
                    const mapper = k => {
                        return v => {
                            v.dataPoints = v.dataPoints.map(v => {
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
                                //v.y = Math.random() * 100;
                                return v;
                            });
                            return v;
                        };
                    };

                    const {pie_charts, column_charts} = charts;

                    ["nearmiss", "first_aid", "minor_injuries", "serious_injuries", "environmental_impacts"].map(k => pie_charts[k]).forEach(chartType => {
                        chartType.data = chartType.data.map(mapper('indexLabel'));
                    });
                    ["nearmiss", "first_aid", "minor_injuries", "serious_injuries", "environmental_impacts"].map(k => column_charts[k]).forEach(chartType => {
                        chartType.data = chartType.data.map(mapper('label'));
                    });

                    return charts;
                });
            });
            const charts = await worker.emit("process", res.charts);
            this.update(charts);
            worker.terminate();
        }).catch(e => {
            console.log(e)
        });
    }
    
    update(charts) {
        extendObservable(this.state, charts);
        this.state.dataLoaded = true;

        setTimeout(function () {
            if (this.refs.nearmiss_pie && this.refs.nearmiss_column &&
                    this.refs.first_aid_pie && this.refs.first_aid_column &&
                    this.refs.minor_injuries_pie && this.refs.minor_injuries_column &&
                    this.refs.serious_injuries_pie && this.refs.serious_injuries_column &&
                    this.refs.environmental_impacts_pie && this.refs.environmental_impacts_column) {
                this.refs.nearmiss_pie.update();
                this.refs.nearmiss_column.update();

                this.refs.first_aid_pie.update();
                this.refs.first_aid_column.update();

                this.refs.minor_injuries_pie.update();
                this.refs.minor_injuries_column.update();

                this.refs.serious_injuries_pie.update();
                this.refs.serious_injuries_column.update();

                this.refs.environmental_impacts_pie.update();
                this.refs.environmental_impacts_column.update();
            }
        }.bind(this), 0);
    }
    
    get year() {
        const value = this.state.year;
        return {label: value, value};
    }

    render() {
        const {pie_charts, column_charts} = this.state;
        return <React.Fragment>
            <ClearableInput name="year" type="select" placeholder="Year..." className="min-w-140 form-control" onChange={this.form.onChange} defaultValue={this.year} values={this.state.lists.years} returnValue/>
            {!this.state.dataLoaded && <div className="fixed-center"><CircularProgress/><br />Loading Statistics...</div>}
            {this.state.dataLoaded && <div className="stats-graph">
                <div className="red">
                    <h4>Nearmiss Summary</h4>
                    <div className="flex">
                        <Chart ref="nearmiss_pie" options={pie_charts.nearmiss}/>
                        <Chart ref="nearmiss_column" options={column_charts.nearmiss}/>
                    </div>
                </div>
                <div className="red">
                    <h4>First Aid Summary</h4>
                    <div className="flex">
                        <Chart ref="first_aid_pie" options={pie_charts.first_aid}/>
                        <Chart ref="first_aid_column" options={column_charts.first_aid}/>
                    </div>
                </div>
                <div className="blue">
                    <h4>Minor Injuries Summary</h4>
                    <div className="flex">
                        <Chart ref="minor_injuries_pie" options={pie_charts.minor_injuries}/>
                        <Chart ref="minor_injuries_column" options={column_charts.minor_injuries}/>
                    </div>
                </div>
                <div className="green">
                    <h4>Serious Injuries Summary</h4>
                    <div className="flex">
                        <Chart ref="serious_injuries_pie" options={pie_charts.serious_injuries}/>
                        <Chart ref="serious_injuries_column" options={column_charts.serious_injuries}/>
                    </div>
                </div>
                <div className="green">
                    <h4>Environmental Impact Summary</h4>
                    <div className="flex">
                        <Chart ref="environmental_impacts_pie" options={pie_charts.environmental_impacts}/>
                        <Chart ref="environmental_impacts_column" options={column_charts.environmental_impacts}/>
                    </div>
                </div>
            </div>}
        </React.Fragment>;
    }

}

export default StatsDialog;
