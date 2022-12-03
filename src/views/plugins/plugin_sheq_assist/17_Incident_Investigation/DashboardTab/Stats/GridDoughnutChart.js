//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import DefaultDoughnutChart from "containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="DoughnutChart">
function DoughnutChart({backgroundColors, title, labels, data: dataPromise}) {
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            if (dataPromise instanceof Promise) {
                dataPromise = await dataPromise;
            }
            setData(dataPromise);
        })();
    }, [dataPromise]);

    if (data === null) {
        return <Card sx={{height: '245px'}}><CircularProgress/></Card>;
    }

    return <DefaultDoughnutChart
        title={title}
        height="220px"
        chart={{
            labels,
            datasets: {
                label: title,
                backgroundColors,
                data
            },
            cutout: 60
        }}
    />;
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

    const path_training_course = "plugin_sheq_assist/05_Trainings/training-registry/";
    const path_training_plan = "plugin_sheq_assist/05_Trainings/training-plan/";
    const path_training_matrix = "plugin_sheq_assist/05_Trainings/training-matrix/";

    const totals = {
        training_status: neonBinding.events.emit(path_training_matrix + "dashboard/doughnut/status", {interval, employee_view}),
        training_result: neonBinding.events.emit(path_training_plan + "dashboard/doughnut/result", {interval, employee_view}),
        training_provider_requirement: neonBinding.events.emit(path_training_matrix + "dashboard/doughnut/provider_requirement", {interval, employee_view}),//
        training_gender: neonBinding.events.emit(path_training_plan + "dashboard/doughnut/gender", {interval, employee_view}),

        training_requirement: neonBinding.events.emit(path_training_matrix + "dashboard/doughnut/requirement", {interval, employee_view}),
        training_legal_requirement: neonBinding.events.emit(path_training_matrix + "dashboard/doughnut/legal_requirement", {interval, employee_view}),//
        training_provider: neonBinding.events.emit(path_training_course + "dashboard/doughnut/provider", {interval, employee_view}),//
        training_competency_evaluation: neonBinding.events.emit(path_training_matrix + "dashboard/doughnut/competency_evaluation", {interval, employee_view}),//
    };

    return <Grid
        container
        columns={1}
        spacing={6}
        className="grid-1 w-full grid-gap-10"
        sx={{m: 0, mt: '30px',}}
    >
        <Card sx={{background: "#f1f1f1",}}>
            <Grid
                container
                columns={1}
                spacing={6}
                className="grid-3 w-full grid-gap-10"
                sx={{
                    m: 0, p: '30px',
                }}
            >
                <DoughnutChart
                    title="Drug Test Result"
                    labels={['Non-negative', 'Negative', 'Unknown at notification', 'Refusal', 'N/A']}
                    backgroundColors={['primary', 'secondary', 'warning', 'info']}
                    data={totals.training_status}
                />
                <DoughnutChart
                    title="Alcohol Test Result"
                    labels={['Non-negative', 'Negative', 'Unknown at notification', 'Refusal', 'N/A']}
                    backgroundColors={['primary', 'secondary', 'warning', 'info']}
                    data={totals.training_result}
                />
                <DoughnutChart
                    title="Mobile Device Test Result"
                    labels={['Non-negative', 'Negative', 'Unknown at notification', 'Refusal', 'N/A']}
                    backgroundColors={['primary', 'secondary', 'warning', 'info']}
                    data={totals.training_provider_requirement}
                />
            </Grid>
        </Card>
    </Grid>;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
