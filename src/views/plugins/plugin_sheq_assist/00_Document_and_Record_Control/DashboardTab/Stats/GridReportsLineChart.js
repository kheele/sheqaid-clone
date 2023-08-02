//<editor-fold desc="imports">
import * as React from "react";
import style from "assets/styles/home.module.css";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import ComplexStatisticsCard from "containers/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import PropTypes from "prop-types";
import {CircularProgress} from "@mui/material";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import DefaultLineChart from "containers/Charts/LineCharts/DefaultLineChart";
//</editor-fold>

//<editor-fold desc="labels">
const labels = {
	Day: "yesterday",
	Week: "last week",
	Month: "last month",
	Quarter: "last 3 months",
	"Bi-Annual": "last 6 months",
	Annual: "last year",
};
//</editor-fold>

console.log('style', style);

//<editor-fold desc="ReportsLineChartWrapper">
function ReportsLineChartWrapper({desc, data: _data, color, percColor, title, percLabel}) {
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

	return null;

	const {chart, count, percAmount} = data;

	return <MDBox mb={3}>
		<ReportsLineChart
			color={color}
			description={desc}
			chart={chart}
			height={300}
		>
		</ReportsLineChart>
	</MDBox>;
}

//</editor-fold>

//<editor-fold desc="DefaultLineChartWrapper">
function DefaultLineChartWrapper({desc, data: _data, color, percColor, title, percLabel}) {
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

	return <MDBox mb={3}>
		<DefaultLineChart
			color={color}
			description={desc}
			chart={chart}
			height={500}
		>
		</DefaultLineChart>
	</MDBox>;
}

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
		height="300px"
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

//<editor-fold desc="Comp">
const Comp = forwardRef(({data: __data, interval: __interval}, ref) => {
	const [data, setData] = useState(__data || DATA_LOAD_STATUS.LOADING);
	const [interval, setInterval] = useState(__interval);

	// <editor-fold desc="useImperativeHandle funs">
	useImperativeHandle(ref, () => ({
		setData: (value) => {
			setData(value);
		},
		setInterval: (value) => {
			setInterval(value);
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

	const [item] = data;
	// _2022_Aug__all_expiry_document_list_aggregate,
	// _2022_Aug__projectplan_expiry_document_list_aggregate,
	// _2022_Aug__imspolicy_expiry_document_list_aggregate,
	// _2022_Aug__certificate_expiry_document_list_aggregate,
	// _2022_Aug__insurance_expiry_document_list_aggregate,
	// _2022_Aug__registration_expiry_document_list_aggregate,
	// _2022_Aug__regulatorybody_expiry_document_list_aggregate,
	// _2022_Aug__unclassified_expiry_document_list_aggregate,

	const list = Object.keys(item).filter(key => key.startsWith('_') && key.contains('__')).map(key => {
		const parts = key.split('__');
		const year = parts[0].split('_')[1];
		const month = parts[0].split('_')[2];
		return {key: parts[1].split('_')[0], year, month, count: item[key].aggregate.count};
	});

	const list_all = list.filter(({key}) => key === 'all');
	const list_project_plan = list.filter(({key}) => key === 'projectplan');
	const list_ims_policy = list.filter(({key}) => key === 'imspolicy');
	const list_certificate = list.filter(({key}) => key === 'certificate');
	const list_insurance = list.filter(({key}) => key === 'insurance');
	const list_registration = list.filter(({key}) => key === 'registration');
	const list_regulatory_body = list.filter(({key}) => key === 'regulatorybody');
	const list_unclassified = list.filter(({key}) => key === 'unclassified');

	console.log('data', data)

	const totals = {
		lists: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_all.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'All',
						color: 'primary',
						data: list_all.map(({count}) => count)
					},
					{
						label: 'Project Plans',
						color: 'warning',
						data: list_project_plan.map(({count}) => count)
					},
					{
						label: 'IMS Policies',
						color: 'success',
						data: list_ims_policy.map(({count}) => count)
					},
					{
						label: 'Company Certificate',
						color: 'info',
						data: list_certificate.map(({count}) => count)
					},
					{
						label: 'Company Insurance',
						color: 'error',
						data: list_insurance.map(({count}) => count)
					},
					{
						label: 'Company Registration',
						color: 'secondary',
						data: list_registration.map(({count}) => count)
					},
					{
						label: 'Company Regulatory Body',
						color: 'dark',
						data: list_regulatory_body.map(({count}) => count)
					},
					{
						label: 'Unclassified',
						color: 'light',
						data: list_unclassified.map(({count}) => count)
					},
				],
			}
		}),
	};

	const {lists} = totals;

	const percLabel = `than ${labels[interval]}`;

	return <Grid
		container
		columns={2}
		spacing={6}
		className="grid-1 w-full grid-gap-10"
		sx={{
			m: 0, mt: '0px',
		}}
	>
		<Grid item sx={{padding: "0 !important", mb: "-10px"}}>
			<DefaultLineChartWrapper
				data={lists}
				color="black"
				percColor="info"
				desc="Total Document Expiry"
				percLabel={percLabel}
			/>
		</Grid>
	</Grid>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
