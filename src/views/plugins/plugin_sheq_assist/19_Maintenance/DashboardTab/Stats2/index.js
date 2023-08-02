//<editor-fold desc="imports">
import * as React from "react";
import style from "assets/styles/home.module.css";
import PropTypes from "prop-types";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import GridCounter from "./GridCounter";
import GridDoughnutChart from "./GridDoughnutChart";
import GridFrequencyVerticalBarChart from "./GridFrequencyVerticalBarChart";
import GridReportsLineChart from "./GridReportsLineChart";
import {Grid} from "@material-ui/core";
import GridCounterSide from "./GridCounterSide";
import Card from "@mui/material/Card";
//</editor-fold>

console.log('style', style);

//
//<editor-fold desc="Comp">
const Comp = forwardRef(({interval, employee_view, data,}, ref) => {
	const gridCounterRef = useRef(null);
	const gridDoughnutChartRef = useRef(null);
	const gridReportsLineChartRef = useRef(null);

	// <editor-fold desc="useImperativeHandle funs">
	useImperativeHandle(ref, () => ({
		setInterval: (value) => {
			gridCounterRef.current.setInterval(value);
			gridDoughnutChartRef.current.setInterval(value);
			gridReportsLineChartRef.current.setInterval(value);
		},
		setEmployeeView: (value) => {
			gridCounterRef.current.setEmployeeView(value);
			gridDoughnutChartRef.current.setEmployeeView(value);
			gridReportsLineChartRef.current.setEmployeeView(value);
		},
	}));
	// </editor-fold>

	return (
		<>
			<Grid lg={12} container>
				<Grid xl={9} item className="padding-r-20">
					<GridCounter ref={gridCounterRef} interval={interval} employee_view={employee_view} data={data}/>
					<GridDoughnutChart ref={gridDoughnutChartRef} interval={interval} employee_view={employee_view} data={data}/>
				</Grid>
				<Grid xl={3} item>
					<Card sx={{background: "#344767"}}>
						<GridCounterSide ref={gridCounterRef} interval={interval} employee_view={employee_view} data={data}/>
					</Card>
				</Grid>
			</Grid>
			<GridReportsLineChart ref={gridReportsLineChartRef} interval={interval} employee_view={employee_view}/>
			<GridFrequencyVerticalBarChart interval={interval} employee_view={employee_view}/>
		</>
	);
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
