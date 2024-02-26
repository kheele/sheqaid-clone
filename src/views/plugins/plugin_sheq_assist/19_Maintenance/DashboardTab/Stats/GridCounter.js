//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import {CircularProgress} from "@mui/material";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import DefaultLineChart from "containers/Charts/LineCharts/DefaultLineChart";
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
			height={337}
		/>
	</MDBox>;
}

//</editor-fold>

//<editor-fold desc="GridCounter">
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

	if(data === DATA_LOAD_STATUS.LOADING) {
		return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
			<CircularProgress />
		</div>;
	}

	if(data === DATA_LOAD_STATUS.ERROR) {
		return null;
	}

	const defaults = {aggregate: {count: 0}};

	const {
		all_asset_list_aggregate = defaults,
		removed_asset_list_aggregate = defaults,
		all_doc_list_aggregate = defaults,
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
		type_Bill_of_Sale_doc_list_aggregate = defaults,
		type_Brake_Test_Report_doc_list_aggregate = defaults,
		type_Certificate_of_Fitness_doc_list_aggregate = defaults,
		type_Clearance_Certificate_doc_list_aggregate = defaults,
		type_Inspection_Reports_doc_list_aggregate = defaults,
		type_Insurance_Certificate_doc_list_aggregate = defaults,
		type_Invoice_doc_list_aggregate = defaults,
		type_LUX_Test_Report_doc_list_aggregate = defaults,
		type_Maintenance_Records_doc_list_aggregate = defaults,
		type_Work_Manual_doc_list_aggregate = defaults,
		type_Work_Procedure_doc_list_aggregate = defaults,
		type_Owners_Manual_doc_list_aggregate = defaults,
		type_Vehicle_History_Report_doc_list_aggregate = defaults,
		type_Vehicle_License_doc_list_aggregate = defaults,
		type_Vehicle_Registration_Certificate_doc_list_aggregate = defaults,
		type_Vehicle_Title_doc_list_aggregate = defaults,
		//
		// doc_non_expiry_list_aggregate = defaults,
		// doc_expired_list_aggregate = defaults,
		// doc_mon_expiry_list_aggregate = defaults,
		// doc_2mon_expiry_list_aggregate = defaults,
		// doc_3mon_expiry_list_aggregate = defaults,
		// doc_4mon_expiry_list_aggregate = defaults,
	} = data;

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

	const chartDocType = {
		labels: [
			'Bill of Sale',
			'Brake Test Report',
			'Certificate of Fitness (COF)',
			'Clearance Certificate',
			'Inspection Reports',
			'Insurance Certificate',
			'Invoice',
			'LUX Test Report',
			'Maintenance Records',
			'Work Manual',
			'Work Procedure',
			'Owners Manual',
			'Vehicle History Report',
			'Vehicle License',
			'Vehicle Registration Certificate',
			'Vehicle Title',
		],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				type_Bill_of_Sale_doc_list_aggregate.aggregate.count,
				type_Brake_Test_Report_doc_list_aggregate.aggregate.count,
				type_Certificate_of_Fitness_doc_list_aggregate.aggregate.count,
				type_Clearance_Certificate_doc_list_aggregate.aggregate.count,
				type_Inspection_Reports_doc_list_aggregate.aggregate.count,
				type_Insurance_Certificate_doc_list_aggregate.aggregate.count,
				type_Invoice_doc_list_aggregate.aggregate.count,
				type_LUX_Test_Report_doc_list_aggregate.aggregate.count,
				type_Maintenance_Records_doc_list_aggregate.aggregate.count,
				type_Work_Manual_doc_list_aggregate.aggregate.count,
				type_Work_Procedure_doc_list_aggregate.aggregate.count,
				type_Owners_Manual_doc_list_aggregate.aggregate.count,
				type_Vehicle_History_Report_doc_list_aggregate.aggregate.count,
				type_Vehicle_License_doc_list_aggregate.aggregate.count,
				type_Vehicle_Registration_Certificate_doc_list_aggregate.aggregate.count,
				type_Vehicle_Title_doc_list_aggregate.aggregate.count,
			],
		}],
	};

	// const chartDocumentExpiry = {
	// 	labels: ['Expired', '1 Month', '2 Months', '3 Months', '4 Months', 'Unclassified'],
	// 	datasets: [{
	// 		label: 'Total',
	// 		color: 'white',
	// 		data: [
	// 			doc_expired_list_aggregate.aggregate.count,
	// 			doc_mon_expiry_list_aggregate.aggregate.count,
	// 			doc_2mon_expiry_list_aggregate.aggregate.count,
	// 			doc_3mon_expiry_list_aggregate.aggregate.count,
	// 			doc_4mon_expiry_list_aggregate.aggregate.count,
	// 			doc_non_expiry_list_aggregate.aggregate.count,
	// 		],
	// 	}],
	// };

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-4 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '10px !important', mb: '15px !important', justifyItems: 'center',}}
		>
			<Counter background="#75732c" title={<b className="color-white font-size-14">Total Assets</b>}
			         count={all_asset_list_aggregate.aggregate.count}/>
			<Counter background="#933333" title={<b className="color-white font-size-14">Assets Written-Off</b>}
			         count={removed_asset_list_aggregate.aggregate.count}/>
			<Counter background="#788389" title={<b className="color-white font-size-14">Total Assets Documents</b>}
			         count={all_doc_list_aggregate.aggregate.count}/>
			<Counter background="#3c763d" title={<b className="color-white font-size-14">Maintenance Cost</b>}
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
				height="215px"
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
					height="215px"
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
					height="215px"
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
				title="Assets Document Type"
				color="#fff"
				tickColor="white"
				background="#344767"
				displayLegend={true}
				chart={chartDocType}
			/>
		</MDBox>
		{/*<MDBox*/}
		{/*	className="w-full grid-gap-10"*/}
		{/*	sx={{*/}
		{/*		m: '25px 0 0 !important', p: '0 !important', justifyItems: 'center', background: "#fff", borderRadius: "20%",*/}
		{/*	}}*/}
		{/*>*/}
		{/*	<VerticalBarChart*/}
		{/*		height="250px"*/}
		{/*		title="Document Expiry"*/}
		{/*		color="#fff"*/}
		{/*		tickColor="white"*/}
		{/*		background="#344767"*/}
		{/*		displayLegend={true}*/}
		{/*		chart={chartDocumentExpiry}*/}
		{/*	/>*/}
		{/*</MDBox>*/}
		{/*<Grid item sx={{padding: "0 !important", mt: '25px !important', mb: "-20px !important"}}>*/}
		{/*	<DefaultLineChartWrapper*/}
		{/*		data={chartDocumentExpiryByDateRange}*/}
		{/*		color="black"*/}
		{/*		percColor="info"*/}
		{/*		desc="Assets Documents Expiry by Time"*/}
		{/*		percLabel={percLabel}*/}
		{/*	/>*/}
		{/*</Grid>*/}
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
