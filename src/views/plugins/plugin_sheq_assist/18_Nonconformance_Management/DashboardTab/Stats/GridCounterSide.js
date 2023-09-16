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
		priority_non_ncr_list_aggregate = defaults,
		priority_low_ncr_list_aggregate = defaults,
		priority_medium_ncr_list_aggregate = defaults,
		priority_high_ncr_list_aggregate = defaults,
		priority_critical_ncr_list_aggregate = defaults,
	} = item;

	const total = priority_non_ncr_list_aggregate.aggregate.count +
		priority_low_ncr_list_aggregate.aggregate.count +
		priority_medium_ncr_list_aggregate.aggregate.count +
		priority_high_ncr_list_aggregate.aggregate.count +
		priority_critical_ncr_list_aggregate.aggregate.count;

	const priority_non_ncr_list_aggregate_perc = ((priority_non_ncr_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const priority_low_ncr_list_aggregate_perc = ((priority_low_ncr_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const priority_medium_ncr_list_aggregate_perc = ((priority_medium_ncr_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const priority_high_ncr_list_aggregate_perc = ((priority_high_ncr_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const priority_critical_ncr_list_aggregate_perc = ((priority_critical_ncr_list_aggregate.aggregate.count / total) * 100).toFixed(1);

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
				title="Priority"
				width="calc(100% - 10px)"
				height="260px"
				chart={{
					labels: ['Unclassified', 'Low', 'Medium', 'High', 'Critical'],
					datasets: {
						label: "Risk Rating",
						backgroundColors: ['secondary', 'success', 'warning', 'primary', 'error'],
						data: [
							getDashboardCounter(priority_non_ncr_list_aggregate),
							getDashboardCounter(priority_low_ncr_list_aggregate),
							getDashboardCounter(priority_medium_ncr_list_aggregate),
							getDashboardCounter(priority_high_ncr_list_aggregate),
							getDashboardCounter(priority_critical_ncr_list_aggregate),
						],
					},
					cutout: 60
				}}
			/>
			<Divider sx={{m: '0.91rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-20 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Unclassified Priority
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(priority_non_ncr_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(priority_non_ncr_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.91rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-20 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Low Priority
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(priority_low_ncr_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(priority_low_ncr_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.91rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-20 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Medium Priority
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(priority_medium_ncr_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(priority_medium_ncr_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.91rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-20 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					High Priority
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(priority_high_ncr_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(priority_high_ncr_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.91rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-20 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Critical Priority
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(priority_critical_ncr_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(priority_critical_ncr_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.91rem 0'}}/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

