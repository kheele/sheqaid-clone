import {ButtonGroup} from "@mui/material";
import * as React from "react";
// import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Button} from "components/inputs";

const Comp = forwardRef(({value, target_view, onChange}, ref) => {
    const [view, setView] = useState(value);
    const [targetView, setTargetView] = useState(target_view);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setView: (value) => {
            setView(value);
        },
        setTargetView: (value) => {
            setTargetView(value);
        },
    }));
    // </editor-fold>

    if (targetView) return null;

    return (
        <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons" className="border-radius-20">
            <ViewBtn text="Year" value={view} onChange={onChange} className="no-border border-radius-l-20 bg-white color-888"/>
            <ViewBtn text="Course" value={view} onChange={onChange} className="no-border border-l-1 border-radius-0 bg-white color-888"/>
            <ViewBtn text="Job Position" value={view} onChange={onChange} className="no-border border-l-1 border-radius-0 bg-white color-888"/>
            <ViewBtn text="Employee" value={view} onChange={onChange} className="no-border border-l-1 border-radius-r-20 bg-white color-888"/>
        </ButtonGroup>
    );
});

function ViewBtn({text, value, className, onChange}) {
    const isSelected = text === value;

    const onClick = () => {
        onChange(text);
    };

    if(isSelected) {
        className += ` border-b-5 bg-border-primary`;
    }

    return (
        <Button
            style={{
                // marginBottom: "-4px !important",
                // borderBottom: "4px solid transparent",
                borderBottomColor: isSelected ? "#2c2c2f" : "transparent",
            }}
            className={`btn btn-primary font-size-13 h-35 no-text-shadow padding-h-20 ${className}`}
            onClick={onClick}
        >
            {text}
        </Button>
    );
}

ViewBtn.propTypes = {
    text: PropTypes.oneOf(["Employee", "Job Position", "Course", "Year"]).isRequired,
    value: PropTypes.oneOf(["Employee", "Job Position", "Course", "Year"]).isRequired,
    onChange: PropTypes.func.isRequired,
};

Comp.propTypes = {
    value: PropTypes.oneOf(["Employee", "Job Position", "Course", "Year"]).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Comp;
