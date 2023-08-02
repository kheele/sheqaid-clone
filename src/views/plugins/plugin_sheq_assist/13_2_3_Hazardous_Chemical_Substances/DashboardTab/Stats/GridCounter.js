//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import {CircularProgress} from "@mui/material";
import MDBox from "../../../../../../components/MD/MDBox";
import VerticalBarChart from "../../../../../../containers/Charts/BarCharts/VerticalBarChart";
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

	if (data === DATA_LOAD_STATUS.LOADING) {
		return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
			<CircularProgress/>
		</div>;
	}

	if (data === DATA_LOAD_STATUS.ERROR) {
		return null;
	}

	const [{
		all_chemical_sds_list_aggregate,
		all_hazchem_sheet_list_aggregate,
		all_chemical_product_list_aggregate,
		//
		physical_state_unclassified_sds_list_aggregate,
		physical_state_gas_sds_list_aggregate,
		physical_state_liquid_sds_list_aggregate,
		physical_state_solid_sds_list_aggregate,
		physical_state_liquid_crystal_sds_list_aggregate,
		//
		physical_state_unclassified_hazchem_sheet_list_aggregate,
		physical_state_gas_hazchem_sheet_list_aggregate,
		physical_state_liquid_hazchem_sheet_list_aggregate,
		physical_state_solid_hazchem_sheet_list_aggregate,
		physical_state_liquid_crystal_hazchem_sheet_list_aggregate,
		//
		physical_state_unclassified_chemical_product_list_aggregate,
		physical_state_gas_chemical_product_list_aggregate,
		physical_state_liquid_chemical_product_list_aggregate,
		physical_state_solid_chemical_product_list_aggregate,
		physical_state_liquid_crystal_chemical_product_list_aggregate,
		//
		person_injured_incident_list_aggregate,
		non_person_injured_incident_list_aggregate,
		//
		vehicle_incident_list_aggregate,
		non_vehicle_incident_list_aggregate,
		//
		status_closed_incident_list_aggregate,
		status_open_incident_list_aggregate,
		//
		time_shift_day_incident_list_aggregate,
		time_shift_night_incident_list_aggregate,
		time_shift_non_incident_list_aggregate,
	}] = data;

	const chartSDS = {
		labels: ['Unclassified', 'Gas', 'Liquid', 'Solid', 'Liquid Crystal'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				physical_state_unclassified_sds_list_aggregate.aggregate.count,
				physical_state_gas_sds_list_aggregate.aggregate.count,
				physical_state_liquid_sds_list_aggregate.aggregate.count,
				physical_state_solid_sds_list_aggregate.aggregate.count,
				physical_state_liquid_crystal_sds_list_aggregate.aggregate.count,
			],
		}],
	};

	const chartHazchemsheet = {
		labels: ['Unclassified', 'Gas', 'Liquid', 'Solid', 'Liquid Crystal'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				physical_state_unclassified_hazchem_sheet_list_aggregate.aggregate.count,
				physical_state_gas_hazchem_sheet_list_aggregate.aggregate.count,
				physical_state_liquid_hazchem_sheet_list_aggregate.aggregate.count,
				physical_state_solid_hazchem_sheet_list_aggregate.aggregate.count,
				physical_state_liquid_crystal_hazchem_sheet_list_aggregate.aggregate.count,
			],
		}],
	};

	const chartChemicalProduct = {
		labels: ['Unclassified', 'Gas', 'Liquid', 'Solid', 'Liquid Crystal'],
		datasets: [{
			label: 'Total',
			color: 'white',
			data: [
				physical_state_unclassified_chemical_product_list_aggregate.aggregate.count,
				physical_state_gas_chemical_product_list_aggregate.aggregate.count,
				physical_state_liquid_chemical_product_list_aggregate.aggregate.count,
				physical_state_solid_chemical_product_list_aggregate.aggregate.count,
				physical_state_liquid_crystal_chemical_product_list_aggregate.aggregate.count,
			],
		}],
	};

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-3 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '10px !important', justifyItems: 'center',}}
		>
			<Counter background="#66BB6A" title={<b className="color-white font-size-14">Total<br/>Safety Data Sheets</b>}
			         count={all_chemical_sds_list_aggregate.aggregate.count}/>
			<Counter background="#614c2d" title={<b className="color-white font-size-14">Total<br/>Hazchem Sheets</b>}
			         count={all_hazchem_sheet_list_aggregate.aggregate.count}/>
			<Counter background="#FFA726"
			         title={<b className="color-white font-size-14">Total<br/>Chemical Products</b>}
			         count={all_chemical_product_list_aggregate.aggregate.count}/>
		</Grid>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-3 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '10px !important', justifyItems: 'center',}}
		>
			<MDBox
				className="w-full grid-gap-10"
				sx={{
					m: '0 !important', mb: '15px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
				}}
			>
				<VerticalBarChart
					height="398px"
					title="Safety Data Sheet Physical State"
					color="#fff"
					tickColor="white"
					background="#344767"
					displayLegend={true}
					chart={chartSDS}
				/>
			</MDBox>
			<MDBox
				className="w-full grid-gap-10"
				sx={{
					m: '0 !important', mb: '15px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
				}}
			>
				<VerticalBarChart
					height="398px"
					title="Hazchem Sheet Physical State"
					color="#fff"
					tickColor="white"
					background="#344767"
					displayLegend={true}
					chart={chartHazchemsheet}
				/>
			</MDBox>
			<MDBox
				className="w-full grid-gap-10"
				sx={{
					m: '0 !important', mb: '15px !important', justifyItems: 'center', background: "#fff", padding: "10px 0", borderRadius: "20%",
				}}
			>
				<VerticalBarChart
					height="398px"
					title="Chemical Product Physical State"
					color="#fff"
					tickColor="white"
					background="#344767"
					displayLegend={true}
					chart={chartChemicalProduct}
				/>
			</MDBox>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

