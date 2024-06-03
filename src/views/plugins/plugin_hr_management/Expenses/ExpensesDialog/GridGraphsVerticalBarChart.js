//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import {forwardRef} from "react"
import {getRandomRolor} from "utils/Utils";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {Clickable} from 'components/inputs';
//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef((
    {
        onViewDialog,
        data,//[{id, month_year: date.formatMonthYear(), count}]
    }, ref) => {

    const chart = {
        labels: data.map(({month_year}) => month_year),
        datasets: [{
            label: 'Total',
            color: 'light',
            data: data.map(({count}) => count),
        }],
    };

    const background = getRandomRolor();

    return <Grid
        container
        columns={2}
        spacing={6}
        className="grid-1 w-full grid-gap-10"
        sx={{
            m: 0, justifyItems: 'center',
        }}
    >
        <Grid item
              className="grid-4 w-full grid-gap-10"
              sx={{padding: "0 !important", mb: "0px", justifyItems: 'center',}}
        >
            <Clickable compRef={compRef} onClick={onViewDialog}>
                <MDBox
                    className="grid-1 w-full grid-gap-10"
                    sx={{
                        m: 0, mb: '15px', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
                    }}
                >
                    <VerticalBarChart
                        height="300px"
                        title={text}
                        color="#fff"
                        tickColor="#fff"
                        background={background}
                        displayLegend={true}
                        chart={chart}
                    />
                </MDBox>
            </Clickable>
        </Grid>
    </Grid>;
});

//</editor-fold>

export default Comp;
