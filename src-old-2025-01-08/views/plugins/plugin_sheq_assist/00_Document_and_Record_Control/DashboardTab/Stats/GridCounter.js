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

	const defaults = {aggregate: {count: 0}};

	const {
		active_document_list_aggregate = defaults,
		removed_document_list_aggregate = defaults,
		all_project_plan_list_aggregate = defaults,
		all_ims_policy_list_aggregate = defaults,
		all_other_list_aggregate = defaults,
		shared_list_aggregate = defaults,
		doc_type_unclassified_incident_list_aggregate = defaults,
		//
		list_no_expiry_aggregate = defaults,
		list_expired_aggregate = defaults,
		list_mon_expiry_aggregate = defaults,
		list_2mon_expiry_aggregate = defaults,
		list_3mon_expiry_aggregate = defaults,
		list_4mon_expiry_aggregate = defaults,
	} = data;

	const chart = {
		labels: ['No Expiry', 'Expired', '1 Month Expiry', '2 Month Expiry', '3 Month Expiry', '+4 Month Expiry'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				list_no_expiry_aggregate.aggregate.count,
				list_expired_aggregate.aggregate.count,
				list_mon_expiry_aggregate.aggregate.count,
				list_2mon_expiry_aggregate.aggregate.count,
				list_3mon_expiry_aggregate.aggregate.count,
				list_4mon_expiry_aggregate.aggregate.count,
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
			<Counter background="#933333" title={<b className="color-white font-size-14">Total<br/>Documents</b>}
			         count={active_document_list_aggregate.aggregate.count}/>
			<Counter background="#2a5d1e" title={<b className="color-white font-size-14">Removed<br/>Documents</b>}
			         count={removed_document_list_aggregate.aggregate.count}/>
			<Counter background="#FFA726"
			         title={<b className="color-white font-size-14">Shared<br/>Documents</b>}
			         count={shared_list_aggregate.aggregate.count}/>
			<Counter background="#978a77"
			         title={<b className="color-white font-size-14">Expired<br/>Documents</b>}
			         count={list_expired_aggregate.aggregate.count}/>

			<Counter background="#755a5a" title={<b className="color-white font-size-14">Project Plans</b>}
			         count={all_project_plan_list_aggregate.aggregate.count}/>
			<Counter background="#438b93" title={<b className="color-white font-size-14">IMS Policies</b>}
			         count={all_ims_policy_list_aggregate.aggregate.count}/>
			<Counter background="#8858a5" title={<b className="color-white font-size-14">Other<br/>Documents</b>}
			         count={all_other_list_aggregate.aggregate.count}/>
			<Counter background="#4c6f89" title={<b className="color-white font-size-14">Unclassified<br/>Documents</b>}
			         count={doc_type_unclassified_incident_list_aggregate.aggregate.count}/>
		</Grid>
		<MDBox
			className="w-full grid-gap-10"
			sx={{
				m: '0 !important', mb: '10px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
			}}
		>
			<VerticalBarChart
				height="398px"
				title="Document Expiry"
				color="#fff"
				tickColor="white"
				background="#344767"
				displayLegend={true}
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
