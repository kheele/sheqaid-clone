//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import DefaultDoughnutChart from "../../../../../../containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import MKBox from "../../../../../../components/MK/MKBox";
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
const Comp = forwardRef(({interval: __interval, employee_view: __employee_view, data}, ref) => {
	const [interval, setInterval] = useState(__interval);
	const [employee_view, setEmployeeView] = useState(__employee_view);

	// <editor-fold desc="useImperativeHandle funs">
	useImperativeHandle(ref, () => ({
		setInterval: (value) => {
			setInterval(value);
		},
		setEmployeeView: (value) => {
			setEmployeeView(value);
		},
	}));
	// </editor-fold>

	if (!data) return null;

	const [{
		risk_rating_non_incident_list_aggregate,
		risk_rating_low_incident_list_aggregate,
		risk_rating_medium_incident_list_aggregate,
		risk_rating_high_incident_list_aggregate,
		risk_rating_extreme_incident_list_aggregate,
	}] = data;

	const total = risk_rating_non_incident_list_aggregate.aggregate.count +
		risk_rating_low_incident_list_aggregate.aggregate.count +
		risk_rating_medium_incident_list_aggregate.aggregate.count +
		risk_rating_high_incident_list_aggregate.aggregate.count +
		risk_rating_extreme_incident_list_aggregate.aggregate.count;

	const risk_rating_non_incident_list_aggregate_perc = ((risk_rating_non_incident_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_rating_low_incident_list_aggregate_perc = ((risk_rating_low_incident_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_rating_medium_incident_list_aggregate_perc = ((risk_rating_medium_incident_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_rating_high_incident_list_aggregate_perc = ((risk_rating_high_incident_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_rating_extreme_incident_list_aggregate_perc = ((risk_rating_extreme_incident_list_aggregate.aggregate.count / total) * 100).toFixed(1);

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-1 w-full grid-gap-10 padding-15"
			sx={{m: 0, mt: '10px', justifyItems: 'center',}}
		>
			<DefaultDoughnutChart
				title="Risk Rating"
				width="calc(100% - 10px)"
				height="260px"
				chart={{
					labels: ['Unclassified', 'Low', 'Medium', 'High', 'Very High'],
					datasets: {
						label: "Risk Rating",
						backgroundColors: ['primary', 'secondary', 'warning', 'info', 'info'],
						data: [
							risk_rating_non_incident_list_aggregate.aggregate.count,
							risk_rating_low_incident_list_aggregate.aggregate.count,
							risk_rating_medium_incident_list_aggregate.aggregate.count,
							risk_rating_high_incident_list_aggregate.aggregate.count,
							risk_rating_extreme_incident_list_aggregate.aggregate.count,
						],
					},
					cutout: 60
				}}
			/>
			<Divider/>
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
					Unclassified Risks
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${risk_rating_non_incident_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_rating_non_incident_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider/>
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
					Low Risks
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${risk_rating_low_incident_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_rating_low_incident_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider/>
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
					Medium Risks
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${risk_rating_medium_incident_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_rating_medium_incident_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider/>
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
					High Risks
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${risk_rating_high_incident_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_rating_high_incident_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider/>
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
					Very High Risks
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${risk_rating_extreme_incident_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_rating_extreme_incident_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

