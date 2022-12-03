/* */
import React, {useMemo} from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

import {Line} from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

import MDBox from "components/MD/MDBox";
import MDTypography from "components/MD/MDTypography";

import {Chart, registerables} from "chart.js";

// ReportsLineChart configurations
import configs from "containers/Charts/LineCharts/ReportsLineChart/configs";

Chart.register(...registerables);

function ReportsLineChart({color, description, chart, children}) {
    const {data, options} = configs(chart.labels || [], chart.datasets || {});

    return (
        <Card sx={{height: "100%"}}>
            <MDBox
                padding="1rem"
                sx={{
                    pr: "0px !important",
                    mr: "-20px !important",
                    maxWidth: "100%",
                }}
            >
                <MDBox padding="1rem" sx={{mb: -2}} className="flex w-full">
                    {children}
                    <MDBox padding="1rem" sx={{ml: "10px", mr: "20px"}} className="grid-1 gap-20">
                        {useMemo(
                            () => (
                                <MDBox
                                    variant="gradient"
                                    bgColor={color}
                                    borderRadius="lg"
                                    coloredShadow={color}
                                    py={2}
                                    pb={5}
                                    pr={0.5}
                                    mt={-9}
                                    mb={-9}
                                    height="300px"
                                >
                                    <Line data={data} options={options}/>
                                </MDBox>
                            ),
                            [chart, color]
                        )}
                        <MDBox mt="35px" mb="-56px" pb={1} sx={{display: "flex", justifyContent: "center",}}>
                            <MDTypography component="div" variant="button" color="white" fontWeight="light">
                                {description}
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </MDBox>
        </Card>
    );
}

// Setting default values for the props of ReportsLineChart
ReportsLineChart.defaultProps = {
    color: "dark",
    description: "",
};

// Typechecking props for the ReportsLineChart
ReportsLineChart.propTypes = {
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
    children: PropTypes.node.isRequired,
};

export default ReportsLineChart;
