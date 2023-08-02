//<editor-fold desc="imports">
import * as React from "react";
import PropTypes from "prop-types";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef(({data: __data}, ref) => {
    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setData: (value) => {
        },
    }));
    // </editor-fold>

    return null;
});
//</editor-fold>

Comp.propTypes = {
    interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
    employee_view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;
