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

//<editor-fold desc="calculateCompliance">
const calculateCompliance = async ({question_list}) => {
	question_list = all_question_list(question_list);

	const list = question_list.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);

	const score = list.map(({score, maxScore,}) => ((score && isNumber(score)) ? parseInt(score) : 0)).reduce((n1, n2) => n1 + n2, 0);
	const maxScore = list.map(({score, maxScore,}) => ((maxScore && isNumber(maxScore)) ? parseInt(maxScore) : 0)).reduce((n1, n2) => n1 + n2, 0);

	const perc = maxScore > 0 ? (score / maxScore) * 100 : 'N/A';
	console.log('calculateCompliance 2 - ', {score, maxScore, perc})
	return perc;
};
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

	const complianceLowest = (questionnaire_list) => {
		return Promise.all(questionnaire_list.map(calculateCompliance)).then(list => {
			console.log('complianceLowest', list);
			list = list.filter(v => v !== 'N/A');
			return list.isEmpty() ? "N/A" : (Math.min(...list).toFixed(1) + "%");
		});
	}

	const complianceAverage = (questionnaire_list) => {
		return Promise.all(questionnaire_list.map(calculateCompliance)).then(list => {
			console.log('complianceAverage', list);
			list = list.filter(v => v !== 'N/A');
			return list.isEmpty() ? "N/A" : ((list.reduce((n1, n2) => n1 + n2, 0) / list.length).toFixed(1) + "%");
		});
	}

	const complianceHighest = (questionnaire_list) => {
		return Promise.all(questionnaire_list.map(calculateCompliance)).then(list => {
			console.log('complianceHighest', list);
			list = list.filter(v => v !== 'N/A');
			return list.isEmpty() ? "N/A" : (Math.max(...list).toFixed(1) + "%");
		});
	}

	const [{
		all_template_list_aggregate,
		all_questionnaire_list_aggregate,
		all_asset_list_aggregate,
		all_non_compliant_questionnaire_list,
		//
		active_questionnaire_list_aggregate,
		completed_questionnaire_list_aggregate,
		completion_requests_questionnaire_list_aggregate,
		declined_requests_questionnaire_list_aggregate,
		//
		questionnaire_list,
	}] = data;

	const all_non_compliant_questionnaire_list_aggregate = {
		aggregate: {
			count: all_non_compliant_questionnaire_list.filter(({questionType}) => {
				return questionType === "Good,Fair,Poor,N/A" ||
					questionType === "Safe,At Risk,N/A" ||
					questionType === "Pass,Fail,N/A" ||
					questionType === "Yes,No,N/A" ||
					questionType === "Compliant,Non-Compliant,N/A";
			}).filter(({answer}) => {
				return answer === "Poor" ||
					answer === "At Risk" ||
					answer === "Fail" ||
					answer === "No" ||
					answer === "Non-Compliant";
			}).length,
		}
	};

	const chartCompliance = {
		labels: ['Lowest Compliance', 'Average Compliance', 'Highest Compliance'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				complianceLowest(questionnaire_list),
				complianceAverage(questionnaire_list),
				complianceHighest(questionnaire_list),
			],
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

