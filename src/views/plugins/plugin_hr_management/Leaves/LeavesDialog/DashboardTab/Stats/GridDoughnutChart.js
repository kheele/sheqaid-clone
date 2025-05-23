//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import DefaultDoughnutChart from "containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import {CircularProgress} from "@mui/material";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
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
        height="250px"
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

//<editor-fold desc="DoughnutChart">
function DoughnutChart({sx, backgroundColors, title, labels, data: dataPromise}) {
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
        sx={sx}
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

    if (data === DATA_LOAD_STATUS.LOADING) {
        return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
            <CircularProgress/>
        </div>;
    }

    if (data === DATA_LOAD_STATUS.ERROR) {
        return null;
    }

    const defaults = {aggregate: {count: 0}};

    const {
        fatality_incident_list_aggregate = defaults,
        non_fatality_incident_list_aggregate = defaults,
        //
        group_lti_incident_list_aggregate = defaults,
        group_nlti_incident_list_aggregate = defaults,
        group_non_incident_list_aggregate = defaults,
        firstaid_incident_list_aggregate = defaults,
        nearmiss_incident_list_aggregate = defaults,
        //
        incident_time_afternoon_incident_list_aggregate = defaults,
        incident_time_morning_incident_list_aggregate = defaults,
        incident_time_non_incident_list_aggregate = defaults,
        //
        person_injured_incident_list_aggregate = defaults,
        non_person_injured_incident_list_aggregate = defaults,
        //
        vehicle_incident_list_aggregate = defaults,
        non_vehicle_incident_list_aggregate = defaults,
        //
        status_closed_incident_list_aggregate = defaults,
        status_open_incident_list_aggregate = defaults,
        //
        time_shift_day_incident_list_aggregate = defaults,
        time_shift_night_incident_list_aggregate = defaults,
        time_shift_non_incident_list_aggregate = defaults,
    } = data;

    return <Grid
        container
        columns={1}
        spacing={6}
        className="grid-1 w-full grid-gap-10"
        sx={{m: '0 !important', mt: '30px !important',}}
    >
        <Card sx={{background: "#fff", padding: "5px",}}>
            <>
                <Grid
                    container
                    columns={1}
                    spacing={6}
                    className="grid-4 w-full grid-gap-10"
                    sx={{
                        m: '0 !important', p: '8px',
                    }}
                >
                    <DoughnutChart
                        title="Sick Leave Days Taken vs. Remaining"
                        labels={['Days Taken', 'Days Remaining']}
                        backgroundColors={['primary', 'warning']}
                        sx={{
                            backgroundColor: "#f5f5f5",
                        }}
                        data={[
                            non_person_injured_incident_list_aggregate.aggregate.count,
                            person_injured_incident_list_aggregate.aggregate.count
                        ]}
                    />
                    <DoughnutChart
                        title="Annual Leave Days Taken vs. Remaining"
                        labels={['Days Taken', 'Days Remaining']}
                        backgroundColors={['primary', 'warning']}
                        sx={{
                            backgroundColor: "#f5f5f5",
                        }}
                        data={[
                            non_vehicle_incident_list_aggregate.aggregate.count,
                            vehicle_incident_list_aggregate.aggregate.count
                        ]}
                    />
                    <DoughnutChart
                        title="Unpaid Leave Days Taken vs. Remaining"
                        labels={['Days Taken', 'Days Remaining']}
                        backgroundColors={['primary', 'warning']}
                        sx={{
                            backgroundColor: "#f5f5f5",
                        }}
                        data={[
                            non_vehicle_incident_list_aggregate.aggregate.count,
                            vehicle_incident_list_aggregate.aggregate.count
                        ]}
                    />
                    <DoughnutChart
                        title="Maternity Leave Days Taken vs. Remaining"
                        labels={['Days Taken', 'Days Remaining']}
                        backgroundColors={['primary', 'warning']}
                        sx={{
                            backgroundColor: "#f5f5f5",
                        }}
                        data={[
                            status_open_incident_list_aggregate.aggregate.count,
                            status_closed_incident_list_aggregate.aggregate.count
                        ]}
                    />
                    <DoughnutChart
                        title="Family Responsibility Leave Days Taken vs. Remaining"
                        labels={['Days Taken', 'Days Remaining']}
                        backgroundColors={['primary', 'warning']}
                        sx={{
                            backgroundColor: "#f5f5f5",
                        }}
                        data={[
                            status_open_incident_list_aggregate.aggregate.count,
                            status_closed_incident_list_aggregate.aggregate.count
                        ]}
                    />
                </Grid>
                {/*<Grid*/}
                {/*    container*/}
                {/*    columns={1}*/}
                {/*    spacing={6}*/}
                {/*    className="grid-3 w-full grid-gap-10"*/}
                {/*    sx={{*/}
                {/*        m: '0 !important', p: '8px',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <VerticalBarChartWrapper*/}
                {/*        title=" "*/}
                {/*        color="#fff"*/}
                {/*        tickColor="#fff"*/}
                {/*        background="#f5f5f5"*/}
                {/*        displayLegend={false}*/}
                {/*        chart={{*/}
                {/*            labels: ['Incident Group'],*/}
                {/*            datasets: [*/}
                {/*                {*/}
                {/*                    label: 'LTI',*/}
                {/*                    color: 'secondary',*/}
                {/*                    data: [group_lti_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'NLTI',*/}
                {/*                    color: 'primary',*/}
                {/*                    data: [group_nlti_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'First Aid',*/}
                {/*                    color: 'success',*/}
                {/*                    data: [firstaid_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'Near Miss',*/}
                {/*                    color: 'warning',*/}
                {/*                    data: [nearmiss_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'Other',*/}
                {/*                    color: 'info',*/}
                {/*                    data: [group_non_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*            ],*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    <VerticalBarChartWrapper*/}
                {/*        title=" "*/}
                {/*        color="#fff"*/}
                {/*        tickColor="#fff"*/}
                {/*        background="#f5f5f5"*/}
                {/*        displayLegend={false}*/}
                {/*        chart={{*/}
                {/*            labels: ['Incident Time'],*/}
                {/*            datasets: [*/}
                {/*                {*/}
                {/*                    label: 'Morning',*/}
                {/*                    color: 'secondary',*/}
                {/*                    data: [incident_time_morning_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'Afternoon',*/}
                {/*                    color: 'primary',*/}
                {/*                    data: [incident_time_afternoon_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'Unclassified',*/}
                {/*                    color: 'info',*/}
                {/*                    data: [incident_time_non_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*            ],*/}
                {/*        }}*/}
                {/*    />*/}
                {/*    <VerticalBarChartWrapper*/}
                {/*        title=" "*/}
                {/*        color="#fff"*/}
                {/*        tickColor="#fff"*/}
                {/*        background="#f5f5f5"*/}
                {/*        displayLegend={false}*/}
                {/*        chart={{*/}
                {/*            labels: ['Time Shift'],*/}
                {/*            datasets: [*/}
                {/*                {*/}
                {/*                    label: 'Day Shift',*/}
                {/*                    color: 'secondary',*/}
                {/*                    data: [time_shift_day_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'Night Shift',*/}
                {/*                    color: 'primary',*/}
                {/*                    data: [time_shift_night_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    label: 'Unclassified',*/}
                {/*                    color: 'info',*/}
                {/*                    data: [time_shift_non_incident_list_aggregate.aggregate.count]*/}
                {/*                },*/}
                {/*            ],*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Grid>*/}
            </>
        </Card>
    </Grid>;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
