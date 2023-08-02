import {ButtonGroup} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import Popover from "../popovers/Popover";
import Divider from "@mui/material/Divider";
import NavItem from "../navs/NavItem";
import {Dates} from "../../utils/Dates";

const Comp = forwardRef((
    {
        value,
        month_range_start: _month_range_start, month_range_end: _month_range_end,
        quarter_range_start: _quarter_range_start, quarter_range_end: _quarter_range_end,
        bi_annual_range_start: _bi_annual_range_start, bi_annual_range_end: _bi_annual_range_end,
        annual_range_start: _annual_range_start, annual_range_end: _annual_range_end,
        onChange,
        setMonthRangeStart: _setMonthRangeStart,
        setMonthRangeEnd: _setMonthRangeEnd,
        setQuarterRangeStart: _setQuarterRangeStart,
        setQuarterRangeEnd: _setQuarterRangeEnd,
        setBiannualRangeStart: _setBiannualRangeStart,
        setBiannualRangeEnd: _setBiannualRangeEnd,
        setAnnualRangeStart: _setAnnualRangeStart,
        setAnnualRangeEnd: _setAnnualRangeEnd,
    }, ref
) => {
    const popover = useRef(null);

    const [interval, setInterval] = useState(value);

    const [month_range_start, setMonthRangeStart] = useState(_month_range_start);
    const [month_range_end, setMonthRangeEnd] = useState(_month_range_end);

    const [quarter_range_start, setQuarterRangeStart] = useState(_quarter_range_start);
    const [quarter_range_end, setQuarterRangeEnd] = useState(_quarter_range_end);

    const [bi_annual_range_start, setBiannualRangeStart] = useState(_bi_annual_range_start);
    const [bi_annual_range_end, setBiannualRangeEnd] = useState(_bi_annual_range_end);

    const [annual_range_start, setAnnualRangeStart] = useState(_annual_range_start);
    const [annual_range_end, setAnnualRangeEnd] = useState(_annual_range_end);

    // <editor-fold desc="useImperativeHandle funs">
    useImperativeHandle(ref, () => ({
        setInterval,
        setMonthRangeStart,
        setMonthRangeEnd,
        setQuarterRangeStart,
        setQuarterRangeEnd,
        setBiannualRangeStart,
        setBiannualRangeEnd,
        setAnnualRangeStart,
        setAnnualRangeEnd,
        setRangeStart: range_start => {
            if (interval === "Month") {
                setMonthRangeStart(range_start);
            } else if (interval === "Quarter") {
                setQuarterRangeStart(range_start);
            } else if (interval === "Bi-Annual") {
                setBiannualRangeStart(range_start);
            } else if (interval === "Year") {
                setAnnualRangeStart(range_start);
            }
        },
        setRangeEnd: range_end => {
            if (interval === "Month") {
                setMonthRangeEnd(range_end);
            } else if (interval === "Quarter") {
                setQuarterRangeEnd(range_end);
            } else if (interval === "Bi-Annual") {
                setBiannualRangeEnd(range_end);
            } else if (interval === "Year") {
                setAnnualRangeEnd(range_end);
            }
        },
    }));
    // </editor-fold>

    const getPopover = () => popover.current;

    return (<>
        <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons">
            {/*<IntervalBtn text="Day" value={interval} onChange={onChange} />*/}
            {/*<IntervalBtn text="Week" value={interval} onChange={onChange} />*/}
            <IntervalBtn text="Month" value={interval} onChange={onChange}/>
            <IntervalBtn text="Quarter" value={interval} onChange={onChange}/>
            <IntervalBtn text="Bi-Annual" value={interval} onChange={onChange}/>
            <IntervalBtn text="Annual" value={interval} onChange={onChange}/>
        </ButtonGroup>
        {interval === 'Month' &&
            <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons"
                         sx={{boxShadow: "none", position: "absolute", marginTop: "52px"}}
                         className="grid-gap-10"
            >
                <RangeBtn interval={interval} text="Start Month" value={month_range_start} getPopover={getPopover}
                          onChange={_setMonthRangeStart}/>
                <RangeBtn interval={interval} text="End Month" value={month_range_end} getPopover={getPopover}
                          onChange={_setMonthRangeEnd}/>
            </ButtonGroup>}
        {interval === 'Quarter' &&
            <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons"
                         sx={{boxShadow: "none", position: "absolute", marginTop: "52px"}}
                         className="grid-gap-10"
            >
                <RangeBtn interval={interval} text="Start Quarter" value={quarter_range_start} getPopover={getPopover}
                          onChange={_setQuarterRangeStart}/>
                <RangeBtn interval={interval} text="End Quarter" value={quarter_range_end} getPopover={getPopover}
                          onChange={_setQuarterRangeEnd}/>
            </ButtonGroup>}
        {interval === 'Bi-Annual' &&
            <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons"
                         sx={{boxShadow: "none", position: "absolute", marginTop: "52px"}}
                         className="grid-gap-10"
            >
                <RangeBtn interval={interval} text="Start Bi-Annual" value={bi_annual_range_start} getPopover={getPopover}
                          onChange={_setBiannualRangeStart}/>
                <RangeBtn interval={interval} text="End Bi-Annual" value={bi_annual_range_end} getPopover={getPopover}
                          onChange={_setBiannualRangeEnd}/>
            </ButtonGroup>}
        {interval === 'Annual' &&
            <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons"
                         sx={{boxShadow: "none", position: "absolute", marginTop: "52px"}}
                         className="grid-gap-10"
            >
                <RangeBtn interval={interval} text="Start Year" value={annual_range_start} getPopover={getPopover}
                          onChange={_setAnnualRangeStart}/>
                <RangeBtn interval={interval} text="End Year" value={annual_range_end} getPopover={getPopover}
                          onChange={_setAnnualRangeEnd}/>
            </ButtonGroup>}

        <Popover ref={popover}/>
    </>);
});

function IntervalBtn({text, value, onChange}) {
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

function RangeBtn({interval, text, value, action, className, getPopover, onChange}) {

    const onSelect = (e, elem) => {
        const {idx, item} = elem.props;

        if (idx === -1) {
            onChange(null);
        } else {
            onChange(item);
        }
    };

    const renderItem = (item, idx) => {
        const className = item === value ? "active" : "";

        let title;
        if (interval === "Month") {
            const {year, month, start, end} = item;
            title = `${month}-${year}`;
        } else if (interval === "Quarter") {
            const {year, quarter, start, end} = item;
            title = `(${Dates.parse(start).getMonthsStr()}-${Dates.parse(end).getMonthsStr()}) ${year}`;
        } else if (interval === "Bi-Annual") {
            const {year, half, start, end} = item;
            title = `(${Dates.parse(start).getMonthsStr()}-${Dates.parse(end).getMonthsStr()}) ${year}`;
        } else if (interval === "Year") {
            title = item;
        }

        return <NavItem key={title} idx={idx} item={item} onClick={onSelect} title={title} className={className}/>;
    };

    const onClick = () => {
        let list = [];
        if (interval === "Month") {
            const startD = new Date(2000, 0, 1);
            const endD = new Date();
            list = Dates.getMonthsStartAndEndDateRangeSQL(startD, endD);
        } else if (interval === "Quarter") {
            list = Dates.getQuartersStartAndEndDateRangeSQL();
        } else if (interval === "Bi-Annual") {
            list = Dates.getHalvesStartAndEndDateRangeSQL();
        } else if (interval === "Year") {
            const y = new Date().getFullYear();
            list = Array.range(2000, y);
        }

        getPopover().settings({
            style: {width: 'auto', minWidth: 140, height: "100%", maxHeight: "calc(100% - 20px)"},
            scrollbarsClassName: "h-full",
            fixedCenter: true,
            isDialog: true,
            contentNode: <div>
                <p className="text-center padding-10 bg-eee"><i>{interval} Options</i></p>
                <NavItem key={0} idx={-1} onClick={onSelect} title="- All -"/>
                {list.map(renderItem)}
            </div>
        }).open();

    };

    if(value) {
        if (interval === "Month" && value.month) {
            const {year, month, start, end} = value;
            value = `${month}-${year}`;
        } else if (interval === "Quarter" && value.quarter) {
            const {year, quarter, start, end} = value;
            value = `(${Dates.parse(start).getMonthsStr()}-${Dates.parse(end).getMonthsStr()}) ${year}`;
        } else if (interval === "Bi-Annual" && value.half) {
            const {year, half, start, end} = value;
            value = `(${Dates.parse(start).getMonthsStr()}-${Dates.parse(end).getMonthsStr()}) ${year}`;
        } else if (interval === "Year" && isNumber(value)) {
            // value = value;
        } else {
            value = null;
        }
    }

    return (
        <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons"
                     sx={{borderRadius: "20px", overflow: "hidden"}}
        >
            <Button
                className={`btn btn-primary color-white bg-aaa  no-border-radius font-size-13 h-35 no-text-shadow padding-h-20 cursor-default`}
            >
                {text}
            </Button>
            <Button
                className={`btn btn-primary font-size-13 h-35  no-border-radius no-text-shadow padding-h-20`}
                onClick={onClick}
            >
                {value || '- All -'}
            </Button>
        </ButtonGroup>
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
