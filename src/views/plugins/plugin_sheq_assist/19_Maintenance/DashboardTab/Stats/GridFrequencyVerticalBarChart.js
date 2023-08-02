//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {CircularProgress} from "@mui/material";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "containers/Cards/StatisticsCards/ComplexStatisticsCard";
//</editor-fold>

//<editor-fold desc="labels">
const labels = {
    Day: "yesterday",
    Week: "last week",
    Month: "last month",
    Quarter: "last 3 months",
    "Bi-Annual": "last 6 months",
    Annual: "last year",
};
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

//<editor-fold desc="ReportsLineChartWrapper">
function ReportsLineChartWrapper({desc, data: _data, color, percColor, title, percLabel}) {
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            if (_data instanceof Promise) {
                _data = await _data;
            }
            setData(_data);
        })();
    }, [_data]);

    if (data === null) {
        return <CircularProgress size='1em'/>;
    }

    const {chart, count, percAmount} = data;

    return <MDBox mb={3}>
        <ReportsLineChart
            color={color}
            description={desc}
            chart={chart}
        >
            <ComplexStatisticsCard
                className="fixed-flex min-w-200"
                color={color}
                title={title}
                count={count}
                percentage={{
                    color: percColor,
                    amount: percAmount,
                    label: percLabel,
                }}
            />
        </ReportsLineChart>
    </MDBox>;
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

    return null;

    if(data === DATA_LOAD_STATUS.LOADING) {
        return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
            <CircularProgress />
        </div>;
    }

    if(data === DATA_LOAD_STATUS.ERROR) {
        return null;
    }

    const [{
        all_incident_list_aggregate,
        all_quick_incident_list_aggregate,
        all_investigation_list_aggregate,
        all_non_conformance_list_aggregate,
    }] = data;

    console.log('data', data)

    const totals = {
        totalIncidentsPerMonth: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Incidents',
                color: 'light',
                data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
            }],
        }),
        totalIncidentsPerWeeklyDay: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Mon',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Tue',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Wed',
                    color: 'info',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Thu',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
                },
                {
                    label: 'Fri',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
                },
                {
                    label: 'Sat',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
                },
                {
                    label: 'Sun',
                    color: 'success',
                    data: Array.range(1, 12).map(n => (Math.random() * 14).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalIncidentsPerTimeDay: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Morning',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'After Noon',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalInjuriesAndVehiclesInvolved: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Injuries',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Vehicles Involved',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalNatureOfInjury: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Abrasions',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Amputation',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalPartsOfBodyInjured: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Abdomen',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Ankle(Left)',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalDirectCauseOfInjury: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Animals (All exc snakes)',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Assault',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalDrugTestsUndertaken: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Non-negative',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Negative',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Unknown at notification',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Refusal',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalAlcoholTestsUndertaken: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Non-negative',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'Negative',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Unknown at notification',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Refusal',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        totalMobileDeviceTestsUndertaken: Promise.resolve({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Yes',
                    color: 'secondary',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
                {
                    label: 'No',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Unknown at notification',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
                {
                    label: 'Suspected',
                    color: 'primary',
                    data: Array.range(1, 12).map(n => (Math.random() * 9).toFixed(0))
                },
            ],
        }),//neonBinding.events.emit(path_training_course + "dashboard/freq/results/course", {interval, view}),//
        // totalIncidentsPerWeeklyDay: Promise.resolve({
        //     labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        //     datasets: [
        //         {
        //             label: 'Incidents',
        //             color: 'light',
        //             data: Array.range(1, 7).map(n => (Math.random() * 15).toFixed(0))
        //         },
        //     ],
        // }),//neonBinding.events.emit(path_training_plan + "dashboard/freq/cost/job-position", {interval, view}),
        // totalIncidentsPerTimeDay: Promise.resolve({
        //     labels: ['Morning', 'After Noon'],
        //     datasets: [
        //         {
        //             label: 'Incidents',
        //             color: 'light',
        //             data: Array.range(1, 7).map(n => (Math.random() * 15).toFixed(0))
        //         },
        //     ],
        // }),//neonBinding.events.emit(path_training_plan + "dashboard/freq/cost/job-position", {interval, view}),
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
        }),//neonBinding.events.emit(path_training_plan + "dashboard/freq/cost/job-position", {interval, view}),

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
        }),//neonBinding.events.emit(path_training_matrix + "dashboard/freq/results/job-position", {interval, view}),//
    };

    const {
        totalIncidentsPerMonth, totalIncidentsPerWeeklyDay, totalIncidentsPerTimeDay, totalInjuriesAndVehiclesInvolved,
        totalNatureOfInjury, totalPartsOfBodyInjured, totalDirectCauseOfInjury,
        totalDrugTestsUndertaken, totalAlcoholTestsUndertaken, totalMobileDeviceTestsUndertaken
    } = totals;

    const percLabel = `than ${labels['Monthly']}`;

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
                    color="black"
                    tickColor="black"
                    background="#ffffff"
                    displayLegend={true}
                    chart={totalIncidentsPerWeeklyDay}
                />
            </MDBox>
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Total Incidents Per Time Day (2022)"*/}
            {/*        color="black"*/}
            {/*        tickColor="black"*/}
            {/*        background="#ffffff"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={totalIncidentsPerTimeDay}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Total Injuries & Vehicles Involved (2022)"*/}
            {/*        color="black"*/}
            {/*        tickColor="black"*/}
            {/*        background="#ffffff"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={totalInjuriesAndVehiclesInvolved}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Total Nature Of Injuries (2022)"
                    color="black"
                    tickColor="black"
                    background="#ffffff"
                    displayLegend={true}
                    chart={totalNatureOfInjury}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Total Parts Of Body Injured (2022)"
                    color="black"
                    tickColor="black"
                    background="#ffffff"
                    displayLegend={true}
                    chart={totalPartsOfBodyInjured}
                />
            </MDBox>
            <MDBox mb={3}>
                <VerticalBarChartWrapper
                    title="Total Direct Cause Of Injury (2022)"
                    color="black"
                    tickColor="black"
                    background="#ffffff"
                    displayLegend={true}
                    chart={totalDirectCauseOfInjury}
                />
            </MDBox>
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Total Drug Tests Undertaken (2022)"*/}
            {/*        color="black"*/}
            {/*        tickColor="black"*/}
            {/*        background="#ffffff"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={totalDrugTestsUndertaken}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Total Alcohol Tests Undertaken (2022)"*/}
            {/*        color="black"*/}
            {/*        tickColor="black"*/}
            {/*        background="#ffffff"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={totalAlcoholTestsUndertaken}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Total Mobile Device Tests Undertaken (2022)"*/}
            {/*        color="black"*/}
            {/*        tickColor="black"*/}
            {/*        background="#ffffff"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={totalMobileDeviceTestsUndertaken}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Total Incidents Per Weekly Day (2022)"*/}
            {/*        color="#fff"*/}
            {/*        tickColor="#fff"*/}
            {/*        background="#344767"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={totalIncidentsPerWeeklyDay}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Risk Rating Per Month (2022)"*/}
            {/*        color="#fff"*/}
            {/*        tickColor="#fff"*/}
            {/*        displayLegend={false}*/}
            {/*        chart={overallRiskRatingPerMonth}*/}
            {/*    />*/}
            {/*</MDBox>*/}
            {/*<MDBox mb={3}>*/}
            {/*    <VerticalBarChartWrapper*/}
            {/*        title="Risk Rating Per Weekly Day (2022)"*/}
            {/*        color="#fff"*/}
            {/*        tickColor="#fff"*/}
            {/*        displayLegend={true}*/}
            {/*        chart={overallRiskRatingPerWeeklyDay}*/}
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
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
