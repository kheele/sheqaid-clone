//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import style from "assets/styles/home.module.css";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
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

// console.log('style', style);

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

	const {chart, count, percAmount} = data;

	return <MDBox mb={3}>
		<ReportsLineChart
			color={color}
			description={desc}
			chart={chart}
			height={300}
		>
			{/*<ComplexStatisticsCard*/}
			{/*    className="fixed-flex min-w-200"*/}
			{/*    color={color}*/}
			{/*    title={title}*/}
			{/*    count={count}*/}
			{/*    percentage={{*/}
			{/*        color: percColor,*/}
			{/*        amount: percAmount,*/}
			{/*        label: percLabel,*/}
			{/*    }}*/}
			{/*/>*/}
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
			height={300}
		>
			{/*<ComplexStatisticsCard*/}
			{/*    className="fixed-flex min-w-200"*/}
			{/*    color={color}*/}
			{/*    title={title}*/}
			{/*    count={count}*/}
			{/*    percentage={{*/}
			{/*        color: percColor,*/}
			{/*        amount: percAmount,*/}
			{/*        label: percLabel,*/}
			{/*    }}*/}
			{/*/>*/}
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

	// _2022_Aug__all_incident_list_aggregate,
	// _2022_Aug__fatality_incident_list_aggregate,
	// _2022_Aug__group_lti_incident_list_aggregate,
	// _2022_Aug__firstaid_incident_list_aggregate,
	// _2022_Aug__nearmiss_incident_list_aggregate,
	// _2022_Aug__person_injured_incident_list_aggregate,
	// _2022_Aug__vehicle_incident_list_aggregate,
	//
	// _2022_Aug__WorkplaceViolenceHomicide_incident_list_aggregate,

	const list = Object.keys(data).filter(key => key.startsWith('_') && key.contains('__')).map(key => {
		const parts = key.split('__');
		const year = parts[0].split('_')[1];
		const month = parts[0].split('_')[2];
		return {key: parts[1].split('_')[0], year, month, count: data[key].aggregate.count};
	});

	const list_all = list.filter(({key}) => key === 'all');
	const list_fatality = list.filter(({key}) => key === 'fatality');
	const list_group_lti = list.filter(({key}) => key === 'group');
	const list_group_firstaid = list.filter(({key}) => key === 'firstaid');
	const list_group_nearmiss = list.filter(({key}) => key === 'nearmiss');
	const list_group_workplaceViolence = list.filter(({key}) => key === 'workplaceViolence');
	const list_person = list.filter(({key}) => key === 'person');
	const list_vehicle = list.filter(({key}) => key === 'vehicle');
	const list_WorkplaceViolenceHomicide = list.filter(({key}) => key === 'WorkplaceViolenceHomicide');
	const list_WorkplaceViolencePhysicalAssault = list.filter(({key}) => key === 'WorkplaceViolencePhysicalAssault');
	const list_WorkplaceViolenceVerbalAbuse = list.filter(({key}) => key === 'WorkplaceViolenceVerbalAbuse');
	const list_WorkplaceViolenceIntimidation = list.filter(({key}) => key === 'WorkplaceViolenceIntimidation');
	const list_WorkplaceViolenceThreats = list.filter(({key}) => key === 'WorkplaceViolenceThreats');
	const list_WorkplaceViolenceCyberbullying = list.filter(({key}) => key === 'WorkplaceViolenceCyberbullying');
	const list_WorkplaceViolenceSexualHarassment = list.filter(({key}) => key === 'WorkplaceViolenceSexualHarassment');
	const list_WorkplaceViolenceDiscrimination = list.filter(({key}) => key === 'WorkplaceViolenceDiscrimination');
	const list_WorkplaceViolenceStalking = list.filter(({key}) => key === 'WorkplaceViolenceStalking');

	console.log('data', data)

	const totals = {
		totalIncidentsPerMonth: Promise.resolve({
			labels: list_all.map(({year, month}) => `${year}-${month}`),
			datasets: [{
				label: 'Incidents',
				color: 'light',
				data: list_all.map(({count}) => count)
			}],
		}),
		fatality: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_fatality.map(({year, month}) => `${year}-${month}`),
				datasets: {
					label: 'Fatalities',
					color: 'light',
					data: list_fatality.map(({count}) => count)
				},
			}
		}),
		group_lti_firstaid_nearmiss: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_group_lti.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'Lost Time Injuries',
						color: 'primary',
						data: list_group_lti.map(({count}) => count)
					},
					{
						label: 'First Aid Injuries',
						color: 'warning',
						data: list_group_firstaid.map(({count}) => count)
					},
					{
						label: 'Near Misses',
						color: 'success',
						data: list_group_nearmiss.map(({count}) => count)
					},
					{
						label: 'Workplace Violence',
						color: 'text',
						data: list_group_workplaceViolence.map(({count}) => count)
					},
				],
			}
		}),
		personsInjured: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_person.map(({year, month}) => `${year}-${month}`),
				datasets: {
					label: 'Persons Injured',
					color: 'light',
					data: list_person.map(({count}) => count)
				},
			}
		}),
		vehiclesInvolved: Promise.resolve({
			count: "281",
			percAmount: "+16%",
			chart: {
				labels: list_vehicle.map(({year, month}) => `${year}-${month}`),
				datasets: {
					label: 'Vehicles Involved',
					color: 'light',
					data: list_vehicle.map(({count}) => count)
				},
			}
		}),
		workplaceViolence: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_WorkplaceViolenceHomicide.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'Homicide',
						color: 'primary',
						data: list_WorkplaceViolenceHomicide.map(({count}) => count)
					},
					{
						label: 'Physical Assault',
						color: 'dark',
						data: list_WorkplaceViolencePhysicalAssault.map(({count}) => count)
					},
					{
						label: 'Verbal Abuse',
						color: 'text',
						data: list_WorkplaceViolenceVerbalAbuse.map(({count}) => count)
					},
					{
						label: 'Intimidation',
						color: 'white',
						data: list_WorkplaceViolenceIntimidation.map(({count}) => count)
					},
					{
						label: 'Threats',
						color: 'black',
						data: list_WorkplaceViolenceThreats.map(({count}) => count)
					},
					{
						label: 'Cyberbullying',
						color: 'brown',
						data: list_WorkplaceViolenceCyberbullying.map(({count}) => count)
					},
					{
						label: 'Sexual Harassment',
						color: 'warning',
						data: list_WorkplaceViolenceSexualHarassment.map(({count}) => count)
					},
					{
						label: 'Discrimination',
						color: 'error',
						data: list_WorkplaceViolenceDiscrimination.map(({count}) => count)
					},
					{
						label: 'Stalking',
						color: 'info',
						data: list_WorkplaceViolenceStalking.map(({count}) => count)
					},
				],
			}
		}),
	};

	const {totalIncidentsPerMonth, fatality, group_lti_firstaid_nearmiss, personsInjured, vehiclesInvolved, workplaceViolence} = totals;

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
		<Grid item sx={{padding: "0 !important", mb: "15px !important"}}>
			<VerticalBarChartWrapper
				title="Total Incidents"
				color="#fff"
				tickColor="#fff"
				background="#344767"
				displayLegend={false}
				chart={totalIncidentsPerMonth}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-10px !important"}}>
			<DefaultLineChartWrapper
				data={group_lti_firstaid_nearmiss}
				color="black"
				percColor="info"
				desc="Total Lost Time Injuries, First Aid Injuries, Nearmisses & Workplace Violences"
				percLabel={percLabel}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-10px !important"}}>
			<ReportsLineChartWrapper
				data={fatality}
				color="dark"
				percColor="info"
				title="Total Fatalities"
				desc="Total Fatalities"
				percLabel={percLabel}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-10px !important"}}>
			<ReportsLineChartWrapper
				data={personsInjured}
				color="info"
				percColor="info"
				title="Total Persons Injured"
				desc="Total Persons Injured"
				percLabel={percLabel}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-10px!important"}}>
			<ReportsLineChartWrapper
				data={vehiclesInvolved}
				color="warning"
				percColor="warning"
				title="Total Vehicles Involved"
				desc="Total Vehicles Involved"
				percLabel={percLabel}
			/>
		</Grid>
		<Grid item sx={{padding: "0 !important", mb: "-20px !important"}}>
			<DefaultLineChartWrapper
				data={workplaceViolence}
				color="success"
				percColor="info"
				desc="Total Workplace Violences (Homicide, Physical Assault, Verbal Abuse, Intimidation, Threats, Cyberbullying, Sexual Harassment, Discrimination, Stalking)"
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
