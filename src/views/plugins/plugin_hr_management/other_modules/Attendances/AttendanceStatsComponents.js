// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';
import {autorun, computed, observable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';

import {Button} from '../../../../../components/inputs';

import Calendar from '../../../../../components/calendar';

import {
    getEmployeeListWithLostimeByDate,
    getEmployeeListWithLostimeByMonth,
    getEmployeeListWithNoContractDailyWorkingHrs,
    getEmployeeListWithOvertimeByDate,
    getEmployeeListWithOvertimeByMonth,
    getTotalHrsWithLostimeByMonth,
    getTotalHrsWithOvertimeByMonth
} from "./AttendanceUtils";

import AttendanceTeamDialog from './AttendanceTeamDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CalendarWrapper">
@observer
class CalendarWrapper extends React.Component {
    
    @computed get currDate() {
        const {state: {selectedYear, selectedMonth, selectedDate}} = this.props;
        return Dates.parse(selectedDate + "-" + selectedMonth + "-" + selectedYear);
    }
    
    render() {
        const {onSelectDay, renderer} = this.props;
        return <Calendar 
            key={this.currDate}
            firstDayIsMonday={false} 
            date={this.currDate} 
            selectDay={false}
            markers={[]}
            onSelectDay={onSelectDay}
            renderer={renderer}
        />;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanel">
@observer
class ViewByPanel extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onViewTeam = this.onViewTeam.bind(this);
    }
    
    onViewTeam(action, list) {
        const {attendanceTeamDialog} = this.refs;
        attendanceTeamDialog.extraProp('action', action).open(list);
    }
    
    render() {
        const {state, state: {item}, onChange, title} = this.props;
        if(!item) return null;
        const {id, data: {name}} = item;
        return <div className="ViewByPanel">
            <div className="ViewByPanelFilter h-75 padding-l-10 padding-r-10">
                <h4 className="flex">{name} {title} Attendance</h4>
                <div className="flex">
                    <ViewByPanelYearsButton state={state} onChange={onChange}/>
                    <ViewByPanelMonths state={state} onChange={onChange}/>
                </div>            
            </div>
            <hr className="margin-t-0 margin-b-10 margin-l-10 margin-r-10"/>
            <div className="ViewByPanelStats h-50 padding-l-10 padding-r-10 grid-4 grid-gap-10">
                <ViewByPanelStat state={state} action="all" title="All Employee(s)" onClick={this.onViewTeam}/>  
                <ViewByPanelStat state={state} action="over" title="Overtime Hrs" onClick={this.onViewTeam}/>  
                <ViewByPanelStat state={state} action="lost" title="Lost Hrs" onClick={this.onViewTeam}/> 
                <ViewByPanelStat state={state} action="no_hrs" title="Without Daily Working Hrs" onClick={this.onViewTeam}/>        
            </div>
            <AttendanceTeamDialog ref="attendanceTeamDialog"/>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelStat">
@observer
class ViewByPanelStat extends React.Component {
    
    @observable state = {
        list: null,
        totalHrs: null
    };
    
    constructor(props) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }
    
    componentDidMount() {
        autorun(() => {
            const {
                state: {
                    teamList, attendanceList,
                    selectedDate, selectedYear, selectedMonth
                }, 
                action
            } = this.props;

            setTimeout(() => {
                switch(action) {
                    case "all":
                        this.state.list = teamList;
                        break;
                    case "over":
                        this.state.list = getEmployeeListWithOvertimeByMonth(teamList, attendanceList);
                        break;
                    case "lost":
                        this.state.list = getEmployeeListWithLostimeByMonth(teamList, attendanceList);
                        break;
                    case "no_hrs":
                        this.state.list = getEmployeeListWithNoContractDailyWorkingHrs(teamList);
                        break;
                }
            });
            setTimeout(() => {
                switch(action) {
                    case "over":
                        this.state.totalHrs = getTotalHrsWithOvertimeByMonth(attendanceList);
                        break;
                    case "lost":
                        this.state.totalHrs = getTotalHrsWithLostimeByMonth(teamList, attendanceList);
                        break;
                }
            });
        });
    }
    
    onClick() {
        const {action, onClick} = this.props;
        const {list} = this.state;
        onClick(action, list);
    }
    
    render() {
        const {state, props: {title, action}} = this;
        return <div className="ViewByPanelStat flex" onClick={this.onClick}>
            <ViewByPanelStatEmployeeCounter state={state} action={action} title={title}/> 
            <ViewByPanelStatHrsCounter state={state} action={action} title={title}/>
        </div>;
    }
}

@observer
class ViewByPanelStatEmployeeCounter extends React.Component {
    
    render() {
        const {action, title, state: {list}} = this.props;
        if(!list) {
            return <div className="flex ViewByPanelStatEmployeeCounter">
                <CircularProgress className="fixed-flex"/> {title}
            </div>;
        }
        return <div className="flex ViewByPanelStatEmployeeCounter">
            <span className="fixed-flex">{list.length}</span>
            {(action === "over" || action === "lost") ? "Employee(s)" : title}
        </div>;
    }
}

@observer
class ViewByPanelStatHrsCounter extends React.Component {
    
    render() {
        const {action, title, state: {totalHrs}} = this.props;
        if(action === "all" || action === "no_hrs") {
            return null;
        }
        if(totalHrs === null) {
            return <div className="flex ViewByPanelStatHrsCounter">
                <CircularProgress className="fixed-flex"/> {title}
            </div>;
        }
        return <div className="flex ViewByPanelStatHrsCounter">
            <span className="fixed-flex">{totalHrs}</span>
            {title}
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelYearsButton">
@observer
class ViewByPanelYearsButton extends React.Component {
    render() {
        const {state: {selectedYear}, onChange} = this.props;
        return <Button key={selectedYear} className="btn btn-primary margin-r-10 fixed-flex" text={String(selectedYear)} type="Year" onClick={onChange}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelMonths">
@observer
class ViewByPanelMonths extends React.Component {
    render() {
        const {state, onChange} = this.props;
        return <div className="ViewByPanelMonths flex">
            <ViewByPanelMonthsButton state={state} text="Jan" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Feb" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Mar" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Apr" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="May" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Jun" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Jul" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Aug" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Sep" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Oct" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Nov" onChange={onChange}/>
            <ViewByPanelMonthsButton state={state} text="Dec" onChange={onChange}/>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByPanelMonthsButton">
@observer
class ViewByPanelMonthsButton extends React.Component {
    render() {
        const {state: {selectedMonth}, onChange, text} = this.props;
        const className = "btn btn-primary" + (selectedMonth === text ? " _888" : "");
        return <Button key={text} className={className} text={text} type="Month" onClick={onChange}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="LostimeAndOvertimeIcon">
@observer
class LostimeAndOvertimeIcon extends React.Component {
    @observable state = {
        hasAttendance: null,
        listOvertime: null,
        listLostime: null,
        totalHrs: null
    };
    
    componentDidMount() {
        autorun(() => {
            const {
                dateItem,
                state: {
                    teamList, attendanceList,
                    selectedDate, selectedYear, selectedMonth
                }
            } = this.props;

            setTimeout(() => {
                this.state.hasAttendance = attendanceList.anyMatch(({id, data: {date, date_split, day, attendance_list}}) => {
                    return Dates.parse(date).setMidnight().equals(dateItem.date);
                });
            });
            setTimeout(() => {
                this.state.listOvertime = getEmployeeListWithOvertimeByDate(teamList, attendanceList, dateItem.date);
            });
            setTimeout(() => {
                this.state.listLostime = getEmployeeListWithLostimeByDate(teamList, attendanceList, dateItem.date);
            });
            setTimeout(() => {
    //            this.state.totalHrs = getTotalHrsWithOvertimeByDate(attendanceList, dateItem.date);
            });
            setTimeout(() => {
    //            this.state.totalHrs = getTotalHrsWithLostimeByDate(teamList, attendanceList, dateItem.date);
            });
        });
    }
    
    render() {
        const {state} = this;
        return <React.Fragment>
            <HasAttendanceIcon state={state}/>
            <div>
                <LostimeIcon state={state}/>
                <OvertimeIcon state={state}/>
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="LostimeIcon">
@observer
class HasAttendanceIcon extends React.Component {
    render() {
        const {state: {hasAttendance}} = this.props;
        if(!hasAttendance) {
            return null;
        }
        return <i className="LostimeAndOvertimeIcon HasAttendanceIcon"/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="LostimeIcon">
@observer
class LostimeIcon extends React.Component {
    render() {
        const {state: {listLostime}} = this.props;
        if(!listLostime || listLostime.isEmpty()) {
            return null;
        }
        return <i className="LostimeAndOvertimeIcon LostimeIcon">{listLostime.length}</i>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="OvertimeIcon">
@observer
class OvertimeIcon extends React.Component {
    render() {
        const {state: {listOvertime}} = this.props;
        if(!listOvertime || listOvertime.isEmpty()) {
            return null;
        }
        return <i className="LostimeAndOvertimeIcon OvertimeIcon">{listOvertime.length}</i>;
    }
}
// </editor-fold>

export {
    CalendarWrapper,
    ViewByPanel,
    LostimeAndOvertimeIcon
};
