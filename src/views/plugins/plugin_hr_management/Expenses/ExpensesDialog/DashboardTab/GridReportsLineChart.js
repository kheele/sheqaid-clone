//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef, useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import {CircularProgress} from "@mui/material";
import MKBox from "components/MK/MKBox";
import DefaultLineChart from "../../../../../../containers/Charts/LineCharts/DefaultLineChart";
import MDBox from "../../../../../../components/MD/MDBox";
//</editor-fold>

//<editor-fold desc="ReportsLineChartWrapper">
function ReportsLineChartWrapper({title, desc, data: _data, color, background}) {
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

    const {chart} = data;

    return <MKBox mb={3} sx={{height: '100%'}}>
        <ReportsLineChart
            height="100%"
            color={color}
            background={background}
            title={title}
            description={desc}
            chart={chart}
        />
    </MKBox>;
}

//</editor-fold>

//<editor-fold desc="DefaultLineChartWrapper">
function DefaultLineChartWrapper({title, desc, data: _data, color, percColor, percLabel, background}) {
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

    return <MDBox mb={3} sx={{height: '100%'}}>
        <DefaultLineChart
            height="100%"
            color={color}
            background={background}
            title={title}
            description={desc}
            chart={chart}
        />
    </MDBox>;
}

//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef((
    {
        data: {bottomStats},//[{id, month_year: date.formatMonthYear(), count}]
    }, ref) => {

    console.log('data', {bottomStats})

    const chart = {
        chart: {
            labels: bottomStats.map(({month_year}) => month_year),
            datasets: [
                {
                    label: 'Total No.',
                    color: 'primary',
                    data: bottomStats.map(({count}) => count)
                },
                {
                    label: 'Total Cost',
                    color: 'warning',
                    data: bottomStats.map(({sum: {amount}}) => amount && parseFloat(amount.replace('$', ''))),
                }
            ],
        }
    };

    return <Grid
        container
        columns={2}
        className="grid-1 grid-gap-10 pos-relative"
        sx={{
            m: '0',
            width: 'calc(100% - 20px) !important',
            height: "400px",
            // height: "calc(100% - 216px)",
            position: 'absolute',
            left: '10px',
            bottom: '0px',
            right: '0px',
        }}
    >
        <Grid
            item
            sx={{
                padding: "0 !important",
                height: '100%',
                position: 'absolute',
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
            }}
            className="GridReportsLineChart-Grid2"
        >
            <DefaultLineChartWrapper
                data={chart}
                background="#1A73E8"
                title="Total Approved Expenses"
            />
        </Grid>
    </Grid>;
});
//</editor-fold>

export default Comp;
