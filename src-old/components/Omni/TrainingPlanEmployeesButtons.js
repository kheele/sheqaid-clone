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

    if(targetView && targetView.target === 'employee') return null;

    return (
        <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons" sx={{mr: '20px'}} className="border-radius-20">
            <Button className="btn btn-primary font-size-13 no-border border-radius-l-20 bg-aaa color-white no-text-shadow padding-h-20 cursor-default">Employees</Button>
            <ViewBtn text="All" action="all" value={view} onChange={onChange} className="no-border border-l-1 bg-white color-888 border-radius-0"/>
            <ViewBtn text="Active" action="active" value={view} onChange={onChange} className="no-border border-l-1 bg-white color-888 border-radius-0"/>
            <ViewBtn text="Inactive" action="inactive" value={view} onChange={onChange} className="no-border border-l-1 bg-white color-888 border-radius-r-20"/>
        </ButtonGroup>
    );
});

function ViewBtn({text, value, action, className, onChange}) {
    const isSelected = action === value;

    const onClick = () => {
        onChange(action);
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
    text: PropTypes.oneOf(["All", "Active", "Inactive"]).isRequired,
    value: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
    onChange: PropTypes.func.isRequired,
};

Comp.propTypes = {
    value: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Comp;
