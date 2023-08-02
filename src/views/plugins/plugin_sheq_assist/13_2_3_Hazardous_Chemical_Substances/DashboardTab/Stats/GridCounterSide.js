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
const CompImpl = forwardRef(({title, type, data}, ref) => {
	const {
		[`risk_unclassified_${type}_list_aggregate`]: risk_unclassified_list_aggregate,
		[`risk_low_${type}_list_aggregate`]: risk_low_list_aggregate,
		[`risk_medium_${type}_list_aggregate`]: risk_medium_list_aggregate,
		[`risk_high_${type}_list_aggregate`]: risk_high_list_aggregate,
		[`risk_very_high_${type}_list_aggregate`]: risk_very_high_list_aggregate,
	} = data;

	const total = risk_unclassified_list_aggregate.aggregate.count +
		risk_low_list_aggregate.aggregate.count +
		risk_medium_list_aggregate.aggregate.count +
		risk_high_list_aggregate.aggregate.count +
		risk_very_high_list_aggregate.aggregate.count;

	const risk_unclassified_list_aggregate_perc = ((risk_unclassified_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_low_list_aggregate_perc = ((risk_low_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_medium_list_aggregate_perc = ((risk_medium_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_high_list_aggregate_perc = ((risk_high_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const risk_very_high_list_aggregate_perc = ((risk_very_high_list_aggregate.aggregate.count / total) * 100).toFixed(1);

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-1 w-full grid-gap-5 padding-15 padding-b-5"
			sx={{m: '0 !important', justifyItems: 'center',}}
		>
			<DefaultDoughnutChart
				title={`${title} Risk Rating`}
				width="calc(100% - 10px)"
				height="260px"
				chart={{
					labels: ['Unclassified', 'Low', 'Medium', 'High', 'Very High'],
					datasets: {
						label: "Risk Rating",
						backgroundColors: ['primary', 'secondary', 'warning', 'info', 'success'],
						data: [
							risk_unclassified_list_aggregate.aggregate.count,
							risk_low_list_aggregate.aggregate.count,
							risk_medium_list_aggregate.aggregate.count,
							risk_high_list_aggregate.aggregate.count,
							risk_very_high_list_aggregate.aggregate.count,
						],
					},
					cutout: 60
				}}
			/>
			<Divider sx={{m: '5px 0 -1px !important'}}/>
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
					         value={`${risk_unclassified_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_unclassified_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '-1px 0 !important'}}/>
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
					         value={`${risk_low_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_low_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '-1px 0 !important'}}/>
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
					         value={`${risk_medium_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_medium_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '-1px 0 !important'}}/>
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
					         value={`${risk_high_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_high_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '-1px 0 !important'}}/>
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
					         value={`${risk_very_high_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={risk_very_high_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '-1px 0 !important'}}/>
		</Grid>
	</>;
});

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

	const [item] = data;

	return <>
		<CompImpl
			title="Safety Data Sheet"
			type="sds"
			data={item}
		/>
		<CompImpl
			title="Hazchem Sheet"
			type="hazchem_sheet"
			data={item}
		/>
		<CompImpl
			title="Chemical Product"
			type="chemical_product"
			data={item}
		/>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

