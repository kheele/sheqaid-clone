//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
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

    const path_training_matrix = "plugin_sheq_assist/05_Trainings/training-matrix/";
    const path_training_course = "plugin_sheq_assist/05_Trainings/training-registry/";
    const path_training_plan = 'plugin_sheq_assist/05_Trainings/training-plan/';

    const totals = {
        cost: neonBinding.events.emit(path_training_matrix + "dashboard/total/cost", {interval, employee_view}),//
        trainings: neonBinding.events.emit(path_training_matrix + "dashboard/total/trainings", {
            interval,
            employee_view
        }),
        participants: neonBinding.events.emit(path_training_plan + "dashboard/total/participants", {
            interval,
            employee_view
        }),
        courses: neonBinding.events.emit(path_training_course + "dashboard/count", {interval, employee_view}),//
        institutions: neonBinding.events.emit(path_training_matrix + "dashboard/total/institutions", {
            interval,
            employee_view
        }),//
        conductors: neonBinding.events.emit(path_training_matrix + "dashboard/total/conductors", {
            interval,
            employee_view
        }),//
    };

    return <Grid
        container
        columns={1}
        spacing={6}
        className="grid-6 w-full grid-gap-10"
        sx={{m: 0, mt: '10px', justifyItems: 'center',}}
    >
        <Counter background="#fb8c00" title={<b className="color-white font-size-14">Total Cost</b>} count={totals.cost}
                 label="K"/>
        <Counter background="#e91e63" title={<b className="color-white font-size-14">Total Trainings</b>}
                 count={totals.trainings}/>
        <Counter background="#7b809a" title={<b className="color-white font-size-14">Total Participants</b>}
                 count={totals.participants}/>
        <Counter background="#F44335" title={<b className="color-white font-size-14">Total Courses</b>}
                 count={totals.courses}/>
        <Counter background="#4CAF50" title={<b className="color-white font-size-14">Total Institutions</b>}
                 count={totals.institutions}/>
        <Counter background="#344767" title={<b className="color-white font-size-14">Total Conductors</b>}
                 count={totals.conductors}/>
    </Grid>;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
