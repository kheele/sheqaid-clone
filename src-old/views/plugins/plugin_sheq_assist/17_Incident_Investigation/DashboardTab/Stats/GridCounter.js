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
const Comp = forwardRef(({interval: __interval, employee_view: __employee_view}, ref) => {
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

    const path = "plugin_sheq_assist/17_Incident_Investigation/dashboard/total/";

    const {events} = neonBinding;

    const totals = {
        lowRisk: events.emit(path + "low-risk", {interval, employee_view}),
        mediumRisk: events.emit(path + "medium-risk", {interval, employee_view}),
        highRisk: events.emit(path + "high-risk", {interval, employee_view}),
        veryHighRisk: events.emit(path + "very-high-risk", {interval, employee_view}),
        totalIncidents: events.emit(path + "count", {interval, employee_view}),
        totalVehiclesInvolved: events.emit(path + "vehicles-involved", {interval, employee_view}),
        totalPersonsInjured: events.emit(path + "persons-injured", {interval, employee_view}),
    };

    return <>
        <Grid
            container
            columns={1}
            spacing={6}
            className="grid-4 w-full grid-gap-10"
            sx={{m: 0, mt: '10px', justifyItems: 'center',}}
        >
            <Counter background="#66BB6A" title={<b className="color-white font-size-14">Low<br/>Risk</b>}
                     count={totals.lowRisk}/>
            <Counter background="#FFA726"
                     title={<b className="color-white font-size-14">Medium<br/>Risk</b>}
                     count={totals.mediumRisk}/>
            <Counter background="#FF0000" title={<b className="color-white font-size-14">High<br/>Risk</b>}
                     count={totals.highRisk}/>
            <Counter background="#AE0000"
                     title={<b className="color-white font-size-14">Very High<br/>Risk</b>}
                     count={totals.veryHighRisk}/>
        </Grid>
        <Grid
            container
            columns={1}
            spacing={6}
            className="grid-3 w-auto grid-gap-10 bg-ddd padding-30"
            sx={{justifyItems: 'center', margin: "20px 90px 0px", borderRadius: "50%"}}
        >
            <Counter background="#fff" color="dark" title={<b className="color-888 font-size-12">Incidents</b>}
                     count={totals.totalIncidents} sx={{width: '130px', height: '130px', border: '5px solid #d5d5d5'}}/>
            <Counter background="#fff" color="dark"
                     title={<b className="color-888 font-size-12">Vehicles Involved</b>}
                     count={totals.totalVehiclesInvolved} sx={{width: '130px', height: '130px', border: '5px solid #d5d5d5'}}/>
            <Counter background="#fff" color="dark" title={<b className="color-888 font-size-12">Persons Injured</b>}
                     count={totals.totalPersonsInjured} sx={{width: '130px', height: '130px', border: '5px solid #d5d5d5'}}/>
        </Grid>
    </>;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

