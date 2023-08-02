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
        width="calc(100% - 10px)"
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
        status_not_started_aggregate,
        status_outstanding_aggregate,
        status_in_progress_aggregate,
        status_completed_aggregate,

        results_passed_aggregate,
        results_failed_aggregate,
        results_average_aggregate,//avg:{result}

        training_provider_requirement_accredited_aggregate,
        training_provider_requirement_non_accredited_aggregate,

        employee_gender_male_aggregate,
        employee_gender_female_aggregate,

        training_requirement_compulsory_aggregate,
        training_requirement_optional_aggregate,

        legal_requirement_yes_aggregate,
        legal_requirement_no_aggregate,

        training_provider_external_aggregate,
        training_provider_internal_aggregate,

        competency_evaluation_on_day_of_evaluation_aggregate,
        competency_evaluation_last_day_of_evaluation_aggregate,
    } = data; //stats_top_doughnut_chart;

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
                className="grid-4 w-full grid-gap-10"
                sx={{
                    m: 0, p: '30px',
                }}
            >
                <DoughnutChart
                    title="Training Status"
                    labels={['Not Started', 'Outstanding', 'In Progress', 'Completed']}
                    backgroundColors={['primary', 'secondary', 'success', 'info']}
                    data={[
                        status_not_started_aggregate.aggregate.count,
                        status_outstanding_aggregate.aggregate.count,
                        status_in_progress_aggregate.aggregate.count,
                        status_completed_aggregate.aggregate.count,
                    ]}
                />
                <DoughnutChart
                    title="Training Results"
                    labels={['Pass', 'Fail']}
                    backgroundColors={['secondary', 'warning']}
                    data={[
                        results_passed_aggregate.aggregate.count,
                        results_failed_aggregate.aggregate.count,
                    ]}
                />
                <DoughnutChart
                    title="Provider Requirement"
                    labels={['Accredited', 'Non-Accredited']}
                    backgroundColors={['warning', 'info']}
                    data={[
                        training_provider_requirement_accredited_aggregate.aggregate.count,
                        training_provider_requirement_non_accredited_aggregate.aggregate.count,
                    ]}
                />
                <DoughnutChart
                    title="Employee Gender"
                    labels={['Male', 'Female']}
                    backgroundColors={['text', 'success']}
                    data={[
                        employee_gender_male_aggregate.aggregate.count,
                        employee_gender_female_aggregate.aggregate.count,
                    ]}
                />

                <DoughnutChart
                    title="Training Requirement"
                    labels={['Compulsory', 'Optional']}
                    backgroundColors={['warning', 'error']}
                    data={[
                        training_requirement_compulsory_aggregate.aggregate.count,
                        training_requirement_optional_aggregate.aggregate.count,
                    ]}
                />
                <DoughnutChart
                    title="Legal Requirement"
                    labels={['Yes', 'No']}
                    backgroundColors={['error', 'info']}
                    data={[
                        legal_requirement_yes_aggregate.aggregate.count,
                        legal_requirement_no_aggregate.aggregate.count,
                    ]}
                />
                <DoughnutChart
                    title="Training Provider"
                    labels={['External', 'Internal']}
                    backgroundColors={['success', 'dark']}
                    data={[
                        training_provider_external_aggregate.aggregate.count,
                        training_provider_internal_aggregate.aggregate.count,
                    ]}
                />
                <DoughnutChart
                    title="Competency Evaluation"
                    labels={['On Day of Evaluation', 'Last Day of Evaluation']}
                    backgroundColors={['dark', 'primary']}
                    data={[
                        competency_evaluation_on_day_of_evaluation_aggregate.aggregate.count,
                        competency_evaluation_last_day_of_evaluation_aggregate.aggregate.count,
                    ]}
                />
            </Grid>
        </Card>
    </Grid>;
});
//</editor-fold>

export default Comp;
