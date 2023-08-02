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

function ReportsLineChart({color, description, chart, height, children}) {
	const {data, options} = configs(chart.labels || [], chart.datasets || {});

	return (
		<Card sx={{height}}>
			<MDBox
				sx={{
					pr: "0px !important",
					maxWidth: "100%",
					height: "100%",
				}}
			>
				<MDBox className="flex w-full h-full">
					{children}
					<MDBox className="grid-1 gap-20 h-full">
						{useMemo(
							() => (
								<MDBox
									className="ReportsLineChart-Line-Chart-Box"
									variant="gradient"
									bgColor={color}
									borderRadius="lg"
									coloredShadow={color}
									pt='10px'
									pb='50px'
									pr={0.5}
									height="100%"
								>
									<Line data={data} options={options}/>
								</MDBox>
							),
							[chart, color]
						)}
						{description && <MDBox pt="10px" sx={{
							m: '-50px 20px 0',
							borderTop: '2px dotted rgba(238, 238, 238, 0.2)',
							display: "flex",
							justifyContent: "center",
						}}>
							<MDTypography component="div" variant="button" color="white" fontWeight="light" sx={{fontSize: '1.6em'}}>
								{description}
							</MDTypography>
						</MDBox>}
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
