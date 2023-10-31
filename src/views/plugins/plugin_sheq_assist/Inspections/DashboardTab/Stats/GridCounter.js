//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import MDBox from "components/MD/MDBox";
import {all_question_list} from "components/questionnaires/AResponseUtils";
//</editor-fold>

//<editor-fold desc="Counter">
function Counter({background, title, count, label, color, sx}) {
	return <DefaultCounterCard
		color={color || "light"}
		background={background}
		count={count}
		label={label}
		radius="50%"
		title={title}
		sx={{
			width: '180px',
			height: '180px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 0,
			margin: 0,
			...(sx || {}),
		}}
	/>;
}

//</editor-fold>

//<editor-fold desc="GridCounter">
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

	const [item = {}] = data;

	const defaults = {aggregate: {count: 0}};
	const {
		all_template_list_aggregate = defaults,
		all_questionnaire_list_aggregate = defaults,
		all_asset_list_aggregate = defaults,
		all_non_compliant_questionnaire_list_aggregate = defaults,
		//
		active_questionnaire_list_aggregate = defaults,
		completed_questionnaire_list_aggregate = defaults,
		completion_requests_questionnaire_list_aggregate = defaults,
		declined_requests_questionnaire_list_aggregate = defaults,
		//
		inspections_compliance,
	} = item;

	const {min, avg, max,} = inspections_compliance || {};

	const chartCompliance = {
		labels: ['Lowest Compliance', 'Average Compliance', 'Highest Compliance'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [min, avg, max,],
		}],
	};

	const chart = {
		labels: ['Active Inspections', 'Completed Inspections', 'Completion Requests', 'Declined Requests'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				active_questionnaire_list_aggregate.aggregate.count,
				completed_questionnaire_list_aggregate.aggregate.count,
				completion_requests_questionnaire_list_aggregate.aggregate.count,
				declined_requests_questionnaire_list_aggregate.aggregate.count,
			],
		}],
	};

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-4 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '10px !important', mb: '15px !important', justifyItems: 'center',}}
		>
			<Counter background="#933333" title={<b className="color-white font-size-14">Total<br/>Templates</b>}
			         count={all_template_list_aggregate.aggregate.count}/>
			<Counter background="#2a5d1e" title={<b className="color-white font-size-14">Total<br/>Inspections</b>}
			         count={all_questionnaire_list_aggregate.aggregate.count}/>
			<Counter background="#978a77"
			         title={<b className="color-white font-size-14">Non-Compliant<br/>Inspections</b>}
			         count={all_non_compliant_questionnaire_list_aggregate.aggregate.count}/>
			<Counter background="#FFA726"
			         title={<b className="color-white font-size-14">Total Assets<br/>With Inspections</b>}
			         count={all_asset_list_aggregate.aggregate.count}/>
		</Grid>
		<MDBox
			className="w-full grid-gap-10"
			sx={{
				m: '0 !important', mb: '5px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
			}}
		>
			<VerticalBarChart
				height="232px"
				title="Inspections Compliance"
				color="#fff"
				tickColor="white"
				background="#534f55"
				chart={chartCompliance}
			/>
		</MDBox>
		<MDBox
			className="w-full grid-gap-10"
			sx={{
				m: '0 !important', mb: '-10px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
			}}
		>
			<VerticalBarChart
				height="232px"
				title="Inspections Statuses"
				color="#fff"
				tickColor="white"
				background="#344767"
				chart={chart}
			/>
		</MDBox>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

