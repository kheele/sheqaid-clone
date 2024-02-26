//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import {CircularProgress} from "@mui/material";
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
		all_audit_list_aggregate = defaults,
		removed_audit_list_aggregate = defaults,
		ncr_list_aggregate = defaults,
		auditor_list_aggregate = defaults,
		representative_list_aggregate = defaults,
		audits_item_responsible_person_list_aggregate = defaults,
	} = data;
	
	console.log('data', data)
	
	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-6 w-full grid-gap-10"
			sx={{m: '0 !important', mt: '10px !important', justifyItems: 'center',}}
		>
			<Counter background="#933333" title={<b className="color-white font-size-14">Active<br/>Compliance Audits</b>}
			         count={all_audit_list_aggregate.aggregate.count}/>
			<Counter background="#2a5d1e" title={<b className="color-white font-size-14">Inactive<br/>Compliance Audits</b>}
			         count={removed_audit_list_aggregate.aggregate.count}/>
			<Counter background="#FFA726"
			         title={<b className="color-white font-size-14">Total<br/>Non-Conformances</b>}
			         count={ncr_list_aggregate.aggregate.count}/>
			<Counter background="#755a5a" title={<b className="color-white font-size-14">Total<br/>Auditors</b>}
			         count={auditor_list_aggregate.aggregate.count}/>
			<Counter background="#716c2d" title={<b className="color-white font-size-14">Total<br/>Representatives</b>}
			         count={representative_list_aggregate.aggregate.count}/>
			<Counter background="#716c2d" title={<b className="color-white font-size-14">Total<br/>Responsible Persons</b>}
			         count={audits_item_responsible_person_list_aggregate.aggregate.count}/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
