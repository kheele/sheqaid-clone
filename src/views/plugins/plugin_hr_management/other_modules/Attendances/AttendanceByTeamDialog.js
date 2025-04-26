// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {execWhen} from 'utils/Utils';

import AAttendanceByDialog from './AAttendanceByDialog';
import {CalendarWrapper, LostimeAndOvertimeIcon, ViewByPanel} from './AttendanceStatsComponents';

import NewAttendanceDialog from './NewAttendanceDialog';
import ProfileAttendanceDialog from './ProfileAttendanceDialog';
import EditAttendanceDialog from './EditAttendanceDialog';

import style from "./AttendanceByTeamDialog.lazy.css";

// </editor-fold>

@observer
class AttendanceByTeamDialog extends AAttendanceByDialog {
    // <editor-fold defaultstate="collapsed" desc="fields">
    pageKey = "AttendanceByTeamDialog";
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        execWhen(() => this.state.item).then(item => {
            this.state.teamList = item.data.list;

            this.onLoadAttendanceList();
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    onLoadAttendanceList() {
        const {item, selectedDate, selectedYear, selectedMonth} = this.state;
        progressDialog.open("Loading attendance...");
        workers.emit('plugin_sheq_assist/employees/attendance/list/by_team', [item.id, selectedYear, selectedMonth]).then(res => {
            this.state.attendanceList = res;
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        });
    }

    renderDay(dateItem) {
//        const {
//            state, state: {item: team}
//        } = this;
//        console.log('renderer', team, dateItem); 
        return <LostimeAndOvertimeIcon dateItem={dateItem} state={this.state}/>;
    }

    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
//        const {item, selectedDate, selectedYear, selectedMonth} = this.state;
//        if (!item)
//            return null;

//        const path = {path: 'plugin_sheq_assist/employees/attendance/list/by_team', data: [item.id, selectedYear, selectedMonth]};
        return <React.Fragment>
            <ViewByPanel
                title="Team"
                state={this.state}
                onChange={this.onChangeByDate}
            />
            <CalendarWrapper
                state={this.state}
                onSelectDay={this.onSelectDay}
                renderer={this.renderDay}
            />
            <NewAttendanceDialog ref="newDialog"/>
            <ProfileAttendanceDialog ref="profileDialog"/>
            <EditAttendanceDialog ref="editDialog"/>
        </React.Fragment>;
    }

// </editor-fold>

}

export default AttendanceByTeamDialog;
