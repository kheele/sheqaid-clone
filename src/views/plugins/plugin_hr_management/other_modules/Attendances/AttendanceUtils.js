import {Dates} from '../../../../../utils/Utils';

class AttendanceUtils {
    // <editor-fold defaultstate="collapsed" desc="filterEmployeeWithNoContractDailyWorkingHrs">
    static filterEmployeeWithNoContractDailyWorkingHrs(employee) {
        const {
            employee_contract_list, sub_collection_keys
        } = employee.data;

        if (!employee_contract_list) {
            return true;
        }

        const {employee_contract_list: {latest, id: ids}} = sub_collection_keys;

        const last = employee_contract_list[latest.id];
        const {created_at, contract_details, salary_info} = last;
        if (!contract_details) {
            return true;
        }

        const {expiry_date, end_of_trial_period, start_time, end_time, daily_working_hours} = contract_details;

        if(!start_time || !end_time) {
            return true;
        }
        
        return false;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="calcEmployeeDailyWorkingHours">
    static calcEmployeeDailyWorkingHours(employee) {
        const {
            employee_contract_list, sub_collection_keys
        } = employee.data;

        if (!employee_contract_list) {
            return 0;
        }

        const {employee_contract_list: {latest, id: ids}} = sub_collection_keys;

        const last = employee_contract_list[latest.id];
        const {created_at, contract_details, salary_info} = last;
        if (!contract_details) {
            return 0;
        }

        const {expiry_date, end_of_trial_period, start_time, end_time, daily_working_hours} = contract_details;

        const start = new Date();
        let st = start_time.split(':');
        start.setHours(parseInt(st[0]));
        start.setMinutes(parseInt(st[1]));
        start.setSeconds(0);
        const end = new Date();
        let et = end_time.split(':');
        end.setHours(parseInt(et[0]));
        end.setMinutes(parseInt(et[1]));
        end.setSeconds(0);

        const totalDailyWorkingSeconds = end.durationPrevSeconds(start);
        return totalDailyWorkingSeconds;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getEmployeeListWithOvertimeOrLostimeByMonthImpl">
    static getEmployeeListWithOvertimeOrLostimeByMonthImpl(teamList, attendanceList, calcFn, onFilterByDate) {
        return teamList.filter(employeeInTeam => {
            const {
                data: {
                    employee_leave_list, sub_collection_keys
                }
            } = employeeInTeam;

            return attendanceList.anyMatch(({id, data: {date, date_split, day, attendance_list}}) => {
                let res;
                if (employee_leave_list) {
                    const {employee_leave_list: {latest, id: ids}} = sub_collection_keys;
                    const last = employee_leave_list[latest.id];
                    const {type: leave_type, due_to, date: leave_date, expiry_date: leave_expiry_date, days_booked} = last;
                    res = onFilterByDate(leave_type, leave_expiry_date, Dates.parse(date).setMidnight(), date_split);
                } else {
                    res = onFilterByDate(null, null, Dates.parse(date).setMidnight(), date_split);
                }

                if (res === "DATE_UNMATCHED") {
                    return false;
                }
                if (res === "Overtime_ON_LEAVE") {
                    return false;
                }
                if (res === "Lostime_ON_LEAVE_Unpaid") {
                    return true;
                }
                if (res === "Lostime_ON_LEAVE_Maternity") {
                    return false;
                }

                if (res === "Overtime_OFF_LEAVE") {
//                    continue
                }
                if (res === "Lostime_OFF_LEAVE") {
//                    continue
                }

                return attendance_list.anyMatch(({employee, time_in, time_out, signature}) => {
                    if (employeeInTeam.id !== employee.id) {
                        return false;
                    }

                    //all dates are similar
                    const time_out_d = Dates.parse(time_out);
                    const time_in_d = Dates.parse(time_in);
                    const totalPresenceTimeInSeconds = time_out_d.durationPrevSeconds(time_in_d);

                    const totalDailyWorkingSeconds = AttendanceUtils.calcEmployeeDailyWorkingHours(employeeInTeam);

                    if (totalDailyWorkingSeconds === 0) {
                        return false;
                    }

                    return calcFn(totalPresenceTimeInSeconds, totalDailyWorkingSeconds);
                });
            });
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getTotalHrsWithOvertimeOrLostimeByMonthImpl">
    static getTotalHrsWithOvertimeOrLostimeByMonthImpl(attendanceList, calcFn, onFilterByDate = (date_split) => true) {
        return attendanceList.filter(({id, data: {date, date_split, day, attendance_list}}) => {
            return onFilterByDate(Dates.parse(date).setMidnight(), date_split);
        }).map(({id, data: {date, date_split, day, attendance_list}}) => {
            return attendance_list.map(({employee, time_in, time_out, signature}) => {
                //all dates are similar
                const time_out_d = Dates.parse(time_out);
                const time_in_d = Dates.parse(time_in);
                const totalPresenceTimeInSeconds = time_out_d.durationPrevSeconds(time_in_d);

                const totalDailyWorkingSeconds = AttendanceUtils.calcEmployeeDailyWorkingHours(employee);
                return calcFn(totalPresenceTimeInSeconds, totalDailyWorkingSeconds);
            }).reduce((n1, n2) => n1 + n2, 0);
        }).reduce((n1, n2) => n1 + n2, 0);
    }
    // </editor-fold>
}

const getEmployeeListWithNoContractDailyWorkingHrs = (teamList) => {
    return teamList.filter(AttendanceUtils.filterEmployeeWithNoContractDailyWorkingHrs);
};

// <editor-fold defaultstate="collapsed" desc="getEmployeeListWithOvertimeByMonth, getEmployeeListWithLostimeByMonth, getEmployeeListWithOvertimeByDate, getEmployeeListWithLostimeByDate">
//args[teamList, attendanceList(all months are similar except dates)]
const getEmployeeListWithOvertimeByMonth = (teamList, attendanceList) => {
    return AttendanceUtils.getEmployeeListWithOvertimeOrLostimeByMonthImpl(teamList, attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalPresenceTimeInSeconds - totalDailyWorkingSeconds;
        return diff >= 1800;//1800 = 30 * 60 = 30min
    }, (leave_type, leave_expiry_date, date, date_split) => {
        //is in leave
        if (leave_expiry_date && (leave_expiry_date <= date)) {
            return "Overtime_ON_LEAVE";
        }
        return "Overtime_OFF_LEAVE";
    });
};

const getEmployeeListWithLostimeByMonth = (teamList, attendanceList) => {
    return AttendanceUtils.getEmployeeListWithOvertimeOrLostimeByMonthImpl(teamList, attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalDailyWorkingSeconds - totalPresenceTimeInSeconds;
        return diff > 300;//300 = 5 * 60 = 5min
    }, (leave_type, leave_expiry_date, date, date_split) => {
        //is in leave
        if (leave_expiry_date && (leave_expiry_date <= date)) {
            if (leave_type === "Unpaid") {
                return "Lostime_ON_LEAVE_Unpaid";
            } else if (leave_type === "Maternity") {
                return "Lostime_ON_LEAVE_Maternity";
            } else {
                //TODO: calculate annual leave days to check if the leave in valid
            }
        }
        return "Lostime_OFF_LEAVE";
    });
};

const getEmployeeListWithOvertimeByDate = (teamList, attendanceList, date_compared) => {
    return AttendanceUtils.getEmployeeListWithOvertimeOrLostimeByMonthImpl(teamList, attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalPresenceTimeInSeconds - totalDailyWorkingSeconds;
        return diff >= 1800;//1800 = 30 * 60 = 30min
    }, (leave_type, leave_expiry_date, date, date_split) => {
        if (!date.equals(date_compared)) {
            return "DATE_UNMATCHED";
        }
        //is in leave
        if (leave_expiry_date && (leave_expiry_date <= date)) {
            return "Overtime_ON_LEAVE";
        }
        return "Overtime_OFF_LEAVE";
    });
};

const getEmployeeListWithLostimeByDate = (teamList, attendanceList, date_compared) => {
    return AttendanceUtils.getEmployeeListWithOvertimeOrLostimeByMonthImpl(teamList, attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalDailyWorkingSeconds - totalPresenceTimeInSeconds;
        return diff > 300;//300 = 5 * 60 = 5min
    }, (leave_type, leave_expiry_date, date, date_split) => {
        console.log(date_split.date, date.equals(date_compared))
        if (!date.equals(date_compared)) {
            return "DATE_UNMATCHED";
        }
        //is in leave
        if (leave_expiry_date && (leave_expiry_date <= date)) {
            if (leave_type === "Unpaid") {
                return "Lostime_ON_LEAVE_Unpaid";
            } else if (leave_type === "Maternity") {
                return "Lostime_ON_LEAVE_Maternity";
            } else {
                //TODO: calculate annual leave days to check if the leave in valid
            }
        }
        return "Lostime_OFF_LEAVE";
    });
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getTotalHrsWithOvertimeByMonth, getTotalHrsWithLostimeByMonth, getTotalHrsWithOvertimeByDate, getTotalHrsWithLostimeByDate">
//args[attendanceList(all months are similar except dates)]
const getTotalHrsWithOvertimeByMonth = (attendanceList) => {
    return AttendanceUtils.getTotalHrsWithOvertimeOrLostimeByMonthImpl(attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalPresenceTimeInSeconds - totalDailyWorkingSeconds;
        const isOvertime = diff >= 1800;//1800 = 30 * 60 = 30min
        if (isOvertime) {
            //3600 = 60 * 60 = 60min
            const multiplier = Math.pow(10, 0);
            const diffHrs = Math.round(Math.round(diff / 60 / 60) * multiplier) / multiplier;
            return diff;
        } else {
            return 0;
        }
    });
};

const getTotalHrsWithLostimeByMonth = (teamList, attendanceList) => {
    const total = AttendanceUtils.getTotalHrsWithOvertimeOrLostimeByMonthImpl(attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalDailyWorkingSeconds - totalPresenceTimeInSeconds;
        const isLostime = diff >= 1800;//1800 = 30 * 60 = 30min
        if (isLostime) {
            //3600 = 60 * 60 = 60min
            const multiplier = Math.pow(10, 0);
            const diffHrs = Math.round(Math.round(diff / 60 / 60) * multiplier) / multiplier;
            return diffHrs;
        } else {
            return 0;
        }
    });

    const otherTotal = teamList.map(employeeInTeam => {
        const {
            data: {
                employee_leave_list, sub_collection_keys
            }
        } = employeeInTeam;

        const totalDailyWorkingSeconds = AttendanceUtils.calcEmployeeDailyWorkingHours(employeeInTeam);

        return attendanceList.filter(({id, data: {date, date_split, day, attendance_list}}) => {
            if (employee_leave_list) {
                const {employee_leave_list: {latest, id: ids}} = sub_collection_keys;
                const last = employee_leave_list[latest.id];
                const {type: leave_type, due_to, date: leave_date, expiry_date: leave_expiry_date, days_booked} = last;
                //is in leave
                if (leave_expiry_date && (leave_expiry_date <= date)) {
                    if (leave_type === "Unpaid") {
                        return true;
                    } else if (leave_type === "Maternity") {
                        return false;
                    } else {
                        //TODO: calculate annual leave days to check if the leave in valid
                    }
                }
            }

            return attendance_list.noneMatch(({employee, time_in, time_out, signature}) => {
                return employeeInTeam.id === employee.id;
            });
        }).map(() => totalDailyWorkingSeconds).reduce((n1, n2) => n1 + n2, 0);
    }).reduce((n1, n2) => n1 + n2, 0);

    return total + otherTotal;
};

const getTotalHrsWithOvertimeByDate = (attendanceList, date_compared) => {
    return AttendanceUtils.getTotalHrsWithOvertimeOrLostimeByMonthImpl(attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalPresenceTimeInSeconds - totalDailyWorkingSeconds;
        const isOvertime = diff >= 1800;//1800 = 30 * 60 = 30min
        if (isOvertime) {
            //3600 = 60 * 60 = 60min
            const multiplier = Math.pow(10, 0);
            const diffHrs = Math.round(Math.round(diff / 60 / 60) * multiplier) / multiplier;
            return diff;
        } else {
            return 0;
        }
    }, (date, date_split) => date.equals(date_compared));
};

const getTotalHrsWithLostimeByDate = (teamList, attendanceList, date_compared) => {
    const total = AttendanceUtils.getTotalHrsWithOvertimeOrLostimeByMonthImpl(attendanceList, (totalPresenceTimeInSeconds, totalDailyWorkingSeconds) => {
        const diff = totalDailyWorkingSeconds - totalPresenceTimeInSeconds;
        const isLostime = diff >= 1800;//1800 = 30 * 60 = 30min
        if (isLostime) {
            //3600 = 60 * 60 = 60min
            const multiplier = Math.pow(10, 0);
            const diffHrs = Math.round(Math.round(diff / 60 / 60) * multiplier) / multiplier;
            return diffHrs;
        } else {
            return 0;
        }
    }, (date, date_split) => date.equals(date_compared));

    const otherTotal = teamList.map(employeeInTeam => {
        const {
            data: {
                employee_leave_list, sub_collection_keys
            }
        } = employeeInTeam;

        const totalDailyWorkingSeconds = AttendanceUtils.calcEmployeeDailyWorkingHours(employeeInTeam);

        return attendanceList.filter(({id, data: {date, date_split, day, attendance_list}}) => {
            if (Dates.parse(date) !== date_compared) {
                return false;
            }
            if (employee_leave_list) {
                const {employee_leave_list: {latest, id: ids}} = sub_collection_keys;
                const last = employee_leave_list[latest.id];
                const {type: leave_type, due_to, date: leave_date, expiry_date: leave_expiry_date, days_booked} = last;
                //is in leave
                if (leave_expiry_date && (leave_expiry_date <= date)) {
                    if (leave_type === "Unpaid") {
                        return true;
                    } else if (leave_type === "Maternity") {
                        return false;
                    } else {
                        //TODO: calculate annual leave days to check if the leave in valid
                    }
                }
            }

            return attendance_list.noneMatch(({employee, time_in, time_out, signature}) => {
                return employeeInTeam.id === employee.id;
            });
        }).map(() => totalDailyWorkingSeconds).reduce((n1, n2) => n1 + n2, 0);
    }).reduce((n1, n2) => n1 + n2, 0);

    return total + otherTotal;
};
// </editor-fold>

export {
getEmployeeListWithNoContractDailyWorkingHrs,
        getEmployeeListWithOvertimeByMonth,
        getEmployeeListWithLostimeByMonth,
        getTotalHrsWithOvertimeByMonth,
        getTotalHrsWithLostimeByMonth,
        getEmployeeListWithOvertimeByDate,
        getEmployeeListWithLostimeByDate,
        getTotalHrsWithOvertimeByDate,
        getTotalHrsWithLostimeByDate
};
