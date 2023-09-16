//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import {CircularProgress} from "@mui/material";
import VerticalBarChart from "../../../../../../containers/Charts/BarCharts/VerticalBarChart";
import {getRandomRolor} from "../../../../../../utils/UtilsFuns";
import MDBox from "../../../../../../components/MD/MDBox";
import {all_question_list} from "../../../../../../components/questionnaires/AResponseUtils";
import {computed} from "mobx";
//</editor-fold>

//<editor-fold desc="Counter">
function Counter({
	                 placeTitleOnTop,
	                 background,
	                 title,
	                 count,
	                 value,
	                 radius = '50%',
	                 width = '180px',
	                 height = '180px',
	                 label,
	                 color,
	                 sx
                 }) {
	return <DefaultCounterCard
		placeTitleOnTop={placeTitleOnTop}
		color={color || "light"}
		background={background}
		count={count}
		value={value}
		label={label}
		radius={radius}
		title={title}
		sx={{
			width,
			height,
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
const calculateCompliance = async ({contractor, question_list}) => {
	question_list = all_question_list(question_list);

	const list = question_list.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);

	const score = list.map(({
		                        score,
		                        maxScore,
	                        }) => ((score && isNumber(score)) ? parseInt(score) : 0)).reduce((n1, n2) => n1 + n2, 0);
	const maxScore = list.map(({
		                           score,
		                           maxScore,
	                           }) => ((maxScore && isNumber(maxScore)) ? parseInt(maxScore) : 0)).reduce((n1, n2) => n1 + n2, 0);

	const perc = maxScore > 0 ? (score / maxScore) * 100 : 'N/A';
	console.log('calculateCompliance 2 - ', {score, maxScore, perc})
	return {contractor, perc};
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

	const complianceLowest = (completed_questionnaire_list) => {
		return Promise.all(completed_questionnaire_list.map(calculateCompliance)).then(list => {
			console.log('complianceLowest', list);
			list = list.filter(v => v.perc !== 'N/A').map(v => v.perc);
			return list.isEmpty() ? "N/A" : (Math.min(...list).toFixed(1) + "%");
		});
	}

	const complianceAverage = (completed_questionnaire_list) => {
		return Promise.all(completed_questionnaire_list.map(calculateCompliance)).then(list => {
			console.log('complianceAverage', list);
			list = list.filter(v => v.perc !== 'N/A').map(v => v.perc);
			return list.isEmpty() ? "N/A" : ((list.reduce((n1, n2) => n1 + n2, 0) / list.length).toFixed(1) + "%");
		});
	}

	const complianceHighest = (completed_questionnaire_list) => {
		return Promise.all(completed_questionnaire_list.map(calculateCompliance)).then(list => {
			console.log('complianceHighest', list);
			list = list.filter(v => v.perc !== 'N/A').map(v => v.perc);
			return list.isEmpty() ? "N/A" : (Math.max(...list).toFixed(1) + "%");
		});
	}

	const contractorsWithActiveQuestionnaires = (active_questionnaire_list) => {
		return active_questionnaire_list.map(({contractor_id}) => contractor_id).distinct().length;
	};

	const contractorsWithCompletionRequestsQuestionnaires = (completion_requests_questionnaire_list) => {
		return completion_requests_questionnaire_list.map(({contractor_id}) => contractor_id).distinct().length;
	};

	const contractorsWithDeclinedRequestsQuestionnaires = (declined_requests_questionnaire_list) => {
		return declined_requests_questionnaire_list.map(({contractor_id}) => contractor_id).distinct().length;
	};

	const contractorsWithCompletedQuestionnaires = (completed_questionnaire_list) => {
		return completed_questionnaire_list.map(({contractor_id}) => contractor_id).distinct().length;
	};

	const contractorWithHighestCompliance = (completed_questionnaire_list) => {
		const list = completed_questionnaire_list.map(calculateCompliance);
		console.log('contractorWithHighestCompliance', list);
		const maxPercList = list.filter(v => v.perc !== 'N/A').map(v => v.perc);
		const max = Math.max(...maxPercList);
		const contractorList = list.filter(v => v.perc === max).map(v => v.contractor.name);
		return contractorList.isEmpty() ? "N/A" : contractorList.join(', ');
	}

	const contractorWithLowestCompliance = (completed_questionnaire_list) => {
		const list = completed_questionnaire_list.map(calculateCompliance);
		console.log('contractorWithLowestCompliance', list);
		const minPercList = list.filter(v => v.perc !== 'N/A').map(v => v.perc);
		const min = Math.min(...minPercList);
		const contractorList = list.filter(v => v.perc === min).map(v => v.contractor.name);
		return contractorList.isEmpty() ? "N/A" : contractorList.join(', ');
	}

	const [item = {}] = data;

	const defaults = {aggregate: {count: 0}};

	const {
		all_contractor_list_aggregate = defaults,
		all_questionnaire_list_aggregate = defaults,
		all_documents_questionnaire_list_aggregate = defaults,
		all_expired_questionnaire_list_aggregate = defaults,
		//
		active_questionnaire_list_aggregate = defaults,
		completed_questionnaire_list_aggregate = defaults,
		completion_requests_questionnaire_list_aggregate = defaults,
		declined_requests_questionnaire_list_aggregate = defaults,
		//
		active_questionnaire_list = [],
		completed_questionnaire_list = [],
		completion_requests_questionnaire_list = [],
		declined_requests_questionnaire_list = [],
	} = item;

	const chart = {
		labels: ['Active Questionnaires', 'Completed Questionnaires', 'Completion Requests', 'Declined Requests'],
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

	const chartContractors = {
		labels: [
			'Contractors With Active Questionnaires',
			'Contractors With Completed Questionnaires',
			'Contractors With Completion Requests',
			'Contractors With Declined Requests'
		],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				contractorsWithActiveQuestionnaires(active_questionnaire_list),
				contractorsWithCompletedQuestionnaires(completed_questionnaire_list),
				contractorsWithCompletionRequestsQuestionnaires(completion_requests_questionnaire_list),
				contractorsWithDeclinedRequestsQuestionnaires(declined_requests_questionnaire_list),
			],
		}],
	};

	const chartCompliance = {
		labels: ['Lowest Compliance', 'Average Compliance', 'Highest Compliance'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				complianceLowest(completed_questionnaire_list),
				complianceAverage(completed_questionnaire_list),
				complianceHighest(completed_questionnaire_list),
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
			<Counter background="#933333" title={<b className="color-white font-size-14">Total<br/>Contractors</b>}
			         count={all_contractor_list_aggregate.aggregate.count}/>
			<Counter background="#2a5d1e" title={<b className="color-white font-size-14">Total<br/>Questionnaires</b>}
			         count={all_questionnaire_list_aggregate.aggregate.count}/>
			<Counter background="#978a77"
			         title={<b className="color-white font-size-14">Expired<br/>Questionnaires</b>}
			         count={all_expired_questionnaire_list_aggregate.aggregate.count}/>
			<Counter background="#FFA726"
			         title={<b className="color-white font-size-14">Total<br/>Documents</b>}
			         count={all_documents_questionnaire_list_aggregate.aggregate.count}/>
		</Grid>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-2 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '20px !important', mb: '15px !important', justifyItems: 'center',}}
		>
			<Counter placeTitleOnTop radius={'0.75rem'} width="100%" height="149.5px" background="#506b7b"
			         title={<b className="color-white font-size-14 pull-left -margin-t-20 margin-b-10">Contractors With<br/>Highest Compliance</b>}
			         value={<div className="font-size-14">{contractorWithHighestCompliance(completed_questionnaire_list)}</div>}/>
			<Counter placeTitleOnTop radius={'0.75rem'} width="100%" height="149.5px" background="#506b7b"
			         title={<b className="color-white font-size-14 pull-left -margin-t-20 margin-b-10">Contractors With<br/>Lowest Compliance</b>}
			         value={<div className="font-size-14">{contractorWithLowestCompliance(completed_questionnaire_list)}</div>}/>
		</Grid>
		<MDBox
			className="w-full grid-gap-10"
			sx={{
				m: '0 !important',
				mb: '15px !important',
				justifyItems: 'center',
				background: "#fff",
				padding: "10px 0",
				borderRadius: "20%",
			}}
		>
			<VerticalBarChart
				height="130px"
				title="Contractors by Questionnaire Statuses"
				color="#fff"
				tickColor="white"
				background="#07616b"
				chart={chartContractors}
			/>
		</MDBox>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-2 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '-10px !important', mb: '5px !important', justifyItems: 'center',}}
		>
			<MDBox
				className="w-full grid-gap-10"
				sx={{
					m: '0 !important',
					mb: '15px !important',
					justifyItems: 'center',
					background: "#fff",
					padding: "10px 0",
					borderRadius: "20%",
				}}
			>
				<VerticalBarChart
					height="130px"
					title="Questionnaires Compliance"
					color="#fff"
					tickColor="white"
					background="#344767"
					chart={chartCompliance}
				/>
			</MDBox>
			<MDBox
				className="w-full grid-gap-10"
				sx={{
					m: '0 !important',
					mb: '15px !important',
					justifyItems: 'center',
					background: "#fff",
					padding: "10px 0",
					borderRadius: "20%",
				}}
			>
				<VerticalBarChart
					height="130px"
					title="Questionnaire Statuses"
					color="#fff"
					tickColor="white"
					background="#344767"
					chart={chart}
				/>
			</MDBox>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

