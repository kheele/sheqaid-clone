//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
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
const Comp = forwardRef(({data: __data}, ref) => {
    const [data, setData] = useState(__data || DATA_LOAD_STATUS.LOADING);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setData: (value) => {
            setData(value);
        },
    }));
    // </editor-fold>

    if(data === DATA_LOAD_STATUS.LOADING) {
        return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
            <CircularProgress />
        </div>;
    }

    if(data === DATA_LOAD_STATUS.ERROR) {
        return null;
    }

    const {

    } = data;

    // const totals = {
    //     overallCost: Promise.resolve({
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         datasets: [{
    //             label: 'Cost',
    //             color: 'light',
    //             data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
    //         }],
    //     }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/cost", {interval, employee_view}),//
    //     costPerCourse: Promise.resolve({
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         datasets: [
    //             {
    //                 label: 'Course #1',
    //                 color: 'dark',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
    //             },
    //             {
    //                 label: 'Course #2',
    //                 color: 'primary',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
    //             },
    //             {
    //                 label: 'Course #3',
    //                 color: 'secondary',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
    //             },
    //             {
    //                 label: 'Course #4',
    //                 color: 'info',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
    //             },
    //             {
    //                 label: 'Course #5',
    //                 color: 'warning',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
    //             },
    //             {
    //                 label: 'Course #6',
    //                 color: 'success',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
    //             },
    //             {
    //                 label: 'Course #7',
    //                 color: 'text',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 5).toFixed(0))
    //             }
    //         ],
    //     }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/cost/course", {interval, employee_view}),
    //     costPerJobPosition: Promise.resolve({
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         datasets: [
    //             {
    //                 label: 'Job Position #1',
    //                 color: 'dark',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
    //             },
    //             {
    //                 label: 'Job Position #2',
    //                 color: 'primary',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
    //             },
    //             {
    //                 label: 'Job Position #3',
    //                 color: 'secondary',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
    //             },
    //             {
    //                 label: 'Job Position #4',
    //                 color: 'info',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
    //             },
    //             {
    //                 label: 'Job Position #5',
    //                 color: 'warning',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
    //             },
    //             {
    //                 label: 'Job Position #6',
    //                 color: 'success',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
    //             },
    //             {
    //                 label: 'Job Position #7',
    //                 color: 'text',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 5).toFixed(0))
    //             }
    //         ],
    //     }),//neonBinding.events.emit(path_training_plan + "dashboard/freq/cost/job-position", {interval, employee_view}),
    //
    //     resultsPerCourse: Promise.resolve({
    //         labels: Array.range(1, 10).map(n => `Course #${n + 1}`),
    //         datasets: [
    //             {
    //                 label: 'Pass',
    //                 color: 'success',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
    //             },
    //             {
    //                 label: 'Fail',
    //                 color: 'error',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
    //             },
    //             {
    //                 label: 'Average',
    //                 color: 'warning',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
    //             },
    //         ],
    //     }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, employee_view}),//
    //     resultsPerJobPosition: Promise.resolve({
    //         labels: Array.range(1, 10).map(n => `Job Position #${n + 1}`),
    //         datasets: [
    //             {
    //                 label: 'Pass',
    //                 color: 'success',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
    //             },
    //             {
    //                 label: 'Fail',
    //                 color: 'error',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
    //             },
    //             {
    //                 label: 'Average',
    //                 color: 'warning',
    //                 data: Array.range(1, 12).map(n => (Math.random() * 100).toFixed(0))
    //             },
    //         ],
    //     }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/results/job-position", {interval, employee_view}),//
    // };
    //
    // const {overallCost, costPerCourse, costPerJobPosition, resultsPerCourse, resultsPerJobPosition} = totals;

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
                    title="Overall Cost (2022)"
                    color="#fff"
                    tickColor="#fff"
                    background="#344767"
                    displayLegend={false}
                    chart={overallCost}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Cost Per Course (2022)"
                    color="#fff"
                    tickColor="#fff"
                    displayLegend={true}
                    chart={costPerCourse}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Cost Per Job Position (2022)"
                    color="#fff"
                    tickColor="#fff"
                    displayLegend={true}
                    chart={costPerJobPosition}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Results Per Course (2022)"
                    color="#fff"
                    tickColor="#fff"
                    background="#4a3c0a"
                    displayLegend={true}
                    chart={resultsPerCourse}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Results Per Job Position (2022)"
                    color="#fff"
                    tickColor="#fff"
                    background="#300d19"
                    displayLegend={true}
                    chart={resultsPerJobPosition}
                />
            </MDBox>
        </Grid>
    </Grid>;
});

//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf([/*"Day", "Week", */"Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
