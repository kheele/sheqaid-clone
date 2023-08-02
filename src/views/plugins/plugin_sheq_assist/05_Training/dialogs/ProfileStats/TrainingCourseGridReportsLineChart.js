//<editor-fold desc="imports">
import * as React from "react";
import style from "assets/styles/home.module.css";
import Grid from "@mui/material/Grid";
import ComplexStatisticsCard from "containers/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
import {getRandomRolor} from "utils/UtilsFuns";
import MKBox from "components/MK/MKBox";
import {Dates} from "utils/Dates";
//</editor-fold>

//<editor-fold desc="ReportsLineChartWrapper">
function ReportsLineChartWrapper({desc, data: _data, color}) {
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
            description={desc}
            chart={chart}
        />
    </MKBox>;
}

//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef((
    {
        item,
    }, ref
) => {
    const {
        data: {
            training_matrix_list = [],//[{id, cost, institution_conducting_training, trainer}]
            training_plan_list = [],//{id, completion_status, result, result_status, year, employee, course, training}
        }
    } = item;

    //cost, year, participants

    const __training_matrix_list = training_matrix_list.filter(({date_range}) => !!date_range && !!Dates.parse(date_range.end));
    const __training_plan_list = training_plan_list.filter(({year}) => !!year);

    const years = __training_matrix_list.map(({date_range}) => Dates.parse(date_range.end).getFullYear()).distinct();

    years.push(...__training_plan_list.map(({year}) => year).distinct());
    years.sort();

    const cost_data = years.map(year => {
        return __training_matrix_list.filter(({date_range}) => Dates.parse(date_range.end).getFullYear() === year).filter(({cost}) => !!cost).map(({cost}) => parseFloat(cost.replace("$", "").replace(",", ""))).reduce((a, b) => a + b, 0);
    });

    const participants_data = years.map(__year => {
        return __training_plan_list.filter(({year}) => year === __year).filter(({employee}) => !!employee).filter(({completion_status}) => completion_status === "Completed" || completion_status === "In Progress").length;
    });

    const data = {
        chart: {
            labels: years.distinct(),
            datasets: [
                {
                    label: 'Cost',
                    color: 'light',
                    data: cost_data
                }, {
                    label: 'Participants',
                    color: 'primary',
                    data: participants_data
                }
            ],
        }
    };

    const background = getRandomRolor();

    return <Grid
        container
        columns={2}
        className="grid-1 grid-gap-10 GridReportsLineChart-Grid1"
        sx={{
            m: '70px 0 -30px -55px', width: 'calc(100% + 100px) !important', height: "296px",
        }}
    >
        <Grid
            item
            sx={{padding: "0 !important", height: `400px`}}
            className="GridReportsLineChart-Grid2"
        >
            <ReportsLineChartWrapper
                data={data}
                color="info"
                percColor="info"
                title=""
            />
        </Grid>
    </Grid>;
});
//</editor-fold>

export default Comp;
