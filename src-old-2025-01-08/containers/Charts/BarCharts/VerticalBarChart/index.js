/* */
import React, {useEffect, useMemo, useState} from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import {Bar} from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MD/MDBox";
import MDTypography from "components/MD/MDTypography";

// VerticalBarChart configurations
import configs from "containers/Charts/BarCharts/VerticalBarChart/configs";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import {CircularProgress} from "@mui/material";

function VerticalBarChart(
    {
        icon,
        title,
        description,
        width = '100%',
        height,
        tickColor,
        color,
        background,
        displayLegend,
        chart: chartInput,
        sx = {}
    }
) {
    const [chartData, setChartData] = useState(null);
    useEffect(() => {
        (async () => {
            if (chartInput instanceof Promise) {
                chartInput = await chartInput;
            }
            setChartData(chartInput);
        })();
    }, [chartInput]);

    if (chartData === null) {
        return <CircularProgress size='1em'/>;
    }

    const {labels, datasets} = chartData;

    const chart = {
        displayLegend,
        labels,
        datasets
    };

    const chartDatasets = chart.datasets ? chart.datasets.map((dataset) => ({
        ...dataset,
        weight: 5,
        borderWidth: 0,
        borderRadius: 4,
        backgroundColor: colors[dataset.color] ? colors[dataset.color || "dark"].main : colors.dark.main,
        fill: false,
        maxBarThickness: 35,
    })) : [];

    const {data, options} = configs(chart.labels || [], chartDatasets, chart.displayLegend, tickColor);

    const renderChart = (<MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>
        {title || description ? (
            <MDBox display="flex" px={description ? 1 : 0} pt={description ? 1 : 0} justifyContent="center">
                {icon.component && (<MDBox
                    width="4rem"
                    height="4rem"
                    bgColor={icon.color || "info"}
                    variant="gradient"
                    coloredShadow={icon.color || "info"}
                    borderRadius="xl"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    mt={-5}
                    mr={2}
                >
                    <Icon fontSize="medium">{icon.component}</Icon>
                </MDBox>)}
                <MDBox sx={{
                    m: '0px 20px 10px',
                    pb: '10px',
                    width: '100%',
                    borderBottom: '2px dotted rgba(238, 238, 238, 0.2)',
                    display: "flex",
                    justifyContent: "center",
                }}>
                    {title && title.isNotEmpty() &&
                        <MDTypography variant="h5" sx={{
                            color,
                            fontSize: '2rem',
                            fontWeight: '300',
                            lineHeight: '1.5',
                        }}>{title}</MDTypography>}
                    {description && <MDBox mb={2}>
                        <MDTypography component="div" variant="button" color="text">
                            {description}
                        </MDTypography>
                    </MDBox>}
                </MDBox>
            </MDBox>) : null
        }
        <BarMemo chart={chart} height={height} width={width} data={data} options={options}/>
    </MDBox>);

    return title || description ? <Card sx={{width, ...sx, background}}>{renderChart}</Card> : renderChart;
}


function BarMemo({chart, width, height, data, options}) {
    return <>
        {useMemo(() => (<MDBox height={height} width={width}>
            <Bar data={data} options={options}/>
        </MDBox>), [chart, width, height])}
    </>;
}

// Setting default values for the props of VerticalBarChart
VerticalBarChart.defaultProps = {
    icon: {color: "info", component: ""},
    title: "",
    description: "",
    height: "19.125rem",
    tickColor: "#fff",
    background: "#fff",
};

// Typechecking props for the VerticalBarChart
VerticalBarChart.propTypes = {
    icon: PropTypes.shape({
        color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "light", "dark",]),
        component: PropTypes.node,
    }),
    tickColor: PropTypes.string,
    background: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default VerticalBarChart;
