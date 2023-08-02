//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import DefaultDoughnutChart from "containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
import VerticalBarChart from "../../../../../../containers/Charts/BarCharts/VerticalBarChart";
//</editor-fold>

//<editor-fold desc="VerticalBarChartWrapper">
function VerticalBarChartWrapper({background, color, tickColor, title, chart: _chart, displayLegend}) {
	const [chart, setChart] = useState(null);
	useEffect(() => {
		(async () => {
			if (_chart instanceof Promise) {
				_chart = await _chart;
			}
			setChart(_chart);
		})();
	}, [_chart]);

	if (chart === null) {
		return <CircularProgress size='1em'/>;
	}

	const {labels, datasets} = chart;

	return <VerticalBarChart
		title={title}
		height="250px"
		color={color}
		tickColor={tickColor}
		background={background}
		chart={{
			displayLegend,
			labels,
			datasets
		}}
	/>;
}

//</editor-fold>

//<editor-fold desc="DoughnutChart">
function DoughnutChart({sx, backgroundColors, title, labels, data: dataPromise}) {
	const [data, setData] = useState(null);
	useEffect(() => {
		(async () => {
			if (dataPromise instanceof Promise) {
				dataPromise = await dataPromise;
			}
			setData(dataPromise);
		})();
	}, [dataPromise]);

	if (data === null) {
		return <Card sx={{height: '245px'}}><CircularProgress/></Card>;
	}

	return <DefaultDoughnutChart
		title={title}
		width="calc(100% - 10px)"
		height="220px"
		sx={sx}
		chart={{
			labels,
			datasets: {
				label: title,
				backgroundColors,
				data
			},
			cutout: 60
		}}
	/>;
}

//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef(({data: __data}, ref) => {
	const [data, setData] = useState(__data || DATA_LOAD_STATUS.LOADING);

	// <editor-fold desc="useImperativeHandle funs">
	useImperativeHandle(ref, () => ({
		setData: (value) => {
			setData(value);
		},
	}));
	// </editor-fold>

	return null;

	if(data === DATA_LOAD_STATUS.LOADING) {
		return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
			<CircularProgress />
		</div>;
	}

	if(data === DATA_LOAD_STATUS.ERROR) {
		return null;
	}

	const [{
		acceptance_status_pending_ncr_list_aggregate,
		acceptance_status_approved_ncr_list_aggregate,
		acceptance_status_rejected_ncr_list_aggregate,
		acceptance_status_non_ncr_list_aggregate,
		//
		status_pending_ncr_list_aggregate,
		status_progressed_ncr_list_aggregate,
		status_completed_ncr_list_aggregate,
		status_non_ncr_list_aggregate,
		//
		status_open_ncr_list_aggregate,
		status_closed_ncr_list_aggregate,
		//
		due_date_passed_ncr_list_aggregate,
		due_date_notpassed_ncr_list_aggregate,
		due_date_non_ncr_list_aggregate,
		//
		result_passed_ncr_list_aggregate,
		result_failed_ncr_list_aggregate,
		result_non_ncr_list_aggregate,
		//
		type_corrective_action_ncr_list_aggregate,
		type_preventative_action_ncr_list_aggregate,
		type_opportunity_for_improver_ncr_list_aggregate,
		type_non_ncr_list_aggregate,
	}] = data;

	return <Grid
		container
		columns={1}
		spacing={6}
		className="grid-1 w-full grid-gap-10"
		sx={{m: 0, mt: '30px',}}
	>
		<Card sx={{background: "#fff", padding: "5px",}}>
			<>
				<Grid
					container
					columns={1}
					spacing={6}
					className="grid-3 w-full grid-gap-10"
					sx={{
						m: 0, p: '8px',
					}}
				>
					<DoughnutChart
						title="Acceptance Status"
						labels={['Pending', 'Approved', 'Rejected', 'Unclassified']}
						backgroundColors={['primary', 'warning', 'info', 'secondary']}
						sx={{
							backgroundColor: "#f5f5f5",
						}}
						data={[
							acceptance_status_pending_ncr_list_aggregate.aggregate.count,
							acceptance_status_approved_ncr_list_aggregate.aggregate.count,
							acceptance_status_rejected_ncr_list_aggregate.aggregate.count,
							acceptance_status_non_ncr_list_aggregate.aggregate.count,
						]}
					/>
					<DoughnutChart
						title="Progress Status"
						labels={['Pending', 'Progressed', 'Completed', 'Unclassified']}
						backgroundColors={['primary', 'warning', 'info', 'secondary']}
						sx={{
							backgroundColor: "#f5f5f5",
						}}
						data={[
							status_pending_ncr_list_aggregate.aggregate.count,
							status_progressed_ncr_list_aggregate.aggregate.count,
							status_completed_ncr_list_aggregate.aggregate.count,
							status_non_ncr_list_aggregate.aggregate.count,
						]}
					/>
					<DoughnutChart
						title="Open VS Closed Non-Conformances"
						labels={['Open Non-Conformances', 'Closed Non-Conformances']}
						backgroundColors={['primary', 'warning', 'info']}
						sx={{
							backgroundColor: "#f5f5f5",
						}}
						data={[
							status_open_ncr_list_aggregate.aggregate.count,
							status_closed_ncr_list_aggregate.aggregate.count,
						]}
					/>
				</Grid>
				<Grid
					container
					columns={1}
					spacing={6}
					className="grid-3 w-full grid-gap-10"
					sx={{
						m: 0, p: '8px',
					}}
				>
					<VerticalBarChartWrapper
						title=" "
						color="#fff"
						tickColor="#fff"
						background="#f5f5f5"
						displayLegend={false}
						chart={{
							labels: ['Due Dates'],
							datasets: [
								{
									label: 'Due Date Passed',
									color: 'success',
									data: [due_date_passed_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Within Due Date',
									color: 'primary',
									data: [due_date_notpassed_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Unclassified',
									color: 'secondary',
									data: [due_date_non_ncr_list_aggregate.aggregate.count]
								},
							],
						}}
					/>
					<VerticalBarChartWrapper
						title=" "
						color="#fff"
						tickColor="#fff"
						background="#f5f5f5"
						displayLegend={false}
						chart={{
							labels: ['Results'],
							datasets: [
								{
									label: 'Passed',
									color: 'success',
									data: [result_passed_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Failed',
									color: 'primary',
									data: [result_failed_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Unclassified',
									color: 'secondary',
									data: [result_non_ncr_list_aggregate.aggregate.count]
								},
							],
						}}
					/>
					<VerticalBarChartWrapper
						title=" "
						color="#fff"
						tickColor="#fff"
						background="#f5f5f5"
						displayLegend={false}
						chart={{
							labels: ['Non-Conformance Type'],
							datasets: [
								{
									label: 'Corrective Action',
									color: 'success',
									data: [type_corrective_action_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Preventative Action',
									color: 'warning',
									data: [type_preventative_action_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Opportunity For Improver',
									color: 'primary',
									data: [type_opportunity_for_improver_ncr_list_aggregate.aggregate.count]
								},
								{
									label: 'Unclassified',
									color: 'secondary',
									data: [type_non_ncr_list_aggregate.aggregate.count]
								},
							],
						}}
					/>
				</Grid>
			</>
		</Card>
	</Grid>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
