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
			height={300}
		/>
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

	return null;

	const [item = {}] = data;
	// _2022_Aug__all_non_conformance_list_aggregate,
	//
	// _2022_Aug__source_site_audit_non_conformance_list_aggregate,
	// _2022_Aug__source_compliance_audit_non_conformance_list_aggregate,
	// _2022_Aug__source_inspection_non_conformance_list_aggregate,
	// _2022_Aug__source_incident_investigation_non_conformance_list_aggregate,
	//
	// _2022_Aug__priority_non_non_conformance_list_aggregate,
	// _2022_Aug__priority_low_non_conformance_list_aggregate,
	// _2022_Aug__priority_medium_non_conformance_list_aggregate,
	// _2022_Aug__priority_high_non_conformance_list_aggregate,
	// _2022_Aug__priority_critical_non_conformance_list_aggregate,
	//
	// _2022_Aug__type_corrective_action_non_conformance_list_aggregate,
	// _2022_Aug__type_preventative_action_non_conformance_list_aggregate,
	// _2022_Aug__type_opportunity_for_improver_non_conformance_list_aggregate,
	// _2022_Aug__type_non_non_conformance_list_aggregate,

	const list = Object.keys(item).filter(key => key.startsWith('_') && key.contains('__')).map(key => {
		const parts = key.split('__');
		const year = parts[0].split('_')[1];
		const month = parts[0].split('_')[2];
		return {key: parts[1].split('_non_conformance')[0], year, month, count: item[key].aggregate.count};
	});

	const list_all = list.filter(({key}) => key === 'all');
	//
	const list_source_site_audit = list.filter(({key}) => key === 'source_site_audit');
	const list_source_compliance_audit = list.filter(({key}) => key === 'source_compliance_audit');
	const list_source_inspection = list.filter(({key}) => key === 'source_inspection');
	const list_source_incident_investigation = list.filter(({key}) => key === 'source_incident_investigation');
	//
	const list_priority_non = list.filter(({key}) => key === 'priority_non');
	const list_priority_low = list.filter(({key}) => key === 'priority_low');
	const list_priority_medium = list.filter(({key}) => key === 'priority_medium');
	const list_priority_high = list.filter(({key}) => key === 'priority_high');
	const list_priority_critical = list.filter(({key}) => key === 'priority_critical');
	//
	const list_type_corrective_action = list.filter(({key}) => key === 'type_corrective_action');
	const list_type_preventative_action = list.filter(({key}) => key === 'type_preventative_action');
	const list_type_opportunity_for_improver = list.filter(({key}) => key === 'type_opportunity_for_improver');
	const list_type_non = list.filter(({key}) => key === 'type_non');

	console.log('data', data)

	const totals = {
		totalNCRPerMonth: Promise.resolve({
			labels: list_all.map(({year, month}) => `${year}-${month}`),
			datasets: [{
				label: 'Non-Conformances',
				color: 'light',
				data: list_all.map(({count}) => count)
			}],
		}),
		source: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_source_site_audit.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'Site Audit',
						color: 'primary',
						data: list_source_site_audit.map(({count}) => count)
					},
					{
						label: 'Compliance Audit',
						color: 'warning',
						data: list_source_compliance_audit.map(({count}) => count)
					},
					{
						label: 'Inspection',
						color: 'info',
						data: list_source_inspection.map(({count}) => count)
					},
					{
						label: 'Incident Investigation',
						color: 'success',
						data: list_source_incident_investigation.map(({count}) => count)
					},
				],
			}
		}),
		priority: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_priority_non.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'Critical',
						color: 'primary',
						data: list_priority_critical.map(({count}) => count)
					},
					{
						label: 'High',
						color: 'warning',
						data: list_priority_high.map(({count}) => count)
					},
					{
						label: 'Medium',
						color: 'info',
						data: list_priority_medium.map(({count}) => count)
					},
					{
						label: 'Low',
						color: 'success',
						data: list_priority_low.map(({count}) => count)
					},
					{
						label: 'Unclassified',
						color: 'secondary',
						data: list_priority_non.map(({count}) => count)
					},
				],
			}
		}),
		type: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_type_corrective_action.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'Corrective Action',
						color: 'primary',
						data: list_type_corrective_action.map(({count}) => count)
					},
					{
						label: 'Preventative Action',
						color: 'warning',
						data: list_type_preventative_action.map(({count}) => count)
					},
					{
						label: 'Opportunity For Improver',
						color: 'info',
						data: list_type_opportunity_for_improver.map(({count}) => count)
					},
					{
						label: 'Unclassified',
						color: 'success',
						data: list_type_non.map(({count}) => count)
					},
				],
			}
		}),
	};

	const {totalNCRPerMonth, source, priority, type} = totals;

	const percLabel = `than ${labels[interval]}`;

	return <Grid
		container
		columns={2}
		spacing={6}
		className="grid-1 w-full grid-gap-10"
		sx={{
			m: '0 !important', mt: '20px !important',
		}}
	>
		<Grid item sx={{padding: "0 !important", mb: "20px !important"}}>
			<VerticalBarChartWrapper
				title="Total Non-Conformances"
				color="#fff"
				tickColor="#fff"
				background="#344767"
				displayLegend={false}
				chart={totalNCRPerMonth}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-10px !important"}}>
			<DefaultLineChartWrapper
				data={source}
				color="dark"
				percColor="info"
				desc="Total NCRs By Source"
				percLabel={percLabel}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-10px !important"}}>
			<DefaultLineChartWrapper
				data={priority}
				color="dark"
				percColor="info"
				desc="Total NCRs By Priority"
				percLabel={percLabel}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-20px !important"}}>
			<DefaultLineChartWrapper
				data={type}
				color="dark"
				percColor="info"
				desc="Total NCRs By Type"
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
