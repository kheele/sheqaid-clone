//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import DefaultDoughnutChart from "containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
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
		height="359px"
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
		has_product_yes_sds_list_aggregate = defaults,
		has_product_no_sds_list_aggregate = defaults,
		//
		has_product_yes_hazchem_sheet_list_aggregate = defaults,
		has_product_no_hazchem_sheet_list_aggregate = defaults,
		//
		is_stable_yes_chemical_product_list_aggregate = defaults,
		is_stable_no_chemical_product_list_aggregate = defaults,
		//
		is_hazardous_yes_chemical_product_list_aggregate = defaults,
		is_hazardous_no_chemical_product_list_aggregate = defaults,
		//
		is_combustible_yes_chemical_product_list_aggregate = defaults,
		is_combustible_no_chemical_product_list_aggregate = defaults,
		//
		is_flammable_yes_chemical_product_list_aggregate = defaults,
		is_flammable_no_chemical_product_list_aggregate = defaults,
		//
		has_sds_yes_chemical_product_list_aggregate = defaults,
		has_sds_no_chemical_product_list_aggregate = defaults,
		has_hazchem_sheet_yes_chemical_product_list_aggregate = defaults,
		has_hazchem_sheet_no_chemical_product_list_aggregate = defaults,
		has_risk_assessment_yes_chemical_product_list_aggregate = defaults,
		has_risk_assessment_no_chemical_product_list_aggregate = defaults,
	} = data;

	return <Grid
		container
		columns={1}
		spacing={6}
		className="grid-3 w-full grid-gap-10"
		sx={{m: '0 !important', mt: '-10px !important',}}
	>
		<DoughnutChart
			title="SDS Chemical Product"
			labels={['No Chemical Product', 'Has Chemical Product']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				has_product_no_sds_list_aggregate.aggregate.count,
				has_product_yes_sds_list_aggregate.aggregate.count,
			]}
		/>
		<DoughnutChart
			title="Hazchem Sheet Chemical Product"
			labels={['No Chemical Product', 'Has Chemical Product']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				has_product_no_hazchem_sheet_list_aggregate.aggregate.count,
				has_product_yes_hazchem_sheet_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product Stability"
			labels={['Unstable', 'Stable']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				is_stable_no_chemical_product_list_aggregate.aggregate.count,
				is_stable_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product Hazards"
			labels={['Not Hazardous', 'Hazardous']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				is_hazardous_no_chemical_product_list_aggregate.aggregate.count,
				is_hazardous_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product Combustibility"
			labels={['Not Combustible', 'Combustible']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				is_combustible_no_chemical_product_list_aggregate.aggregate.count,
				is_combustible_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product Flammability"
			labels={['Not Flammable', 'Flammable']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				is_flammable_no_chemical_product_list_aggregate.aggregate.count,
				is_flammable_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product SDS"
			labels={['No SDS', 'Has SDS']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				has_sds_no_chemical_product_list_aggregate.aggregate.count,
				has_sds_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product Hazchem Sheet"
			labels={['No Hazchem Sheet', 'Has Hazchem Sheet']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				has_hazchem_sheet_no_chemical_product_list_aggregate.aggregate.count,
				has_hazchem_sheet_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
		<DoughnutChart
			title="Chemical Product Risk Assessment"
			labels={['No Risk Assessment', 'Has Risk Assessment']}
			backgroundColors={['primary', 'warning']}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
			data={[
				has_risk_assessment_no_chemical_product_list_aggregate.aggregate.count,
				has_risk_assessment_yes_chemical_product_list_aggregate.aggregate.count
			]}
		/>
	</Grid>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
