// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import 'react-alice-carousel/lib/alice-carousel.css';
import MKBox from "components/MK/MKBox";
import {ButtonGroup,} from "@mui/material";
import {Button} from "components/inputs";
import AliceCarousel from "react-alice-carousel";
// </editor-fold>

//<editor-fold desc="HasWarnings">
@observer
class HasWarnings extends React.Component {
    render() {
        const {item, view, idx, onClick} = this.props;

        let hasWarnings = false;

        if (view === 'Employee') {
            const {
                group: {data: {fname, lname, optional_details = {}}},
                list,
                cost,
                attendanceRate,
                results,
                status,
                courseList,
                yearList
            } = item;
            const {job_position} = optional_details || {};
            hasWarnings = !status || !results || !cost || !job_position;
        } else if (view === 'Job Position') {
            const {group, list, cost, attendanceRate, results, status, employeeList, courseList, yearList} = item;
            hasWarnings = !status || !results || !cost || employeeList.isEmpty();
        } else if (view === 'Course') {
            const {group, list, cost, attendanceRate, results, status, employeeList, jobPositionList, yearList} = item;
            hasWarnings = !status || !results || !cost || jobPositionList.isEmpty() || employeeList.isEmpty();
        } else if (view === 'Year') {
            const {
                group,
                list,
                cost,
                attendanceRate,
                results,
                status,
                employeeList,
                jobPositionList,
                courseList
            } = item;
            hasWarnings = !status || !results || !cost || jobPositionList.isEmpty() || employeeList.isEmpty();
        }

        if (!hasWarnings) return null;

        return <i className="fa fa-warning" idx={idx} onClick={onClick}/>;
    }
}

//</editor-fold>

//<editor-fold desc="CostBtn">
@observer
class CostBtn extends React.Component {
    render() {
        const {cost} = this.props;
        return <Button
            className="btn btn-primary pull-right circled bg-white no-text-shadow min-w-80 h-30 font-size-12 color-primary border-w-2 bg-border-primary"
        >
            {isNumber(cost) ? cost.toCurrency('R') : 'N/A'}
        </Button>;
    }
}

//</editor-fold>

//<editor-fold desc="YearDot">
@observer
class YearDot extends React.Component {
    render() {
        const {year, onViewTarget} = this.props;
        let bg, currY = new Date().getFullYear();
        if (year === currY) {
            bg = 'green';
        } else if (year < currY) {
            bg = 'aaa';
        } else {
            bg = 'orange';
        }

        return <Button
            id={year}
            item={year}
            target="year"
            text={year}
            onClick={onViewTarget}
            className={`padding-0 font-size-11 min-w-35 w-35 h-35 no-text-shadow no-border circled color-white bg-${bg}`}
        />;
    }
}

//</editor-fold>

//<editor-fold desc="YearsTD">
@observer
class YearsTD extends React.Component {
    render() {
        const {value, onViewTarget} = this.props;

        const responsive = {
            0: {items: 3},
        };

        const items = value.map(year => <YearDot year={year} onViewTarget={onViewTarget}/>);

        return <div className="td fixed-flex min-w-250">
            <AliceCarousel
                mouseTracking
                items={items}
                responsive={responsive}
                controlsStrategy="alternate"
            />
        </div>;
    }
}

//</editor-fold>

//<editor-fold desc="StatusTD">
@observer
class StatusTD extends React.Component {
    render() {
        const {value} = this.props;
        const sxValue = {
            background: "#fff",
            padding: '2px',
            minWidth: '20px',
            height: '20px',
            width: '28px',
            margin: '0 auto',
            fontSize: '13px',
            borderRadius: '50%',
        };
        const outstanding = value.filter(v => v === 'Outstanding').length;
        const completed = value.filter(v => v === 'Completed').length;
        return <div className="td fixed-flex min-w-240">
            <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons" sx={{height: '52px'}}>
                <Button className="padding-10 font-size-11 no-text-shadow bg-red no-border grid-1">
                    <MKBox sx={{color: '#fff'}}>Outstanding</MKBox>
                    <MKBox sx={{color: 'red', ...sxValue}}>{outstanding + (outstanding > 99 ? '+' : '')}</MKBox>
                </Button>
                <Button className="padding-10 font-size-11 no-text-shadow bg-green no-border grid-1">
                    <MKBox sx={{color: '#fff'}}>Completed</MKBox>
                    <MKBox sx={{color: 'green', ...sxValue}}>{completed + (completed > 99 ? '+' : '')}</MKBox>
                </Button>
            </ButtonGroup>
        </div>;
    }
}

//</editor-fold>

//<editor-fold desc="ResultsTD">
@observer
class ResultsTD extends React.Component {
    render() {
        const {value} = this.props;
        const sxValue = {
            background: "#fff",
            padding: '2px',
            minWidth: '20px',
            height: '20px',
            width: '28px',
            margin: '0 auto',
            fontSize: '13px',
            borderRadius: '50%',
        };
        const __value = value.filter(v => isNumber(v)).map(v => parseFloat(v, 10));
        const failed = __value.filter(v => v < 50).length;
        const passed = __value.filter(v => v >= 50).length;
        const average = __value.isEmpty() ? 'N/A' : (__value.reduce((a, b) => a + b, 0) / (__value.length * 100) * 100).toFixed(1) + '%';
        return <div className="td fixed-flex min-w-250">
            <ButtonGroup variant="contained" color="white" ariaLabel="elevation buttons" sx={{height: '52px'}}>
                <Button className="padding-10 font-size-11 no-text-shadow bg-red no-border grid-1">
                    <MKBox sx={{color: '#fff'}}>Failed</MKBox>
                    <MKBox sx={{color: 'red', ...sxValue}}>{failed + (failed > 99 ? '+' : '')}</MKBox>
                </Button>
                <Button className="padding-10 font-size-11 no-text-shadow bg-green no-border grid-1">
                    <MKBox sx={{color: '#fff'}}>Passed</MKBox>
                    <MKBox sx={{color: 'green', ...sxValue}}>{passed + (passed > 99 ? '+' : '')}</MKBox>
                </Button>
                <Button className={`padding-10 font-size-11 no-text-shadow bg-${average === 'N/A' ? "orange" : average >= 50 ? "green" : "red"} no-border grid-1`}>
                    <MKBox sx={{color: '#fff'}}>Average</MKBox>
                    <MKBox sx={{color: 'orange', ...sxValue}}>{average}</MKBox>
                </Button>
            </ButtonGroup>
        </div>;
    }
}

//</editor-fold>

export {HasWarnings, CostBtn, YearsTD, StatusTD, ResultsTD};
