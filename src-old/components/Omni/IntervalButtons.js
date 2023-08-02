import { ButtonGroup } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {forwardRef, useImperativeHandle, useState} from "react";

const Comp = forwardRef(({ value, onChange }, ref) => {
    const [interval, setInterval] = useState(value);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setInterval: (value) => {
            setInterval(value);
        },
    }));
    // </editor-fold>

  return (
    <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons">
      {/*<IntervalBtn text="Day" value={interval} onChange={onChange} />*/}
      {/*<IntervalBtn text="Week" value={interval} onChange={onChange} />*/}
      <IntervalBtn text="Month" value={interval} onChange={onChange} />
      <IntervalBtn text="Quarter" value={interval} onChange={onChange} />
      <IntervalBtn text="Bi-Annual" value={interval} onChange={onChange} />
      <IntervalBtn text="Annual" value={interval} onChange={onChange} />
    </ButtonGroup>
  );
});

function IntervalBtn({ text, value, onChange }) {
  const isSelected = text === value;

  const onClick = () => {
    onChange(text);
  };

  return (
    <Button
      sx={{
        marginBottom: "-4px !important",
        borderBottom: "4px solid transparent",
        borderBottomColor: isSelected ? "#2c2c2f" : "transparent",
          fontSize: "13px"
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

IntervalBtn.propTypes = {
  text: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
  value: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

Comp.propTypes = {
  value: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Comp;
