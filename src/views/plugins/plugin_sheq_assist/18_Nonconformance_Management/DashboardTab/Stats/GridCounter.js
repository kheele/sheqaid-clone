//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef, useImperativeHandle, useState} from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="Counter">
function Counter({onClick, id, background, title, count, label, color, sx}) {
    return <DefaultCounterCard
        onClick={onClick}
        id={id}
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
const Comp = forwardRef(({data: __data, onClick}, ref) => {
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

    const defaults = {aggregate: {count: 0}};

    const {
        all_ncr_list_aggregate = defaults,
        source_site_audit_aggregate = defaults,
        source_compliance_audit_aggregate = defaults,
        source_inspection_aggregate = defaults,
        source_incident_investigation_aggregate = defaults,
    } = data;

    console.log('data', data)

    return <>
        <Grid
            container
            columns={1}
            spacing={6}
            className="grid-5 w-full grid-gap-10"
            sx={{m: '0 !important', mt: '10px !important', justifyItems: 'center',}}
        >
            <Counter
                id="ncr"
                onClick={onClick}
                background="#933333" title={<b className="color-white font-size-14">Total<br/>Non-Conformances</b>}
                count={all_ncr_list_aggregate.aggregate.count}/>
            <Counter
                id="site-audits"
                onClick={onClick}
                background="#2a5d1e"
                title={<b className="color-white font-size-14">Total Site Audit<br/>Non-Conformances</b>}
                count={source_site_audit_aggregate.aggregate.count}/>
            <Counter
                id="audits"
                onClick={onClick}
                background="#FFA726"
                title={<b className="color-white font-size-14">Total Compliance Audit<br/>Non-Conformances</b>}
                count={source_compliance_audit_aggregate.aggregate.count}/>
            <Counter
                id="inspections"
                onClick={onClick}
                background="#755a5a"
                title={<b className="color-white font-size-14">Total Inspection<br/>Non-Conformances</b>}
                count={source_inspection_aggregate.aggregate.count}/>
            <Counter
                id="incidents"
                onClick={onClick}
                background="#716c2d"
                title={<b className="color-white font-size-14">Total Incidents<br/>Non-Conformances</b>}
                count={source_incident_investigation_aggregate.aggregate.count}/>
        </Grid>
    </>;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
