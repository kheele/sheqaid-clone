//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import {CircularProgress} from "@mui/material";
import MDBox from "../../../../../../components/MD/MDBox";
import VerticalBarChart from "../../../../../../containers/Charts/BarCharts/VerticalBarChart";
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

	if(data === DATA_LOAD_STATUS.LOADING) {
		return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
			<CircularProgress />
		</div>;
	}

	if(data === DATA_LOAD_STATUS.ERROR) {
		return null;
	}

	const [item = {}] = data;

	const defaults = {aggregate: {count: 0}};

	const {
		all_asset_list_aggregate = defaults,
		removed_asset_list_aggregate = defaults,
		maintenance_plan_cost_aggregate = {nodes: []},
		//
		condition_new_aggregate = defaults,
		condition_good_aggregate = defaults,
		condition_fair_aggregate = defaults,
		condition_poor_aggregate = defaults,
		condition_scrap_aggregate = defaults,
		condition_non_aggregate = defaults,
		//
		next_service_reason_for_service_due_date_list_aggregate = defaults,
		next_service_reason_for_service_mechanical_failure_list_aggregate = defaults,
		next_service_reason_for_service_wear_and_tear_list_aggregate = defaults,
		next_service_reason_for_service_non_list_aggregate = defaults,
		//
		next_service_non_list_aggregate = defaults,
		next_service_expired_list_aggregate = defaults,
		next_service_expired_25_list_aggregate = defaults,
		next_service_expired_50_list_aggregate = defaults,
		next_service_expired_75_list_aggregate = defaults,
		next_service_expired_100_list_aggregate = defaults,
		//
		next_calibration_date_non_list_aggregate = defaults,
		next_calibration_expired_list_aggregate = defaults,
		next_calibration_mon_expiry_list_aggregate = defaults,
		next_calibration_2mon_expiry_list_aggregate = defaults,
		next_calibration_3mon_expiry_list_aggregate = defaults,
		next_calibration_4mon_expiry_list_aggregate = defaults,
		//
		doc_non_expiry_list_aggregate = defaults,
		doc_expired_list_aggregate = defaults,
		doc_mon_expiry_list_aggregate = defaults,
		doc_2mon_expiry_list_aggregate = defaults,
		doc_3mon_expiry_list_aggregate = defaults,
		doc_4mon_expiry_list_aggregate = defaults,
		//
	} = item;

	console.log('data', data)

	const chartCondition = {
		labels: ['New Condition', 'Good Condition', 'Fair Condition', 'Poor Condition', 'Scrap Condition', 'Unclassified Condition'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				condition_new_aggregate.aggregate.count,
				condition_good_aggregate.aggregate.count,
				condition_fair_aggregate.aggregate.count,
				condition_poor_aggregate.aggregate.count,
				condition_scrap_aggregate.aggregate.count,
				condition_non_aggregate.aggregate.count,
			],
		}],
	};

	const chartNextServiceReason = {
		labels: ['Due Date', 'Mechanical Failure', 'Wear & Tear', 'Unclassified'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				next_service_reason_for_service_due_date_list_aggregate.aggregate.count,
				next_service_reason_for_service_mechanical_failure_list_aggregate.aggregate.count,
				next_service_reason_for_service_wear_and_tear_list_aggregate.aggregate.count,
				next_service_reason_for_service_non_list_aggregate.aggregate.count,
			],
		}],
	};

	const chartNextServiceDate = {
		labels: ['Expired', '25% Expired', '50% Expired', '75% Expired', '100% Expired', 'Unclassified'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				next_service_expired_list_aggregate.aggregate.count,
				next_service_expired_25_list_aggregate.aggregate.count,
				next_service_expired_50_list_aggregate.aggregate.count,
				next_service_expired_75_list_aggregate.aggregate.count,
				next_service_expired_100_list_aggregate.aggregate.count,
				next_service_non_list_aggregate.aggregate.count,
			],
		}],
	};

	const chartNextCalibrationDate = {
		labels: ['Expired', '1 Month', '2 Months', '3 Months', '4 Months', 'Unclassified'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				next_calibration_expired_list_aggregate.aggregate.count,
				next_calibration_mon_expiry_list_aggregate.aggregate.count,
				next_calibration_2mon_expiry_list_aggregate.aggregate.count,
				next_calibration_3mon_expiry_list_aggregate.aggregate.count,
				next_calibration_4mon_expiry_list_aggregate.aggregate.count,
				next_calibration_date_non_list_aggregate.aggregate.count,
			],
		}],
	};

	const chartDocumentExpiry = {
		labels: ['Expired', '1 Month', '2 Months', '3 Months', '4 Months', 'Unclassified'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				doc_expired_list_aggregate.aggregate.count,
				doc_mon_expiry_list_aggregate.aggregate.count,
				doc_2mon_expiry_list_aggregate.aggregate.count,
				doc_3mon_expiry_list_aggregate.aggregate.count,
				doc_4mon_expiry_list_aggregate.aggregate.count,
				doc_non_expiry_list_aggregate.aggregate.count,
			],
		}],
	};

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-3 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '10px !important', mb: '15px !important', justifyItems: 'center',}}
		>
			<Counter background="#933333" title={<b className="color-white font-size-14">Total Assets</b>}
			         count={all_asset_list_aggregate.aggregate.count}/>
			<Counter background="#2a5d1e" title={<b className="color-white font-size-14">Assets Written-Off</b>}
			         count={removed_asset_list_aggregate.aggregate.count}/>
			<Counter background="#2a5d1e" title={<b className="color-white font-size-14">Maintenance Cost</b>}
			         count={maintenance_plan_cost_aggregate.nodes.map(({maintenance_plan_cost}) => maintenance_plan_cost).reduce((a1, a2) => a1 + a2, 0)}/>
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
				height="166px"
				title="Asset Condition"
				color="#fff"
				tickColor="white"
				background="#07616b"
				chart={chartCondition}
			/>
		</MDBox>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-2 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '-10px !important', mb: '0px !important', justifyItems: 'center',}}
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
					height="166px"
					title="Next Service Date"
					color="#fff"
					tickColor="white"
					background="#344767"
					chart={chartNextServiceDate}
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
					height="166px"
					title="Next Calibration Date"
					color="#fff"
					tickColor="white"
					background="#344767"
					chart={chartNextCalibrationDate}
				/>
			</MDBox>
		</Grid>
		<MDBox
			className="w-full grid-gap-10"
			sx={{
				m: '0 !important', p: '0 !important', justifyItems: 'center', background: "#fff", borderRadius: "20%",
			}}
		>
			<VerticalBarChart
				height="250px"
				title="Reason For Next Service"
				color="#fff"
				tickColor="white"
				background="#344767"
				displayLegend={true}
				chart={chartNextServiceReason}
			/>
		</MDBox>
		<MDBox
			className="w-full grid-gap-10"
			sx={{
				m: '25px 0 0 !important', p: '0 !important', justifyItems: 'center', background: "#fff", borderRadius: "20%",
			}}
		>
			<VerticalBarChart
				height="250px"
				title="Document Expiry"
				color="#fff"
				tickColor="white"
				background="#344767"
				displayLegend={true}
				chart={chartDocumentExpiry}
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

