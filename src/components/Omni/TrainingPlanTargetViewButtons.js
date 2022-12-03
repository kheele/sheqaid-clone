import {ButtonGroup} from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Button} from "components/inputs";

const Comp = forwardRef(({value, onChange}, ref) => {
    const [view, setView] = useState(value);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setView: (value) => {
            setView(value);
        },
    }));
    // </editor-fold>

    if (!view) return null;

    const {id, target, item} = view;
    let text;
    if(target === 'employee') {
        const {data: {fname, lname}} = item;
        text = `${lname} ${fname}`;
    } else if(target === 'year') {
        text = item;
    } else if(item.data) {
        text = item.data.name;
    }

    return (
        <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons" className="border-radius-20">
            <ViewBtn text={target} className="no-border border-radius-l-20 bg-aaa"/>
            <ViewBtn text={text} className="no-border border-l-1 border-radius-0 bg-white color-888" value={view} item={item} onChange={onChange}/>
            <ViewBtn text="Cancel" className="no-border border-l-1 border-radius-r-20 bg-red" value="Cancel" onChange={onChange}/>
        </ButtonGroup>
    );
});

function ViewBtn({text, value, item, className, onChange}) {
    const isSelected = !!item;

    const onClick = () => {
        onChange && onChange(text, value);
    };

    const sx = {};
    if(onChange) {
        if (value === 'Cancel') {
            sx.color = "#fff";
        } else {

        }
    } else {
        sx.color = "#fff";
        sx.cursor = "default";
        if(text === 'employee') {
            text = 'Employee:';
        } else if(text === 'job_position') {
            text = 'Job Position:';
        } else if(text === 'course') {
            text = 'Course:';
        } else if(text === 'year') {
            text = 'Year:';
        }
    }

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

Comp.propTypes = {
    // value: PropTypes.oneOf(["Employee", "Job Position", "Course", "Year"]).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Comp;
