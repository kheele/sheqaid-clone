//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useImperativeHandle, useState} from "react";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="Counter">
function Counter({background, title, value, count, label, color, sx}) {
    return <DefaultCounterCard
        color={color || "light"}
        background={background}
        value={value}
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

    const {
        cost_list_aggregate,
        training_list_aggregate,
        participant_list_aggregate,
        training_course_list_aggregate,
        institution_list_aggregate,
        trainer_internal_list_aggregate,
        trainer_external_list_aggregate,
    } = data; //stats_top_counter;

    return <Grid
        container
        columns={1}
        spacing={6}
        className="grid-6 w-full grid-gap-10"
        sx={{m: 0, mt: '10px', justifyItems: 'center',}}
    >
        <Counter
            background="#fb8c00"
            title={<b className="color-white font-size-14">Total Cost</b>}
            value={parseFloat((cost_list_aggregate.aggregate.sum.cost || '0').replace('$', '').replace(',', ''), 2).toCurrencyNoCents('R')}
        />
        <Counter
            background="#e91e63"
            title={<b className="color-white font-size-14">Total Trainings</b>}
            count={training_list_aggregate.aggregate.count}
        />
        <Counter
            background="#7b809a"
            title={<b className="color-white font-size-14">Total Participants</b>}
            count={participant_list_aggregate.aggregate.count}
        />
        <Counter
            background="#F44335"
            title={<b className="color-white font-size-14">Total Courses</b>}
            count={training_course_list_aggregate.aggregate.count}
        />
        <Counter
            background="#4CAF50"
            title={<b className="color-white font-size-14">Total Institutions</b>}
            count={institution_list_aggregate.aggregate.count}
        />
        <Counter
            background="#344767"
            title={<b className="color-white font-size-14">Total Conductors</b>}
            count={trainer_internal_list_aggregate.aggregate.count + trainer_external_list_aggregate.aggregate.count}
        />
    </Grid>;
});
//</editor-fold>

export default Comp;
