//<editor-fold desc="imports">
import * as React from "react";
import style from "assets/styles/home.module.css";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import ComplexStatisticsCard from "containers/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import PropTypes from "prop-types";
import {CircularProgress} from "@mui/material";
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

console.log('style', style);

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
const Comp = forwardRef(({interval: __interval, employee_view: __employee_view}, ref) => {
    const [interval, setInterval] = useState(__interval);
    const [employee_view, setEmployeeView] = useState(__employee_view);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setInterval: (value) => {
            setInterval(value);
        },
        setEmployeeView: (value) => {
            setEmployeeView(value);
        },
    }));
    // </editor-fold>

    const path_training_matrix = "plugin_sheq_assist/05_Trainings/training-matrix/";
    const path_training_course = "plugin_sheq_assist/05_Trainings/training-registry/";
    const path_training_plan = 'plugin_sheq_assist/05_Trainings/training-plan/';

    const totals = {
        trainings: Promise.resolve({
            count: "+91",
            percAmount: "+4%",
            chart: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: {
                    label: 'Trainings',
                    color: 'light',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
            }
        }),//neonBinding.events.emit(path_training_matrix + "dashboard/line-chart/trainings", {interval, employee_view}),//
        participants: Promise.resolve({
            count: "281",
            percAmount: "+16%",
            chart: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: {
                    label: 'Participants',
                    color: 'light',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
            }
        }),//neonBinding.events.emit(path_training_matrix + "dashboard/line-chart/participants", {interval, employee_view}),
        attendanceRate: Promise.resolve({
            count: "95%",
            percAmount: "+8%",
            chart: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: {
                    label: 'Attendance Rate',
                    color: 'light',
                    data: Array.range(1, 12).map(n => (Math.random() * 15).toFixed(0))
                },
            }
        }),//neonBinding.events.emit(path_training_plan + "dashboard/line-chart/attendance-rate", {interval, employee_view})
    };

    const {trainings, participants, attendanceRate} = totals;

    const percLabel = `than ${labels[interval]}`;

    return <Grid
        container
        columns={2}
        spacing={6}
        className="grid-1 w-full grid-gap-10"
        sx={{
            m: 0, mt: '90px',
        }}
    >
        <Grid item sx={{padding: "0 !important", mb: "110px"}}>
            <ReportsLineChartWrapper
                data={trainings}
                color="info"
                percColor="info"
                title="Total Trainings"
                percLabel={percLabel}
            />
        </Grid>
        <Grid item sx={{padding: "0 !important", mb: "110px"}}>
            <ReportsLineChartWrapper
                data={participants}
                color="warning"
                percColor="warning"
                title="Total Participants"
                percLabel={percLabel}
            />
        </Grid>
        <Grid item sx={{padding: "0 !important", mb: "50px"}}>
            <ReportsLineChartWrapper
                data={attendanceRate}
                color="secondary"
                percColor="secondary"
                title="Attendance Rate"
                percLabel={percLabel}
            />
        </Grid>
    </Grid>;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
