/* */
import React, {useMemo} from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import {Line} from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MD/MDBox";
import MDTypography from "components/MD/MDTypography";

// DefaultLineChart configurations
import configs from "containers/Charts/LineCharts/DefaultLineChart/configs";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";

function DefaultLineChart({color, background, description, chart, height, sx, icon, title}) {
    const chartDatasets = chart.datasets
        ? chart.datasets.map((dataset) => ({
            ...dataset,
            tension: 0,
            pointRadius: 3,
            borderWidth: 4,
            backgroundColor: "transparent",
            fill: true,
            pointBackgroundColor: colors[dataset.color]
                ? colors[dataset.color || "dark"].main
                : colors.dark.main,
            borderColor: colors[dataset.color]
                ? colors[dataset.color || "dark"].main
                : colors.dark.main,
            maxBarThickness: 6,
        }))
        : [];

    const {data, options} = configs(chart.labels || [], chartDatasets);

    return (
        <Card
            sx={{...(sx || {}), height, background, padding: color ? 0 : '16px'}}
        >
            <MDBox
                sx={{
                    pr: "0px !important",
                    maxWidth: "100%",
                    height: "100%",
                }}
            >
                <MDBox className="flex w-full h-full">
                    <MDBox className="grid-1 gap-20 h-full">
                        {title && title.isNotEmpty() && <MDBox
                            display="flex"
                            justifyContent="center"
                        >
                            <MDBox sx={{
                                m: '0px 20px 10px',
                                pb: '10px',
                                width: '100%',
                                borderBottom: '2px dotted rgba(238, 238, 238, 0.2)',
                                display: "flex",
                                justifyContent: "center",
                            }}>
                                <MDTypography variant="h5" color="white" sx={{
                                    fontSize: '2rem',
                                    fontWeight: '300',
                                    lineHeight: '1.5',
                                }}>{title}</MDTypography>
                            </MDBox>
                        </MDBox>}
                        <BarMemo chart={chart} color={color} data={data} options={options}/>
                        {description && <MDBox pt="10px" sx={{
                            m: '-50px 20px 0',
                            borderTop: '2px dotted rgba(238, 238, 238, 0.2)',
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <MDTypography component="div" variant="button" color="white" fontWeight="light"
                                          sx={{fontSize: '1.6em'}}>
                                {description}
                            </MDTypography>
                        </MDBox>}
                    </MDBox>
                </MDBox>
            </MDBox>
        </Card>
    );
}

function BarMemo({chart, color, data, options}) {
    const props = {};
    if (color) {
        props.bgColor = color;
        props.coloredShadow = color;
        props.variant = "gradient";
    }
    return <>
        {useMemo(
            () => (
                <MDBox
                    className="ReportsLineChart-Line-Chart-Box"
                    borderRadius="lg"
                    {...props}
                    pt='10px'
                    pb='50px'
                    pr={0.5}
                    height="100%"
                    sx={{minHeight: "100%"}}
                >
                    <Line data={data} options={options}/>
                </MDBox>
            ),
            [chart, props]
        )}
    </>;
}

// Setting default values for the props of DefaultLineChart
DefaultLineChart.defaultProps = {
    icon: {color: "info", component: ""},
    title: "",
    description: "",
    height: "19.125rem",
};

// Typechecking props for the DefaultLineChart
DefaultLineChart.propTypes = {
    icon: PropTypes.shape({
        color: PropTypes.oneOf([
            "primary",
            "secondary",
            "info",
            "success",
            "warning",
            "error",
            "light",
            "dark",
            "black",
        ]),
        component: PropTypes.node,
    }),
    title: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default DefaultLineChart;
