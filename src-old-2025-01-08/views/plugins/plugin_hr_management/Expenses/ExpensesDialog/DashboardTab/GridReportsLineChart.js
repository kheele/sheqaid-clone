//<editor-fold desc="imports">
import * as React from "react";
import style from "assets/styles/home.module.css";
import Grid from "@mui/material/Grid";
import ComplexStatisticsCard from "containers/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "containers/Charts/LineCharts/ReportsLineChart";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
import {getRandomRolor} from "utils/UtilsFuns";
import MKBox from "components/MK/MKBox";
//</editor-fold>

//<editor-fold desc="ReportsLineChartWrapper">
function ReportsLineChartWrapper({desc, data: _data, color}) {
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

	const {chart} = data;

	return <MKBox mb={3} sx={{height: '100%'}}>
		<ReportsLineChart
			height="100%"
			color={color}
			description={desc}
			chart={chart}
		/>
	</MKBox>;
}

//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef((
	{
		onViewDialog,
		data,//[{id, month_year: date.formatMonthYear(), count}]
	}, ref) => {

	console.log('data', data)

	data = {
		chart: {
			labels: data.map(({month_year}) => month_year),
			datasets: {
				label: 'Total',
				color: 'light',
				data: data.map(({count}) => count)
			},
		}
	};

	const background = getRandomRolor();

	return <Grid
		container
		columns={2}
		className="grid-1 grid-gap-10 GridReportsLineChart-Grid1 pos-relative"
		sx={{
			m: '0',
			width: 'calc(100% - 5px) !important',
			height: "calc(100% - 216px)",
			position: 'absolute',
			left: '5px',
			bottom: '-5px',
			right: '0px',
		}}
	>
		<Grid
			item
			sx={{
				padding: "0 !important",
				height: `100%`,
				position: 'absolute',
				left: '0',
				top: '0',
				right: '0',
				bottom: '0',
			}}
			className="GridReportsLineChart-Grid2"
		>
			<ReportsLineChartWrapper
				data={data}
				color="info"
				percColor="info"
				title=""
			/>
		</Grid>
	</Grid>;
});
//</editor-fold>

export default Comp;
