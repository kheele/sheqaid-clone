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

	const defaults = {aggregate: {count: 0}};
	const {
		list_interval_unclassified_questionnaire_list_aggregate = defaults,
		list_interval_daily_questionnaire_list_aggregate = defaults,
		list_interval_weekly_questionnaire_list_aggregate = defaults,
		list_interval_monthly_questionnaire_list_aggregate = defaults,
		list_interval_quarterly_questionnaire_list_aggregate = defaults,
		list_interval_biannually_questionnaire_list_aggregate = defaults,
		list_interval_annually_questionnaire_list_aggregate = defaults,
	} = data;

	const total = list_interval_unclassified_questionnaire_list_aggregate.aggregate.count +
		list_interval_daily_questionnaire_list_aggregate.aggregate.count +
		list_interval_weekly_questionnaire_list_aggregate.aggregate.count +
		list_interval_monthly_questionnaire_list_aggregate.aggregate.count +
		list_interval_quarterly_questionnaire_list_aggregate.aggregate.count +
		list_interval_biannually_questionnaire_list_aggregate.aggregate.count +
		list_interval_annually_questionnaire_list_aggregate.aggregate.count;

	const calc = (list_aggregate, total) => {
		if(total === 0) return 0;
		return ((list_aggregate.aggregate.count / total) * 100);
	}

	const list_interval_unclassified_questionnaire_list_aggregate_perc = calc(list_interval_unclassified_questionnaire_list_aggregate, total).toFixed(1);
	const list_interval_daily_questionnaire_list_aggregate_perc = calc(list_interval_daily_questionnaire_list_aggregate, total).toFixed(1);
	const list_interval_weekly_questionnaire_list_aggregate_perc = calc(list_interval_weekly_questionnaire_list_aggregate, total).toFixed(1);
	const list_interval_monthly_questionnaire_list_aggregate_perc = calc(list_interval_monthly_questionnaire_list_aggregate, total).toFixed(1);
	const list_interval_quarterly_questionnaire_list_aggregate_perc = calc(list_interval_quarterly_questionnaire_list_aggregate, total).toFixed(1);
	const list_interval_biannually_questionnaire_list_aggregate_perc = calc(list_interval_biannually_questionnaire_list_aggregate, total).toFixed(1);
	const list_interval_annually_questionnaire_list_aggregate_perc = calc(list_interval_annually_questionnaire_list_aggregate, total).toFixed(1);

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
				title="Inspections Interval"
				width="calc(100% - 10px)"
				height="260px"
				chart={{
					labels: ['Unclassified', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually'],
					datasets: {
						label: "Interval",
						backgroundColors: ['secondary', 'success', 'warning', 'primary', 'info', 'error', 'dark'],
						data: [
							getDashboardCounter(list_interval_unclassified_questionnaire_list_aggregate),
							getDashboardCounter(list_interval_daily_questionnaire_list_aggregate),
							getDashboardCounter(list_interval_annually_questionnaire_list_aggregate),
							getDashboardCounter(list_interval_weekly_questionnaire_list_aggregate),
							getDashboardCounter(list_interval_monthly_questionnaire_list_aggregate),
							getDashboardCounter(list_interval_quarterly_questionnaire_list_aggregate),
							getDashboardCounter(list_interval_biannually_questionnaire_list_aggregate),
						],
					},
					cutout: 60
				}}
			/>
			<Divider sx={{m: '0rem 0'}}/>
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
					Unclassified
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_unclassified_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_unclassified_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
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
					Daily
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_daily_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_daily_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
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
					Weekly
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_weekly_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_weekly_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
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
					Monthly
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_monthly_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_monthly_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
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
					Quarterly
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_quarterly_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_quarterly_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
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
					Bi-Annually
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_biannually_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_biannually_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
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
					Annually
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${getDashboardCounter(list_interval_annually_questionnaire_list_aggregate_perc)}%`}/>
					<Counter background="#66BB6A"
					         count={getDashboardCounter(list_interval_annually_questionnaire_list_aggregate)}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0rem 0'}}/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

