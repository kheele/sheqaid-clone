//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
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
		all_incident_list_aggregate,
		all_quick_incident_list_aggregate,
		all_investigation_list_aggregate,
		all_non_conformance_list_aggregate,
		//
		fatality_incident_list_aggregate,
		non_fatality_incident_list_aggregate,
		//
		group_lti_incident_list_aggregate,
		group_nlti_incident_list_aggregate,
		group_non_incident_list_aggregate,
		//
		incident_time_afternoon_incident_list_aggregate,
		incident_time_morning_incident_list_aggregate,
		incident_time_non_incident_list_aggregate,
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

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-4 w-full grid-gap-10"
			sx={{m: 0, mt: '10px', justifyItems: 'center',}}
		>
			<Counter background="#66BB6A" title={<b className="color-white font-size-14">Total<br/>Incidents</b>}
			         count={all_incident_list_aggregate.aggregate.count}/>
			<Counter background="#66BB6A" title={<b className="color-white font-size-14">Total Quick<br/>Incidents</b>}
			         count={all_quick_incident_list_aggregate.aggregate.count}/>
			<Counter background="#FFA726"
			         title={<b className="color-white font-size-14">Total<br/>Investigations</b>}
			         count={all_investigation_list_aggregate.aggregate.count}/>
			<Counter background="#FF0000" title={<b className="color-white font-size-14">Total Incidents<br/>Non-Conformances</b>}
			         count={all_non_conformance_list_aggregate.aggregate.count}/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

