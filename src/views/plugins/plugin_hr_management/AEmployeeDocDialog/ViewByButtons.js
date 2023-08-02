import {ButtonGroup} from "@mui/material";
import * as React from "react";
// import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Button} from "components/inputs";

const Comp = forwardRef(({expiry_date, value, name, onChange}, ref) => {
    const [view, setView] = useState(value);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setView: (value) => {
            setView(value);
        },
    }));
    // </editor-fold>

    return (
        <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons" className="border-radius-20">
            <ViewBtn expiry_date={expiry_date} text="Employee" value={view} onChange={onChange} className="no-border border-radius-l-20 bg-white color-888"/>
            <ViewBtn expiry_date={expiry_date} text={name} value={view} onChange={onChange} className="no-border border-l-1 border-radius-r-20 bg-white color-888"/>
        </ButtonGroup>
    );
});

function ViewBtn({expiry_date, text, value, className, onChange}) {
    const isSelected = text === value;

    const onClick = () => {
        onChange({view: text, expiry_date, load: true});
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
            View By {text}
        </Button>
    );
}

ViewBtn.propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

Comp.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Comp;
