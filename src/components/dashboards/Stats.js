//<editor-fold desc="imports">
import * as React from "react";
import {createRef} from "react";
import PropTypes from "prop-types";

import {observer} from "mobx-react";
import {observable} from "mobx";
import {execWhen} from "utils/UtilsFuns";
import {Grid} from "@material-ui/core";
import Card from "@mui/material/Card";
import {ErrorBoundary} from "../index";
import {Dates} from "../../utils/Dates";

//</editor-fold>

@observer
class Comp extends React.Component {

    //<editor-fold desc="state">
    @observable state = {
        interval: null,
        view: null,
        range_start: '- All -',
        range_end: '- All -',
    };
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.gridCounterRef = createRef(null);
        this.gridDoughnutChartRef = createRef(null);
        this.gridCounterSideRef = createRef(null);
        this.gridFrequencyVerticalBarChart = createRef(null);
        this.gridReportsLineChartRef = createRef(null);

        this.update = this.update.bind(this);
        this.setLoadStatus = this.setLoadStatus.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.setView = this.setView.bind(this);
    }

    // </editor-fold>

    componentDidMount() {
        this.update();
    }

    //<editor-fold desc="update">
    update(args) {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = storage.selected;
        const {loggedContractor} = storage;
        const {hasProjects, isConsultant} = storage.is;
        let {listBy, path} = this.props;
        const {LOADING, ERROR} = DATA_LOAD_STATUS;

        const company_id = sess_company_id;
        const client_id = isConsultant ? selectedClient && selectedClient.id : undefined;
        const project_id = selectedProject && selectedProject.id;
        const site_id = selectedSite && selectedSite.id;

        const contractor_id = loggedContractor && loggedContractor.id;
        const contractor_site_id = selectedContractorSite && selectedContractorSite.id;

        this.setLoadStatus(LOADING);

        console.log(JSON.stringify(args));

        {
            const {view, interval, range_start, range_end} = args || {};
            view && (this.state.view = view);
            interval && (this.state.interval = interval);
            range_start && (this.state.range_start = range_start);
            range_end && (this.state.range_end = range_end);
        }

        {
            const {interval, view, range_start, range_end} = this.state;

            if (path) {
                listBy = sockets.of(path).fn("dashboard");
            }

            listBy({
                now: Dates.formatDateSQL(new Date()),
                company_id,
                client_id,
                project_id,
                site_id,
                contractor_id,
                contractor_site_id,
                //
                interval,
                view,
                range_start,
                range_end,
            }).then(data => {
                if (data) {
                    console.log('data', data)

                    execWhen(() => this.gridCounterRef && this.gridCounterRef.current).then(ref => {
                        ref.setData(data);
                    });
                    execWhen(() => this.gridDoughnutChartRef && this.gridDoughnutChartRef.current).then(ref => {
                        ref.setData(data);
                    });
                    execWhen(() => this.gridCounterSideRef && this.gridCounterSideRef.current).then(ref => {
                        ref.setData(data);
                    });
                    execWhen(() => this.gridFrequencyVerticalBarChart && this.gridFrequencyVerticalBarChart.current).then(ref => {
                        ref.setData(data);
                    });
                    execWhen(() => this.gridReportsLineChartRef && this.gridReportsLineChartRef.current).then(ref => {
                        ref.setData(data);
                    });
                }
            }).catch(err => {
                this.setLoadStatus(ERROR);
                console.error(err);
            });
        }
    }

    //</editor-fold>

    //<editor-fold desc="setLoadStatus">
    setLoadStatus(STATUS) {
        execWhen(() => this.gridCounterRef && this.gridCounterRef.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridDoughnutChartRef && this.gridDoughnutChartRef.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridCounterSideRef && this.gridCounterSideRef.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridFrequencyVerticalBarChart && this.gridFrequencyVerticalBarChart.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridReportsLineChartRef && this.gridReportsLineChartRef.current).then(ref => {
            ref.setData(STATUS);
        });
    }

    //</editor-fold>

    setInterval(interval) {
        this.state.interval = interval;
        this.update();
    }

    setView(view) {
        this.state.view = view;
        this.update();
    }

    //<editor-fold desc="render">
    render() {
        const {
            onClick,
            GridCounter,
            GridDoughnutChart,
            GridCounterSide,
            GridReportsLineChart,
            GridFrequencyVerticalBarChart,
        } = this.props;

        return <>
            <Grid xl={12} lg={12} md={12} container>
                <Grid xl={9} lg={9} md={9} sm={12} item className="padding-r-20">
                    {GridCounter && <ErrorBoundary>
                        <GridCounter ref={this.gridCounterRef} onClick={onClick}/>
                    </ErrorBoundary>}
                    {GridDoughnutChart && <ErrorBoundary>
                        <GridDoughnutChart ref={this.gridDoughnutChartRef}/>
                    </ErrorBoundary>}
                </Grid>
                {GridCounterSide && <Grid xl={3} lg={3} md={3} sm={12} item>
                    <Card sx={{background: "#344767"}}>
                        <ErrorBoundary>
                            <GridCounterSide ref={this.gridCounterSideRef}/>
                        </ErrorBoundary>
                    </Card>
                </Grid>}
            </Grid>
            {GridReportsLineChart && <ErrorBoundary>
                <GridReportsLineChart ref={this.gridReportsLineChartRef}/>
            </ErrorBoundary>}
            {GridFrequencyVerticalBarChart && <ErrorBoundary>
                <GridFrequencyVerticalBarChart
                    ref={this.gridFrequencyVerticalBarChart}
                />
            </ErrorBoundary>}
        </>;
    }

    //</editor-fold>
}

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
