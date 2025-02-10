//<editor-fold desc="imports">
import * as React from "react";
import {createRef} from "react";
import PropTypes from "prop-types";
import GridCounter from "./GridCounter";
import GridDoughnutChart from "./GridDoughnutChart";

import * as findByIdTrainingDashboardStatsByLogged from "../Query/List/findByIdTrainingDashboardStatsByLogged";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {execWhen} from "utils/UtilsFuns";

//</editor-fold>

@observer
class Comp extends React.Component {

    @observable state = {
        interval: null,
        employee_view: null,
        range_start: '- All -',
        range_end: '- All -',
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.gridCounterRef = createRef(null);
        this.gridDoughnutChartRef = createRef(null);
        this.gridFrequencyVerticalBarChart = createRef(null);
        this.gridReportsLineChartRef = createRef(null);

        this.update = this.update.bind(this);
        this.setLoadStatus = this.setLoadStatus.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.setEmployeeView = this.setEmployeeView.bind(this);
    }

    // </editor-fold>

    componentDidMount() {
        this.update();
    }

    update(args) {
        const {byCompany, byClient, byProject, bySite} = findByIdTrainingDashboardStatsByLogged;

        const {sess_company_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {isConsultant, isNoProjects, isContractor, isContractorView} = storage.is;

        const {LOADING, ERROR} = DATA_LOAD_STATUS;

        this.setLoadStatus(LOADING);

        console.log(JSON.stringify(args));

        let fn, id;
        if (isConsultant) {
            console.log('load', 'isConsultant')
            if (selectedSite) {
                console.log('load', 'selectedSite')
                id = selectedSite.id;
                fn = bySite;
            } else if (selectedProject) {
                console.log('load', 'selectedProject')
                id = selectedProject.id;
                fn = byProject;
            } else if (selectedClient) {
                console.log('load', 'selectedClient')
                id = selectedClient.id;
                fn = byClient;
            } else {
                console.log('load', 'company')
                id = sess_company_id;
                fn = byCompany;
            }
        } else if (!isNoProjects) {//client with projects
            if (selectedSite) {
                id = selectedSite.id;
                fn = bySite;
            } else if (selectedProject) {
                id = selectedProject.id;
                fn = byProject;
            } else {
                id = sess_company_id;
                fn = byCompany;
            }
        } else {//client with no projects
            id = sess_company_id;
            fn = byCompany;
        }

        {
            const {employee_view, interval, range_start, range_end} = args || {};
            employee_view && (this.state.employee_view = employee_view);
            interval && (this.state.interval = interval);
            range_start && (this.state.range_start = range_start);
            range_end && (this.state.range_end = range_end);
        }

        {
            const {interval, employee_view, range_start, range_end} = this.state;

            fn({
                id,
                interval,
                employee_view,
                range_start,
                range_end,
            }).then(item => {
                if (item) {
                    const {
                        stats_top_counter,
                        stats_top_doughnut_chart,
                        frequency_vertical_bar_chart,
                    } = item;

                    console.log('item', item)

                    execWhen(() => this.gridCounterRef && this.gridCounterRef.current).then(ref => {
                        ref.setData(stats_top_counter[0]);
                    });
                    execWhen(() => this.gridDoughnutChartRef && this.gridDoughnutChartRef.current).then(ref => {
                        ref.setData(stats_top_doughnut_chart[0]);
                    });
                    execWhen(() => this.gridFrequencyVerticalBarChart && this.gridFrequencyVerticalBarChart.current).then(ref => {

                        // ref.setData(frequency_vertical_bar_chart[0]);
                    });
                    // execWhen(() => this.gridReportsLineChartRef && this.gridReportsLineChartRef.current).then(ref => {
                    //     ref.setData();
                    // });
                }
            }).catch(err => {
                this.setLoadStatus(ERROR);
                console.error(err);
            });
        }
    }

    setLoadStatus(STATUS) {
        execWhen(() => this.gridCounterRef && this.gridCounterRef.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridDoughnutChartRef && this.gridDoughnutChartRef.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridFrequencyVerticalBarChart && this.gridFrequencyVerticalBarChart.current).then(ref => {
            ref.setData(STATUS);
        });
        execWhen(() => this.gridReportsLineChartRef && this.gridReportsLineChartRef.current).then(ref => {
            ref.setData(STATUS);
        });
    }

    setInterval(interval) {
        this.state.interval = interval;
        this.update();
    }

    setEmployeeView(employee_view) {
        this.state.employee_view = employee_view;
        this.update();
    }

    render() {
        return <>
            <GridCounter ref={this.gridCounterRef}/>
            <GridDoughnutChart ref={this.gridDoughnutChartRef}/>
            {/*<GridFrequencyVerticalBarChart ref={this.gridFrequencyVerticalBarChart}/>*/}
            {/*<GridReportsLineChart ref={this.gridReportsLineChartRef}/>*/}
            {/*<GridTrainingsTables/>*/}
        </>;
    }
}

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
