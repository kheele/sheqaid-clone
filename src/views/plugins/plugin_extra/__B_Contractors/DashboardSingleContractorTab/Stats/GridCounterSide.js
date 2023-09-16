//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import DefaultDoughnutChart from "containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import MKBox from "components/MK/MKBox";
import {CircularProgress} from "@mui/material";
import {getDashboardCounter} from "utils/UtilsFuns";
//</editor-fold>

//<editor-fold desc="Counter">
function Counter({background, title, count, value, label, color, sx}) {
	return <DefaultCounterCard
		color={color || "light"}
		background={background}
		count={count}
		value={value}
		label={label}
		radius="50%"
		fontSize="1.3em !important"
		title={title}
		sx={{
			width: '60px',
			height: '60px',
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
		list_no_expiry_questionnaire_list_aggregate = defaults,
		list_mon_expiry_questionnaire_list_aggregate = defaults,
		list_2mon_expiry_questionnaire_list_aggregate = defaults,
		list_3mon_expiry_questionnaire_list_aggregate = defaults,
		list_4mon_expiry_questionnaire_list_aggregate = defaults,
		all_expired_questionnaire_list_aggregate = defaults,
	} = item;

	const total = list_no_expiry_questionnaire_list_aggregate.aggregate.count +
		list_mon_expiry_questionnaire_list_aggregate.aggregate.count +
		list_2mon_expiry_questionnaire_list_aggregate.aggregate.count +
		list_3mon_expiry_questionnaire_list_aggregate.aggregate.count +
		list_4mon_expiry_questionnaire_list_aggregate.aggregate.count +
		all_expired_questionnaire_list_aggregate.aggregate.count;
	
	const calc = (list_aggregate, total) => {
		if(total === 0) return 0;
		return ((list_aggregate.aggregate.count / total) * 100);
	}

	const list_no_expiry_questionnaire_list_aggregate_perc = calc(list_no_expiry_questionnaire_list_aggregate, total).toFixed(1);
	const list_mon_expiry_questionnaire_list_aggregate_perc = calc(list_mon_expiry_questionnaire_list_aggregate, total).toFixed(1);
	const list_2mon_expiry_questionnaire_list_aggregate_perc = calc(list_2mon_expiry_questionnaire_list_aggregate, total).toFixed(1);
	const list_3mon_expiry_questionnaire_list_aggregate_perc = calc(list_3mon_expiry_questionnaire_list_aggregate, total).toFixed(1);
	const list_4mon_expiry_questionnaire_list_aggregate_perc = calc(list_4mon_expiry_questionnaire_list_aggregate, total).toFixed(1);
	const all_expired_questionnaire_list_aggregate_perc = calc(all_expired_questionnaire_list_aggregate, total).toFixed(1);

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-1 w-full grid-gap-10 padding-15"
			sx={{m: '0 !important', mt: '10px !important', justifyItems: 'center',}}
		>
			<DefaultDoughnutChart
				title="Question Expiry"
				width="calc(100% - 10px)"
				height="260px"
				chart={{
					labels: ['No Expiry', 'Expired', '1 Month Expiry', '2 Months Expiry', '3 Months Expiry', '4 Months Expiry'],
					datasets: {
						label: "Document Categories",
						backgroundColors: ['secondary', 'success', 'warning', 'primary', 'info', 'error', 'dark'],
						data: [
							getDashboardCounter(list_no_expiry_questionnaire_list_aggregate),
							getDashboardCounter(all_expired_questionnaire_list_aggregate),
							getDashboardCounter(list_mon_expiry_questionnaire_list_aggregate),
							getDashboardCounter(list_2mon_expiry_questionnaire_list_aggregate),
							getDashboardCounter(list_3mon_expiry_questionnaire_list_aggregate),
							getDashboardCounter(list_4mon_expiry_questionnaire_list_aggregate),
						],
					},
					cutout: 60
				}}
			/>
			<Divider sx={{m: '0.2rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					No Expiry
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_no_expiry_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_no_expiry_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.2rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					4 Months Expiry
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(all_expired_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(all_expired_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.2rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Expired
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_mon_expiry_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_mon_expiry_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.2rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					1 Month Expiry
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_2mon_expiry_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_2mon_expiry_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.2rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					2 Months Expiry
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_3mon_expiry_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_3mon_expiry_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.2rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					3 Months Expiry
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_4mon_expiry_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_4mon_expiry_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.2rem 0'}}/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

