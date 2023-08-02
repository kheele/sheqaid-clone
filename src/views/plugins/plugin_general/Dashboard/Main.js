import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, when} from 'mobx';

import APage from "../../../APage";
import {Clickable} from 'components/inputs';
import {Chart} from 'components/FormComponents';

import {execWhen} from 'utils/Utils';
import {renderLeftButtonsForExpiryOnly_firebase} from 'utils/ComponentUtils';

import WebWorker from "../../../../web-worker/WebWorker";

import style from "./Main.lazy.css";

@observer
class Main extends APage {
    static key = 'Dashboard';

    constructor(props) {
        super(props);
        this.classNames += " LeftButtonsForExpiryOnlyPage";
    }

    componentWillMount() {
        super.componentWillMount();
        style.use();
    }

    componentDidMount() {
        super.componentDidMount();

        setTimeout(function () {
            $(findDOMNode(this).querySelector('.nice-scrollbars')).showScrollbars(0.8, "rgb(2,168,168)");
            when(() => this.refs.stats.dataLoaded, () => {
                //app.onPageComplete();
            });
        }.bind(this), 0);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        style.unuse();
        $(findDOMNode(this).querySelector('.nice-scrollbars')).removeScrollbars();
    }

    render() {
        return (<div id="dashboard-page" className={this.classNames + " dashboard-page"}>
            <div className="page-title">
                {this.renderBackBtn()}<h3>Dashboard</h3>
                {renderLeftButtonsForExpiryOnly_firebase.call(this)}
            </div>
            <div className="page-content nice-scrollbars">
                <Stats ref="stats"/>
            </div>
        </div>);
    }
}

@observer
class Stats extends React.Component {

    @observable
    state = {
        dataLoaded: false
    };

    componentDidMount() {
        neonBinding.events.emit("plugin_sheq_assist/dashboard/stats").then(async res => {
            this.refs.statsCount.update(res.top_counts);

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
                                } else {
                                    v[k] = d;
                                }
                                //v.y = Math.random() * 100;
                                return v;
                            });
                            return v;
                        };
                    };

                    const {pie_charts, line_charts} = charts;

                    ["assets", "incidents", "sites"].map(k => pie_charts[k]).forEach(chartType => {
                        chartType.data = chartType.data.map(mapper('indexLabel'));
                    });
                    ["assets", "incidents", "sites"].map(k => line_charts[k]).forEach(chartType => {
                        chartType.data = chartType.data.map(mapper('x'));
                    });

                    return charts;
                });
            });
            const charts = await worker.emit("process", res.charts);
            worker.terminate();
            const statsGraph = await execWhen(() => this.refs.statsGraph);
            statsGraph.update(charts);
            this.state.dataLoaded = true;
        }).catch(e => {
            console.log(e)
        });
    }

    @computed
    get dataLoaded() {
        return this.state.dataLoaded;
    }

    render() {
        return <div className="stats">
            <StatsCount ref="statsCount"/>
            <StatsGraph ref="statsGraph"/>
        </div>;
    }
}

@observer
class StatsCount extends React.Component {

    @observable
    state = {
        //events: null,
        assets: null,
        incidents: null,
        sites: null
    };

    constructor() {
        super();
    }

    update(count) {
        extendObservable(this.state, count);
    }
            
    Tile = ({className, plugin, module, count}) => {
        return <Clickable plugin={plugin} module={module} onClick={appBody.onOpenPage}>
            <div className={className}>
                <Clickable plugin={plugin} module={module} onClick={appBody.onOpenPage}><h4>{module}</h4></Clickable>
                <Clickable plugin={plugin} module={module} onClick={appBody.onOpenPage}><div>{count}</div></Clickable>
            </div>
        </Clickable>;
    }

    render() {
        const {Tile} = this;
        return <div className="stats-count">
            <Tile className="green" plugin="plugin2" module="Assets" count={this.state.assets} onClick={appBody.onOpenPage}/>
            <Tile className="red" plugin="plugin2" module="Incidents" count={this.state.incidents} onClick={appBody.onOpenPage}/>
            <Tile className="blue" plugin="plugin2" module="Sites" count={this.state.sites} onClick={appBody.onOpenPage}/>
        </div>;
    }
}

@observer
class StatsGraph extends React.Component {

    @observable
    state = {
        dataLoaded: false,
        line_charts: {
            assets: null,
            incidents: null,
            sites: null
        },
        pie_charts: {
            assets: null,
            incidents: null,
            sites: null
        }
    };

    update(charts) {
        extendObservable(this.state, charts);
        this.state.dataLoaded = true;

        setTimeout(function () {
            if (this.refs.assets_pie && this.refs.assets_line &&
                    this.refs.incidents_pie && this.refs.incidents_line &&
                    this.refs.sites_pie && this.refs.sites_line) {
                this.refs.assets_pie.update();
                this.refs.assets_line.update();

                this.refs.incidents_pie.update();
                this.refs.incidents_line.update();

                this.refs.sites_pie.update();
                this.refs.sites_line.update();
            }
        }.bind(this), 0);
    }

    render() {
        if (!this.state.dataLoaded) {
            return null;
        }
        const yr = new Date().getFullYear();
        return <div className="stats-graph">
            <div className="red">
                <h4>Assets Summary ({yr})</h4>
                <div>
                    <Chart ref="assets_pie" options={this.state.pie_charts.assets}/>
                    <Chart ref="assets_line" options={this.state.line_charts.assets}/>
                </div>
            </div>
            <div className="blue">
                <h4>Incidents Summary ({yr})</h4>
                <div>
                    <Chart ref="incidents_pie" options={this.state.pie_charts.incidents}/>
                    <Chart ref="incidents_line" options={this.state.line_charts.incidents}/>
                </div>
            </div>
            <div className="green">
                <h4>Sites Summary ({yr})</h4>
                <div>
                    <Chart ref="sites_pie" options={this.state.pie_charts.sites}/>
                    <Chart ref="sites_line" options={this.state.line_charts.sites}/>
                </div>
            </div>
        </div>;
    }

}

export default Main;
