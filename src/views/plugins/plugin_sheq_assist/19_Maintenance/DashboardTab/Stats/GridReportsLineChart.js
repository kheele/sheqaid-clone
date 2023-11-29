//<editor-fold desc="imports">
import * as React from "react";
import style from "assets/styles/home.module.css";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import ComplexStatisticsCard from "containers/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import PropTypes from "prop-types";
import {CircularProgress} from "@mui/material";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import DefaultLineChart from "containers/Charts/LineCharts/DefaultLineChart";
//</editor-fold>

//<editor-fold desc="labels">
const labels = {
	Day: "yesterday",
	Week: "last week",
	Month: "last month",
	Quarter: "last 3 months",
	"Bi-Annual": "last 6 months",
	Annual: "last year",
};
//</editor-fold>

console.log('style', style);

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
			height={300}
		/>
	</MDBox>;
}

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
		height="300px"
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

//<editor-fold desc="Comp">
const Comp = forwardRef(({data: __data, interval: __interval}, ref) => {
	const [data, setData] = useState(__data || DATA_LOAD_STATUS.LOADING);
	const [interval, setInterval] = useState(__interval);

	return null;

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

	if (data === DATA_LOAD_STATUS.LOADING) {
		return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
			<CircularProgress/>
		</div>;
	}

	if (data === DATA_LOAD_STATUS.ERROR) {
		return null;
	}

	const [item = {}] = data;
	// _2022__doc_expiry_list_aggregate,

	const list = Object.keys(item).filter(key => key.startsWith('_') && key.contains('__')).map(key => {
		const parts = key.split('__');
		const year = parts[0].split('_')[1];
		const month = parts[0].split('_')[2];
		return {key: parts[1].split('_')[0], year, month, count: item[key].aggregate.count};
	});

	const list_all = list.filter(({key}) => key === 'doc');

	console.log('data', data)

	const totals = {
		lists: Promise.resolve({
			count: "+91",
			percAmount: "+4%",
			chart: {
				labels: list_all.map(({year, month}) => `${year}-${month}`),
				datasets: [
					{
						label: 'All',
						color: 'primary',
						data: list_all.map(({count}) => count)
					},
				],
			}
		}),
	};

	const {lists} = totals;

	const percLabel = `than ${labels[interval]}`;

	return <Grid
		container
		columns={2}
		spacing={6}
		className="grid-1 w-full grid-gap-10"
		sx={{
			m: '0 !important', mt: '0px !important',
		}}
	>
		<Grid item sx={{padding: "0 !important", mb: "-10px !important"}}>
			<DefaultLineChartWrapper
				data={lists}
				color="black"
				percColor="info"
				desc="Total Document Expiry"
				percLabel={percLabel}
			/>
		</Grid>
	</Grid>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
