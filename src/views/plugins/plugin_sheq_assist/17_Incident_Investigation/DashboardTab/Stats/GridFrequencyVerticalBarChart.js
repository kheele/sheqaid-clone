//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import PropTypes from "prop-types";
import DefaultCounterCard from "../../../../../../containers/Cards/CounterCards/DefaultCounterCard";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="VerticalBarChartWrapper">
function VerticalBarChartWrapper({background, color, tickColor, title, chart: _chart, displayLegend}) {
    const [chart, setChart] = useState(null);
    useEffect(() => {
        (async () => {
            if (_chart instanceof Promise) {
                _chart = await _chart;
            }
            setChart(_chart);
        })();
    }, [_chart]);

    if (chart === null) {
        return <CircularProgress size='1em'/>;
    }

    const {labels, datasets} = chart;

    return <VerticalBarChart
        title={title}
        height="300px"
        color={color}
        tickColor={tickColor}
        background={background}
        chart={{
            displayLegend,
            labels,
            datasets
        }}
    />;
}

//</editor-fold>

//<editor-fold desc="Comp">
function Comp() {
    const path_training_matrix = "plugin_sheq_assist/05_Trainings/training-matrix/";
    const path_training_course = "plugin_sheq_assist/05_Trainings/training-registry/";
    const path_training_plan = 'plugin_sheq_assist/05_Trainings/training-plan/';

    const totals = {
        totalIncidentsPerMonth: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Incidents',
                color: 'light',
                data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
            }],
        }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/cost", {interval, employee_view}),//
        overallRiskRatingPerMonth: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Low',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Medium',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'High',
                    color: 'info',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Very High',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/cost/course", {interval, employee_view}),
        totalIncidentsPerWeeklyDay: Promise.resolve({
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                {
                    label: 'Incidents',
                    color: 'light',
                    data: Array.range(1, 7).map(n => (Math.random() * 15).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_plan + "dashboard/freq/cost/job-position", {interval, employee_view}),
        overallRiskRatingPerWeeklyDay: Promise.resolve({
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                {
                    label: 'Low',
                    color: 'secondary',
                    data: Array.range(1, 7).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Medium',
                    color: 'primary',
                    data: Array.range(1, 7).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'High',
                    color: 'info',
                    data: Array.range(1, 7).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Very High',
                    color: 'success',
                    data: Array.range(1, 7).map(n => (Math.random() * 14).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_plan + "dashboard/freq/cost/job-position", {interval, employee_view}),

        resultsPerCourse: Promise.resolve({
            labels: Array.range(1, 10).map(n => `Course #${n + 1}`),
            datasets: [
                {
                    label: 'Pass',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
                },
                {
                    label: 'Fail',
                    color: 'error',
                    data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
                },
                {
                    label: 'Average',
                    color: 'warning',
                    data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, employee_view}),//
        resultsPerJobPosition: Promise.resolve({
            labels: Array.range(1, 10).map(n => `Job Position #${n + 1}`),
            datasets: [
                {
                    label: 'Pass',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
                },
                {
                    label: 'Fail',
                    color: 'error',
                    data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
                },
                {
                    label: 'Average',
                    color: 'warning',
                    data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/results/job-position", {interval, employee_view}),//
    };

    const {totalIncidentsPerMonth, overallRiskRatingPerMonth, totalIncidentsPerWeeklyDay, overallRiskRatingPerWeeklyDay, resultsPerCourse, resultsPerJobPosition} = totals;

    return <Grid
        container
        columns={2}
        spacing={6}
        className="grid-1 w-full grid-gap-10"
        sx={{
            m: 0, mt: '30px',
        }}
    >
        <Grid item sx={{padding: "0 !important", mb: "0px"}}>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Total Incidents Per Month (2022)"
                    color="#fff"
                    tickColor="#fff"
                    background="#344767"
                    displayLegend={false}
                    chart={totalIncidentsPerMonth}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Total Incidents Per Weekly Day (2022)"
                    color="#fff"
                    tickColor="#fff"
                    background="#344767"
                    displayLegend={true}
                    chart={totalIncidentsPerWeeklyDay}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Risk Rating Per Month (2022)"
                    color="#fff"
                    tickColor="#fff"
                    displayLegend={false}
                    chart={overallRiskRatingPerMonth}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Risk Rating Per Weekly Day (2022)"
                    color="#fff"
                    tickColor="#fff"
                    displayLegend={true}
                    chart={overallRiskRatingPerWeeklyDay}
                />
            </MDBox>

            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Results Per Course (2022)"*/}
            {/*        color="#fff"*/}
            {/*        tickColor="#fff"*/}
            {/*        background="#4a3c0a"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={resultsPerCourse}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Results Per Job Position (2022)"*/}
            {/*        color="#fff"*/}
            {/*        tickColor="#fff"*/}
            {/*        background="#300d19"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={resultsPerJobPosition}*/}
            {/*    />*/}
            {/*</MDBox>*/}
        </Grid>
    </Grid>;
}

//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
